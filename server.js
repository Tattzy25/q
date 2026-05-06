const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

const clients = new Set();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'banner2.html'));
});

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.add(res);
  req.on('close', () => clients.delete(res));
});

app.post('/update', (req, res) => {
  const data = req.body;
  for (const client of clients) {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }
  res.sendStatus(200);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Running on https://q-production-87b2.up.railway.app`));
