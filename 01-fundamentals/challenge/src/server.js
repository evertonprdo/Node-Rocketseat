import http from 'node:http'
import stream from 'node:stream'

import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'
import { processCSV } from './utils/process-csv.js'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  if (req.method === 'POST' && req.url === '/tasks/csv') {

    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
      res.statusCode = 400;
      res.end('Bad Request: Content-Type should be multipart/form-data');
      return;
    }

    let boundary = contentType.split('; ')[1].replace('boundary=', '');
    let rawData = '';

    req.on('data', (chunk) => {
      rawData += chunk;
    });

    req.on('end', () => {
      const parts = rawData.split(`--${boundary}`);

      parts.forEach(part => {
        if (part.includes('Content-Disposition: form-data;') && part.includes('filename')) {

          const csvData = part.split('\r\n\r\n')[1];

          const csvContent = csvData.split('\r\n--')[0];

          const csvStream = new stream.Readable();
          csvStream.push(csvContent);
          csvStream.push(null);

          processCSV(csvStream, () => {
            res.statusCode = 200;
            res.end('CSV file processed successfully');
          });
        }
      });
    });

    return
  }

  await json(req, res)

  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    req.params = { ...routeParams.groups }

    return route.handler(req, res)
  }

  return res.writeHead(404).end('Not Found')
})

server.listen(3333)