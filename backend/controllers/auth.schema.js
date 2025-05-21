import z from 'zod'

export const userInputSchema = z.object({
    name: z.string().nonempty(),
    username: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(6, 'Password must be more than 6 characters')
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, 'Password must be more than 6 characters')
})