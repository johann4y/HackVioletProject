const express = require('express');
const router = express.Router();
const Pin = require('../models/Pin');


router.post('/', async (req, res) => {
  try {
    const newPin = new Pin(req.body);
    const savedPin = await newPin.save();
    res.status(201).json(savedPin);
  } 
  catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const pins = await Pin.find();
    res.json(pins);
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const pin = await Pin.findOneAndUpdate(
      { 
        _id: req.params.id,
        createdBy: req.body.createdBy  
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!pin) return res.status(404).json({ message: 'Pin not found or unauthorized' });
    res.json(pin);
  } 
  catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const pin = await Pin.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.body.createdBy
    });

    if (!pin) return res.status(404).json({ message: 'Pin not found or unauthorized' });
    res.json({ message: 'Pin deleted successfully' });
  } 
  catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;