import { z } from "zod";

export const CONTACT_TOPIC_OPTIONS = [
  "General",
  "Grain",
  "Feed and Supply",
  "Marketing",
  "Agronomy",
  "Energy",
  "Careers",
  "Other",
] as const;

export const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  topic: z.enum(CONTACT_TOPIC_OPTIONS),
  message: z.string().min(1).max(10000),
});

export const investorInquirySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  organization: z.string().min(1).max(300),
  message: z.string().min(1).max(10000),
});

export const mailingListSchema = z.object({
  email: z.string().email(),
});

export const producerNotifySchema = z.object({
  email: z.string().email(),
  name: z.string().max(200).optional(),
});
