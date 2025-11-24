import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { PeoplePage } from './pages/PeoplePage/PeoplePage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { FavouritesPage } from './pages/FavouritesPage/FavouritesPage';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

const App = () => {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<PeoplePage />} />
          <Route path="/people/:id" element={<PeoplePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/favourites"
            element={
              <ProtectedRoute>
                <FavouritesPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
