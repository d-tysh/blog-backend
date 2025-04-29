import mongoose from 'mongoose';
import Joi from 'joi';

const Schema = mongoose.Schema;

const news = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required']
        },
        date: {
            type: String,
        },
        content: {
            type: String
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        url: {
            type: String,
            unique: true,
            required: true
        },
        comments: [
            {
                commentText: String,
                commentDate: String,
                authorName: String,
                authorId: Schema.Types.ObjectId
            }
        ],
    },
    { versionKey: false, timestamps: true }
)

export const newsCreateSchema = Joi.object({
    title: Joi.string().min(5).required(),
    date: Joi.string().required(),
    content: Joi.string()
})

export const newsUpdateSchema = Joi.object({
    title: Joi.string().min(5).required(),
    date: Joi.string().required(),
    url: Joi.string().min(5).required(),
    content: Joi.string()
})

export const addCommentSchema = Joi.object({
    commentText: Joi.string().min(1).max(300).required(),
    commentDate: Joi.string().required(),
    authorName: Joi.string().required(),
    authorId: Joi.string().required()
})

export const News = mongoose.model('news', news);