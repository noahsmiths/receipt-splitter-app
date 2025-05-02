import handleImage from "@/actions/handleImage";
import ImageSelectorWithPreview from "@/components/ImageSelectorWithPreview";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen max-h-screen h-screen">
      <ImageSelectorWithPreview onSubmit={handleImage}/>
    </div>
  );
}
