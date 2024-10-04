import News from '../service/schemas/news.js';
import successResponse from '../helpers/successResponse.js';

const get = async (req, res) => {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const totalCount = await News.countDocuments();
    const results = await News.find({}, null, { skip, limit }).populate('author', 'name').sort({ _id: -1 });
    return successResponse(res, 200, {
        totalCount,
        resultsCount: results.length,
        results
    })
}

const getById = async (req, res) => {
    const { id } = req.params;
    const result = await News.findById(id).populate('author', 'name');
    return successResponse(res, 200, {
        result
    })
}

const create = async (req, res) => {
    const { _id: author } = req.user;
    let url = req.body.title
        .replace(/[^a-zA-Z\s]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();

    const result = await News.create({ ...req.body, author, url });
    return successResponse(res, 201, {
        status: 'success',
        code: 201,
        message: 'News added',
        result
    })
}

const update = async (req, res) => {
    const { id } = req.params;
    const result = await News.findByIdAndUpdate({ _id: id }, req.body, { new: true });
    if (!result) {
        return res.status(400).json({
            status: 'error',
            code: 400,
            message: "You don't have permission to edit this post."
        })
    }
    return successResponse(res, 200, {
        status: 'success',
        code: 200,
        message: `News changed`,
        result
    })
}

const remove = async (req, res,) => {
    const { id } = req.params;
    const result = await News.findByIdAndDelete(id);
    if (!result) {
        return res.status(404).json({
            status: 'error',
            code: 404,
            message: 'Not Found'
        })
    }
    return successResponse(res, 200, {
        status: 'success',
        code: 200,
        message: `Deleted news: ${result.title}`
    })
}

export default {
    get,
    getById,
    create,
    update,
    remove
};