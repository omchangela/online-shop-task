const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const Product = require('../models/Product');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); 
    }
});

const upload = multer({ storage: storage });

// Add Product
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const newProduct = new Product({
            ...req.body, 
            imageUrl: req.file ? req.file.path : null 
        });
        await newProduct.save();
        res.json(newProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
    console.log(`Received delete request for product ID: ${req.params.id}`);
});

// Update Product
router.put('/:id', upload.single('image'), async (req, res) => {
    const productId = req.params.id;

    try {
        const updateData = {
            ...req.body,
        };

        if (req.file) {
            updateData.imageUrl = req.file.path;
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
