"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  RotateCcw,
  RotateCw,
  Crop,
  Expand,
  Sliders,
  Palette,
  Maximize2,
  ChevronDown,
  Text,
  RefreshCcw,
  Loader2,
  Eye,
  Save,
  Download,
  FileImage,
  Lock,
} from "lucide-react";

import { useCanvas } from "../../../../../context/context";
import { useConvexMutation, useConvexQuery } from "../../../../../hooks/use-convex-mutation";
import { api } from "../../../../../convex/_generated/api";
import { UpgradeModal } from "../../../../../components/upgrade-modal";
import { usePlanAccess } from "../../../../../hooks/usePlanAccess";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../../../../components/ui/dropdown-menu";

import { Button } from "../../../../../components/ui/button";

// Fabric.js for reset/undo
import { fabric } from "fabric";
const FabricImage = fabric.Image;

const TOOLS = [
  { id: "resize", label: "Resize", icon: Expand, isActive: true },
  { id: "crop", label: "Crop", icon: Crop },
  { id: "adjust", label: "Adjust", icon: Sliders },
  { id: "text", label: "Text", icon: Text },
  { id: "background", label: "AI Background", icon: Palette, proOnly: true },
  { id: "ai_extender", label: "AI Image Extender", icon: Maximize2, proOnly: true },
  { id: "ai_edit", label: "AI Editing", icon: Eye, proOnly: true },
];

const EXPORT_FORMATS = [
  { format: "PNG", quality: 1.0, label: "PNG (High Quality)", extension: "png" },
  { format: "JPEG", quality: 0.9, label: "JPEG (90% Quality)", extension: "jpg" },
  { format: "JPEG", quality: 0.8, label: "JPEG (80% Quality)", extension: "jpg" },
  { format: "WEBP", quality: 0.9, label: "WebP (90% Quality)", extension: "webp" },
];

function EditorTopBar({ project }) {
  const router = useRouter();
  const { activeTool, onToolChange, canvasEditor } = useCanvas();

  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [restrictedTool, setRestrictedTool] = useState(null);

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isUndoRedoOperation, setIsUndoRedoOperation] = useState(false);

  const { mutate: updateProject, isLoading: isSaving } = useConvexMutation(api.projects.updateProject);
  const { data: user } = useConvexQuery(api.users.getCurrentUser);

  // ✅ Access plan permissions
  const { hasAccess, canExport, isFree } = usePlanAccess();

  /** -------- Reset Image to Original -------- */
  const handleResetToOriginal = async () => {
    if (!project?.originalImageUrl || !canvasEditor) return;
    try {
      const originalImage = await FabricImage.fromURL(project.originalImageUrl, {
        crossOrigin: "anonymous",
      });
      canvasEditor.clear();
      canvasEditor.add(originalImage);
      canvasEditor.renderAll();

      await updateProject({
        projectId: project._id,
        canvasState: canvasEditor.toJSON(),
        currentImageUrl: project.originalImageUrl,
      });

      toast.success("Reset to original image");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reset image");
    }
  };

  /** -------- Manual Save -------- */
  const handleManualSave = async () => {
    if (!canvasEditor || !project) return;
    try {
      await updateProject({
        projectId: project._id,
        canvasState: canvasEditor.toJSON(),
        currentImageUrl: project.currentImageUrl,
      });
      toast.success("Project saved!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save project");
    }
  };

  /** -------- Export Image -------- */
  const handleExport = async (format) => {
    if (!canvasEditor || !project) return;

    if (!canExport) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      setIsExporting(true);
      const dataUrl = canvasEditor.toDataURL({
        format: format.format.toLowerCase(),
        quality: format.quality,
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${project.title || "export"}.${format.extension}`;
      link.click();

      toast.success(`Exported as ${format.label}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to export image");
    } finally {
      setIsExporting(false);
    }
  };

  const canUndo = undoStack.length > 1;
  const canRedo = redoStack.length > 0;

  return (
    <>
      <div className="border-b px-6 py-3 bg-slate-900 text-white">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Left: Back button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="text-white hover:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Projects
            </Button>
          </div>

          {/* Title */}
          <h1 className="font-extrabold capitalize">{project.title}</h1>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Reset */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToOriginal}
              disabled={isSaving || !project.originalImageUrl}
              className="gap-2"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
              {isSaving ? "Resetting..." : "Reset"}
            </Button>

            {/* Save */}
            <Button
              variant="primary"
              size="sm"
              onClick={handleManualSave}
              disabled={isSaving || !canvasEditor}
              className="gap-2"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? "Saving..." : "Save"}
            </Button>

            {/* Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="glass"
                  size="sm"
                  disabled={isExporting || !canvasEditor}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {EXPORT_FORMATS.map((format) => (
                  <DropdownMenuItem
                    key={format.label}
                    onClick={() => handleExport(format)}
                  >
                    <FileImage className="h-4 w-4 mr-2" />
                    {format.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                {!canExport && (
                  <DropdownMenuItem onClick={() => setShowUpgradeModal(true)}>
                    <Lock className="h-4 w-4 mr-2" />
                    Upgrade to Export
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        restrictedFeature={restrictedTool}
      />
    </>
  );
}

export default EditorTopBar;
