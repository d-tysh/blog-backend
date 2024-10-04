import mongoose from 'mongoose';
import Joi from 'joi';

const Schema = mongoose.Schema;

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

export const userRegisterSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required()
})

export const userLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required()
})

export const User = mongoose.model('user', user);