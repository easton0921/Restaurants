
const dbHelper = {
    // Create a new document
    create: (Model, data) => {
        try {
            const instance = new Model(data); // Create an instance of the model
            return instance.save(); // Save the instance to the database
        } catch (error) {
            console.error("Error in dbHelper.create:", error);
            throw error;
        }
    },


    // Find one document
    findOne: (Model, query, projection = {}, options = {}) => {
        return Model.findOne(query, projection, options);
    },
 
    // Find multiple documents
    find: (Model, query = {}, projection = {}, options = {}) => {
        try {
            const { sort, skip, limit, ...otherOptions } = options;

            // Build the query using the Model
            let queryBuilder = Model.find(query, projection);

            // Apply options dynamically
            if (sort) {
                queryBuilder = queryBuilder.sort(sort);
            }

            if (typeof skip === "number") {
                queryBuilder = queryBuilder.skip(skip);
            }

            if (typeof limit === "number") {
                queryBuilder = queryBuilder.limit(limit);
            }
            // console.log('queryBuilder: ', queryBuilder);

            // Apply other options if provided (e.g., lean, populate)
            if (otherOptions) {
                Object.keys(otherOptions).forEach(option => {
                    if (typeof queryBuilder[option] === "function") {
                        queryBuilder = queryBuilder[option](otherOptions[option]);
                    }
                });
            }
            // Execute and return the results
            return queryBuilder.exec();
        } catch (error) {
            console.error("Error in dbHelper.find:", error);
            throw error;
        }
    },


    // Update one document
    updateOne: (Model, query = {}, update = {}, options = {}) => {
        return Model.updateOne(query, update, options);
    },

    // Update many document
    updateMany: (Model, query = {}, update = {}, options = {}) => {
        return Model.updateMany(query, update, options);
    },

    countDocuments: (Model, query = {}) => {
        return Model.countDocuments(query);
    },
    findOneAndUpdate: (Model, query = {}, update = {}, options = {}) => {
        return Model.findOneAndUpdate(query, update, options);
    },

    // Aggregation pipeline
    aggregate: (Model, pipeline) => {
        return Model.aggregate(pipeline);
    },

    // Delete one document
    deleteOne: (Model, query, options = {}) => {
        return Model.deleteOne(query, options);
    },
    deleteMany: (Model, query, options = {}) => {
        return Model.deleteMany(query, options);
    },
};

module.exports = dbHelper;
