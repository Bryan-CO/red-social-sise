export const status404 = () => {
    return (req, res, next) => {
        res.status(404).send('<h1>404 :(</h1>');
    };
}