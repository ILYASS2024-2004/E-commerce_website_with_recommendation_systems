import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
// Pas besoin de ScrollTrigger pour une animation d'entrée simple, mais je le garde importé au cas où
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./hero.css"; 

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const compRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      
      const tl = gsap.timeline();

      // 1. Animation des Textes (Entrée avec rotation et Y)
      tl.from(".hero-text", {
        y: 80,         // Vient du bas
          // Commence invisible
        rotate: 6,      // Légère rotation au début
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,    // Le titre du haut, puis celui du bas
        opacity: 0
      });

      // 2. Animation des Images (Explosion depuis le centre)
      // On utilise 'from' : cela veut dire "Commence à cet état, et va vers le CSS actuel"
      tl.from(".hero-img", {
        x: 0,           // Commence au centre (ignore le translate Tailwind au début)
        
        y: 24,         // Un peu plus bas
        rotation: 0,    // Commence droit (ignore le rotate Tailwind au début)
        scale: 1,     // Commence petit
           // Commence invisible
        duration: 1.5,
        ease: "expo.out", // Effet d'explosion fluide
        // stagger: 0.1    // Les images sortent une par une rapidement
      }, "-=0.9"); // Commence 0.8s avant la fin de l'animation texte

    }, compRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={compRef} className="h-[100vh] lin-lr relative flex flex-col justify-center items-center overflow-hidden">
              <img src="img/about_do.png" className='absolute bottom-[0%] mix-blend-difference left-0 h-[200px] select-none pointer-events-none ' alt="abt" />

      {/* TITRE HAUT */}
      <div className="absolute top-[18%] scale-y-150 left-[50%] overflow-hidden -translate-x-1/2 -translate-y-1/2 z-10">
        <h1 className=" text-center  uppercase   text-6xl  font-black">
        Qua<span className="inline-block hero-text">lity first</span>
      </h1>
      </div>
      

      {/* CONTENEUR IMAGES */}
      <div className="relative h-[80%] w-[80%] scale-66 flex justify-center items-center gap-0 translate-y-6">
        
        {/* IMAGE 1 (Violet) */}
        <div className="hero-img p-8 h-[500px] w-[350px] absolute bg-purple-400 -translate-x-[110%] rotate-2 shadow-2xl">
          <img className="h-full w-full object-cover" src="https://i.pinimg.com/736x/38/9b/b4/389bb4540bf23de7a051a73e78476516.jpg" alt="" />
        </div>
        
        {/* IMAGE 2 (Vert) */}
        <div className="hero-img p-8 h-[500px] w-[350px] absolute bg-green-600 -translate-x-[20%] -rotate-8 shadow-2xl">
          <img className="h-full w-full object-cover" src="https://tse1.mm.bing.net/th/id/OIP.VzaAIQ7keKtETkQY3XiR7QHaLG?rs=1&pid=ImgDetMain&o=7&rm=3" alt="" />
        </div>
        
        {/* IMAGE 3 (Jaune) */}
        <div className="hero-img p-8 h-[500px] w-[350px] absolute bg-amber-200 translate-x-[40%] rotate-12 z-1 shadow-2xl">
          <img className="h-full w-full object-cover" src="https://i.pinimg.com/736x/a6/0e/d7/a60ed72845978e2f230ca4ef627e9887.jpg" alt="" />
        </div>
        
        {/* IMAGE 4 (Rouge/Error) */}
        <div className="hero-img p-8 h-[500px] w-[350px] bg-error translate-x-[110%] -rotate-6 shadow-2xl">
          <img className="h-full w-full object-cover" src="https://i.pinimg.com/originals/cc/d4/62/ccd4624a7c44d30a81fdf5f4dc420a9f.jpg" alt="" />
        </div>

      </div>

      {/* TITRE BAS */}
     
       <div className="absolute  w-[70%] scale-y-140 font-black uppercase bottom-[20px] left-[50%] -translate-x-1/2 z-10">
        <h1 className=" text-center    text-8xl font-black uppercase ">
        Impa<span className="hero-text inline-block">ct for ever</span>

      </h1>
      </div>
      <div className='absolute text-2xl px-3 scale-y-60   font-medium bg-pink-400 bottom-[20px] z-20  left-[20%] -translate-x-1/2 -translate-y-1/2 -rotate-30'
      >
                <span className='fth'>Me</span>&<span className='italic'>Me</span>

        </div>


    </div>
  );
}