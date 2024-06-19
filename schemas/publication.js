import { z } from 'zod';

const publicationSchema = z.object({
    uuid_usuario: z.string().uuid(),
    contenido: z.string()
});

export function validatePublication(object){
    return publicationSchema.safeParse(object);
}

export function validatePartialPublication(object){
    return publicationSchema.partial().safeParse(object);
}