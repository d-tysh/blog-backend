import { News } from '../service/schemas/news.js';
import successResponse from '../helpers/successResponse.js';
import HttpError from '../helpers/HttpError.js';

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

const getById = async (req, res, next) => {
    const { id } = req.params;
    const result = await News.findById(id).populate('author', 'name');
    if (!result) {
        next(HttpError(404));
    }
    return successResponse(res, 200, { result });
}

const create = async (req, res) => {
    const { _id: author } = req.user;
    let url = req.body.title
        .replace(/[^a-zA-Z\s]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();

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
    const result = await News.findByIdAndUpdate({ _id: id }, req.body, { new: true });
    if (!result) {
        next(HttpError(404));
    }
    const data = {
        status: 'success',
        code: 200,
        message: 'News changed',
        result
    };
    return successResponse(res, 200, data);
}

const remove = async (req, res,) => {
    const { id } = req.params;
    const result = await News.findByIdAndDelete(id);
    if (!result) {
        next(HttpError(404));
    }
    const data = {
        status: 'success',
        code: 200,
        message: `Deleted news: ${result.title}`
    };
    return successResponse(res, 200, data);
}

export default {
    get,
    getById,
    create,
    update,
    remove
};