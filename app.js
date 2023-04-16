const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes/routes');
const dotenv = require('dotenv')

app.use(cors());
app.use(express.json());
app.use(routes);

const host = '192.168.1.101';
const PORT = process.env.PORT || 3000;
app.listen(PORT, host || 'localhost', () => {
   console.log(
      `PZsPhoto backend started at http://${host}:${PORT}. Waiting for requests...`
   );
});
