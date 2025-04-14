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

// const createUniqueURL = async (Model, title, i = 0) => {
//     const url = title
//         .replace(/[^a-zA-Z\s]/g, '')
//         .trim()
//         .replace(/\s+/g, '-')
//         .toLowerCase();

//     const newUrl = i > 0 ? `${url}-${i}` : url;
//     const isUrlExist = await Model.findOne({ url: newUrl });
    
//     console.log(i);

//     if (isUrlExist) {
//         return await createUniqueURL(Model, title, i + 1);
//     }

//     return newUrl;
// }

export default createUniqueURL;