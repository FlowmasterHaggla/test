// src/users/user.repo.pg.ts
import type { Pool } from 'pg'
import type { UserRepo, CreateUser, PatchUser, User } from './user.repo'

export class PgUserRepo implements UserRepo {
    constructor(private pool: Pool) {}

    async create(data: CreateUser): Promise<User> {
        const res = await this.pool.query(
            `insert into users (name, email, age)
       values ($1, $2, $3)
       returning id, name, email, age`,
            [data.name, data.email ?? null, data.age ?? null]
        )
        return res.rows[0]
    }

    async patch(id: string, data: PatchUser): Promise<void> {
        // minimal demo: nur name patchen (später dynamisch erweitern)
        if (data.name == null) return
        await this.pool.query(`update users set name=$1 where id=$2`, [data.name, id])
    }

    async findById(id: string): Promise<User | null> {
        const res = await this.pool.query(
            `select id, name, email, age from users where id=$1`,
            [id]
        )
        return res.rows[0] ?? null
    }
}
