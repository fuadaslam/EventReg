import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Pages
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import PhotoUploadPage from './pages/PhotoUploadPage';
import BadgeGeneratorPage from './pages/BadgeGeneratorPage';
import SuccessPage from './pages/SuccessPage';

// Components
import Header from './components/Header';
import { AppProvider } from './context/AppContext';

function App() {
  const location = useLocation();
  const showBackButton = location.pathname !== '/';

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header showBackButton={showBackButton} />
        
        <main className="flex-1 container-app pt-16 pb-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/upload-photo" element={<PhotoUploadPage />} />
            <Route path="/generate-badge" element={<BadgeGeneratorPage />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </main>
        
        <footer className="py-4 bg-white border-t border-neutral-200">
          <div className="container-app text-center text-neutral-500 text-sm">
            © {new Date().getFullYear()} Event Registration App
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;