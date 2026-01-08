import {CreateUser, PatchUser, User} from "./user.schema";

export interface UserRepo {
    create(data: CreateUser): Promise<User>
    patch(id: string, data: PatchUser): Promise<void>
}
