import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod"

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(["development", "test", "production"]),
        STRIPE_SECRET_KEY: z.string(),
    },
    client: {
        NEXT_PUBLIC_SERVER_URL: z.string().url()
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL
    },
    emptyStringAsUndefined: true,
})
