import jwt from 'jsonwebtoken';
import { User } from '../service/schemas/user.js';
import HttpError from '../helpers/HttpError.js';

const { SECRET_KEY } = process.env;

const authenticate = async (req, _, next) => {
    const { authorization = '' } = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') {
        next(HttpError(401));
    }

    try {
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if (!user || !user.token || user.token !== token) {
            throw HttpError(401);
        }
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

export default authenticate;