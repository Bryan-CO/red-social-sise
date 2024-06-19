import z from 'zod';

const reactionSchema = z.object({
    user_uuid: z.string().uuid(),
    reaction_id: z.number().positive().max(5)
});

export function validateReaction(object){
    return reactionSchema.safeParse(object);
}

export function validatePartialReaction(object){
    return reactionSchema.partial().safeParse(object);
}