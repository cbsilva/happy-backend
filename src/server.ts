import express from 'express';

import './database/connection';

import routes from './routes';

//cria aplicacao app
const app = express();

app.use(express.json());
app.use(routes);

//ouvindo a porta 3333
app.listen(3333);