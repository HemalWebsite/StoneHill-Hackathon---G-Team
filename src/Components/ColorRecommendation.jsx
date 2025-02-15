// import React, { useState, useEffect } from "react";
// import * as tf from "@tensorflow/tfjs";

// const colorMap = {
//   red: [255, 0, 0],
//   blue: [0, 0, 255],
//   yellow: [255, 255, 0],
//   green: [0, 128, 0],
//   orange: [255, 165, 0],
//   purple: [128, 0, 128],
//   black: [0, 0, 0],
//   white: [255, 255, 255],
//   gray: [128, 128, 128],
//   lightGray: [211, 211, 211],
//   darkGray: [169, 169, 169],
//   brown: [165, 42, 42],
//   pink: [255, 192, 203],
//   cyan: [0, 255, 255],
//   magenta: [255, 0, 255],
//   lime: [0, 255, 0],
//   maroon: [128, 0, 0],
//   navy: [0, 0, 128],
//   olive: [128, 128, 0],
//   teal: [0, 128, 128],
//   gold: [255, 215, 0],
//   silver: [192, 192, 192],
//   beige: [245, 245, 220],
//   turquoise: [64, 224, 208],
//   indigo: [75, 0, 130],
//   violet: [238, 130, 238],
//   salmon: [250, 128, 114],
//   coral: [255, 127, 80],
//   khaki: [240, 230, 140],
//   lavender: [230, 230, 250]
// };

// const locationMap = {
//   beach: [1, 0, 0],
//   city: [0, 1, 0],
//   mountains: [0, 0, 1]
// };

// const occasionMap = {
//   casual: [1, 0, 0],
//   formal: [0, 1, 0],
//   date: [0, 0, 1]
// };

// const genderMap = {
//   male: [1, 0],
//   female: [0, 1]
// };

// async function trainModel() {
//   const model = tf.sequential();
//   model.add(tf.layers.dense({ units: 16, inputShape: [9], activation: "relu" }));
//   model.add(tf.layers.dense({ units: 3, activation: "softmax" }));

//   model.compile({ optimizer: "adam", loss: "meanSquaredError" });

//   const inputs = tf.tensor2d(Object.values(colorMap));
//   const outputs = tf.tensor2d(Object.values(colorMap));

//   await model.fit(inputs, outputs, { epochs: 100 });
//   return model;
// }

// async function predictOutfit(color, location, occasion, gender) {
//   const model = await trainModel();
//   const colorArray = colorMap[color.toLowerCase()] || [255, 255, 255];
//   const locationArray = locationMap[location.toLowerCase()] || [0, 0, 0];
//   const occasionArray = occasionMap[occasion.toLowerCase()] || [0, 0, 0];
//   const genderArray = genderMap[gender.toLowerCase()] || [0, 0];

//   const inputArray = [...colorArray, ...locationArray, ...occasionArray, ...genderArray];
//   const inputTensor = tf.tensor2d([inputArray], [1, 9]);

//   const prediction = model.predict(inputTensor);
//   const outputArray = await prediction.data();
//   const recommendedColor = Object.keys(colorMap).find(
//     (key) => colorMap[key].toString() === outputArray.map(Math.round).toString()
//   );

//   return recommendedColor || "white";
// }

// const ColorRecommendation = ({ color, location, occasion, gender }) => {
//   const [recommendedColor, setRecommendedColor] = useState("Loading...");

//   useEffect(() => {
//     async function fetchColor() {
//       const suggested = await predictOutfit(color, location, occasion, gender);
//       setRecommendedColor(suggested);
//     }
//     fetchColor();
//   }, [color, location, occasion, gender]);

//   return (
//     <div className="text-white text-center mt-4">
//       <h2 className="text-lg font-bold">AI Suggested Outfit for {color} at {location} on {occasion} ({gender}):</h2>
//       <p className="text-sm">{recommendedColor}</p>
//     </div>
//   );
// };

// export default ColorRecommendation;

import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

const colorMap = {
  red: [255, 0, 0], blue: [0, 0, 255], yellow: [255, 255, 0], green: [0, 128, 0],
  orange: [255, 165, 0], purple: [128, 0, 128], black: [0, 0, 0], white: [255, 255, 255],
};

const occasionMap = {
  casual: [1, 0, 0], formal: [0, 1, 0], date: [0, 0, 1]
};

const weatherMap = {
  hot: [1, 0, 0], cold: [0, 1, 0], rainy: [0, 0, 1]
};

const clothingTypeMap = {
  shorts: { hot: true, cold: false, rainy: false },
  pants: { hot: true, cold: true, rainy: true },
  formal_pants: { hot: true, cold: true, rainy: true },
  tshirt: { hot: true, cold: false, rainy: false },
  jacket: { hot: false, cold: true, rainy: true }
};

function filterWardrobeByWeather(wardrobe, weather) {
  return wardrobe.filter(item => clothingTypeMap[item]?.[weather]);
}

function getComplementaryColors(color) {
  const complementary = {
    red: "green", blue: "orange", yellow: "purple",
    green: "red", orange: "blue", purple: "yellow",
    black: "white", white: "black"
  };
  return complementary[color] || "gray";
}

async function trainModel(wardrobe) {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 16, inputShape: [wardrobe[0].length], activation: "relu" }));
  model.add(tf.layers.dense({ units: wardrobe[0].length, activation: "softmax" }));

  model.compile({ optimizer: "adam", loss: "meanSquaredError" });
  const inputs = tf.tensor2d(wardrobe);
  const outputs = tf.tensor2d(wardrobe);
  await model.fit(inputs, outputs, { epochs: 100 });
  return model;
}

async function predictOutfit(wardrobe, occasion, weather) {
  const filteredWardrobe = filterWardrobeByWeather(wardrobe, weather);
  if (filteredWardrobe.length === 0) return "No suitable outfit found";

  const model = await trainModel(filteredWardrobe);
  const occasionArray = occasionMap[occasion.toLowerCase()] || [0, 0, 0];
  const weatherArray = weatherMap[weather.toLowerCase()] || [0, 0, 0];
  
  const inputArray = filteredWardrobe.flat().concat(occasionArray, weatherArray);
  const inputTensor = tf.tensor2d([inputArray], [1, inputArray.length]);

  const prediction = model.predict(inputTensor);
  const outputArray = await prediction.data();
  
  const selectedOutfit = filteredWardrobe.find((item, index) => outputArray[index] > 0.5) || "No suitable outfit found";
  const outfitColor = colorMap[selectedOutfit] ? getComplementaryColors(selectedOutfit) : "gray";

  return `${selectedOutfit} with ${outfitColor} accents`;
}

const OutfitRecommendation = ({ wardrobe, occasion, weather }) => {
  const [recommendedOutfit, setRecommendedOutfit] = useState("Loading...");

  useEffect(() => {
    async function fetchOutfit() {
      const suggested = await predictOutfit(wardrobe, occasion, weather);
      setRecommendedOutfit(suggested);
    }
    fetchOutfit();
  }, [wardrobe, occasion, weather]);

  return (
    <div className="text-white text-center mt-4">
      <h2 className="text-lg font-bold">AI Suggested Outfit for {occasion} in {weather} weather:</h2>
      <p className="text-sm">{recommendedOutfit}</p>
    </div>
  );
};

export default OutfitRecommendation;
