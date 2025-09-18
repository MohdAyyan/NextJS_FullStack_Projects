"use client";
import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { DialogFooter } from "../../../../components/ui/dialog";
import { toast } from "sonner";
import { usePlanAccess } from "../../../../hooks/use-plan-access";
import { Badge } from "../../../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import React from "react";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { Crown, Loader2 } from "lucide-react";
import { useConvexMutation, useConvexQuery }  from "../../../../hooks/use-convex-query"
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { UpgradeModal } from "../../../../components/upgrade-modal";

function NewProjectModal({ isOpen, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const router = useRouter();
 const { data: projects } = useConvexQuery(api.projects.getUserProjects);
  const { canCreateProject: canCreate, isFree } = usePlanAccess();
  const { mutate: createProject } = useConvexMutation(api.projects.create);
  const currentProjectCount = projects?.length || 0;
  const handleCreateProject = async () => {
    // Check project limits first
    if (!canCreate) {
      setShowUpgradeModal(true);
      return;
    }

    if (!selectedFile || !projectTitle.trim()) {
      toast.error("Please select an image and enter a project title");
      return;
    }

    setIsUploading(true);

    try {
      // Upload to ImageKit via our API route
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("fileName", selectedFile.name);

      const uploadResponse = await fetch("/api/imagekit/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        throw new Error(uploadData.error || "Failed to upload image");
      }

      // Create project in Convex
      const projectId = await createProject({
        title: projectTitle.trim(),
        originalImageUrl: uploadData.url,
        currentImageUrl: uploadData.url,
        thumbnailUrl: uploadData.thumbnailUrl,
        width: uploadData.width || 800,
        height: uploadData.height || 600,
        canvasState: null,
      });

      toast.success("Project created successfully!");

      // Navigate to editor
      router.push(`/editor/${projectId}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(
        error.message || "Failed to create project. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setProjectTitle("");
    setIsUploading(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl bg-slate-800 border-white/10">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DialogTitle className="text-2xl font-bold text-white">
                  Create New Project
                </DialogTitle>
                {isFree && (
                  <Badge
                    variant="secondary"
                    className="bg-slate-700 text-white/70"
                  >
                    {currentProjectCount}/3 projects
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Project Limit Warning for Free Users */}
            {isFree && currentProjectCount >= 2 && (
              <Alert className="bg-amber-500/10 border-amber-500/20">
                <Crown className="h-5 w-5 text-amber-400" />
                <AlertDescription className="text-amber-300/80">
                  <div className="font-semibold text-amber-400 mb-1">
                    {currentProjectCount === 2
                      ? "Last Free Project"
                      : "Project Limit Reached"}
                  </div>
                  {currentProjectCount === 2
                    ? "This will be your last free project. Upgrade to Pixxel Pro for unlimited projects."
                    : "Free plan is limited to 3 projects. Upgrade to Pixxel Pro to create more projects."}
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter className="gap-3">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isUploading}
              className="text-white/70 hover:text-white"
            >
              Cancel
            </Button>

            <Button
              onClick={handleCreateProject}
              disabled={!selectedFile || !projectTitle.trim() || isUploading}
              variant="primary"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        restrictedTool="projects"
        reason="Free plan is limited to 3 projects. Upgrade to Pro for unlimited projects and access to all AI editing tools."
      />
    </>
  );
}

export default NewProjectModal;
