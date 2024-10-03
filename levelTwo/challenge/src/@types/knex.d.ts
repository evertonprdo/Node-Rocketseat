// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      session_id?: string
      name: string
      email: string
      password_hash: string
      created_at: Date
      updated_at: Date
    }
    meals: {
      id: string
      name: string
      description: string
      date_time: Date
      within_diet: boolean
      user_id: string
      created_at: Date
      updated_at: Date
    }
  }
}
