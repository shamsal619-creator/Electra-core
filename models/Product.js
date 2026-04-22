const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, lowercase: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, min: 0 },
    description: { type: String, default: '', trim: true },
    brand: { type: String, default: '', trim: true },
    color: { type: String, default: '', trim: true },
    inStock: { type: Boolean, default: true },
    images: {
        type: [String],
        default: [],
        validate: {
            validator: (arr) => Array.isArray(arr) && arr.length > 0,
            message: 'At least one image is required'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
