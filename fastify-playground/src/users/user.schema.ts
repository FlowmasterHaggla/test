import {object, z} from 'zod'

export const CreateUserSchema = z.object({
    name: z.string().min(1),
    email: z.string().email().optional(),
    age: z.number().int().min(0).optional()
})

export type CreateUser = z.infer<typeof CreateUserSchema>

export const PatchUserSchema = CreateUserSchema.partial().refine(
    data => Object.keys(data).length > 0,
    {message: 'At least one field required'}
)

export type PatchUser = z.infer<typeof PatchUserSchema>

export const UserSchema = CreateUserSchema.extend({
        id: z.string().min(1).max(36)
    }
)

export type User = z.infer<typeof UserSchema>

