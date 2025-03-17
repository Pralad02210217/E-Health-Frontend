'use client';
import { useEffect, useRef, useState } from "react";
import { createFeedFn } from "@/lib/api";
import { uploadImage, uploadVideo } from "@/lib/cloudinary";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { z } from "zod"; // Import Zod
import { useForm } from "react-hook-form";

const feedSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

const CreateFeedPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const { mutate: createFeed, isPending: isCreatingFeed } = useMutation({
    mutationFn: createFeedFn,
    onSuccess: () => {
      setIsUploading(false);
      setIsDialogOpen(false);
      setImages([]);
      setVideos([]);
      queryClient.invalidateQueries({ queryKey: ['feeds'] });
      toast({ title: "Success", description: "Feed created successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.data.message, variant: "destructive" });
    },
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: async (data) => {
      try {
        feedSchema.parse(data); // Validate the data
        return { values: data, errors: {} };
      } catch (e: any) {
        return { values: {}, errors: e.errors.reduce((acc: any, error: any) => {
          acc[error.path[0]] = { message: error.message };
          return acc;
        }, {}) };
      }
    },
  });

  const handleCreateFeed = async (data: any) => {
    setIsUploading(true);
    try {
      // Upload images and videos
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const uploadedImage = await uploadImage(image);
          return uploadedImage.secure_url;
        })
      );

      const videoUrls = await Promise.all(
        videos.map(async (video) => {
          const uploadedVideo = await uploadVideo(video);
          return uploadedVideo.secure_url;
        })
      );

      createFeed({
        title: data.title,
        description: data.description,
        image_urls: imageUrls || [],
        video_url: videoUrls || [],
      });

      setIsDialogOpen(false);
      setImages([]);
      setVideos([]);
       reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the feed.",
        variant: "destructive",
      });
      console.error("Error creating feed:", error);
    }
  };

  const MAX_FILE_SIZE = 100 * 1024 * 1024; 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const files = Array.from(e.target.files || []);

    if (type === "image") {
      setImages(files);
    } else {
      // Check the size of each video file
      const videosWithValidSize = files.filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast({
            title: "File too large",
            description: "Each video must be smaller than 100MB.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      });
      setVideos(videosWithValidSize);
    }
  };

    const handleRemoveFile = (index: number, type: "image" | "video") => {
    if (type === "image") {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);

        // Reset the file input field
        if (imageInputRef.current) {
        imageInputRef.current.value = "";
        }
    } else {
        const updatedVideos = videos.filter((_, i) => i !== index);
        setVideos(updatedVideos);

        // Reset the file input field
        if (videoInputRef.current) {
        videoInputRef.current.value = "";
        }
    }
    };



  return (
    <div className="flex justify-center items-center">
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
        setImages([]);
        setVideos([]);
        reset()
        }
    }}>
        <DialogTrigger asChild>
          <Button className="mb-4 bg-blue-500 text-white">Create Feed</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create Feed</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 p-4">
            <form onSubmit={handleSubmit(handleCreateFeed)}>
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Title"
                  {...register("title")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message?.toString()}</p>}
              </div>

              <div>
                <textarea
                  placeholder="Description"
                  {...register("description")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message?.toString()}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Images (Max: 5)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange(e, "image")}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p>{images.length > 0 ? `${images.length} file${images.length > 1 ? "s" : ""} selected` : "No Images selected"}</p>
                <div className="mt-2 flex space-x-2 relative">
                  {images.length > 0 && images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index, "image")}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Videos (Max: 2)</label>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => handleFileChange(e, "video")}
                  className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <div className="flex gap-5 mt-2">
                  {videos.length > 0 && videos.map((video, index) => (
                    <div key={index} className="relative">
                      <video controls className="w-32 h-32 object-cover rounded-lg">
                        <source src={URL.createObjectURL(video)} type="video/mp4" />
                      </video>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index, "video")}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <p>{videos.length > 0 ? `${videos.length} file${videos.length > 1 ? "s" : ""} selected` : "No Videos selected"}</p>
                </div>
              </div>

              <div className="p-4 space-x-4 flex justify-end">
                <Button
                  disabled={isCreatingFeed || isUploading}
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  {isCreatingFeed || isUploading && <Loader className="animate-spin" />}
                  {isCreatingFeed || isUploading ? "Creating..." : "Create"}
                </Button>
                <Button
                  onClick={() => {
                    setIsDialogOpen(false);
                    setImages([]);
                    setVideos([]);
                     reset()
                  }}
                  disabled={isCreatingFeed}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateFeedPage;
