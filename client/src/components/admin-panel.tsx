import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Upload, Save, BarChart3, List, Settings } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPromptSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = insertPromptSchema.extend({
  image: z.any().optional(),
  tagsString: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      prompt: "",
      category: "",
      tagsString: "",
    },
  });

  const createPromptMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("prompt", data.prompt);
      formData.append("category", data.category);
      formData.append("tags", data.tagsString || "");
      
      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      const response = await fetch("/api/prompts", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create prompt");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Prompt has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      reset();
      setImagePreview(null);
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create prompt. Please try again.",
        variant: "destructive",
      });
      console.error("Error creating prompt:", error);
    },
  });

  const onSubmit = (data: FormData) => {
    createPromptMutation.mutate(data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
      setValue("image", e.target.files);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" data-testid="admin-panel">
      <div className="modal-overlay fixed inset-0" onClick={onClose}></div>
      <div className="fixed inset-4 md:inset-8 bg-card rounded-xl shadow-2xl border border-border overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-muted/30 border-r border-border p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-foreground">Admin Panel</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                data-testid="button-close-admin"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="space-y-2">
              <Button
                variant={activeTab === "upload" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("upload")}
                data-testid="button-tab-upload"
              >
                <Upload className="w-4 h-4 mr-3" />
                Upload Image
              </Button>
              <Button
                variant={activeTab === "manage" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("manage")}
                data-testid="button-tab-manage"
              >
                <List className="w-4 h-4 mr-3" />
                Manage Prompts
              </Button>
              <Button
                variant={activeTab === "analytics" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("analytics")}
                data-testid="button-tab-analytics"
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                Analytics
              </Button>
              <Button
                variant={activeTab === "settings" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("settings")}
                data-testid="button-tab-settings"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 overflow-y-auto">
            {activeTab === "upload" && (
              <div className="max-w-3xl">
                <h3 className="text-2xl font-bold text-foreground mb-6">Upload New Image</h3>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <Label className="block text-sm font-medium text-foreground mb-2">Image</Label>
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img src={imagePreview} alt="Preview" className="max-w-xs mx-auto rounded-lg" />
                          <p className="text-sm text-muted-foreground">Click to change image</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-muted-foreground mb-4 mx-auto" />
                          <p className="text-foreground font-medium mb-2">Click to upload or drag and drop</p>
                          <p className="text-muted-foreground text-sm">PNG, JPG, WebP up to 10MB</p>
                        </>
                      )}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        {...register("image")}
                        onChange={handleImageChange}
                        data-testid="input-image"
                      />
                    </div>
                  </div>

                  {/* Title Input */}
                  <div>
                    <Label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a descriptive title..."
                      {...register("title")}
                      data-testid="input-title"
                    />
                    {errors.title && (
                      <p className="text-destructive text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Prompt Input */}
                  <div>
                    <Label htmlFor="prompt" className="block text-sm font-medium text-foreground mb-2">AI Prompt</Label>
                    <Textarea 
                      id="prompt"
                      rows={4} 
                      placeholder="Enter the prompt used to generate this image..." 
                      className="font-mono text-sm"
                      {...register("prompt")}
                      data-testid="textarea-prompt"
                    />
                    {errors.prompt && (
                      <p className="text-destructive text-sm mt-1">{errors.prompt.message}</p>
                    )}
                  </div>

                  {/* Category Selection */}
                  <div>
                    <Label className="block text-sm font-medium text-foreground mb-2">Category</Label>
                    <Select onValueChange={(value) => setValue("category", value)} data-testid="select-category">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Portrait">Portraits</SelectItem>
                        <SelectItem value="Nature">Landscapes</SelectItem>
                        <SelectItem value="Abstract">Abstract</SelectItem>
                        <SelectItem value="Digital Art">Digital Art</SelectItem>
                        <SelectItem value="Macro">Photography</SelectItem>
                        <SelectItem value="Architecture">Illustrations</SelectItem>
                        <SelectItem value="Vintage">Vintage</SelectItem>
                        <SelectItem value="Surreal">Surreal</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-destructive text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  {/* Tags Input */}
                  <div>
                    <Label htmlFor="tags" className="block text-sm font-medium text-foreground mb-2">Tags</Label>
                    <Input 
                      id="tags"
                      placeholder="cyberpunk, neon, futuristic (comma separated)" 
                      {...register("tagsString")}
                      data-testid="input-tags"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <Button 
                      type="submit" 
                      disabled={createPromptMutation.isPending}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      data-testid="button-save-publish"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {createPromptMutation.isPending ? "Saving..." : "Save & Publish"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="secondary"
                      data-testid="button-save-draft"
                    >
                      Save as Draft
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={onClose}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "manage" && (
              <div className="max-w-5xl">
                <h3 className="text-2xl font-bold text-foreground mb-6">Manage Prompts</h3>
                <div className="bg-muted/50 border border-border rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">Prompt management functionality coming soon...</p>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="max-w-5xl">
                <h3 className="text-2xl font-bold text-foreground mb-6">Analytics</h3>
                <div className="bg-muted/50 border border-border rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="max-w-3xl">
                <h3 className="text-2xl font-bold text-foreground mb-6">Settings</h3>
                <div className="bg-muted/50 border border-border rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">Settings panel coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
