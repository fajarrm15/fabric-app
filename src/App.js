// src/App.js
import React, { useState, useRef } from "react";
import FabricCanvas from "./components/FabricCanvas";
import InputForm from "./components/InputForm";

function App() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const canvasRef = useRef(null);

  const addText = (text) => {
    const newElement = {
      id: `text-${elements.length + 1}`,
      type: "text",
      x: 50,
      y: 50,
      text: text,
      fontSize: 30,
    };
    setElements([...elements, newElement]);
  };

  const addImage = (src) => {
    const newElement = {
      id: `image-${elements.length + 1}`,
      type: "image",
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      src: src,
    };
    setElements([...elements, newElement]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL({
      format: "png",
    });
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "canvas.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div style={{ flex: 1 }}>
        <FabricCanvas
          elements={elements}
          setElements={setElements}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          canvasRef={canvasRef}
        />
      </div>
      <div style={{ flex: 1, padding: "20px", borderLeft: "1px solid black" }}>
        <h2>Controls</h2>
        <InputForm addText={addText} addImage={addImage} />
        <button onClick={handleDownload} style={{ marginTop: "20px" }}>
          Download as PNG
        </button>
      </div>
    </div>
  );
}

export default App;
