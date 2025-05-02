"use server";

import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export default async function handleImage(base64Image: string): Promise<string> {
  console.log(base64Image);
  const { object } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
      items: z.array(z.object({
        count: z.number().default(1),
        name: z.string(),
        price: z.number(),
      })),
      subtotal: z.number(),
      tax: z.number().optional(),
      serviceCharge: z.number().optional(),
      tip: z.number().optional(),
    }),
    messages: [
      {
        role: "system",
        content: "Your job is to itemize receipts. You will get a picture of a receipt, from which you should extract the items, subtotal, tax, service charge (if displayed), and tip. If any of these fields don't exist, omit them. Do not try and calculate anything on your own, only copy and paste the exact numbers from the receipt.",
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

  console.log(JSON.stringify(object, null, 2));

  return "response";
}