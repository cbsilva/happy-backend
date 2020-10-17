import {ErrorRequestHandler} from 'express';


const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
    
    //retorna o somente na console para o dev
    console.error(error);

    //retorna para o usuario um erro amigavel
    return response.status(500).json({ message: 'Internal Server Error'});
};

export default errorHandler;