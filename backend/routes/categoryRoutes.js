const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

// Add Category with Subcategories
router.post('/', async (req, res) => {
    try {
        const { name, subCategories } = req.body;

        const newCategory = new Category({ name });
        const savedCategory = await newCategory.save();

        // Check if subCategories were provided
        if (subCategories && subCategories.length > 0) {
            const subcategoryPromises = subCategories.map(async (subCategoryName) => {
                const newSubcategory = new Subcategory({ name: subCategoryName, category: savedCategory._id });
                const savedSubcategory = await newSubcategory.save();
                return savedSubcategory._id; 
            });

            const subcategoryIds = await Promise.all(subcategoryPromises);

            savedCategory.subCategories = subcategoryIds;
            await savedCategory.save();
        }

        res.status(201).json(savedCategory); 
    } catch (err) {
        console.error('Error adding category:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Categories with Subcategories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().populate('subCategories', 'name');
        res.json(categories);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


// Delete Category by ID
router.delete('/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;

        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        await Subcategory.deleteMany({ category: categoryId });

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
