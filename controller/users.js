const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../service/schemas/user');

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            res.status(409).json({
                status: 'conflict',
                code: 409,
                message: `User with email "${email}" already exists`
            })
        }

        const password = await bcrypt.hash(req.body.password, 10);
        await User.create({ ...req.body, password });
        res.status(201).json({
            status: 'success',
            code: 201,
            message: `User "${email}" registered successfully`
        })
    } catch (error) {
        next(error);
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            res.status(401).json({
                status: 'error',
                message: 'Email or password is incorrect'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Email or password is incorrect'
            })
        }

        const { _id: id } = user;
        const payload = { id };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });
        await User.findByIdAndUpdate(id, { token });
        res.json({
            message: 'Authorized',
            data: {
                id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        })
    } catch (error) {
        next(error);
    }
}

const logout = async (req, res) => {
    const { _id: id } = req.user;
    await User.findByIdAndUpdate(id, { token: '' });
    res.status(200).json({
        message: 'Logout successful'
    })
}

const getCurrent = async (req, res) => {
    const { name, email, role, _id: id } = req.user;
    console.log(req.user);
    res.status(200).json({
        data: { id, name, email, role }
    })
}

const getAllUsers = async (req, res, next) => {
    const { user } = req;
    try {
        if (user.role !== 'admin') {
            res.status(400).json({
                status: 'bad request',
                code: 400,
                message: 'Access Denied'
            })
        }

        const results = await User.find({}, '-token -password');
        res.status(200).json({
            results
        })
    } catch (error) {
        next(error);
    }
}

const getUserByid = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await User.findById(id, '-token -password');
        if (!result) {
            res.status(404).json({
                code: 404,
                status: "Not Found",
                message: 'User not found'
            })
        }
        res.status(200).json({
            result
        })
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!result) {
            res.status(404).json({
                code: 404,
                status: "Not Found"
            })
        }
        res.status(200).json({
            message: `User "${result.email}" updated`,
            result: {
                name: result.name,
                email: result.email,
                role: result.role
            }
        })
    } catch (error) {
        next(error);
    }
}

const remove = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await User.findByIdAndDelete(id);
        if (!result) {
            res.status(404).json({
                status: 'error',
                code: 404,
                message: 'Not Found'
            })
        }
        res.status(200).json({
            message: `Deleted user: ${result.email}`
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    logout,
    getCurrent,
    getAllUsers,
    getUserByid,
    update,
    remove
}