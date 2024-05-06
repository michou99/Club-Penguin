const express = require('express');
const router = express.Router();

const Inventory = require('../models/inventory');

// get all inventories
router.get('/', (req, res) => {
  Inventory.find()
    .then((inventories) => {
      res.json(inventories);
    })
    .catch((err) => {
      res.status(404).json({ error: 'Could not get all inventory.' });
    });
});

// get inventory by id
router.get('/:id', (req, res) => {
  Inventory.findById(req.params.id)
    .then((inventory) => {
      res.json(inventory);
    })
    .catch((err) => {
      res.status(404).json({ error: 'Inventory ID not found!' });
    });
});

// post new inventory
router.post('/', (req, res) => {
  Inventory.create(req.body)
    .then((newInventory) => {
      res.json(newInventory);
    })
    .catch((err) => {
      res.status(404).json({ error: 'Issue adding new inventory. Please try again.' });
    });
});

// delete inventory by id
router.delete('/:id', (req, res) => {
  Inventory.findByIdAndDelete(req.params.id)
    .then(() => {
      Inventory.find()
        .then((inventories) => {
          res.json(inventories);
        })
        .catch((err) => {
          res.status(404).json({ error: 'Issue deleting this inventory. Please try again.' });
        });
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

module.exports = router