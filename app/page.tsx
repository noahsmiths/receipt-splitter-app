"use client";

import parseReceiptFromImage, { Receipt } from "@/actions/parseReceiptFromImage";
import ImageSelectorWithPreview from "@/components/ImageSelectorWithPreview";
import ReceiptDataEditor from "@/components/ReceiptDataEditor";
import { useState } from "react";

export default function Home() {
  const [receiptData, setReceiptData] = useState<Receipt | null>();
  const [showParsingError, setShowParsingError] = useState(false);

  async function handleImage(encodedImage: string) {
    const receipt = await parseReceiptFromImage(encodedImage);

    if (receipt.result) {
      setReceiptData(receipt);
    } else {
      setShowParsingError(true);
    }
  }

  async function handleReceiptData(receipt: NonNullable<Receipt["result"]>) {

  }

  return (
    <div className="flex flex-col w-full min-h-screen max-h-screen h-screen">
      {
        receiptData?.result ? (
          <ReceiptDataEditor onSubmit={handleReceiptData} receipt={receiptData.result} />
        ) : (
          <ImageSelectorWithPreview onSubmit={handleImage} />
        )
      }
      <div className={`toast toast-center w-full cursor-pointer ${!showParsingError && "hidden"}`} onClick={() => { setShowParsingError(false); }}>
        <div className="alert alert-error">
          <span>Error parsing receipt</span>
        </div>
      </div>
    </div>
  );
}
