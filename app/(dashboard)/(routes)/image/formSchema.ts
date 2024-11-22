import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Image Prompt is required",
  }),
  num_images: z.string().min(1),
  image_size: z.string().min(1),
});

export const amountOptions = [
  {
    value: "1",
    label: "1 Image",
  },
  {
    value: "2",
    label: "2 Images",
  },
  {
    value: "3",
    label: "3 Images",
  },
  {
    value: "4",
    label: "4 Images",
  },
];

export const resolutionOptions = [
  {
    value: "square",
    label: "512x512",
  },
  {
    value: "portrait_4_3",
    label: "768x1024",
  },
  {
    value: "portrait_16_9",
    label: "576x1024",
  },
  {
    value: "landscape_4_3",
    label: "1024x768",
  },
  {
    value: "landscape_16_9",
    label: "1024x576",
  },
  {
    value: "square_hd",
    label: "1024x1024",
  },
];