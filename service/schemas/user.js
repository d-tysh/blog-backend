const mongoose = require('mongoose');
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
        // avatarURL: {
        //     type: String
        // },
        token: {
            type: String,
            default: ''
        }
    },
    { versionKey: false }
)

const User = mongoose.model('user', user);
module.exports = User;