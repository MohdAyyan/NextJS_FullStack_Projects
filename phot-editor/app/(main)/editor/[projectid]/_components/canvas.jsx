"use client";
import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { api } from "../../../../../convex/_generated/api";
import { useConvexMutation } from "../../../../../hooks/use-convex-mutation";
import { useCanvas } from "../../../../../context/context";

function CanvasEditor({ project }) {
  const canvasRef = useRef();
  const containerRef = useRef();

  const { canvasEditor, setCanvasEditor, activeTool, onToolChange } = useCanvas();
  const [isLoading, setIsLoading] = useState(true);

  const { mutate: updateProject } = useConvexMutation(api.projects.updateProject);

  const calculateViewportScale = () => {
    if (!containerRef.current || !project) return 1;
    const container = containerRef.current;
    const containerWidth = container.clientWidth - 40;
    const containerHeight = container.clientHeight - 40;
    const scaleX = containerWidth / project.width;
    const scaleY = containerHeight / project.height;
    return Math.min(scaleX, scaleY, 1);
  };

  useEffect(() => {
    if (!canvasRef.current || !project || canvasEditor) return;

    const initializeCanvas = () => {
      setIsLoading(true);

      const viewportScale = calculateViewportScale();
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: project.width,
        height: project.height,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
        controlsAboveOverlay: true,
        selection: true,
        hoverCursor: "move",
        moveCursor: "move",
        defaultCursor: "default",
      });

      // Set scaled dimensions
      canvas.setDimensions(
        {
          width: project.width * viewportScale,
          height: project.height * viewportScale,
        },
        { backstoreOnly: false }
      );

      canvas.setZoom(viewportScale);

      // Load image if available
      if (project.currentImageUrl || project.originalImageUrl) {
        const imageUrl = project.currentImageUrl || project.originalImageUrl;

        fabric.Image.fromURL(
          imageUrl,
          (fabricImage) => {
            if (!fabricImage) return;

            const imgAspectRatio = fabricImage.width / fabricImage.height;
            const canvasAspectRatio = project.width / project.height;
            let scaleX, scaleY;

            if (imgAspectRatio > canvasAspectRatio) {
              scaleX = project.width / fabricImage.width;
              scaleY = scaleX;
            } else {
              scaleY = project.height / fabricImage.height;
              scaleX = scaleY;
            }

            fabricImage.set({
              left: project.width / 2,
              top: project.height / 2,
              originX: "center",
              originY: "center",
              scaleX,
              scaleY,
              selectable: true,
              evented: true,
            });

            canvas.add(fabricImage);
            canvas.centerObject(fabricImage);
            canvas.renderAll();
          },
          { crossOrigin: "anonymous" }
        );
      }

      // Load saved canvas state if available
      if (project.canvasState) {
        canvas.loadFromJSON(project.canvasState, () => {
          canvas.renderAll();
        });
      }

      setCanvasEditor(canvas);

      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 500);

      setIsLoading(false);
    };

    initializeCanvas();

    return () => {
      if (canvasEditor) {
        canvasEditor.dispose();
        setCanvasEditor(null);
      }
    };
  }, [project]);

  // Save canvas state
  const saveCanvasState = async () => {
    if (!canvasEditor || !project) return;
    try {
      const canvasJSON = canvasEditor.toJSON();
      await updateProject({
        projectId: project._id,
        canvasState: canvasJSON,
      });
    } catch (error) {
      console.error("Error saving canvas state:", error);
    }
  };

  // Auto save on changes
  useEffect(() => {
    if (!canvasEditor) return;
    let saveTimeout;

    const handleCanvasChange = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        saveCanvasState();
      }, 2000);
    };

    canvasEditor.on("object:modified", handleCanvasChange);
    canvasEditor.on("object:added", handleCanvasChange);
    canvasEditor.on("object:removed", handleCanvasChange);

    return () => {
      clearTimeout(saveTimeout);
      canvasEditor.off("object:modified", handleCanvasChange);
      canvasEditor.off("object:added", handleCanvasChange);
      canvasEditor.off("object:removed", handleCanvasChange);
    };
  }, [canvasEditor]);

  // Handle tool changes (cursor)
  useEffect(() => {
    if (!canvasEditor) return;

    switch (activeTool) {
      case "crop":
        canvasEditor.defaultCursor = "crosshair";
        canvasEditor.hoverCursor = "crosshair";
        break;
      default:
        canvasEditor.defaultCursor = "default";
        canvasEditor.hoverCursor = "move";
    }
  }, [canvasEditor, activeTool]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasEditor || !project) return;

      const newScale = calculateViewportScale();
      canvasEditor.setDimensions(
        {
          width: project.width * newScale,
          height: project.height * newScale,
        },
        { backstoreOnly: false }
      );
      canvasEditor.setZoom(newScale);
      canvasEditor.calcOffset();
      canvasEditor.renderAll();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasEditor, project]);

  // Switch tool when selecting text
  useEffect(() => {
    if (!canvasEditor || !onToolChange) return;

    const handleSelection = (e) => {
      const selectedObject = e.selected?.[0];
      if (selectedObject && selectedObject.type === "i-text") {
        onToolChange("text");
      }
    };

    canvasEditor.on("selection:created", handleSelection);
    canvasEditor.on("selection:updated", handleSelection);

    return () => {
      canvasEditor.off("selection:created", handleSelection);
      canvasEditor.off("selection:updated", handleSelection);
    };
  }, [canvasEditor, onToolChange]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center bg-secondary w-full h-full overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #64748b 25%, transparent 25%),
            linear-gradient(-45deg, #64748b 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #64748b 75%),
            linear-gradient(-45deg, transparent 75%, #64748b 75%)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <p className="text-white/70 text-sm">Loading canvas...</p>
          </div>
        </div>
      )}

      <div className="px-5">
        <canvas id="canvas" className="border" ref={canvasRef} />
      </div>
    </div>
  );
}

export default CanvasEditor;
