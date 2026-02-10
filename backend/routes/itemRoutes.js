import express from 'express';
import Item from '../models/Item.js';

const router = express.Router();

// Get all items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create an item
router.post('/', async (req, res) => {
    // Log item data without the potentially large imageUrl
    const { imageUrl, ...itemDataWithoutImage } = req.body;
    console.log('Received item data:', {
        ...itemDataWithoutImage,
        imageUrl: imageUrl ? `[Image data: ${imageUrl.substring(0, 50)}...]` : 'none'
    });

    const item = new Item(req.body);
    try {
        const newItem = await item.save();
        console.log('Item saved successfully:', newItem._id);
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Error saving item:', error.message);
        res.status(400).json({ message: error.message });
    }
});

// Update an item
router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an item
router.delete('/:id', async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
