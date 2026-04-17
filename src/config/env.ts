import { z } from "zod";

const createEnv = () => {
  const EnvSchema = z.object({
    API_URL: z.string(),
    ENABLE_API_MOCKING: z
      .string()
      .refine((s) => s === "true" || s === "false")
      .transform((s) => s === "true")
      .optional(),
    MOCK_DELAY: z
      .string()
      .transform((s) => Number.parseInt(s, 10))
      .optional(),
  });

  const envVars = Object.entries(import.meta.env).reduce<Record<string, string>>((acc, curr) => {
    const [key, value] = curr;
    if (key.startsWith("VITE_APP_")) {
      acc[key.replace("VITE_APP_", "")] = value;
    }
    return acc;
  }, {});

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.\nThe following variables are missing or invalid:\n${Object.entries(
        parsedEnv.error.flatten().fieldErrors
      )
        .map(([k, v]) => `- ${k}: ${v}`)
        .join("\n")}\n`
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
