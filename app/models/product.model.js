const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    id: Number,
    name: String,
    price: Number,
    dimensions: {x: Number, y: Number, z: Number},
    stock: Number,
    reviews: [Number]
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);