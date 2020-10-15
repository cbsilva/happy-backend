import { Request, response, Response } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../model/Orphanage';

export default {
  //#region consulta
  // retorna todos os registros encontrados (select * from tabela)
  //#endregion
  async index(request: Request, response: Response) {
    const orphanagesRepository = getRepository(Orphanage);

    const orphanages = await orphanagesRepository.find();

    return response.json(orphanages);
  },

  //#region consulta pelo id
  // metodo para listar o registro consultado pelo id
  //#endregion
  async show(request: Request, response: Response) {

    const { id } = request.params;

    const orphanagesRepository = getRepository(Orphanage);

    const orphanage = await orphanagesRepository.findOneOrFail(id);

    return response.json(orphanage);
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
    
    // cria os dados (em memoria)
    const orphanage = orphanagesRepository.create({
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images,
    });

    // salva os dados no banco de dados
    await orphanagesRepository.save(orphanage);

    return response.status(201).json(orphanage);
  }
}