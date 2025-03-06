import { randomUUID } from "node:crypto";

import { database } from "../routes.js";

export function processCSV(stream, callback) {
  let remainingData = '';

  stream.on('data', (chunk) => {
    remainingData += chunk.toString();

    const lines = remainingData.split('\n');

    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i].trim();

      if (line) {
        const [title, description] = line.split(',');

        if (title && description) {
          database.insert('tasks', {
            id: randomUUID(),
            title,
            description,
            completed_at: null,
            created_at: new Date,
            updated_at: new Date
          })

          console.log(`Task: ${title}, Description: ${description} added`);
        }
      }
    }

    remainingData = lines[lines.length - 1];
  });

  stream.on('end', () => {
    const [title, description] = remainingData.trim().split(',');

    if (title && description) {
      database.insert('tasks', {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date,
        updated_at: new Date
      })

      console.log(`Task: ${title}, Description: ${description} added`);
    }

    callback();
  });
}