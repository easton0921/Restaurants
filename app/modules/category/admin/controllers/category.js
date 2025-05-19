const express = require("express")
const router = express()

const createCategory = async (req,res,next) =>{
    try {
        const {data,message} = await Services.category.createCategory(req.admin,req.body)
        return res.success(message,data)
    } catch (error) {
        next(error)
    }
};

const updateCategory = async (req,res,next) => {
    try {
        const {data,message} = await Services.category.updateCategory(req.admin,req.params,req.body)
        return res.success(message,data)
    } catch (error) {
        next(error)
        
    }
};

const deletedCategory = async(req,res,next) =>{
    try {
        const {data,message} = await Services.category.deleteCategory(req.admin,req.params)
        return res.success(message,data)
    } catch (error) {
        next(error)
    }
};

const getCategoryById = async (req,res,next) => {
    try {
        console.log("get by id router working")
        const {data,message} = await Services.category.getCategoryById(req.admin,req.params)
        return res.success(message,data)
    } catch (error) {
        console.log('get by id router ',error)
        next(error)
    }
};

const getAllCategory = async (req,res,next) =>{
try {
    console.log("get all cstegory router is working")
    const {data,message} = await Services.category.getAllCategory(req.admin)
    return res.success(message,data)
} catch (error) {
    console.log("error in getAllCategory router",error)
    next(error)
}
}


//====================================================Sub category=====================================================

const createSubCategory = async (req,res,next) =>{
    try {
        const {data,message} = await Services.category.createSubCategory(req.admin,req.body)
        return res.success(message,data)
    } catch (error) {
        next(error)
    }
};

const updateSubCategory = async (req,res,next) => {
    try {
        const {data,message} = await Services.category.updateSubCategory(req.admin,req.params,req.body)
        return res.success(message,data)
    } catch (error) {
        next(error)   
    }
};

const deletedSubCategory = async(req,res,next) =>{
    try {
        const {data,message} = await Services.category.deleteSubCategory(req.admin,req.params)
        return res.success(message,data)
    } catch (error) {
        next(error)
    }
};

const getAllSubCategory = async (req,res,next) =>{
    try {
        console.log("get all category router is working")
        const {data,message} = await Services.category.getAllSubCategory(req.admin)
        return res.success(message,data)
    } catch (error) {
        console.log("error in getAllCategory router",error)
        next(error)
    }
    }


const getSubCategoryById = async (req,res,next) => {
    try {
        console.log("get by id router working")
        const {data,message} = await Services.category.getSubCategoryById(req.admin,req.params)
        return res.success(message,data)
    } catch (error) {
        console.log('get by id router ',error)
        next(error)
    }
};







//============================================Category==================================================================


router.post("/",Auth.verify("admin"),Validator( Validations.Category.createCategory),createCategory)

router.get("/",Auth.verify("admin"),getAllCategory)

router.get("/:id",Auth.verify("admin"),getCategoryById)

router.put("/:id",Auth.verify("admin"),Validator(Validations.Category.updateCategory),updateCategory)

router.delete("/:id",Auth.verify("admin"),deletedCategory)



//===================================router Sub-Category================================================================

router.post("/subCategory",Auth.verify("admin"),Validator( Validations.Category.createSubCategory),createSubCategory)

router.post("/AllSubCategory",Auth.verify("admin"),getAllSubCategory)

router.get("/subCategory/:id",Auth.verify("admin"),getSubCategoryById)

router.put("/subCategory/:id",Auth.verify("admin"),Validator(Validations.Category.updateSubCategory),updateSubCategory)

router.delete("/subCategory/:id",Auth.verify("admin"),deletedSubCategory)

module.exports = router