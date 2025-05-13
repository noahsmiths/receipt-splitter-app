"use client";

import { ChangeEvent, useState } from "react";

export default function ImageSelectorWithPreview({
  onSubmit
}: Readonly<{
  onSubmit(base64Image: string): Promise<any>
}>) {
  const [previewURI, setPreviewURI] = useState<string | null>(null);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  function updateImagePreview(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file === undefined || !file.type.startsWith("image/")) {
      setPreviewURI(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewURI(reader.result as string);
    }
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    setButtonsDisabled(true);
    await onSubmit(previewURI!);
    setButtonsDisabled(false);
  }

  return (
    <div className="flex flex-col justify-center items-center h-full gap-2">
      {
        // eslint-disable-next-line @next/next/no-img-element
        previewURI && <img src={previewURI} alt="Receipt Preview" className="max-h-[90%]"/>
      }
      <div className="flex flex-row w-full justify-center gap-2">
        {
          previewURI ? (
            <>
              <button className="btn btn-success cursor-pointer" disabled={buttonsDisabled} onClick={handleSubmit}>Looks Good</button>
              <button className="btn btn-error cursor-pointer" disabled={buttonsDisabled} onClick={() => { setPreviewURI(null); }}>Cancel</button>
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