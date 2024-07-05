//Maneja errores 404 (Not Found) enviando una respuesta con código 404.
export const status404 = () => {
    return (req, res, next) => {
        res.status(404).send('<h1>404 :(</h1>');
    };
}