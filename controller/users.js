import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, userRegisterSchema, userLoginSchema } from '../service/schemas/user.js';
import successResponse from '../helpers/successResponse.js';
import validateBody from '../helpers/validateBody.js';

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    validateBody(userRegisterSchema);

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        return res.status(409).json({
            status: 'error',
            code: 409,
            message: `User with email "${email}" already exists`
        })
    }

    const password = await bcrypt.hash(req.body.password, 10);
    await User.create({ ...req.body, password });
    return successResponse(res, 201, {
        status: 'success',
        code: 201,
        message: `User "${email}" registered successfully`
    })
}

const login = async (req, res) => {
    validateBody(userLoginSchema);

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Email or password is incorrect'
        })
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({
            status: 'error',
            code: 401,
            message: 'Email or password is incorrect'
        })
    }

    const { _id: id } = user;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
    await User.findByIdAndUpdate(id, { token });
    return res.json({
        message: 'Authorized',
        data: {
            id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        }
    })
}

const logout = async (req, res) => {
    const { _id: id } = req.user;
    await User.findByIdAndUpdate(id, { token: '' });
    successResponse(res, 200, {
        message: 'Logout successful'
    })
}

const getCurrent = async (req, res) => {
    const { name, email, role, _id: id } = req.user;
    return successResponse(res, 200, {
        data: { id, name, email, role }
    })
}

const getAllUsers = async (req, res) => {
    const { user } = req;
    if (user.role !== 'admin') {
        return res.status(403).json({
            status: 'error',
            code: 403,
            message: 'Access Denied'
        })
    }

    const results = await User.find({}, '-token -password');
    return successResponse(res, 200, {
        results
    })
}

const getUserByid = async (req, res) => {
    const { id } = req.params;
    const result = await User.findById(id, '-token -password');
    if (!result) {
        return res.status(404).json({
            status: 'error',
            code: 404,
            message: 'User not found'
        })
    }
    return successResponse(res, 200, {
        result
    })
}

const update = async (req, res) => {
    const { id } = req.params;
    const result = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
        return res.status(404).json({
            status: 'error',
            code: 404,
            message: "Not Found"
        })
    }
    return successResponse(res, 200, {
        message: `User "${result.email}" updated`,
        result: {
            name: result.name,
            email: result.email,
            role: result.role
        }
    })
}

const remove = async (req, res) => {
    const { id } = req.params;
    const result = await User.findByIdAndDelete(id);
    if (!result) {
        return res.status(404).json({
            status: 'error',
            code: 404,
            message: 'Not Found'
        })
    }
    return successResponse(res, 200, {
        message: `Deleted user: ${result.email}`
    })
}

export default {
    register,
    login,
    logout,
    getCurrent,
    getAllUsers,
    getUserByid,
    update,
    remove
};