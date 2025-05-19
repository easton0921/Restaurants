
const Schema = new Mongoose.Schema({
    question: { type: String },
    answer: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date }
  }, { timestamps: true });
  
  // (Optional) Automatically remove deleted record after 30 days
  // Schema.index({ deletedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
  
  Schema.pre(/save|create|update/i, async function (next) {
    if (this.get("isDeleted")) {
      this.set({ deletedAt: new Date() });
    }
  
    next();
  });
  
  const Faq = Mongoose.model('faqs', Schema);
  module.exports = Faq;
  
  module.exports.updateById = (id, data) => {
    return Faq.findByIdAndUpdate(id, data, { new: true });
  };
  
  module.exports.list = (filter, skip, limit) => {
    const pipeline = [];
  
    const qry = {
      isDeleted: false
    };
  
    pipeline.push(
      { $match: qry }
    );
  
    if (skip !== undefined && limit !== undefined) {
      pipeline.push(...Func.pagination(skip, limit));
    }
  
    return Faq.aggregate(pipeline).then(res => {
      if (skip !== undefined && limit !== undefined) {
        return res[0];
      } else {
        return res;
      }
    });
  };