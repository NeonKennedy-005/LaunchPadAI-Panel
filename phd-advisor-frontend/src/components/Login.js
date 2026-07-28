import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAppConfig } from '../contexts/AppConfigContext';
import { persistAuth, getApiBaseUrl } from '../utils/authStorage';
import CopyrightNotice from './CopyrightNotice';
import '../styles/Login.css';

const Login = ({ onNavigateToSignup, onNavigateToHome }) => {
  const { config, resolveIcon } = useAppConfig();
  const LogoIcon = resolveIcon(config?.app?.logo_icon || 'BookOpen');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGuestContinue = async () => {
    setIsGuestLoading(true);
    setErrors({});
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        persistAuth(data.user, data.access_token);
        onNavigateToHome?.(data.user, data.access_token);
      } else {
        setErrors({ submit: data.detail || 'Could not start a guest session.' });
      }
    } catch (error) {
      console.error('Guest login error:', error);
      setErrors({ submit: 'Could not start a guest session. Please try again.' });
    } finally {
      setIsGuestLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        persistAuth(data.user, data.access_token);
        onNavigateToHome?.(data.user, data.access_token);
      } else {
        setErrors({ submit: data.detail || 'Login failed. Please try again.' });
      }

    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const busy = isLoading || isGuestLoading;

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-container">
        <div className="login-header">
          <div className="logo-container">
            <LogoIcon className="logo-icon" />
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">
            {config?.login?.subtitle || 'Sign in to continue'}
          </p>
        </div>

        <div className="login-form-container">
          <button
            type="button"
            className={`guest-continue-btn ${isGuestLoading ? 'loading' : ''}`}
            onClick={handleGuestContinue}
            disabled={busy}
          >
            {isGuestLoading ? 'Starting guest mode…' : 'Try without an account'}
          </button>
          <p className="guest-continue-hint">
            Play with the advisors first. Create an account later if you want to save your chats.
          </p>
          <div className="login-divider" aria-hidden="true">
            <span>or sign in</span>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-container">
                <Mail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  disabled={busy}
                />
              </div>
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-container">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  disabled={busy}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  disabled={busy}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>

            <div className="form-actions">
              <button type="button" className="forgot-password">
                Forgot your password?
              </button>
            </div>

            {errors.submit && (
              <div className="submit-error">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={busy}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="link-btn"
              onClick={onNavigateToSignup}
              disabled={busy}
            >
              Sign up here
            </button>
          </p>
          <div className="login-powered-by">
            <a href="https://neon.ai" target="_blank" rel="noopener noreferrer" className="footer-neon-link">
              <img src="/neon-logo.png" alt="" className="footer-neon-logo" />
              Powered by Neon.ai
            </a>
          </div>
        </div>
      </div>
      </div>
      <footer className="login-page-footer">
        <CopyrightNotice className="login-page-copyright" />
      </footer>
    </div>
  );
};

export default Login;
