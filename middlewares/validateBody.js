const validateBody = (schema) => {
    const func = (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: 'error',
                code: 400,
                message: 'Bad Request',
                error: error.details
            })
        }
        next();
    }
    return func;
}

export default validateBody;