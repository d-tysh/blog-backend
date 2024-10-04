import mongoose from 'mongoose';

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
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { versionKey: false }
)

const News = mongoose.model('news', news);

export default News;