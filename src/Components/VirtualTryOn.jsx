// import React, { useState } from "react";
// import axios from "axios";

// function VirtualTryOn() {
//   const [personImage, setPersonImage] = useState(null);
//   const [clothingImage, setClothingImage] = useState(null);
//   const [resultImage, setResultImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const API_KEY = "YOUR_RAPIDAPI_KEY"; // Replace with actual API Key
//   const API_HOST = "try-on-diffusion.p.rapidapi.com";
//   const API_URL = `https://${API_HOST}/try-on-file`;

//   const handleImageUpload = (event, type) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       if (type === "person") setPersonImage(reader.result);
//       if (type === "clothing") setClothingImage(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const generateTryOn = async () => {
//     if (!personImage || !clothingImage) {
//       console.error("Please upload both images before trying on.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await axios.post(
//         API_URL,
//         { person_image: personImage, clothing_image: clothingImage },
//         {
//           headers: {
//             "X-RapidAPI-Key": API_KEY,
//             "X-RapidAPI-Host": API_HOST,
//             "Content-Type": "application/json"
//           }
//         }
//       );

//       console.log("API Response:", response.data);
//       setResultImage(response.data.image_url);
//     } catch (error) {
//       console.error("Error generating try-on:", error.response ? error.response.data : error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center p-6 bg-gray-900 min-h-screen text-white">
//       <h1 className="text-3xl font-bold mb-4">Virtual Try-On</h1>

//       <div className="flex flex-col md:flex-row items-center gap-6">
//         <div className="flex flex-col items-center">
//           <label className="mb-2 text-lg">Upload Person Image</label>
//           <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "person")} className="mb-2" />
//           {personImage && <img src={personImage} alt="Person" className="w-40 h-40 object-cover rounded-md" />}
//         </div>

//         <div className="flex flex-col items-center">
//           <label className="mb-2 text-lg">Upload Clothing Image</label>
//           <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "clothing")} className="mb-2" />
//           {clothingImage && <img src={clothingImage} alt="Clothing" className="w-40 h-40 object-cover rounded-md" />}
//         </div>
//       </div>

//       <button
//         onClick={generateTryOn}
//         disabled={loading}
//         className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-gray-500"
//       >
//         {loading ? "Processing..." : "Try On"}
//       </button>

//       {resultImage && (
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold">Result</h2>
//           <img src={resultImage} alt="Try-On Result" className="w-80 h-auto rounded-md mt-4" />
//         </div>
//       )}
//     </div>
//   );
// }

// export default VirtualTryOn;
