import { z } from "zod";

const phone = z.string().trim().min(7, "Enter a valid phone number").max(25);
const email = z.string().trim().email("Enter a valid email");

export const step1Schema = z
  .object({
    creator_type: z.enum(["bride", "groom", "other"]),
    creator_type_other: z.string().trim().optional(),
    first_name: z.string().trim().min(2).max(100),
    last_name: z.string().trim().min(2).max(100),
    email,
    phone,
  })
  .superRefine((value, ctx) => {
    if (value.creator_type === "other" && !value.creator_type_other?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["creator_type_other"],
        message: "Please specify who you are",
      });
    }
  });

export const personSchema = z.object({
  creator_type: z.enum(["bride", "groom"]),
  first_name: z.string().trim().min(2).max(100),
  last_name: z.string().trim().min(2).max(100),
  email,
  phone,
  fathers_name: z.string().trim().max(150).optional().or(z.literal("")),
  mothers_name: z.string().trim().max(150).optional().or(z.literal("")),
});

export const step2Schema = z.object({
  bride: personSchema.optional(),
  groom: personSchema.optional(),
});

export const step3Schema = z.object({
  description: z.string().trim().min(20, "Please write at least 20 characters").max(5000),
  video_url: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(value),
      "Enter a valid YouTube URL"
    ),
});

export const eventSchema = z.object({
  id: z.number().optional(),
  title: z.string().trim().min(2).max(150),
  dress_code: z.string().trim().max(150).optional().or(z.literal("")),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  is_music_or_dancing: z.boolean(),
});

export const daySchema = z.object({
  id: z.number().optional(),
  wedding_day_date: z.string().min(1, "Date is required"),
  wedding_day_time: z.string().optional().or(z.literal("")),
  venue_name: z.string().trim().max(200).optional().or(z.literal("")),
  address_line_1: z.string().trim().min(3).max(255),
  address_line_2: z.string().trim().max(255).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(120),
  state: z.string().trim().min(2).max(120),
  post_code: z.string().trim().max(30).optional().or(z.literal("")),
  landmark_near: z.string().trim().max(255).optional().or(z.literal("")),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  events: z.array(eventSchema).min(1, "Add at least one event"),
});

export const step4Schema = z.object({
  food_observance: z.string().trim().min(1, "Food preference is required"),
  languages: z.array(z.string().trim().min(1)).min(1, "Choose at least one language"),
  is_alcohol_offered: z.boolean(),
  days: z.array(daySchema).min(1, "Add at least one wedding day"),
});

export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;
export type Step3Values = z.infer<typeof step3Schema>;
export type Step4Values = z.infer<typeof step4Schema>;
