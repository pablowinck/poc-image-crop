"use client";
import axios from "axios";
import { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCropper = () => {
  const [crop, setCrop] = useState(null);
  const [src, setSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = async () => {
    if (!crop || !src) return;

    const image = new Image();
    image.src = src;
    await image.decode();

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Canvas is empty");
        return;
      }
      const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
      setCroppedImage(file);
    }, "image/jpeg");
  };

  const uploadImage = async () => {
    if (!croppedImage) {
      console.error("No cropped image available");
      return;
    }

    const formData = new FormData();
    formData.append("file", croppedImage);

    try {
      const response = await axios.post("/api/upload-photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload successful", response.data);
    } catch (error) {
      console.error("Upload error", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Image Cropper</h2>
      <input
        type="file"
        accept="image/*"
        onChange={onSelectFile}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
      />
      {src && (
        <div className="relative w-full max-w-lg mb-4">
          <ReactCrop
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={onCropComplete}
            className="max-w-full"
          >
            <img src={src} className="w-full h-auto" />
          </ReactCrop>
        </div>
      )}
      <button
        onClick={uploadImage}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Upload Image
      </button>
    </div>
  );
};

export default ImageCropper;
