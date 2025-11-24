import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCredentials } from '../../store/authSlice';
import { useLoginMutation } from '../../store/api';
import './LoginPage.scss';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState('');
  
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const searchParams = new URLSearchParams(location.search);
  const nextPath = searchParams.get('next') || '/';
  const sessionExpired = searchParams.get('sessionExpired') === 'true';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(nextPath);
    }
  }, [isAuthenticated, navigate, nextPath]);

  useEffect(() => {
    if (sessionExpired && !generalError) {
      setGeneralError('Your session has expired. Please sign in again.');
    }
  }, [sessionExpired]);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      // Focus first invalid field
      const firstError = errors.email ? 'email' : 'password';
      document.getElementById(firstError)?.focus();
      return;
    }

    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials(result));
      navigate(nextPath);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; status?: number };
      setGeneralError(err.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-page-container">
        <h2 className="login-page-title">Sign In</h2>
        
        {generalError && (
          <div className="login-page-error-banner" role="alert" aria-live="assertive">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="login-form-field">
            <label htmlFor="email" className="login-form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`login-form-input ${errors.email ? 'login-form-input--error' : ''}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={isLoading}
            />
            {errors.email && (
              <span id="email-error" className="login-form-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="login-form-field">
            <label htmlFor="password" className="login-form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`login-form-input ${errors.password ? 'login-form-input--error' : ''}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              disabled={isLoading}
            />
            {errors.password && (
              <span id="password-error" className="login-form-error" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="login-form-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="login-page-hint">
            Demo credentials: test@example.com / password123
          </p>
        </form>
      </div>
    </div>
  );
};
