const express = require('express')
const router = express.Router()

const createAddress = async (req, res, next) => {
    try {
        const { data, message } = await Services.address.createAddress(req.user, req.body)
        return res.success(message, data)
    } catch (error) {
        console.log("createAddress router function error", error)
        next(error)
    }
};

const getAddress = async (req, res, next) => {
    try {
        const { data, message } = await Services.address.getAddress(req.user)
        return res.success(message, data)
    } catch (error) {
        console.log("error in get address router", error)
        next(error)
    }
};

const updateAddress = async (req, res, next) => {
    try {
        const { data, message } = await Services.address.updateAddress(req.user, req.body, req.params)
        return res.success(message, data)
    } catch (error) {
        console.log("error in update address fucntion ", error)
        next(error)
    }
};

const deleteAddress = async (req, res, next) => {
    try {
        console.log("delete address fuction is working ")
        const { data, message } = await Services.address.deleteAddress(req.user, req.params)
        return res.success(message, data)
    } catch (error) {
        console.log("error in delete function ", error)
        next(error)
    }
}

router.post("/", Auth.verify('user'), Validator(Validations.Address.createAddress), createAddress)

router.get("/", Auth.verify('user'), getAddress)

router.put("/:id", Auth.verify("user"), Validator(Validations.Address.updateAddress), updateAddress)

router.delete("/:id", Auth.verify('user'), deleteAddress)

module.exports = router