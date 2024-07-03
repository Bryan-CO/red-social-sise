import { z } from 'zod';

const chatSchema = z.object({
    nombre: z.string()
});

export function validateChat(object){
    return chatSchema.safeParse(object);
}

export function validatePartialChat(object){
    return chatSchema.partial().safeParse(object);
}