import { z } from 'zod';

const memberSchema = z.object({
    miembro: z.string().uuid()
});

export function validateMember(object){
    return memberSchema.safeParse(object);
}

export function validatePartialMember(object){
    return memberSchema.partial().safeParse(object);
}