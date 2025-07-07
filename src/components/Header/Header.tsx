import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/auth/authSlice";
import { UserProfileDropdown } from "../../components/UserProfileDropdown";
import { auth } from "../../lib/firebase/firebase";
import "./Header.css";

export const Header = () => {
  const [user, setUser] = useState(() => auth.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleSignOut = () => {
    signOut(auth).then(() => {
      dispatch(logout());
      navigate("/");
    });
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        JET App
      </Link>
      <div className="header-actions">
        {!user ? (
          <button className="signin-btn" onClick={handleSignIn}>
            Sign In
          </button>
        ) : (
          <UserProfileDropdown
            userEmail={user.email || "User"}
            onSignOut={handleSignOut}
          />
        )}
      </div>
    </header>
  );
};
