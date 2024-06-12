import ImageCropper from "@/components/ImageCropper";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Image Cropper and Uploader
      </h1>
      <ImageCropper />
    </div>
  );
}
