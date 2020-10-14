import express from 'express';

import './database/connection';

//cria aplicacao app
const app = express();

app.use(express.json());


app.post('/users/:id', (request, response) => {
    console.log(request.query);
    console.log(request.params);
    console.log(request.body);
    return response.json({ message: 'hello world'});
});





//ouvindo a porta 3333
app.listen(3333);