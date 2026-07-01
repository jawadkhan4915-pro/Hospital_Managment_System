import inventoryService from '../services/inventory.service.js';

export const addItem = async (req, res, next) => {
  try {
    const item = await inventoryService.addItem(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const getItems = async (req, res, next) => {
  try {
    const items = await inventoryService.getAllItems();
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const item = await inventoryService.updateStock(req.params.id, quantity);
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const getLowStock = async (req, res, next) => {
  try {
    const items = await inventoryService.getLowStock();
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};
