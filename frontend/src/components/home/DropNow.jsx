import React, { useLayoutEffect, useRef, useEffect } from 'react'
import "./dropnow.css"
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// --- NOUVEAUX IMPORTS ---
import { Link } from 'react-router-dom'
import useProductStore from '../../store/useProductStore'

// Enregistrer le plugin GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

const DropNow = () => {


  // --- 1. RÉCUPÉRER LES DONNÉES (NEW DROPS) ---
  const { newDrops, fetchNewDrops } = useProductStore();

  useEffect(() => {
    fetchNewDrops();
  }, [fetchNewDrops]);


  return (
    // Ajouter la référence 'mainRef' au conteneur principal
    // J'ajoute overflow-hidden pour m'assurer que les logos ne dépassent pas
    <> <div>
         <div  className='relative w-full   flex flex-col justify-center items-center  gap-0 '>
      
      
        {/* Ajouter la référence 'redBoxRef' à la div rouge */}
        <div  className='  scale-100  w-full pt-10 pb-5 '>
            
            {/* --- CONTENU AJOUTÉ ICI --- */}
            <div className="w-full h-full flex flex-col justify-center items-center px-4 md:px-2">
                
                {/* Titre de la section */}
                <div className='flex justify-between  w-full'>
                   <h2 
                    className="text-5xl md:text-4xl mb-12 text-black font-black  scale-y-200 uppercase z-10 "
                  // Utilise votre police perso
                >
                    Latest Arrivals
                </h2>  
                <div>
                    <p class="text-gray-900 text-sm w-[300px]">
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Explore our <span className='fth text-2xl'>latest</span> products crafted for modern everyday style today.
  </p>

                    

                </div>
                </div>
               

                {/* Grille de Produits (Limitée à 3 pour un design épuré) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-[90%] h-[90%] ">
                    {newDrops.slice(0, 8).map((product) => (
                        <Link 
                            key={product.id_prod} 
                            to={`/product/${product.sku}`}
                            className="group relative block h-full flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="flex-1  overflow-hidden relative ">
                                <img 
                                    src={product.img_url || 'https://sm.ign.com/t/ign_tr/photo/e/every-play/every-playstation-console-a-full-history-of-release-dates_xdxx.960.jpg'} 
                                    alt={product.nom} 
                                    className="w-full h-full object-cover  mix-blend-multiply  transition-transform duration-300 ease-out group-hover:scale-102"
                                />
                                
                                {/* Overlay au survol (Optionnel pour effet pro) */}
                                <div className="absolute inset-0  bg-primary/40" />
                            </div>

                            {/* Infos Produit (Minimaliste) */}
                            <div className="mt-4 flex justify-between items-start border-t border-black pt-2">
                                <div className="max-w-[70%]">
                                    <h3 className="text-sm md:text-md font-bold font-sans text-black uppercase leading-none truncate">
                                        {product.nom}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {product.categorie} SERIES
                                    </p>
                                </div>
                                <span className="text-lg font-sans font-light text-black">
                                    ${product.prix}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                
              
            </div>
          

        </div>


    
    </div>
    
    </div>
  


    </>
   
  )
}

export default DropNow