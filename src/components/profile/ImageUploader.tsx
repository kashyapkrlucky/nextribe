import { ChangeEvent, useRef, useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { getSupabaseClient } from "@/core/config/supabase";
import { CameraIcon } from "lucide-react";
import Image from "next/image";
interface ImageUploaderProps {
  icon?: React.ReactNode; 
    username: string;
    type: string;
    afterUpload: (avatar: string) => void;
}
export default function ImageUploader({ icon, username, type, afterUpload }: ImageUploaderProps) {
  const [userImage, setUserImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('dsl');
    
    const file = e.target.files?.[0];
    if (file) {
      setUserImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onUpload = async () => {
    if (userImage) {
      const fileExt = userImage.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `/${username}/${type}/${fileName}`;

      try {
        const supabase = getSupabaseClient();
        const { error: uploadError } = await supabase.storage
          .from("nextribe")
          .upload(filePath, userImage);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }

        console.log("✅ Upload successful");

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("nextribe").getPublicUrl(filePath);

        // setUserImageUrl(publicUrl);
        afterUpload(publicUrl);
        setImagePreview(null);
      } catch (error) {
        console.error("❌ Upload failed:", error);
        // You might want to show user-friendly error message here
      }
    }
  };

    const onRemove = () => {
    setUserImage(null);
    setImagePreview(null);
    // setUserImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      <button className="w-10 h-10 cursor-pointer flex items-center justify-center">
        {icon || <CameraIcon />}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="w-full h-full opacity-0 absolute z-50 top-0 left-0 cursor-pointer"
        />
      </button>
      {imagePreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-white p-4 rounded-md w-md flex flex-col items-center gap-4">
            <Image src={imagePreview} alt="Profile" width={400} height={400} />
            <div className="flex gap-2">
              <button
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                onClick={onUpload}
              >
                Upload
              </button>
              <button
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                onClick={onRemove}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
