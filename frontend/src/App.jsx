import React, { useEffect, useState} from 'react';
import Navbar from './components/Navbar'; // Votre chemin (correct)
import './App.css';

import { ToastBar, Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react'; 
import { Routes, Route, Navigate } from 'react-router-dom';

// --- 1. Importation des Pages ---
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';

// --- 2. Importation du Store ---
import useAuthStore from './store/useAuthStore'; 
import useLenis from './utils/useLenis'; // Smooth Scroll
import ScrollToTop from './components/ScrollToTop';
import CartSidebar from './components/CartSidebar';
import RecommendedPage from './pages/RecommendedPage';
import Load from './components/Load';
function App() {
 useLenis(); // Smooth Scroll
  
  // --- LA CORRECTION EST ICI ---
  //
  // On ne sélectionne PAS un objet, mais chaque
  // "tranche" (slice) de l'état SÉPARÉMENT.
  // //
  // const authChecked = useAuthStore((state) => state.authChecked);
  // const checkAuth = useAuthStore((state) => state.checkAuth);
  // const user = useAuthStore((state) => state.user);

 
  const {user, authChecked, checkAuth} = useAuthStore();
  //
  // -----------------------------

  const isAuthenticated = !!user;

  const [minDelayPassed, setMinDelayPassed] = useState(false);
  // Maintenant, ce useEffect est correct.
  // 'checkAuth' est maintenant une référence stable.
  useEffect(() => {
    checkAuth();
  }, []); // (Même [checkAuth] fonctionnera, mais [] est mieux)


   useEffect(() => {
    const timer = setTimeout(() => {
      setMinDelayPassed(true); // Après 2s, on dit "C'est bon pour le temps"
    }, 1000);

    return () => clearTimeout(timer); // Nettoyage si le composant est démonté
  }, []);


  // Écran de chargement
  if (!authChecked || !minDelayPassed ) {
    return (
      <div className="flex justify-center items-center h-screen text-5xl bg-[#f8f8f8]">
        {/* <Loader className="size-20 animate-spin" /> */}
        <Load></Load>
      </div>
    );
  }

  // L'application
  return (
    <div className='bg-[#f8f8f8] min-h-screen'>
      <Navbar />
      <CartSidebar />
      <ScrollToTop />
      <Toaster>
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              ...t.style,
              animation: t.visible
                ? 'custom-enter 0.5s ease'
                : 'custom-exit 0.5s ease forwards',
            }}
          />
        )}
      </Toaster>

      {/* Routes (votre logique de protection) */}
      <Routes>
        {/* --- Publique --- */}
        <Route path="/" element={<HomePage />} />
        
        {/* --- Auth (Inverse Protection) --- */}
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />} 
        />

        {/* --- Protégées --- */}
        <Route 
          path="/products" 
          element={isAuthenticated ? <ProductsPage /> : <Navigate to="/auth" replace />} 
        />
        <Route 
          path="/product/:sku" 
          element={isAuthenticated ? <ProductDetailPage /> : <Navigate to="/auth" replace />} 
        />

        {/* --- NOUVELLE ROUTE (PLAN B) --- */}
<Route 
  path="/recommended" 
  element={isAuthenticated ? <RecommendedPage /> : <Navigate to="/auth" replace />} 
/>
      </Routes>
    </div>
  );
}

export default App;