import { z } from 'zod';

const userSchema = z.object({
    username: z.string({
        invalid_type_error: 'El username debe ser un string!',
        required_error: 'El username es requerido'
    }), 
    role: z.number(),
    nombre: z.string(),
    apellidopaterno: z.string(),
    apellidomaterno: z.string(),
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