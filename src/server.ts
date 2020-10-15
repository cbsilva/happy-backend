import express from 'express';
import { getRepository } from 'typeorm';
import './database/connection';
import Orphanage from './model/Orphanage';

//cria aplicacao app
const app = express();

app.use(express.json());

// por se tratar de um metodo que vai gravar no banco 
// de dados é preciso usar o async na chamada
// e await no metodo save
app.post('/orphanages', async (request, response) => {
    //recupera o conteudo enviado no body
    const {
        name,
        latitude,
        longitude,
        about, 
        instructions,
        opening_hours,
        open_on_weekends,
    } = request.body;

    // recebe os tipo de dados definidos na classe
    const orphanagesRepository = getRepository(Orphanage);

    // cria os dados (em memoria)
    const orphanage = orphanagesRepository.create({
        name,
        latitude,
        longitude,
        about, 
        instructions,
        opening_hours,
        open_on_weekends,
    });

    // salva os dados no banco de dados
    await orphanagesRepository.save(orphanage);

    return response.json({ message: 'hello world'});
});


//ouvindo a porta 3333
app.listen(3333);