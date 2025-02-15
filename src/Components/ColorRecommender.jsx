import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

const ColorRecommender = () => {
  const [inputColor, setInputColor] = useState("#3498db"); // Default: Blue
  const [recommendedColors, setRecommendedColors] = useState([]);
  const [trainedModel, setTrainedModel] = useState(null);

  useEffect(() => {
    const trainModel = async () => {
      const colorData = [
        { input: [255, 0, 0], output: [0, 255, 255] }, // Red → Cyan (Complementary)
        { input: [0, 255, 0], output: [255, 0, 255] }, // Green → Magenta (Complementary)
        { input: [0, 0, 255], output: [255, 255, 0] }, // Blue → Yellow (Complementary)
        { input: [255, 165, 0], output: [255, 215, 0] }, // Orange → Gold (Analogous)
        { input: [128, 0, 128], output: [75, 0, 130] }, // Purple → Indigo (Analogous)
      ];

      const model = tf.sequential();
      model.add(tf.layers.dense({ units: 16, inputShape: [3], activation: "relu" }));
      model.add(tf.layers.dense({ units: 3, activation: "sigmoid" })); // Output: RGB normalized

      model.compile({ optimizer: "adam", loss: "meanSquaredError" });

      const xs = tf.tensor2d(colorData.map((d) => d.input.map((c) => c / 255)));
      const ys = tf.tensor2d(colorData.map((d) => d.output.map((c) => c / 255)));

      await model.fit(xs, ys, { epochs: 500 });

      setTrainedModel(model);
      console.log("Model trained successfully!");
    };

    trainModel();
  }, []);

  const hexToRgb = (hex) => {
    hex = hex.replace("#", "");
    const bigint = parseInt(hex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const rgbToHex = ([r, g, b]) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const generateColorRecommendation = async () => {
    if (!trainedModel) {
      console.log("Model is still loading...");
      return;
    }

    const rgbInput = hexToRgb(inputColor);
    const inputTensor = tf.tensor2d([rgbInput.map((c) => c / 255)]);

    const prediction = trainedModel.predict(inputTensor);
    const outputArray = (await prediction.array())[0]; // Convert tensor to array
    const recommendedRgb = outputArray.map((c) => Math.round(c * 255));

    setRecommendedColors([rgbToHex(recommendedRgb)]);
    console.log("Generated color:", rgbToHex(recommendedRgb));
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-lg font-bold mb-4">Color Harmony Recommender</h2>

      {/* Color Input */}
      <input
        type="color"
        value={inputColor}
        onChange={(e) => setInputColor(e.target.value)}
        className="w-16 h-16 border rounded-full mb-4"
      />

      {/* Generate Recommendation */}
      <button
        onClick={generateColorRecommendation}
        className="ml-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        Suggest Matching Colors
      </button>

      {/* Display Recommendations */}
      {recommendedColors.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-semibold">Recommended Color:</h3>
          <div
            className="w-16 h-16 mx-auto rounded-full border mt-2"
            style={{ backgroundColor: recommendedColors[0] }}
          ></div>
          <p className="text-white mt-2">{recommendedColors[0]}</p>
        </div>
      )}
    </div>
  );
};

export default ColorRecommender;
