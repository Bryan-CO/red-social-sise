import { z } from 'zod';

const commentSchema = z.object({
    uuid_usuario: z.string().uuid(),
    contenido: z.string()
});

export function validateComment(object){
    return commentSchema.safeParse(object);
}

export function validatePartialComment(object){
    return commentSchema.partial().safeParse(object);
}