import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        last_verified: z.coerce.date().optional(),
        typ: z.string().optional(),
        id: z.string().optional(),
        status: z.enum(['draft', 'hotovo']).optional(),
      }),
    }),
  }),
};
