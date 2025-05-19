module.exports.createAddress = async (user, body) => {
    try {
        const userId = user._id
        if (body.isDefault) {
            await Model.Address.updateMany({ userId }, { isDefault: false });
        }
        body.userId = userId
        const newAddress = await dbHelper.create(Model.Address, body)
        return {
            data: newAddress,
            message: MSG.ADDRESS_SAVE_SUCCESSFULLY
        }
    } catch (error) {
        console.log("error in createAddress function", error)
        throw error
    }
};

module.exports.getAddress = async (user) => {
    try {
        console.log("getAddress working")
        const userId = user._id
        const data = await Model.User.aggregate([
            {
                $match: {
                    _id: userId,
                    isDeleted: false
                }
            },
            {
                $lookup: {
                    from: "addresses",
                    localField: "_id",
                    foreignField: "userId",
                    as: "addressData"
                }
            },
            {
                $unwind: "$addressData"
            },
            {
                $project: {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    "addressData": 1
                }
            },
            {
                $match: {
                    "addressData.isDeleted": false
                }
            }

        ])
        return {
            data: data,
            message: MSG.DATA_FETCHED
        }


    } catch (error) {
        throw error
    }
};

module.exports.updateAddress = async (user, body, params) => {
    try {
        const userId = user._id;
        const addressId = new Mongoose.Types.ObjectId(params.id)

        const address = await Model.Address.findOne({ _id: addressId, userId });

        if (!address) { throw new Error("address id not match") }

        if (body.isDefault) {
            await Model.Address.updateMany({ userId }, { isDefault: false });
        }
        const updatedAddress = await Model.Address.findByIdAndUpdate(
            addressId,
            {
                street: body.street,
                city: body.city,
                state: body.state,
                postalCode: body.postalCode,
                country: body.country,
                isDefault: body.isDefault
            },
            { new: true }
        );
        return {
            data: updatedAddress,
            message: MSG.ADDRESS_UPDATE_SUCCESSFULLY
        }

    } catch (error) {
        console.log("error in update Address function ", error)
        throw error
    }
};


module.exports.deleteAddress = async (user, params) => {
    try {
        console.log("delete address on working")
        const userId = user._id;
        const addressId = new Mongoose.Types.ObjectId(params.id)
        const softDeleted = await Model.Address.findOneAndUpdate(
            {
                _id: addressId,
                userId
            },
            {
                isDeleted: true
            },
            {
                new: true
            });
        if (!softDeleted) { throw new Error("address id not match") }
        return {
            data: softDeleted,
            message: MSG.ADDRESS_DELETED_SUCCESSFULLY
        }
    } catch (error) {
        console.log("delete function ", error)
        throw error
    }
}