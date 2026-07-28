import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Shield, Globe } from 'lucide-react';
import { useAppConfig } from '../contexts/AppConfigContext';
import { persistAuth } from '../utils/authStorage';
import '../styles/Signup.css';

const Signup = ({ onNavigateToLogin, onNavigateToHome }) => {
  const { config, resolveIcon } = useAppConfig();
  const LogoIcon = resolveIcon(config?.app?.logo_icon || 'Shield');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    academicStage: '',
    researchArea: '',
    careerFocus: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const knowledgeLevels = config?.login?.knowledge_levels?.length
    ? config.login.knowledge_levels
    : config?.login?.academic_stages?.length
      ? config.login.academic_stages
      : [
          { value: '', label: 'Select your academic standing' },
          { value: 'sophomore', label: 'Sophomore (2nd year)' },
          { value: 'junior', label: 'Junior (3rd year — internships)' },
          { value: 'senior', label: 'Senior (4th year — FT / entry-level)' },
          { value: 'grad', label: 'Graduate / recent grad' },
        ];

  const timezones = config?.login?.timezones?.length
    ? config.login.timezones
    : [{ value: '', label: 'Select timezone (optional)' }];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.academicStage) {
      newErrors.academicStage = 'Please select your academic standing';
    }

    if (!formData.careerFocus) {
      newErrors.careerFocus = 'Please choose internship or full-time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          academicStage: formData.academicStage,
          researchArea: formData.researchArea,
          careerFocus: formData.careerFocus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        persistAuth(data.user, data.access_token);
        onNavigateToHome?.(data.user, data.access_token);
      } else {
        setErrors({ submit: data.detail || 'Signup failed. Please try again.' });
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Header */}
        <div className="signup-header">
          <div className="logo-container">
            <LogoIcon className="logo-icon" />
          </div>
          <h1 className="signup-title">Join Our Community</h1>
          <p className="signup-subtitle">
            {config?.login?.signup_subtitle || 'Create your account to get personalized guidance from expert advisors'}
          </p>
        </div>

        {/* Main Signup Form */}
        <div className="signup-form-container">
          <form onSubmit={handleSubmit} className="signup-form">
            
            {/* Name Fields Row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name
                </label>
                <div className="input-container">
                  <User className="input-icon" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="First name"
                    disabled={isLoading}
                  />
                </div>
                {errors.firstName && (
                  <span className="error-message">{errors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                </label>
                <div className="input-container">
                  <User className="input-icon" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Last name"
                    disabled={isLoading}
                  />
                </div>
                {errors.lastName && (
                  <span className="error-message">{errors.lastName}</span>
                )}
              </div>
            </div>

            {/* Email Field */}
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
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {/* Password Fields Row */}
            <div className="form-row">
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
                    placeholder="Create password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-container">
                  <Lock className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="password-toggle"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            {/* Academic standing */}
            <div className="form-group">
              <label htmlFor="academicStage" className="form-label">
                Academic standing
              </label>
              <div className="input-container">
                <Shield className="input-icon" />
                <select
                  id="academicStage"
                  name="academicStage"
                  value={formData.academicStage}
                  onChange={handleInputChange}
                  className={`form-select ${errors.academicStage ? 'error' : ''}`}
                  disabled={isLoading}
                >
                  {knowledgeLevels.map(stage => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>
              {errors.academicStage && (
                <span className="error-message">{errors.academicStage}</span>
              )}
            </div>

            {/* Internship vs full-time */}
            <div className="form-group">
              <span className="form-label">What are you aiming for?</span>
              <div className="career-focus-options">
                {[
                  { value: 'Internship search', label: 'Internship' },
                  { value: 'Full-time / entry-level', label: 'Full-time job' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`career-focus-option ${formData.careerFocus === opt.value ? 'active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="careerFocus"
                      value={opt.value}
                      checked={formData.careerFocus === opt.value}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              {errors.careerFocus && (
                <span className="error-message">{errors.careerFocus}</span>
              )}
            </div>

            {/* Time zone (optional) */}
            <div className="form-group">
              <label htmlFor="researchArea" className="form-label">
                Time zone <span className="optional">(Optional)</span>
              </label>
              <div className="input-container">
                <Globe className="input-icon" />
                <select
                  id="researchArea"
                  name="researchArea"
                  value={formData.researchArea}
                  onChange={handleInputChange}
                  className="form-select"
                  disabled={isLoading}
                >
                  {timezones.map(tz => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Terms and Privacy */}
            <div className="terms-section">
              <p className="terms-text">
                By creating an account, you agree to our{' '}
                <button type="button" className="link-btn">Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="link-btn">Privacy Policy</button>
              </p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="submit-error">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <button 
              type="button" 
              className="link-btn"
              onClick={onNavigateToLogin}
            >
              Sign in here
            </button>
            {' · '}
            <button
              type="button"
              className="link-btn"
              onClick={async () => {
                try {
                  const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/auth/guest`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                  });
                  const data = await response.json();
                  if (response.ok) {
                    persistAuth(data.user, data.access_token);
                    onNavigateToHome?.(data.user, data.access_token);
                  }
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              Try without an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;