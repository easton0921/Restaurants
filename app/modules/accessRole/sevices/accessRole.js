
/**
 * Function to create
 * @param {*} body
 * @returns 
 */
module.exports.create = async (body) => {
    const result = await dbHelper.create(Model.AccessRole, body);

    return { data: result, message: MSG.DATA_SUBMITED_SUCCESSFULLY };
};

/**
 * Function to list
 * @param {*} query
 * @returns 
 */
module.exports.list = async (query) => {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : pagination_limit;
    const skip = Number((page - 1) * limit);

    let result = await Model.AccessRole.list(query, skip, limit);

    if (!result) {
        result = {
            list: [],
            totalCount: 0,
        }
    }

    result.totalPages = Math.ceil(result.totalCount / limit);

    return { data: result, message: MSG.DATA_FETCHED };
};

/**
 * Function to get by id
 * @param {*} params
 * @param {*} query
 * @returns 
 */
module.exports.getById = async (params, query) => {
    let qry = { _id: params.id, isDeleted: false };
    const result = await dbHelper.findOne(Model.AccessRole, qry);

    return { data: result, message: MSG.DATA_FETCHED };
};

/**
 * Function to update by id
 * @param {*} params
 * @param {*} body
 * @returns 
 */
module.exports.updateById = async (params, body) => {
    const qry = { _id: params.id, isDeleted: false };
    const result = await dbHelper.findOneAndUpdate(Model.AccessRole, qry, body);
    if (!result) throw new Error(MSG.INVALID_ID);

    return { data: result, message: MSG.UPDATED_SUCCESSFULLY };
};

/**
 * Function to delete by id
 * @param {*} params
 * @param {*} body
 * @returns 
 */
module.exports.deleteById = async (params, body) => {
    let qry = { _id: params.id, isDeleted: false };
    const result = await dbHelper.findOne(Model.AccessRole, qry);

    let subadmin = await dbHelper.findOne(Model.User, { isDeleted:false, role:constants.ROLE.SUB_ADMIN, accessRole:params.id });
    if(subadmin) throw new Error(MSG.ROLE_IN_USE);

    result.isDeleted = true;

    await result.save();

    return { message: MSG.DELETED_SUCCESSFULLY };
};

/**
 * Function to export records
 * @param {*} query
 * @returns 
 */
// module.exports.exportRecords = async (query) => {
//     let result = await Model.AccessRole.list(query);
    
//     if (!result || result.length === 0) {
//         return { data: null, message: MSG.NO_DATA_TO_EXPORT };
//     }
//     const list = result.map(obj => ({
//         question: obj.question,
//         answer: obj.answer
//     }));

//     const fileName = "access_role_" + Date.now() + ".csv";
//     const url = await Services.Upload.generateCsv(list, fileName);

//     return { data: url, message: MSG.DATA_FETCHED };
// };