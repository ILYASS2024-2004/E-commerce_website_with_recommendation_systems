import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ModelViewero from './ModelViewero';


gsap.registerPlugin(ScrollTrigger);

const HorizontalScrollo = () => {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".panel");

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=300%", 
          invalidateOnRefresh: true, // Important : Recalcule si la fenêtre change
        }
      });
    }, containerRef);

    // --- LE FIX MAGIQUE ---
    // On attend un tout petit peu (100ms ou 500ms) que le reste de la page (Hero, Images) se place
    // Puis on force GSAP à recalculer les positions exactes.
    const timer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100); // 500ms de délai

    return () => {
        ctx.revert();
        clearTimeout(timer); // Nettoyage
    };
  }, []);

  return (
    <div ref={containerRef} className="hidden sm:block relative w-full h-screen overflow-hidden  ">
      <div className="flex w-[300vw] h-full bg-blue-600 gap-0 m-0">
        
        {/* SECTION 1 */}
        <section className="panel w-screen h-full flex flex-col items-center justify-center relative  "
        //  style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
         >
          <div className="w-full h-full">

             <ModelViewero  p="Performance you can feel premium phones & high-end gaming gear" img="img/techxS.png" />
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="panel w-screen h-full flex flex-col items-center justify-center relative  "
        //style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full">
             <ModelViewero  p="Stay connected. Play harder. Upgrade your tech today" img="img/techxSf.png" />
          </div>
        </section>

        {/* SECTION 3 */}
        <section className="panel w-screen h-full flex flex-col items-center justify-center relative  text-white"
       // style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full">
             <ModelViewero  p="Power up your world,from cam smartphones to gaming PC" img="img/techxSf1.png" />
          </div>
        </section>

      </div>
    </div>
  );
};

export default HorizontalScrollo;