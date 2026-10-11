import React, { useRef, useLayoutEffect, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import useRecommanderBStore from '../../store/useRecommanderBStore';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { 
    id: 'pants', name: 'pants', 
    colorHex: '#000', colorClass: 'text-black', borderClass: 'border-black', bgClass: 'bg-black/40',
    img: 'https://tse2.mm.bing.net/th/id/OIP.Aeo4r9kbw5jnBeHVPJ_7tgAAAA?rs=1&pid=ImgDetMain&o=7&rm=3' 
  },
  { 
    id: 'jacket', name: 'jacket', 
    colorHex: '#fee685', colorClass: 'text-amber-200', borderClass: 'border-amber-200', bgClass: 'bg-amber-200/20',
    img: 'https://tse2.mm.bing.net/th/id/OIP.53Smg5XpxuG_iOfZGnZ00AHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3' 
  },
  { 
    id: 'sneakers', name: 'sneakers', 
    colorHex: '#10B981', colorClass: 'text-emerald-500', borderClass: 'border-emerald-500', bgClass: 'bg-emerald-500/20',
    img: 'https://img01.ztat.net/article/spp-media-p1/c27b05ac174e48cea21731aeeca2a1e3/3d264152d3a84eb7805174469ebc2e22.jpg?imwidth=762' 
  },
  { 
    id: 'shirt', name: 'shirt', 
    colorHex: '#570DF8', colorClass: 'text-primary', borderClass: 'border-primary', bgClass: 'bg-primary/20',
    img: 'https://www.fashionnova.com/cdn/shop/files/06-13-24_S7_62_ZDF01V420093_White_CZ_DJ_13-53-03_108570_PXF_1200x1200.jpg?v=1718748832' 
  },
  { 
    id: 'hoodie', name: 'hoodie', 
    colorHex: '#8b5cf6', colorClass: 'text-violet-500', borderClass: 'border-violet-500', bgClass: 'bg-violet-500/20',
    img: 'https://179a38.a-cdn.akinoncloud.com/products/2024/09/18/71346/4669a2ab-6b8d-4860-8ca2-3edaf5a22017_size826x1222.jpg' 
  },
  { 
    id: 't-shirt', name: 'T-shirt', 
    colorHex: '#ec4899', colorClass: 'text-pink-500', borderClass: 'border-pink-500', bgClass: 'bg-pink-500/20',
    img: 'https://cdn-img.prettylittlething.com/5/a/f/4/5af4e32ae4f20cf454baf86da6029095d7d52e1d_CNK4659_1_petite_grey_marl_premium_cotton_oversized_t_shirt.jpg' 
  },
]; 



