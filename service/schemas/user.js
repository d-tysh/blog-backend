const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const user = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        },
        token: {
            type: String,
            default: ''
        }
    },
    { versionKey: false }
)

const userRegisterSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required()
})

const userLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required()
})

const User = mongoose.model('user', user);

module.exports = {
    User,
    userRegisterSchema,
    userLoginSchema
};