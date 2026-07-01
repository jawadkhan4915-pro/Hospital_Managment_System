import inventoryRepository from '../repositories/inventory.repository.js';
import logger from '../config/logger.js';

class InventoryService {
  async addItem(itemData) {
    const existing = await inventoryRepository.findByName(itemData.itemName);
    if (existing) {
      throw new Error('Item name already exists in inventory');
    }
    const item = await inventoryRepository.create(itemData);
    logger.info(`Inventory item added: ${item.itemName}`);
    return item;
  }

  async getAllItems() {
    return inventoryRepository.find();
  }

  async updateStock(itemId, quantity) {
    const item = await inventoryRepository.findById(itemId);
    if (!item) {
      throw new Error('Inventory item not found');
    }

    item.quantity = quantity;
    await item.save();

    logger.info(`Stock updated for ${item.itemName}: ${quantity}`);
    return item;
  }

  async getLowStock() {
    return inventoryRepository.findLowStockItems();
  }
}

export default new InventoryService();
