const jwt = require('jsonwebtoken');
const User = require('../service/schemas/user');
const { SECRET_KEY } = process.env;
const HttpError = require('../helpers/HttpError');

const autehticate = async (req, _, next) => {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') {
        next(HttpError(401));
    }

    try {
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if (!user || !user.token || user.token !== token) {
            next(HttpError(401))
        }
        req.user = user;
        next();
    } catch (error) {
        next(HttpError(401));
    }
}

module.exports = autehticate;