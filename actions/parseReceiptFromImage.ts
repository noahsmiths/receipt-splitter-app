"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const Receipt = z.object({
  result: z.object({
    items: z.array(z.object({
      count: z.number().default(1),
      name: z.string(),
      price: z.number(),
    })),
    // subtotal: z.number(),
    tax: z.number().nullish(),
    serviceCharge: z.number().nullish(),
    tip: z.number().nullish(),
  }).nullish()
});
export type Receipt = z.infer<typeof Receipt>;

export default async function parseReceiptFromImage(base64Image: string): Promise<Receipt> {
  console.log("Extracting data from image...");
  // return {"result":{"items":[{"count":2,"name":"A4. FRESH SPRING ROLL","price":6},{"count":2,"name":"A9. THAI BASIL WINGS","price":16},{"count":1,"name":"SWEET/UNST TEA","price":4},{"count":4,"name":"PH3. SPECIAL BEEF PHO","price":60},{"count":1,"name":"FR2. PORK FRIED RICE","price":26},{"count":1,"name":"FR3. SHRIMP FRIED RICE","price":13},{"count":1,"name":"PH8. SHRIMP & PORK NOODLE SOUP sidfhish fiusdfhsuif sidh fiusdfh isdh fiusdh ifhsdif hsidh fuisdfi h","price":14},{"count":2,"name":"A4. FRESH SPRING ROLL","price":6},{"count":2,"name":"A9. THAI BASIL WINGS","price":16},{"count":1,"name":"SWEET/UNST TEA","price":4},{"count":4,"name":"PH3. SPECIAL BEEF PHO","price":60},{"count":1,"name":"FR2. PORK FRIED RICE","price":26},{"count":1,"name":"FR3. SHRIMP FRIED RICE","price":13},{"count":1,"name":"PH8. SHRIMP & PORK NOODLE SOUP sidfhish fiusdfhsuif sidh fiusdfh isdh fiusdh ifhsdif hsidh fuisdfi h","price":14}],"tax":9.38,"serviceCharge":25.02,"tip":null}};

  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: Receipt,
    topP: 0.1,
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: "Your job is to itemize receipts. You will get a picture of a receipt, from which you should extract the items, tax, service charge, and tip. If any of these fields don't exist, omit them. Do not try and calculate anything on your own, only copy and paste the exact numbers from the receipt. If the picture is not of a receipt, just return null for the result field.",
      },
      {
        role: "user",
        content: [
          {
            type: "image",
            image: base64Image
          }
        ]
      }
    ]
  });

  return object;
}