"use client";

import { ChangeEvent, useState } from "react";

export default function ImageSelectorWithPreview({
  onSubmit
}: Readonly<{
  onSubmit(base64Image: string): Promise<string>
}>) {
  const [previewURL, setPreviewURL] = useState<string | null>(null);

  function updateImagePreview(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file === undefined || !file.type.startsWith("image/")) {
      setPreviewURL(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewURL(reader.result as string);
    }
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col justify-center items-center h-full gap-2">
      {
        // eslint-disable-next-line @next/next/no-img-element
        previewURL && <img src={previewURL} alt="Receipt Preview" className="max-h-[90%]"/>
      }
      <div className="flex flex-row w-full justify-center gap-2">
        {
          previewURL ? (
            <>
              <span className="btn btn-success cursor-pointer" onClick={async () => { const res = await onSubmit(previewURL); console.log(res); }}>Looks Good</span>
              <span className="btn btn-error cursor-pointer" onClick={() => { setPreviewURL(null); }}>Cancel</span>
            </>
          ) : (
            <label>
              <span className="btn btn-primary cursor-pointer">Select your receipt</span>
              <input type="file" accept="image/*" className="hidden" onChange={updateImagePreview}/>
            </label>
          )
        }
      </div>
    </div>
  );
}