const Category = () => {
  const containerRef = useRef(null);
  const titleSpanRef = useRef(null);
   const { 
    isTrained, 
    
    checkStatus, 
   
  } = useRecommanderBStore();
  useEffect(() => {
      checkStatus();
    }, [checkStatus]);
  

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // On cible toutes les cartes
      const cards = gsap.utils.toArray(".category-card");
      
      // --- ETAT INITIAL ---
      // La carte 0 est déjà à sa place (y:0).
      // Toutes les autres (1 à 5) commencent EN BAS (y:100%), hors de la vue.
      gsap.set(cards.slice(1), { yPercent: 100 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          // --- CORRECTION MAJEURE ICI ---
          // On donne beaucoup d'espace de scroll (longueur du tableau * 100%)
          // Cela garantit que l'animation a le temps de se finir complètement.
          end: `+=${cards.length * 100}%`, 
          pin: true,
          scrub: 1, // Fluidité
          invalidateOnRefresh: true,
        }
      });

      // --- BOUCLE D'ANIMATION ---
      cards.forEach((card, index) => {
        if (index === 0) return; // La première carte est fixe, les autres viennent la recouvrir

        // 1. La carte monte pour recouvrir la précédente
        tl.to(card, {
          yPercent: 0, // Elle remonte à sa position normale (0)
          ease: "none", // Important pour un scroll linéaire
          duration: 1
        });

        // 2. Le texte change de couleur au moment précis où la carte arrive
        // On utilise "<" pour dire "lance ça en même temps que l'animation précédente"
        tl.to(titleSpanRef.current, {
          color: categories[index].colorHex,
          duration: 0.1, // Changement rapide
          ease: "none"
        }, "<"); 
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className='h-screen lin-lr2 flex flex-col md:flex-row overflow-hidden  '>
      
      {/* --- PARTIE GAUCHE (Texte Fixe) --- */}
      <div className='w-full  md:w-[50%] p-8 md:p-6 md:px-12 flex flex-col justify-center items-start  relative z-20'>
        
        <h2 className='text-6xl self-start scale-y-200  md:text-7xl 2xl:text-9xl -translate-y-[50%] font-black uppercase  text-nowrap mb-8 flex flex-col items-center leading-none'>
       
       <span 
  ref={titleSpanRef}
  className={`transition-colors duration-10  `

}style={{color: categories[0].colorHex}}

>

            Our Products
          </span>
        </h2>
        
           <p className='text-lg md:text-xl  mt-8  text-gray-900   leading-relaxed '>

        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Discover our exclusive collection of <span className='fth text-error'>high-quality</span> apparel, meticulously crafted to elevate your <span className='fth text-error'>style </span>and comfort. Each piece is designed with attention to detail, ensuring you look and feel <span className='fth text-error'>your best</span> every day.

        </p>

         <div className='hidden md:inline-block absolute bottom-10 left-1/2 -translate-x-1/2 border-1 border-gray-900 z-7000000 rounded-full'>
        <Link 
             to={isTrained ? "/recommended" : "/products"}
             className='block p-3 px-15 cursor-pointer text-xl 2xl:text-xl italic text-gray-900'
          > 
             {isTrained ? "Recommended AI" : "Discover All"} 
          </Link>          <div className='absolute text-md px-3 italic font-medium bg-pink-400 right-[-10%] top-5 -rotate-30'>Pants</div>
          <div className='absolute text-md px-3 italic font-medium bg-blue-600 left-[-10%] top-7 rotate-10'>Jackets</div>
          <div className='absolute text-md px-3 italic font-medium  bg-error left-[75%] top-[-10px] -rotate-8'>Shirt</div>
          <div className='absolute text-md px-3 italic font-medium bg-green-600 left-[0%] top-[-10px] -rotate-5'>T-Shirt</div>
          <div className='absolute text-md px-3 italic font-medium bg-violet-500 left-[30%] top-11 -rotate-1'>Sneakers</div>
          <div className='absolute text-md px-3 italic font-medium bg-amber-200 left-[37%] top-[-10px] rotate-0'>Hoodie</div>
        </div>
      </div>

      {/* --- PARTIE DROITE (Cartes Empilées) --- */}
      <div className='w-full md:w-[50%] h-[50vh] md:h-screen relative '>
        
        <div className='w-full h-full relative flex items-center justify-center'>
          
          {categories.map((cat, index) => (
            <div 
              key={cat.id}
              className={`category-card absolute w-full h-full flex items-center justify-center top-0 left-0 `}
              style={{ 
                  zIndex: index, // L'ordre d'empilement est crucial (0 en bas, 5 en haut)
                  willChange: 'transform' // Optimisation performance
              }} 
            >
              
              <Link 
                to={`/products?categorie=${cat.name}`}
                className='relative group cursor-pointer'
              >
                <div className={`
                    h-[400px] w-[300px] sm:h-[540px] sm:w-[380px] 
                    relative overflow-hidden 
                    border-8 ${cat.borderClass} 
                   
                   
                  
                `}>
                  
                  <div className={`absolute inset-0 ${cat.bgClass} z-10`} />

                  <img 
                    src={cat.img} 
                    alt={cat.name} 
                    className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-105'
                  />

                  <div className="absolute bottom-0 left-0 w-full p-4   flex justify-between z-20 text-center">
                    <span className={`text-2xl font-bold uppercase ${cat.colorClass}`} >
                        {cat.name}
                    </span>
                   <ArrowUpRight className={`text-2xl font-bold uppercase size-12 ${cat.colorClass}`}></ArrowUpRight>
                  </div>

                </div>
              </Link>

            </div>
          ))}

        </div>
      </div>

    </div>
  );
};

export default Category;