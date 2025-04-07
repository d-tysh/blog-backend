const createUniqueURL = async (Model, title) => {
    let i = 0;
    let url = title
        .replace(/[^a-zA-Z\s]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();

    let newUrl = url;

    while (await Model.findOne({ url: newUrl })) {
        i++;
        newUrl = `${url}-${i}`;
    }

    return newUrl;
}

export default createUniqueURL;