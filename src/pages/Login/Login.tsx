import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  loginWithGoogleRequest,
  loginWithEmailRequest,
  registerWithEmailRequest,
} from '../../redux/auth/authSlice';
import type { User } from '../../redux/auth/types';
import "./styles.css";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, user } = useSelector(
    (state: {
      auth: {
        error: string | null;
        loading: boolean;
        user: User | null;
      };
    }) => state.auth
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    if (user) {
      if (justRegistered) {
        const timer = setTimeout(() => {
          navigate("/");
        }, 1500);
        return () => clearTimeout(timer);
      } else {
        navigate("/");
      }
    }
  }, [user, justRegistered, navigate]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      setJustRegistered(true);
      dispatch(registerWithEmailRequest({ email, password }));
    } else {
      setJustRegistered(false);
      dispatch(loginWithEmailRequest({ email, password }));
    }
  };

  const handleGoogleSignIn = async () => {
    setJustRegistered(false);
    dispatch(loginWithGoogleRequest());
  };

  return (
    <div className="page-content">
      <div className="card">
        <h2 className="title">{isRegistering ? "Sign Up" : "Sign In"}</h2>
        {justRegistered && !!user && (
          <p className="success">
            Registration successful! Redirecting to home...
          </p>
        )}
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
            className="input"
          />
          <button type="submit" className="btn primary-btn" disabled={loading}>
            {isRegistering ? "Sign Up" : "Sign In"}
          </button>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="btn google-btn"
          >
            Sign in with Google
          </button>
        </form>
        <p
          className="toggle-text"
          onClick={() => setIsRegistering(!isRegistering)}
          role="button"
          tabIndex={0}
          onKeyPress={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
};
