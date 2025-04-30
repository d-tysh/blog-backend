import { News } from '../service/schemas/news.js';
import successResponse from '../helpers/successResponse.js';
import HttpError from '../helpers/HttpError.js';
import createUniqueURL from '../helpers/createUniqueURL.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import mongoose from 'mongoose';

const get = async (req, res) => {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const totalCount = await News.countDocuments();
    const results = await News.find({}, null, { skip, limit }).populate('author', 'name').sort({ _id: -1 });
    const data = {
        totalCount,
        resultsCount: results.length,
        results
    };
    return successResponse(res, 200, data);
}

const getById = async (req, res) => {
    const { id } = req.params;
    
    const isValidId = mongoose.Types.ObjectId.isValid(id);
    if (!isValidId) {
        throw HttpError(400);
    }

    const result = await News.findById(id).populate('author', 'name');
    if (!result) {
        throw HttpError(404);
    }
    return successResponse(res, 200, { result });
}

const getByURL = async (req, res) => {
    const { url } = req.params;
    const result = await News.findOne({ url }).populate('author', 'name');
    if (!result) {
        throw HttpError(404);
    }
    return successResponse(res, 200, { result });
}

const create = async (req, res) => {
    const { _id: author } = req.user;
    const { title } = req.body;

    const url = await createUniqueURL(News, title);

    const result = await News.create({ ...req.body, author, url });
    const data = {
        status: 'success',
        code: 201,
        message: 'News added',
        result
    };
    return successResponse(res, 201, data);
}

const update = async (req, res) => {
    const { id } = req.params;
    const { url } = req.body;
    
    const isUrlExist = await News.findOne({ url });
    if (isUrlExist && !isUrlExist._id.equals(id)) {
        throw HttpError(409, 'News with this URL already exist');
    }

    const result = await News.findByIdAndUpdate({ _id: id }, req.body, { new: true });
    if (!result) {
        throw HttpError(404);
    }
    const data = {
        status: 'success',
        code: 200,
        message: 'News changed',
        result
    };
    return successResponse(res, 200, data);
}

const remove = async (req, res) => {
    const { id } = req.params;
    const result = await News.findByIdAndDelete(id);
    if (!result) {
        throw HttpError(404);
    }
    const data = {
        status: 'success',
        code: 200,
        message: `Deleted news: ${result.title}`
    };
    return successResponse(res, 200, data);
}

const addComment = async (req, res) => {
    const { id } = req.params;
    const result = await News.findByIdAndUpdate(id, {
        $push: {
            comments: {
                ...req.body
            }
        }
    }, { new: true });
    if (!result) {
        throw HttpError(404);
    }
    successResponse(res, 200, {
        message: "Comment added"
    })
}

const removeComment = async (req, res) => {
    const { id, commentId } = req.params;
    const result = await News.findByIdAndUpdate(id, {
        $pull: {
            comments: {
                _id: commentId
            }
        }
    }, { new: true });
    if (!result) {
        throw HttpError(404);
    }
    successResponse(res, 200, {
        message: "Comment deleted"
    })
}

export default {
    get: controllerWrapper(get),
    getById: controllerWrapper(getById),
    getByURL: controllerWrapper(getByURL),
    create: controllerWrapper(create),
    update: controllerWrapper(update),
    remove: controllerWrapper(remove),
    addComment: controllerWrapper(addComment),
    removeComment: controllerWrapper(removeComment)
};