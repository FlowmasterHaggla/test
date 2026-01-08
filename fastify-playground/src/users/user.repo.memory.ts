// src/users/user.repo.memory.ts
import type { UserRepo} from '@users/user.repo'
import crypto from 'node:crypto'
import {CreateUser, PatchUser, User} from "@users/user.schema";

export class MemoryUserRepo implements UserRepo {
    private store = new Map<string, User>()

    async create(data: CreateUser): Promise<User> {
        const user: User = { id: crypto.randomUUID(), ...data }
        this.store.set(user.id, user)
        return user
    }

    async patch(id: string, data: PatchUser): Promise<void> {
        const existing = this.store.get(id)
        if (!existing) return
        this.store.set(id, { ...existing, ...data })
        return
    }

    async findById(id: string): Promise<User | null> {
        return this.store.get(id) ?? null
    }
}
