// import React, { useCallback } from 'react';
// import Particles from 'react-tsparticles';
// import { loadSlim } from 'tsparticles-slim';
// import Search from './Components/Search';
// import Navbar from './Components/Navbar';
// // import 'bootstrap/dist/css/bootstrap.min.css';
// // import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// // import VirtualTryOn from './Components/VirtualTryOn';
// // import { db } from './firebase';
// import ColorRecommender from './Components/ColorRecommender';

// function App() {
//   const particlesInit = useCallback(async (engine) => {
//     console.log("Particles Engine Loaded:", engine);
//     await loadSlim(engine);
//   }, []);

//   return (
//     <>

//       <Particles
//         id="tsparticles"
//         init={particlesInit}
//         options={{
//           fullScreen: { enable: true, zIndex: -1 },
//           background: { color: "transparent" },
//           fpsLimit: 120,
//           particles: {
//             color: { value: "#ffffff" },
//             move: { enable: true, speed: 1, outModes: { default: "bounce" } },
//             number: { value: 100, density: { enable: true, area: 800 } },
//             opacity: { value: 0.5 },
//             shape: { type: "circle" },
//             size: { value: { min: 1, max: 3 } },
//           },
//         }}
//         className="absolute inset-0 w-full h-full"
//       />
      


//       <Navbar />


//       <div className="relative min-h-screen flex flex-col items-center justify-center bg-transparent">
//         <Search />
//       </div>
//       <div>
//         {/* <VirtualTryOn></VirtualTryOn> */}
//       </div>
//     </>
//   );
// }

// export default App;



import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import Search from './Components/Search';
import Navbar from './Components/Navbar';
// import ColorRecommender from './Components/ColorRecommender';
import ImageDetection from './Components/ImageDetection';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';

function App() {
  

  return (
    <>


      <div className="container " >
        <div className="card  m-5 p-3">
          <div className="relative min-h-screen flex flex-col items-center justify-center bg-transparent">
            <Search />
          </div>
        </div>
        

        {/* Color Recommender Section */}
        {/* <div className="relative flex flex-col items-center justify-center mt-10">
          <h2 className="text-2xl font-bold text-white mb-4">Find Complementary Colors</h2>
          <ColorRecommender />
        </div> */}

        {/* Image Detection Section */}
        <div className="relative flex flex-col items-center justify-center mt-10">
          <ImageDetection />
        </div>
      </div>
      
    </>
  );
}

export default App;
