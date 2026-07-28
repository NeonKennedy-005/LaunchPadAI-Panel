import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppConfigProvider } from './contexts/AppConfigContext';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import AuthPage from './pages/AuthPage';
import CanvasPage from './pages/CanvasPage';
import UserGuide from './components/UserGuide';
import {
  readStoredAuth,
  persistAuth,
  clearStoredAuth,
  getApiBaseUrl,
} from './utils/authStorage';
import './styles/components.css';

function App() {
  const initialAuthRef = useRef(null);
  if (initialAuthRef.current === null) {
    initialAuthRef.current = readStoredAuth();
  }
  const initialAuth = initialAuthRef.current;
  const [currentView, setCurrentView] = useState(initialAuth ? 'chat' : 'home');
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialAuth));
  const [user, setUser] = useState(initialAuth?.user ?? null);
  const [authToken, setAuthToken] = useState(initialAuth?.token ?? null);
  const [authBootstrapping, setAuthBootstrapping] = useState(Boolean(initialAuth));

  const clearAuthState = useCallback(() => {
    clearStoredAuth();
    setUser(null);
    setAuthToken(null);
    setIsAuthenticated(false);
    setCurrentView('home');
  }, []);

  // Re-validate stored credentials on startup so stale tokens are cleared
  // and profile data stays fresh after refresh.
  useEffect(() => {
    if (!initialAuth) {
      return;
    }

    let cancelled = false;

    const validateStoredSession = async () => {
      try {
        const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
          headers: { Authorization: `Bearer ${initialAuth.token}` },
        });

        if (cancelled) {
          return;
        }

        if (response.ok) {
          const freshUser = await response.json();
          persistAuth(freshUser, initialAuth.token);
          setUser(freshUser);
          setAuthToken(initialAuth.token);
          setIsAuthenticated(true);
          return;
        }

        if (response.status === 401 || response.status === 403) {
          clearAuthState();
        }
      } catch {
        // Keep the cached session on transient network errors so refresh
        // does not force re-login when the API is briefly unavailable.
      } finally {
        if (!cancelled) {
          setAuthBootstrapping(false);
        }
      }
    };

    validateStoredSession();

    return () => {
      cancelled = true;
    };
  }, [initialAuth, clearAuthState]);

  const sessionReady = isAuthenticated && !authBootstrapping;

  const navigateToAuth = () => {
    if (authBootstrapping) {
      return;
    }
    setCurrentView('auth');
  };

  const navigateToCanvas = (canvasView) => {
    if (['insights', 'workspace', 'deliverables'].includes(canvasView)) {
      localStorage.setItem('canvas-view-v2', canvasView);
    }
    setCurrentView('canvas');
  };

  const navigateToChat = () => {
    setCurrentView('chat');
  };

  const navigateToHome = () => {
    setCurrentView('home');
  };

  const handleAuthSuccess = (userData, token) => {
    persistAuth(userData, token);
    setUser(userData);
    setAuthToken(token);
    setIsAuthenticated(true);
    setAuthBootstrapping(false);
    setCurrentView('chat');
  };

  const handleGuestStart = async () => {
    if (authBootstrapping) {
      return;
    }
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        handleAuthSuccess(data.user, data.access_token);
      } else {
        setCurrentView('auth');
      }
    } catch {
      setCurrentView('auth');
    }
  };

  const handleSignOut = () => {
    clearAuthState();
  };

  return (
    <AppConfigProvider>
      <ThemeProvider>
        <div className="App">
          {authBootstrapping && (
            <div className="auth-bootstrap-overlay" aria-live="polite">
              Restoring your session...
            </div>
          )}
          {currentView === 'home' && (
            <HomePage
              onNavigateToHome={navigateToHome}
              onNavigateToChat={sessionReady ? navigateToChat : navigateToAuth}
              onNavigateToCanvas={sessionReady ? navigateToCanvas : navigateToAuth}
              onTryAsGuest={sessionReady ? navigateToChat : handleGuestStart}
              isAuthenticated={sessionReady}
            />
          )}
          {currentView === 'auth' && !sessionReady && (
            <AuthPage onAuthSuccess={handleAuthSuccess} />
          )}
          {currentView === 'canvas' && sessionReady && (
            <CanvasPage
              user={user}
              authToken={authToken}
              onNavigateToHome={navigateToHome}
              onNavigateToChat={navigateToChat}
              onSignOut={handleSignOut}
            />
          )}
          {currentView === 'chat' && sessionReady && (
            <ChatPage
              user={user}
              authToken={authToken}
              onNavigateToHome={navigateToHome}
              onNavigateToCanvas={navigateToCanvas}
              onSignOut={handleSignOut}
            />
          )}
          <UserGuide />
        </div>
      </ThemeProvider>
    </AppConfigProvider>
  );
}

export default App;
