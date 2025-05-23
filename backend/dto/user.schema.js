import z from 'zod'

export const updateProfileSchema = z.object({
    name: z.string().optional(),
    username: z.string().optional(),
    headline: z.string().optional(),
    about: z.string().optional(),
    location: z.string().optional(),
    profilePicture: z.string().optional(),
    bannerImg: z.string().optional(),
    skills: z.string().optional(),
    experience: z.string().optional(),
    education: z.string().optional()
})