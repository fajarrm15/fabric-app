// src/components/FabricCanvas.js
import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

const FabricCanvas = ({
  elements,
  setElements,
  selectedId,
  setSelectedId,
  canvasRef,
}) => {
  const canvasElementRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasElementRef.current, {
      width: 600,
      height: 600,
      backgroundColor: "white",
      selection: true,
    });
    canvasRef.current = canvas;

    // Add elements to the canvas
    elements.forEach((el) => {
      if (el.type === "text") {
        const text = new fabric.Text(el.text, {
          left: el.x,
          top: el.y,
          fontSize: el.fontSize,
          id: el.id,
        });
        canvas.add(text);
      } else if (el.type === "image") {
        fabric.Image.fromURL(el.src, (img) => {
          img.set({
            left: el.x,
            top: el.y,
            scaleX: el.width / img.width,
            scaleY: el.height / img.height,
            id: el.id,
          });
          canvas.add(img);
        });
      }
    });

    // Handle object selection
    canvas.on("selection:created", (e) => {
      const selectedObject = e.target;
      if (selectedObject) {
        setSelectedId(selectedObject.id);
      }
    });

    // Handle object modification
    canvas.on("object:modified", (e) => {
      const modifiedObject = e.target;
      if (modifiedObject) {
        const newElements = elements.map((el) => {
          if (el.id === modifiedObject.id) {
            return {
              ...el,
              x: modifiedObject.left,
              y: modifiedObject.top,
              width: modifiedObject.scaleX
                ? modifiedObject.width * modifiedObject.scaleX
                : el.width,
              height: modifiedObject.scaleY
                ? modifiedObject.height * modifiedObject.scaleY
                : el.height,
              text: modifiedObject.text || el.text,
            };
          }
          return el;
        });
        setElements(newElements);
      }
    });

    // Handle object double click for text editing
    canvas.on("mouse:dblclick", (e) => {
      const clickedObject = e.target;
      if (clickedObject && clickedObject.type === "text") {
        const newText = prompt("Edit text:", clickedObject.text);
        if (newText !== null) {
          clickedObject.set({ text: newText });
          canvas.renderAll();
          const newElements = elements.map((el) => {
            if (el.id === clickedObject.id) {
              return { ...el, text: newText };
            }
            return el;
          });
          setElements(newElements);
        }
      }
    });

    // Ensure elements stay within canvas boundaries
    canvas.on("object:moving", (e) => {
      const obj = e.target;
      if (obj.left < 0) {
        obj.left = 0;
      }
      if (obj.top < 0) {
        obj.top = 0;
      }
      if (obj.left + obj.width * obj.scaleX > 600) {
        obj.left = 600 - obj.width * obj.scaleX;
      }
      if (obj.top + obj.height * obj.scaleY > 600) {
        obj.top = 600 - obj.height * obj.scaleY;
      }
    });

    return () => {
      canvas.dispose();
    };
  }, [elements, setElements, setSelectedId, canvasRef]);

  return <canvas ref={canvasElementRef} />;
};

export default FabricCanvas;
