class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async find(filter = {}, options = {}) {
    const queryFilter = { ...filter, isDeleted: { $ne: true } };
    let query = this.model.find(queryFilter);

    if (options.select) query = query.select(options.select);
    if (options.populate) query = query.populate(options.populate);
    if (options.sort) query = query.sort(options.sort);
    if (options.limit) query = query.limit(options.limit);
    if (options.skip) query = query.skip(options.skip);
    if (options.lean !== false) query = query.lean();

    return query.exec();
  }

  async findOne(filter = {}, options = {}) {
    const queryFilter = { ...filter, isDeleted: { $ne: true } };
    let query = this.model.findOne(queryFilter);

    if (options.select) query = query.select(options.select);
    if (options.populate) query = query.populate(options.populate);
    if (options.lean !== false) query = query.lean();

    return query.exec();
  }

  async findById(id, options = {}) {
    let query = this.model.findOne({ _id: id, isDeleted: { $ne: true } });

    if (options.select) query = query.select(options.select);
    if (options.populate) query = query.populate(options.populate);
    if (options.lean !== false) query = query.lean();

    return query.exec();
  }

  async create(data) {
    const item = new this.model(data);
    return item.save();
  }

  async update(id, data) {
    return this.model.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $set: data },
      { new: true, runValidators: true }
    ).exec();
  }

  async softDelete(id) {
    return this.model.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    ).exec();
  }

  async count(filter = {}) {
    const queryFilter = { ...filter, isDeleted: { $ne: true } };
    return this.model.countDocuments(queryFilter).exec();
  }
}

export default BaseRepository;
