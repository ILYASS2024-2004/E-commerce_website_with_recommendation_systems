// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const ModelViewer = ({dimx,modelPath,p}) => {
//   const mountRef = useRef(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const currentMount = mountRef.current;
//     const width = currentMount.clientWidth;
//     const height = currentMount.clientHeight;

//     // 1. Scène : NE PAS METTRE DE BACKGROUND ICI
//     const scene = new THREE.Scene();
//     // scene.background = new THREE.Color(0xf1f1f1); <--- Ligne supprimée pour la transparence

//     // 2. Caméra
//     const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//     camera.position.set(0, 1, 4);

//     // 3. Rendu : ACTIVER L'ALPHA (Transparence)
//     const renderer = new THREE.WebGLRenderer({ 
//         antialias: true, 
//         alpha: true // <--- C'est la clé ! Cela rend le fond du canvas transparent
//     });
    
//     renderer.setSize(width, height);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true;
    
//     // Cette ligne assure que le fond est bien vide (transparent)
//     renderer.setClearColor(0x000000, 0); 

//     currentMount.appendChild(renderer.domElement);

//     // 4. Contrôles
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true; 
//     controls.enableZoom = false;

//     // 5. Lumières
//     const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
//     scene.add(ambientLight);

//     const dirLight = new THREE.DirectionalLight(0xffffff, 2);
//     dirLight.position.set(5, 10, 7);
//     scene.add(dirLight);

//     // 6. Chargement
//     const loader = new GLTFLoader();
//     loader.load(modelPath, 
//       (gltf) => {
//         const model = gltf.scene;
//         model.scale.set(dimx, dimx, dimx);
      
        
//         scene.add(model);
//         setLoading(false);
//       },
//       undefined,
//       (error) => {
//         console.error('Erreur chargement:', error);
//         setLoading(false);
//       }
//     );

//     const handleResize = () => {
//       if (!currentMount) return;
//       const newWidth = currentMount.clientWidth;
//       const newHeight = currentMount.clientHeight;
//       camera.aspect = newWidth / newHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(newWidth, newHeight);
//     };

//     window.addEventListener('resize', handleResize);

//     let animationId;
//     const animate = () => {
//       animationId = requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       cancelAnimationFrame(animationId);
//       if (currentMount && renderer.domElement) {
//           currentMount.removeChild(renderer.domElement);
//       }
//       renderer.dispose();
//     };

//   }, []);

//   return (
//     <div className='relative h-screen w-screen  overflow-hidden bg-blue-600 '> {/* J'ai mis un bg au conteneur global pour voir le contraste */}
        
//         {/* LE TEXTE (Derrière) */}
//         {/* z-0 : Niveau bas */}
//         <div className='absolute top-1/2 left-1/2 bg-red-500 border-r-4 border-l-4 -translate-x-1/2 w-[80%] h-screen -translate-y-1/2  text-9xl flex justify-center items-center above font-bold text-black'>
//            <p className='bg-[#f1f1f1] h-[80%] flex justify-center items-center'>
//             {p}</p>
//         </div>

//         {/* LE MODEL 3D (Devant) */}
//         {/* z-10 : Niveau haut */}
//         {/* pointer-events-none : Si tu veux pouvoir sélectionner le texte à travers le vide (optionnel) */}
//         <div 
//             ref={mountRef} 
//             className='absolute top-0 left-0 w-full h-full z-10'
//             style={{ outline: 'none' }}
//         >
//             {loading && (
//                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-xl">
//                     ...
//                 </div>
//             )}
//         </div>
//     </div>
//   );
// };

// export default ModelViewer;
// import React, { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// const ModelViewer = ({ dimx, modelPath, p }) => {
//   const mountRef = useRef(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!mountRef.current) return;

//     const currentMount = mountRef.current;
//     const width = currentMount.clientWidth;
//     const height = currentMount.clientHeight;

//     // --- OPTIMISATION 1 : Renderer moins gourmand ---
//     const renderer = new THREE.WebGLRenderer({ 
//         antialias: false, // Désactiver l'antialias booste énormément les perfs
//         alpha: true,
//         powerPreference: "high-performance" // Demande au GPU de prioriser la fluidité
//     });
    
//     renderer.setSize(width, height);
//     // Limiter le pixel ratio à 2 (pour les écrans 4K/Retina qui tuent les perfs)
//     renderer.setPixelRatio(window.devicePixelRatio); 
//     renderer.setClearColor(0x000000, 0);
//     currentMount.appendChild(renderer.domElement);

//     const scene = new THREE.Scene();

//     const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
//     camera.position.set(0, 1, 4);

//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.enableZoom = false;

//     const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
//     scene.add(ambientLight);
//     const dirLight = new THREE.DirectionalLight(0xffffff, 2);
//     dirLight.position.set(5, 10, 7);
//     scene.add(dirLight);

//     let model = null;
//     const loader = new GLTFLoader();
    
//     loader.load(modelPath, (gltf) => {
//         model = gltf.scene;
//         model.scale.set(dimx, dimx, dimx);
//         scene.add(model);
//         setLoading(false);
//       }, undefined, (error) => console.error(error)
//     );

//     // --- OPTIMISATION 2 : Intersection Observer (Arrête le rendu si hors écran) ---
//     let animationId;
//     let isVisible = false;

