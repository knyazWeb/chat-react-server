const socketIOMiddleware = (io) => (req, res, next) => {
    req.io = io;
    next();
};

export default socketIOMiddleware;