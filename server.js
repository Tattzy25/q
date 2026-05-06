const express = require('express');
const app = express();

app.use(express.json());

const clients = new Set();

app.get('/', (req, res) => res.sendFile(__dirname + '/src/index.html'));

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  clients.add(res);
  req.on('close', () => clients.delete(res));
});

app.post('/training', (req, res) => {
  const model = req.body.model;
  for (const client of clients) {
    client.write(`data: ${JSON.stringify({ message: 'Model ' + model + ' is currently Training', dot: 'orange' })}\n\n`);
  }
  res.sendStatus(200);
});

app.post('/complete', (req, res) => {
  const model = req.body.model;
  const url = req.body.url;
  for (const client of clients) {
    client.write(`data: ${JSON.stringify({ message: 'Congratulations, ' + model + ' is Well Fed and Battle Ready.', dot: 'green', url: url })}\n\n`);
  }
  res.sendStatus(200);
});

app.listen(8080, () => console.log('Running on https://q-production-87b2.up.railway.app'));
