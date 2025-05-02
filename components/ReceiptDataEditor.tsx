"use client";

import { Receipt } from "@/actions/parseReceiptFromImage";

export default function ReceiptDataEditor({
  receipt
}: Readonly<{
  receipt: NonNullable<Receipt["result"]>
}>) {
  console.log(receipt.items);

  return (
    <div className="flex flex-col h-full w-full">
      {
        receipt.items.map((item, index) => {
          return <p key={index}>{item.name}</p>;
        })
      }
    </div>
  );
}