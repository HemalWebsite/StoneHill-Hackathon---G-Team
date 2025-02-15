import React, { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


const ImageDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [detectedItem, setDetectedItem] = useState("");
  const [detectedColor, setDetectedColor] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const detectColor = async (image) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = URL.createObjectURL(image);
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height).data;

        // Get average color
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < imageData.length; i += 4) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
          count++;
        }
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        resolve(`#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`);
      };
    });
  };

  const detectItem = async (image) => {
    const model = await mobilenet.load();
    const img = document.createElement("img");
    img.src = URL.createObjectURL(image);
    await new Promise((resolve) => (img.onload = resolve));
    const predictions = await model.classify(img);
    return predictions.length > 0 ? predictions[0].className : "Unknown item";
  };

  const uploadImageAndSaveData = async () => {
    if (!selectedImage) {
        alert("Please select an image first.");
        return;
    }

    setLoading(true);

    try {
        // Detect color & item
        const color = await detectColor(selectedImage);
        const item = await detectItem(selectedImage);
        setDetectedColor(color);
        setDetectedItem(item);

        // Format the query as "color + item name"
        const queryText = `${color} ${item}`;

        // Upload image to Firebase Storage
        const storageRef = ref(storage, `images/${selectedImage.name}`);
        await uploadBytes(storageRef, selectedImage);
        const imageUrl = await getDownloadURL(storageRef);

        // Save metadata in Firestore under the "items" collection
        await addDoc(collection(db, "items"), {
            query: queryText,
            imageUrl,
            detectedItem: item,
            detectedColor: color,
            timestamp: new Date(),
        });

        alert("Image uploaded & data saved!");
        setSelectedImage(null);
        setPreviewImage(null);
        setComment("");
        setDetectedItem("");
        setDetectedColor("");
    } catch (error) {
        console.error("Error uploading image:", error);
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="text-black text-center p-6">
        <div className="card">
            <div className="card-header">
                <  h2 className="text-lg font-bold mb-4">Image Detection</h2>
            </div>
            <div className="card-text">
                 {/* Image Upload */}
                <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />
                {previewImage && <img src={previewImage} alt="Preview" className="w-48 mx-auto mt-4 rounded-lg" />}
                {/* Comment Input */}
                <div className="row">
                {/* <input
                    type="text"
                    placeholder="Add a comment (e.g., 'Baggy T-Shirt')"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="px-4 py-2 m-2 rounded bg-gray-800 text-white mb-4"
                    style={{ width: "50%", margin:"50px", textAlign: "center", display: "block", margin: "0 auto", borderRadius:"50px" }}
                    /> */}

                </div>
                

                {/* Detection Results */}
                {detectedItem && <p className="mt-2">Detected Item: <strong>{detectedItem}</strong></p>}
                {detectedColor && <p className="mt-2">Dominant Color: <span className="px-2 py-1 rounded-lg" style={{ backgroundColor: detectedColor }}>{detectedColor}</span></p>}

                {/* Upload Button */}
                <button
                    onClick={uploadImageAndSaveData}
                    className="mt-4 p-3 text-white rounded-lg hover:bg-blue-700 transition-all"
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Upload & Detect"}
                </button>
            </div>
        </div>
      
     

      
    </div>
  );
};

export default ImageDetection;

