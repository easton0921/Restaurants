module.exports.createCategory = async (admin, body) => {
    try {

        const findCategory = await dbHelper.findOne(Model.Category, { name: body.name })
        if (findCategory) { throw new Error("Category allready exist") }

        const categorySave = await dbHelper.create(Model.Category, body)
        return {
            data: categorySave,
            message: "Category save successfully"
        }
    } catch (error) {
        console.log("error in create category function please cehck", error)
        throw error
    }
};


module.exports.updateCategory = async (admin, params, body) => {
    try {

        const categoryId = new Mongoose.Types.ObjectId(params.id)

        const findCategoryName = await dbHelper.findOne(Model.Category, { name: body.name })
        if (findCategoryName) { throw new Error("Category name all ready exist") }

        const categoryUpdate = await Model.Category.findByIdAndUpdate(categoryId, {
            name: body.name,
            image: body.image,
            description: body.description
        }, { new: true })

        if (!categoryUpdate) { throw new Error("category id messing ") }

        return {
            data: categoryUpdate,
            message: "Category update successfully"
        }
    } catch (error) {
        throw error;
    }
};



module.exports.deleteCategory = async (admin, params) => {
    try {
        const categoryId = new Mongoose.Types.ObjectId(params.id)

        const deleteProduct = await dbHelper.findOneAndUpdate(Model.Product, categoryId, { isDeleted: true }, { new: true })

        const deleteSubCategory = await dbHelper.findOneAndUpdate(Model.SubCategory, categoryId, { isDeleted: true }, { new: true })


        const deleteCategory = await dbHelper.findOneAndUpdate(Model.Category, categoryId, { isDeleted: true }, { new: true })
        if (!deleteCategory) { throw new Error("Category id is missing") }

        return {
            data: deleteCategory,
            message: "Category deleted successfully"
        }
    } catch (error) {
        throw error
    }
};


module.exports.getCategoryById = async (admin, params) => {
    try {
        console.log("getCategory function on working")

        const categoryId = new Mongoose.Types.ObjectId(params.id)
        console.log("categoryId", categoryId)

        const categoryIdCheck = await Model.Category.findById(categoryId)
        console.log("categoryId Check in data base", categoryIdCheck)
        if (!categoryIdCheck) { throw new Error("category id is missing") }

        const categoryData = await Model.Category.aggregate([
            { $match: { _id: categoryId,isDeleted:false, } }, 
            {
              $lookup: {
                from: "subcategories", 
                localField: "_id", 
                foreignField: "categoryId", 
                as: "subcategories", 
              },
            },
          ]);

        

        return {
            data: categoryData[0]||categoryIdCheck,
            message: 'data fetch successfully'
        }

    } catch (error) {
        console.log("error in getCategory functon ", error)
        throw error
    }
};

module.exports.getAllCategory = async (admin) => {
    try {
        console.log("get all category function working")
        const allCategoryFetch = await dbHelper.find(Model.Category, { isDeleted: false })
        const count = allCategoryFetch.length
        return {
            data: { allCategoryFetch, count },
            message: "data fetch successfully"
        }

    } catch (error) {
        console.log("error in getAll category function", error)
        throw error
    }
}; 



//============================================Sub category===================================================

module.exports.createSubCategory = async (admin, body) => {
    try {

        const categoryId = new Mongoose.Types.ObjectId(body.categoryId)
        console.log("category id ",categoryId)
        const category = await Model.Category.findById(categoryId);
        console.log("subcategory ",category)
        if (!category) {throw new Error("Sub category id missing")}
    

        const findSubCategory = await dbHelper.findOne(Model.SubCategory, { name: body.name })
        if (findSubCategory) { throw new Error("SubCategory allready exist") }

        const SubcategorySave = await dbHelper.create(Model.SubCategory, body)
        return {
            data: SubcategorySave,
            message: "SubCategory save successfully"
        }
    } catch (error) {
        console.log("error in create Subcategory function please cehck", error)
        throw error
    }
};

module.exports.updateSubCategory = async (admin, params, body) => {
    try {

        const SubcategoryId = new Mongoose.Types.ObjectId(params.id)
        const categoryId = new Mongoose.Types.ObjectId(body.categoryId)

        if (body.categoryId) {
            const category = await Model.Category.findById(categoryId);
            if (!category) {throw new Error("new category id is not ")}
            body.categoryId = category;
          }

        const findSubCategoryName = await dbHelper.findOne(Model.SubCategory, { name: body.name })
        if (findSubCategoryName) { throw new Error("SubCategory name all ready exist") }

        const SubcategoryUpdate = await Model.SubCategory.findByIdAndUpdate(SubcategoryId, {
            name: body.name,
            categoryId:body.categoryId
        }, { new: true })

        if (!SubcategoryUpdate) { throw new Error("Subcategory id messing ") }

        return {
            data: SubcategoryUpdate,
            message: "SubCategory update successfully"
        }
    } catch (error) {
        throw error;
    }
};


module.exports.deleteSubCategory = async (admin, params) => {
    try {
        const subCategoryId = new Mongoose.Types.ObjectId(params.id)

        const deleteProduct = await dbHelper.findOneAndUpdate(Model.Product, subCategoryId, { isDeleted: true }, { new: true })

        const deleteSubCategory = await dbHelper.findOneAndUpdate(Model.SubCategory, subCategoryId, { isDeleted: true }, { new: true })
        if (!deleteSubCategory) { throw new Error("SubCategory id is missing") }

        return {
            data: deleteSubCategory,
            message: "SubCategory deleted successfully"
        }
    } catch (error) {
        throw error
    }
};



module.exports.getSubCategoryById = async (admin, params) => {
    try {
        console.log("getSubCategory function on working")

        const subCategoryId = new Mongoose.Types.ObjectId(params.id)
        console.log("Sub categoryId", subCategoryId)

        const SubcategoryIdCheck = await Model.SubCategory.findById(subCategoryId).populate("categoryId", "name image")
        console.log("Sub categoryId Check in data base", SubcategoryIdCheck)
        if (!SubcategoryIdCheck) { throw new Error("sub category id is missing") }

        return {
            data: SubcategoryIdCheck,
            message: 'data fetch successfully'
        }

    } catch (error) {
        console.log("error in getCategory functon ", error)
        throw error
    }
};


module.exports.getAllSubCategory = async (admin) => {
    try {
        console.log("get all sub categories function working")
        const allSubCategoryFetch = await dbHelper.find(Model.SubCategory, { isDeleted: false })
        const subcategories = await Model.Category.aggregate([
            {
              $lookup: {
                from: "subcategories", 
                localField: "_id", 
                foreignField: "categoryId", 
                as: "subcategoryDetails", 
              },
            },
            {
              $unwind: {
                path: "$subcategoryDetails",
                preserveNullAndEmptyArrays: true, 
              }      
            },
            {
              $project: {
                _id: 1,
                name: 1,
                subcategories: {
                  $let: {
                    vars: {
                      subcategoryObj: "$subcategoryDetails",
                    },
                    in: {
                      _id: "$$subcategoryObj._id",
                      name: "$$subcategoryObj.name",
                    },
                  },
                },
              },
            },
            {
              $group: {
                _id: "$_id",
                name: { $first: "$name" },
                subcategories: { $push: "$subcategories" }, 
              },
            },
          ]);
        const count = subcategories.length
        return {
            data: { subcategories, count },
            message: "data fetch successfully"
        }

    } catch (error) {
        console.log("error in getAll category function", error)
        throw error
    }
}; 
