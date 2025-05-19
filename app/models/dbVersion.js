
const Schema = new Mongoose.Schema({
    version: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = Mongoose.model('dbversions', Schema);