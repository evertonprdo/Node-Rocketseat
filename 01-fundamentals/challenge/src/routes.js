import { randomUUID } from 'node:crypto'

import { Database } from "./database.js"
import { buildRoutePath } from './utils/build-route-path.js'

export const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search
        ? { title: search, description: search }
        : null
      )

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!(title && description)) {
        return res.writeHead(400).end('Preencha todos os campos requeridos')
      }

      const tasks = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date,
        updated_at: new Date
      }

      database.insert('tasks', tasks)

      return res.writeHead(201).end()
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      if (!(title || description)) {
        return res.writeHead(400).end('Preencha pelo menos 1 dos campos a serem atualizados')
      }

      const response = database.update('tasks', id, {
        title,
        description
      })

      if (response === null) {
        return res.writeHead(404).end(`id: ${id} não foi encontrado`)
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const response = database.patch('tasks', id)

      if (response === null) {
        return res.writeHead(404).end(`id: ${id} não foi encontrado`)
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
]