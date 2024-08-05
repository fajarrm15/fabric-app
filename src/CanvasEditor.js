import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

const CanvasEditor = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current);

    // Add text to the canvas
    const addText = () => {
      const text = new fabric.IText("Hello Fabric.js", {
        left: 100,
        top: 100,
        fill: "#000",
        fontSize: 24,
      });
      canvas.add(text);
    };

    // Add image to the canvas
    const addImage = () => {
      const url = "https://example.com/path/to/your/image.jpg"; // Replace with the actual image URL
      fabric.Image.fromURL(url, (img) => {
        img.set({
          left: 100,
          top: 100,
        });
        canvas.add(img);
      });
    };

    // Download canvas as image
    const downloadCanvas = () => {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 0.8,
      });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas.png";
      link.click();
    };

    document.getElementById("add-text").addEventListener("click", addText);
    document.getElementById("add-image").addEventListener("click", addImage);
    document
      .getElementById("download")
      .addEventListener("click", downloadCanvas);

    // Cleanup event listeners on component unmount
    return () => {
      document.getElementById("add-text").removeEventListener("click", addText);
      document
        .getElementById("add-image")
        .removeEventListener("click", addImage);
      document
        .getElementById("download")
        .removeEventListener("click", downloadCanvas);
    };
  }, []);

  return (
    <div>
      <div id="canvas-container">
        <canvas ref={canvasRef} width="800" height="600"></canvas>
      </div>
      <button id="add-text">Add Text</button>
      <button id="add-image">Add Image</button>
      <button id="download">Download</button>
    </div>
  );
};

export default CanvasEditor;
