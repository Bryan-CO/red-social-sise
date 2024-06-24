import { z } from 'zod';

const userSchema = z.object({
    alias: z.string({
        invalid_type_error: 'El alias debe ser un string!',
        required_error: 'El alias es requerido'
    }), // Puedo incluso ver la informacion del error
    nombre: z.string(),
    apellido: z.string(),
    email: z.string().email(),
    contraseña: z.string(),
    rutaAvatar: z.string().url({
        message: 'URL de ruta inválido'
    })
});

export function validateUser(object){
    return userSchema.safeParse(object);
}

export function validatePartialUser(object){
    return userSchema.partial().safeParse(object);
}