const express = require('express');
const app = express();

app.use(express.json());

const clients = new Set();

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  clients.add(res);
  req.on('close', () => clients.delete(res));
});

app.post('/update', (req, res) => {
  for (const client of clients) {
    client.write(`data: ${JSON.stringify(req.body)}\n\n`);
  }
  res.sendStatus(200);
});

app.listen(8080, () => console.log('Running on https://q-production-87b2.up.railway.app'));
