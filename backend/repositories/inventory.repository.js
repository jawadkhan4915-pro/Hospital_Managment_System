import BaseRepository from './base.repository.js';
import Inventory from '../models/Inventory.js';

class InventoryRepository extends BaseRepository {
  constructor() {
    super(Inventory);
  }

  async findLowStockItems() {
    return this.model.find({
      isDeleted: { $ne: true },
      $expr: { $lte: ['$quantity', '$reorderLevel'] },
    }).exec();
  }

  async findByName(itemName) {
    return this.findOne({ itemName });
  }
}

export default new InventoryRepository();
