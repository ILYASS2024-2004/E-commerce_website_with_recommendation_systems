
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useProductStore from '../../store/useProductStore';




const BestSellers = () => {
  // 1. Récupérer les données
  const { bestSellers, fetchBestSellers } = useProductStore();
  const containerRef = useRef(null);

  // 2. Charger les données
  useEffect(() => {
    fetchBestSellers();
  }, [fetchBestSellers]);

// 3. L'ANIMATION PRO AVEC DÉCALAGE (STAGGER)
  useEffect(() => {
    // Si pas de produits, on ne fait rien
    if (bestSellers.length === 0) return;


  }, [bestSellers]);

  return (
    // TONY DESIGN EXACT (Aucune modification ici)
    <div ref={containerRef} className="w-full py-24  text-black relative z-10 ">
      
      <div className="container  px-4 md:px-10">
        
        {/* En-tête de la section */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-sm uppercase inline-block font-black scale-y-150 mb-2 ">
            Top Rated
          </span>
          <h2 
            className="text-5xl md:text-6xl text-center font-black scale-y-160 uppercase "
          >
            Best Sellers
          </h2>
        </div>

        {/* Grille des Produits (Limitée à 3) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          
          {/* On prend seulement les 3 premiers */}
          {bestSellers.slice(0, 6).map((product) => (
            <Link 
              key={product.id_prod} 
              to={`/product/${product.sku}`}
              className="group block"
            >
              {/* Conteneur Image (Style minimaliste avec bordure fine) */}
              <div className="relative h-[400px] border border-gray-100 overflow-hidden mb-1">
                
              

                {/* Image du produit */}
                <img 
                  src={product.img_url || 'https://sm.ign.com/t/ign_tr/photo/e/every-play/every-playstation-console-a-full-history-of-release-dates_xdxx.960.jpg'} 
                  alt={product.nom} 
                  className="absolute inset-0 w-full h-full object-contain mix-blend-multiply  z-10 transition-transform duration-200 ease-out group-hover:scale-101"
                />
                <div className='absolute inset-0 w-full h-full bg-green-600/30'></div>
                
                
              </div>

              {/* Infos Produit */}
              <div className="flex flex-col items-center text-center border-t-2 border-gray-700">
                <h3 className="text-xl  w-full font-bold uppercase self-start flex justify-between tracking-tight mb-1 group-hover:text-gray-600 transition-colors">
                  <span className='text-an'>{product.nom}</span>
                  <span className="text-lg font-light text-an">
                  ${product.prix}
                </span>
                </h3>
                <p className="text-xs text-gray-400 mb-1 uppercase tracking-widest self-start electro text-an">
                  {product.categorie} Series
                </p>
                
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BestSellers;