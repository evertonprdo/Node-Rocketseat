// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password_hash: string
      created_at: string
      updated_at: string
    }
    meals: {
      id: string
      name: string
      description: string
      date_time: string
      within_diet: string
      user_id: string
      created_at: string
      updated_at: string
    }
  }
}
