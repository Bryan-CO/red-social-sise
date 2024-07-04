import { z } from 'zod';

const messageSchema = z.object({
    uuid_usuario: z.string().uuid(),
    contenido: z.string()
});

export function validateMessage(object){
    return messageSchema.safeParse(object);
}

export function validatePartialMessage(object){
    return messageSchema.partial().safeParse(object);
}