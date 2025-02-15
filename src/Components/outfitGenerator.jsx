
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as tf from "@tensorflow/tfjs";

const OutfitGenerator = ({ pantsList, tshirtsList, shortsList, weather, occasion, location, sex, age, specialRequirements }) => {
    const [recommendedOutfit, setRecommendedOutfit] = useState("Press Generate to get an outfit");
    const [trainedModel, setTrainedModel] = useState(null);

    useEffect(() => {
        trainColorModel();
    }, []);

    const trainColorModel = async () => {
        const colorData = [
            // Complementary Colors
            { input: [255, 0, 0], output: [0, 255, 255] }, // Red → Cyan
            { input: [0, 255, 0], output: [255, 0, 255] }, // Green → Magenta
            { input: [0, 0, 255], output: [255, 255, 0] }, // Blue → Yellow
            { input: [255, 165, 0], output: [0, 105, 255] }, // Orange → Azure
            { input: [128, 0, 128], output: [128, 255, 0] }, // Purple → Chartreuse
            { input: [255, 255, 0], output: [0, 0, 255] }, // Yellow → Blue
            { input: [0, 255, 255], output: [255, 0, 0] }, // Cyan → Red
            { input: [255, 0, 255], output: [0, 255, 0] }, // Magenta → Green
        
            // Analogous Colors
            { input: [255, 0, 0], output: [255, 69, 0] }, // Red → Red-Orange
            { input: [255, 69, 0], output: [255, 165, 0] }, // Red-Orange → Orange
            { input: [255, 165, 0], output: [255, 215, 0] }, // Orange → Gold
            { input: [255, 215, 0], output: [255, 255, 0] }, // Gold → Yellow
            { input: [0, 255, 0], output: [0, 255, 127] }, // Green → Spring Green
            { input: [0, 255, 127], output: [0, 255, 255] }, // Spring Green → Cyan
            { input: [0, 0, 255], output: [75, 0, 130] }, // Blue → Indigo
            { input: [75, 0, 130], output: [138, 43, 226] }, // Indigo → Blue-Violet
        
            // Triadic Colors (Equally Spaced on the Color Wheel)
            { input: [255, 0, 0], output: [0, 255, 0] }, // Red → Green (Triadic)
            { input: [255, 0, 0], output: [0, 0, 255] }, // Red → Blue (Triadic)
            { input: [0, 255, 0], output: [255, 0, 0] }, // Green → Red (Triadic)
            { input: [0, 255, 0], output: [0, 0, 255] }, // Green → Blue (Triadic)
            { input: [0, 0, 255], output: [255, 0, 0] }, // Blue → Red (Triadic)
            { input: [0, 0, 255], output: [0, 255, 0] }, // Blue → Green (Triadic)
        ];
        
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 16, inputShape: [3], activation: "relu" }));
        model.add(tf.layers.dense({ units: 3, activation: "sigmoid" })); // Output: RGB normalized

        model.compile({ optimizer: "adam", loss: "meanSquaredError" });

        const xs = tf.tensor2d(colorData.map((d) => d.input.map((c) => c / 255)));
        const ys = tf.tensor2d(colorData.map((d) => d.output.map((c) => c / 255)));

        await model.fit(xs, ys, { epochs: 500 });

        setTrainedModel(model);
        console.log("Color model trained successfully!");
    };

    const hexToRgb = (hex) => {
        hex = hex.replace("#", "");
        const bigint = parseInt(hex, 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };

    const rgbToHex = ([r, g, b]) => {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    };

    const findComplementaryColor = async (color) => {
        if (!trainedModel) return color;

        const rgbInput = hexToRgb(color);
        const inputTensor = tf.tensor2d([rgbInput.map((c) => c / 255)]);
        const prediction = trainedModel.predict(inputTensor);
        const outputArray = (await prediction.array())[0];
        return rgbToHex(outputArray.map((c) => Math.round(c * 255)));
    };

    const getClosestColorMatch = (color, availableColors) => {
        let closestColor = availableColors[0];
        let minDifference = Number.MAX_VALUE;

        const inputRgb = hexToRgb(color);

        availableColors.forEach((wardrobeColor) => {
            const wardrobeRgb = hexToRgb(wardrobeColor);
            const diff = Math.sqrt(
                Math.pow(inputRgb[0] - wardrobeRgb[0], 2) +
                Math.pow(inputRgb[1] - wardrobeRgb[1], 2) +
                Math.pow(inputRgb[2] - wardrobeRgb[2], 2)
            );

            if (diff < minDifference) {
                minDifference = diff;
                closestColor = wardrobeColor;
            }
        });

        return closestColor;
    };

    const generateOutfit = async () => {
        if (!weather || !occasion || !location || !sex || !age) {
            setRecommendedOutfit("Please select all parameters (weather, occasion, location, sex, and age group).");
            return;
        }

        const availableItems = [...pantsList, ...tshirtsList, ...shortsList];

        if (availableItems.length === 0) {
            setRecommendedOutfit("No clothing items available in the wardrobe.");
            return;
        }

        const itemColors = availableItems.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`); // Random colors for demo
        const baseColor = itemColors[0]; // Select first item as base color
        const complementaryColor = await findComplementaryColor(baseColor);
        const matchedColor = getClosestColorMatch(complementaryColor, itemColors);

        // Format special requirements if they exist
        const specialReqsText = specialRequirements?.length > 0
            ? `\n- Special Requirements: ${specialRequirements.join(", ")}`
            : "";

        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: `Based on the following parameters:
                - Weather condition: "${weather}"
                - Occasion: "${occasion}"
                - Location: "${location}"
                - Sex: "${sex}"
                - Age group: "${age}"
                
                Please suggest an appropriate outfit using these available clothing items: ${availableItems.join(", ")}. 
                Ensure that the selected colors are aesthetically pleasing and complementary. Prioritize outfits that 
                use the closest color match to the recommended complementary color: ${matchedColor}.
                ${specialReqsText}
              `,
                        },
                    ],
                },
            ],
        };

        try {
            const response = await axios.post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
                requestBody,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    params: {
                        key: "AIzaSyAwHX-XqBew9XaQDnLkqnv3aKOup5hm1bY", // Replace with your actual API key
                    },
                }
            );

            const generatedText =
                response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                response.data?.candidates?.[0]?.content?.parts?.[0]?.textContent ||
                response.data?.candidates?.[0]?.text ||
                "Could not generate an outfit.";

            setRecommendedOutfit(generatedText);
        } catch (error) {
            console.error("Error fetching outfit from Gemini:", error);
            setRecommendedOutfit("Failed to generate outfit. Try again.");
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <div className="text-black text-center mt-4">
            </div>
            
            <h2 className="text-lg font-bold" style={{color:"black"}}> Suggested Outfit:</h2>
            <p className="text-sm">{recommendedOutfit}</p>
            <button
                onClick={generateOutfit}
                className="mt-4 p-3 btn btn-primary text-white rounded-lg hover:bg-blue-700 transition-all"
            >
                Generate Outfit
            </button>
        </div>
        </div>
        
    );
};

export default OutfitGenerator;
