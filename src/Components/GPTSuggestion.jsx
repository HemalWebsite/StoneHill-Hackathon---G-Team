import React, { useState } from 'react';

function GPTSuggestion({ keywords, location, occasion, gender }) {
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use Google Gemini API key
  const API_KEY = "AIzaSyD8WqBzM77v3N2NmztpDt9kad-UIpgIEcE";

  const getSuggestion = async () => {
    if (keywords.length === 0) return;
    setLoading(true);
    setError(null);
  
    const userPrompt = `I want to wear an outfit with these items: ${keywords.join(", ")}. Given the location: ${location}, occasion: ${occasion}, and gender: ${gender}, what colors and styles would complement them well?`;
  
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userPrompt }] }] // FIXED REQUEST FORMAT
        })
      });
  
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (data.candidates && data.candidates.length > 0) {
        setSuggestion(data.candidates[0].output);
      } else {
        setSuggestion("No valid suggestion received.");
      }
    } catch (error) {
      console.error("Error fetching Gemini AI response:", error);
      setError("Error fetching suggestion. Please try again.");
    }
  
    setLoading(false);
  };
  

  return (
    <div className="mt-4 text-center">
      <button 
        onClick={getSuggestion} 
        className="p-2 bg-blue-500 rounded-lg hover:bg-blue-700 transition-all text-white"
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Outfit Suggestion"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {suggestion && <p className="text-white mt-4">{suggestion}</p>}
    </div>
  );
}

export default GPTSuggestion;
