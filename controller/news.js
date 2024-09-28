const News = require('../service/schemas/news');

const get = async (req, res, next) => {
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    try {
        const totalCount = await News.countDocuments();
        const results = await News.find({}, null, { skip, limit }).populate('author', 'name').sort({_id: -1});
        res.status(200).json({
            totalCount,
            resultsCount: results.length,
            results
        })
    } catch (error) {
        next(error);
    }
}

const getById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await News.findById(id).populate('author', 'name');
        res.status(200).json({
            result
        })
    } catch (error) {
        next(error);
    }
}

const create = async (req, res, next) => {
    const { _id: author } = req.user;
    let url = req.body.title
        .replace(/[^a-zA-Z\s]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();
    try {
        const result = await News.create({ ...req.body, author, url});
        res.status(201).json({
            status: 'success',
            code: 201,
            message: 'News added',
            result
        })
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await News.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        if (!result) {
            res.status(400).json({
                status: 'error',
                code: 400,
                message: "You don't have permission to edit this post."
            })
        }
        res.status(200).json({
            status: 'success',
            code: 200,
            message: `News changed`,
            result
        })
    } catch (error) {
        next(error);
    }
}

const remove = async (req, res, next) => {
    const { id } = req.params;
    try {
        const result = await News.findByIdAndDelete(id);
        if (!result) {
            res.status(404).json({
                status: 'error',
                code: 404,
                message: 'Not Found'
            })
        }
        res.status(200).json({
            status: 'success',
            code: 200,
            message: `Deleted news: ${result.title}`
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    get,
    getById,
    create,
    update,
    remove
}