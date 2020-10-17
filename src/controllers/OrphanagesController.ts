import { Request, response, Response } from 'express';
import { getRepository } from 'typeorm';
import * as Yup from 'yup';

import Orphanage from '../models/Orphanage';
import OrphanagesView from '../views/orphanages_view';

export default {
  //#region consulta
  // retorna todos os registros encontrados (select * from tabela)
  //#endregion
  async index(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanage);

    const orphanages = await orphanagesRepository.find({
      relations: ['images']
    });

    return response.json(OrphanagesView.renderMany(orphanages));
  },

  //#region consulta pelo id
  // metodo para listar o registro consultado pelo id
  //#endregion
  async show(request: Request, response: Response) {

    const { id } = request.params;

    const orphanagesRepository = getRepository(Orphanage);

    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    });

    return response.json(OrphanagesView.render(orphanage));
  },

  //#region cria novo registro
  // por se tratar de um metodo que vai gravar no banco 
  // de dados é preciso usar o async na chamada
  // e await no metodo save
  //#endregion
  async create(request: Request, response: Response) {    
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    } = request.body;
    
    // envia o model como parametro para o repositorio
    const orphanagesRepository = getRepository(Orphanage);
    
    // as Express.Multer.File[] = forca a declaracado do objeto
    // isso é um forma de reforço, para que não gere erro durante a compilação
    const requestImages = request.files as Express.Multer.File[];

    const images = requestImages.map(image => {
      
      return { path: image.filename}
    });


    // cria um objeto data
    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    }

    //cria objeto schema para validar os dados
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        })
      )
    });

    // quando informado false, retorna todos os erros de uma unica vez
    await schema.validate(data, {
      abortEarly: false,
    });
    
    // cria os dados (em memoria)
    const orphanage = orphanagesRepository.create(data);

    console.log(orphanage);

    // salva os dados no banco de dados
    await orphanagesRepository.save(orphanage);

    return response.status(201).json(orphanage);
  }
}