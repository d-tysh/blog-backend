import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../service/schemas/user.js';
import successResponse from '../helpers/successResponse.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import mongoose from 'mongoose';
import HttpError from '../helpers/HttpError.js';

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, `User with email "${email}" already exists`);
    }

    const password = await bcrypt.hash(req.body.password, 10);
    await User.create({ ...req.body, password });
    const data = {
        status: 'success',
        code: 201,
        message: `User "${email}" registered successfully`
    }
    return successResponse(res, 201, data);
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, 'Email or password is incorrect');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw HttpError(401, 'Email or password is incorrect');
    }

    const { _id: id } = user;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
    const result = await User.findByIdAndUpdate(id, { token, isOnline: true }, { new: true });
    return res.json({
        message: 'Authorized',
        data: {
            id,
            name: result.name,
            email: result.email,
            role: result.role,
            token,
            isOnline: result.isOnline
        }
    })
}

const logout = async (req, res) => {
    const { _id: id } = req.user;
    await User.findByIdAndUpdate(id, { token: '', isOnline: false });
    successResponse(res, 200, {
        message: 'Logout successful'
    })
}

const getCurrent = async (req, res) => {
    const { name, email, role, _id: id, isOnline } = req.user;
    return successResponse(res, 200, {
        data: { id, name, email, role, isOnline }
    })
}

const setOnlineStatus = async (req, res) => {
    const { id, isOnline } = JSON.parse(req.body);
    const result = await User.findByIdAndUpdate(id, { isOnline }, { new: true });
    if (!result) {
        throw HttpError(404);
    }
    return res.status(200);
}

const getAllUsers = async (req, res) => {
    const { user } = req;
    if (user.role !== 'admin') {
        throw HttpError(403, 'Access Denied')
    }

    const results = await User.find({}, '-token -password');
    return successResponse(res, 200, { results })
}

const getUserByid = async (req, res) => {
    const { id } = req.params;

    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
        throw HttpError(400);
    }

    const result = await User.findById(id, '-token -password');
    if (!result) {
        throw HttpError(404, 'User not found');
    }
    return successResponse(res, 200, { result })
}

const update = async (req, res) => {
    const { id } = req.params;
    const result = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
        throw HttpError(404);
    }
    const data = {
        message: `User "${result.email}" updated`,
        result: {
            name: result.name,
            email: result.email,
            role: result.role
        }
    }
    return successResponse(res, 200, data);
}

const remove = async (req, res) => {
    const { id } = req.params;
    const result = await User.findByIdAndDelete(id);
    if (!result) {
        throw HttpError(404);
    }
    return successResponse(res, 200, {
        message: `Deleted user: ${result.email}`
    })
}

export default {
    register: controllerWrapper(register),
    login: controllerWrapper(login),
    logout: controllerWrapper(logout),
    getCurrent: controllerWrapper(getCurrent),
    getAllUsers: controllerWrapper(getAllUsers),
    getUserByid: controllerWrapper(getUserByid),
    update: controllerWrapper(update),
    remove: controllerWrapper(remove),
    setOnlineStatus: controllerWrapper(setOnlineStatus)
};