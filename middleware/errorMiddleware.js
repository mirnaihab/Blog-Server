const errorMiddleware = (err, req, res, next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorMiddleware;
// const errorMiddleware = (err, req, res, next) => {
//     const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
//     res.status(statusCode).json({
//         message: err.message,
//         stack: process.env.NODE_ENV === 'production' ? null : err.stack,
//     });
// };

// module.exports = errorMiddleware;

// function errorHandler(err, req, res, next) {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// }
// module.exports = errorHandler;
