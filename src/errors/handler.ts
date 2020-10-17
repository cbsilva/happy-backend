import { ErrorRequestHandler } from 'express';
import { ValidationError } from 'yup';

interface ValidationErrors {
    [key: string]: string[];
}

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
    
    if (error instanceof ValidationError)
    {
        console.log("Error de validação");
        let errors: ValidationErrors = {};

        error.inner.forEach(err => {
            errors[err.path] = err.errors;
        });

        return response.status(400).json({ message: 'Validation fail', errors });
    }

    //retorna o somente na console para o dev
    console.error(error);

    //retorna para o usuario um erro amigavel
    return response.status(500).json({ message: 'Internal Server Error'});
};

export default errorHandler;