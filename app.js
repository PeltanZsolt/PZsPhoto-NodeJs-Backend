const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes/routes');
require('dotenv').config()

app.use(cors());
app.use(express.json());
app.use(routes);

const HOST = process.env.HOST
const PORT = process.env.PORT;
app.listen(PORT, HOST, () => {
   console.log(
      `PZsPhoto backend started at http://${HOST}:${PORT}. Waiting for requests...`
   );
});
