export type User = { id: string; name: string; email?: string; age?: number }
export type CreateUser = { name: string; email?: string; age?: number }
export type PatchUser = Partial<CreateUser>

export interface UserRepo {
    create(data: CreateUser): Promise<User>
    patch(id: string, data: PatchUser): Promise<void>
    findById(id: string): Promise<User | null>
}
