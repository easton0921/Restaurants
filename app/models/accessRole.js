
const Schema = new Mongoose.Schema({
    name:                 { type: String },
    name_ar:              { type: String },
    permission: [{
      sideBarId:          { type: Number, enum: Object.values(constants.MODULES) },
      label:              { type: String },
      path:               { type: String },
      icon:               { type: String },
      isSubMenu:          { type: Boolean, default: false },
      subMenuItems:       [],
      isSubAdmin:         { type: Boolean, default: false },
      _id:                { type: String },
      id:                 { type: String },
      isView:             { type: Boolean, default: false },
      isAdd:              { type: Boolean, default: false },
      isEdit:             { type: Boolean, default: false },
      isDelete:           { type: Boolean, default: false }
    }],
    isBlocked:            { type: Boolean, default: false, index: true },
    isDeleted:            { type: Boolean, default: false, index: true },
    deletedAt:            { type: Date }
  
  }, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
  
  
  Schema.pre(/save|create|update/i, async function (next) {
    if (this.get("isDeleted")) {
      this.set({ deletedAt: new Date() });
    }
  
    next();
  });
  
  const AccessRole = Mongoose.model('access_roles', Schema);
  module.exports = AccessRole;
  
  module.exports.list = (filter, skip, limit) => {
    const pipeline = [];
  
    const qry = {
      isDeleted: false,
    };
  
    pipeline.push(
      { $match: qry }
    );
  
    if (skip !== undefined && limit !== undefined) {
      pipeline.push(...Func.pagination(skip, limit));
    }
  
    return dbHelper.aggregate(AccessRole, pipeline).then(res => {
      if (skip !== undefined && limit !== undefined) {
        return res[0]
      }
      return res;
    });
  };