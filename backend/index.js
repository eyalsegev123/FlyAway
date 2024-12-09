const express = require('express');
const app = express();
const port = 5001; // You can choose any port you want

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
