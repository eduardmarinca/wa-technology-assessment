import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { clearFavourites } from '../../store/favouritesSlice';
import { useLogoutMutation, api } from '../../store/api';
import './Header.scss';

export const Header = () => {
  const { isAuthenticated, user, refreshToken } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logoutMutation({ refreshToken }).unwrap();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth state
      dispatch(logout());
      dispatch(clearFavourites());
      // Invalidate all RTK Query cached data
      dispatch(api.util.resetApiState());
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <h1>Star Wars Characters</h1>
        </Link>
        <nav className="header-nav">
          <Link to="/" className="header-link">
            Home
          </Link>
          <Link to="/favourites" className="header-link">
            Favourites
          </Link>
          {isAuthenticated ? (
            <div className="header-auth">
              <span className="header-username">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="header-button"
                aria-label="Sign out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="header-link header-link--login">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