//     const animate = () => {
//       // Si l'élément n'est pas visible, on ne calcule rien !
//       if (!isVisible) return;

//       animationId = requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };

//     const observer = new IntersectionObserver(([entry]) => {
//         isVisible = entry.isIntersecting;
//         if (isVisible) {
//             animate(); // Relance la boucle si visible
//         } else {
//             cancelAnimationFrame(animationId); // Coupe la boucle si caché
//         }
//     }, { threshold: 0.1 }); // Se déclenche dès que 10% de l'objet est visible

//     observer.observe(currentMount);

//     // --- GESTION REDIMENSIONNEMENT ---
//     const handleResize = () => {
//       const newWidth = currentMount.clientWidth;
//       const newHeight = currentMount.clientHeight;
//       camera.aspect = newWidth / newHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(newWidth, newHeight);
//     };
//     window.addEventListener('resize', handleResize);

//     // --- NETTOYAGE TOTAL (CRUCIAL POUR LA MÉMOIRE) ---
//     return () => {
//       observer.disconnect();
//       window.removeEventListener('resize', handleResize);
//       cancelAnimationFrame(animationId);
      
//       if (currentMount && renderer.domElement) {
//         currentMount.removeChild(renderer.domElement);
//       }

//       // Nettoyage profond de la scène (Three.js ne le fait pas tout seul)
//       scene.traverse((object) => {
//         if (object.isMesh) {
//           object.geometry.dispose();
//           if (object.material.isMaterial) {
//             object.material.dispose();
//           } else {
//             // Si c'est un tableau de matériaux
//             for (const material of object.material) material.dispose();
//           }
//         }
//       });

//       renderer.dispose();
//     };

//   }, [dimx, modelPath]); // Dépendances

//   return (
//     <div className='relative h-screen w-screen overflow-hidden bg-blue-600  '>
//        {/* Texte... identique à ton code */}
//        <div className='absolute top-1/2 left-1/2 bg-red-500 -translate-x-1/2 w-[80%] h-screen -translate-y-1/2 text-9xl border-r-4 border-l-4 flex justify-center items-center font-bold text-black pointer-events-none z-0'>
//            <p className='bg-[#f1f1f1] h-[80%] flex justify-center items-center above'>
//             {p}
//            </p>
//        </div>

//        <div 
//            ref={mountRef} 
//            className='absolute top-0 left-0 w-full h-full z-10'
//            style={{ outline: 'none' }}
//        >
//            {loading && (
//                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-xl">
//                    Chargement...
//                </div>
//            )}
//        </div>
//     </div>
//   );
// };

// export default ModelViewer;
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ModelViewer = ({ dimx, modelPath, p }) => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  
  // --- OPTIMISATION : Variable pour savoir si on est visible ou non ---
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const currentMount = mountRef.current;
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scène
    const scene = new THREE.Scene();

    // 2. Caméra
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 1, 4);

    // 3. Rendu
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
    });
    
    renderer.setSize(width, height);
    // --- OPTIMISATION : Bloquer la qualité max à 1.5 pour éviter la surchauffe sur écrans Retina ---
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x000000, 0); 

    currentMount.appendChild(renderer.domElement);

    // 4. Contrôles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; 
    controls.enableZoom = false;

    // 5. Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // 6. Chargement
    const loader = new GLTFLoader();
    loader.load(modelPath, 
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(dimx, dimx, dimx);
        scene.add(model);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error('Erreur chargement:', error);
        setLoading(false);
      }
    );

    // --- OPTIMISATION : Intersection Observer (Détecteur de visibilité) ---
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Si l'élément est visible à l'écran, on active le rendu
        isVisibleRef.current = entry.isIntersecting;
      });
    }, { threshold: 0 }); // Se déclenche dès que 10% du composant est visible

    observer.observe(currentMount);

    // 7. Animation Loop (Modifiée pour la performance)
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // NE CALCULER QUE SI VISIBLE !
      if (isVisibleRef.current) {
        controls.update();
        renderer.render(scene, camera);
      }
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Nettoyage complet
      observer.disconnect(); // Arrêter d'observer
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (currentMount && renderer.domElement) {
          currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      
      // Nettoyer la mémoire GPU (Important pour éviter le crash après plusieurs scrolls)
      scene.traverse((object) => {
        if (object.isMesh) {
          object.geometry.dispose();
          if (object.material.isMaterial) {
            object.material.dispose();
          }
        }
      });
    };

  }, [modelPath, dimx]); // Dépendances ajoutées pour recharger si les props changent

  // --- TON DESIGN ORIGINAL INTACT ---
  return (
    <div className='relative h-screen w-screen  overflow-hidden bg-blue-600 '> 
        
        {/* LE TEXTE (Derrière) */}
        <div className='absolute top-1/2 left-1/2 bg-red-500 border-r-4 border-l-4 -translate-x-1/2 w-[80%] h-screen -translate-y-1/2  text-9xl flex justify-center items-center above font-bold text-black'>
           <p className='bg-[#f1f1f1] h-[80%] flex justify-center items-center'>
            {p}</p>
        </div>

        {/* LE MODEL 3D (Devant) */}
        <div 
            ref={mountRef} 
            className='absolute top-0 left-0 w-full h-full z-10'
            style={{ outline: 'none' }}
        >
            {loading && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black text-xl">
                    ...
                </div>
            )}
        </div>
    </div>
  );
};

export default ModelViewer;