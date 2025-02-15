import React from 'react';

const colorComplementMap = {
  red: ["green", "white", "black"],
  blue: ["orange", "white", "gray"],
  yellow: ["purple", "black", "navy"],
  green: ["red", "white", "beige"],
  orange: ["blue", "black", "white"],
  purple: ["yellow", "white", "gray"],
  black: ["white", "gray", "red"],
  white: ["black", "blue", "gray"],
};

export const getComplementaryColors = (color) => {
  return colorComplementMap[color.toLowerCase()] || ["white", "black"];
};

const ColorTheory = ({ color }) => {
  const complementaryColors = getComplementaryColors(color);

  return (
    <div className="text-white text-center mt-4">
      <h2 className="text-lg font-bold">Complementary Colors for {color}:</h2>
      <p className="text-sm">{complementaryColors.join(", ")}</p>
    </div>
  );
};

export default ColorTheory;
