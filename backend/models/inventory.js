const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    itemName: String,
  }
);

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;