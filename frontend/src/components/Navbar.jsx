import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Mail, LogIn, LogOut, ShoppingCart } from 'lucide-react';

// 1. IMPORTER LE STORE PANIER
import useCartStore from '../store/useCartStore'; 

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);

  const { user, logout } = useAuthStore();
  const isAuthenticated = !!user;

  // 2. RÉCUPÉRER L'ACTION 'toggleCart' et le NOMBRE D'ITEMS
  const { toggleCart, cart } = useCartStore();
  
  // Calculer le nombre d'items uniques (pour le badge)
  const uniqueItemsCount = cart.length;

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current ) {
        setIsVisible(false); 
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      }
      setIsScrolled(currentScrollY >= 600);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        fixed top-0 left-0 w-full px-2 sm:px-6  z-[999] text-black
        flex items-center justify-between transition-all duration-500
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${isScrolled ? "bg-[#f8f8f8]" : " bg-[#f8f8f8]"}
      `}
    >
      <div 
        className='text-xl sm:text-2xl  font-bold scale-y-120'
      
      >
        <span className='fth'>Me</span>&<span className='italic'>Me</span>
      </div>

      <div className="flex-none p-2 ">
        <ul className="menu menu-horizontal items-center gap-2 sm:gap-0    p-0 px-2  ">
           <li>
              <Link to="/auth" className=" sm:w-auto sm:px-4  ">
                
                <span className="hidden sm:inline ">Products</span>
              </Link>
            </li>
          
         

          {isAuthenticated ? (
            <li>
              <button onClick={handleLogout} className=" sm:w-auto sm:px-4 ">
                <LogOut className="inline sm:hidden size-4 sm:size-5" />
                <span className="hidden sm:inline ">Logout</span>
              </button>
            </li>
          ) : (
            <li>
              <Link to="/auth" className=" sm:w-auto sm:px-4  ">
                <LogIn className="inline sm:hidden size-4 sm:size-5" />
                <span className="hidden sm:inline ">Login</span>
              </Link>
            </li>
          )}

          {/* --- BOUTON PANIER CONNECTÉ --- */}
          <li>
            <button 
              className=" relative"
              onClick={toggleCart} // 3. AJOUTER L'ÉVÉNEMENT ONCLICK
            >
              <div className="indicator">
                <ShoppingCart className="size-4 sm:size-5" />
                
                {/* 4. AFFICHER LE BADGE (SI > 0) */}
                {uniqueItemsCount > 0 && (
                  <span className="absolute -top-4 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-error above text-sm text-white">
                    {uniqueItemsCount}
                  </span>
                )}
              </div>
            </button>
          </li>
          
        </ul>
      </div>

      <div>
        
            <a href="mailto:contact@techecomm.com" className=" sm:w-auto sm:px-6 italic text-lg border-1">
             
              <span className="hidden sm:inline">Contact</span>
            </a>
          

      </div>
    </div>
  );
};

export default Navbar;