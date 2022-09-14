import express from 'express';

const app = express();

app.get('/ads', (req, res) => {
  return res.json([
    {id: 1, name: 'lalala'},
    {id: 2, name: 'lalala'},
    {id: 3, name: 'lalala'},
  ]);
});

app.listen(3333, () => {
  console.log('http server is running');
});