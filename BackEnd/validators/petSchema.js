const { z } = require('zod');

const createPetSchema = {
  body: z.object({
    name: z.string().min(1, 'Pet name is required'),
    type: z.string().min(1, 'Pet type is required'),
    breed: z.string().optional(),
    age: z.coerce.number().min(0, 'Age must be a positive number'),
    weight: z.coerce.number().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
  }).passthrough() // allow other fields for now to easily support existing code
};

const updatePetSchema = {
  params: z.object({
    id: z.string().min(1, 'Pet ID is required')
  }),
  body: z.object({
    name: z.string().optional(),
    type: z.string().optional(),
    breed: z.string().optional(),
    age: z.coerce.number().min(0).optional(),
    weight: z.coerce.number().optional(),
    description: z.string().optional(),
    image: z.string().optional()
  }).passthrough()
};

module.exports = { createPetSchema, updatePetSchema };
