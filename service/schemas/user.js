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
        },
        isOnline: {
            type: Boolean,
            default: false
        }
    },
    { versionKey: false }
)

export const userRegisterSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})

export const userLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})

export const userUpdateSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    role: Joi.string().required()
})

export const User = mongoose.model('user', user);