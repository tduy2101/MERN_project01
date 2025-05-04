import mongoose from 'mongoose';
import Product from '../models/product.model.js';

const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.log("error fetching products: ", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

const createProduct = async (req, res) => {
    console.log("req.body:", req.body);

    const product = req.body;

    // Check for required fields
    if (!product.name || !product.price || !product.image) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if price has a '$' sign, remove it and convert it to a number
    let price = product.price;
    if (typeof price === 'string' && price.includes('$')) {
        price = price.replace('$', '');  // Remove '$' symbol if present
    }

    // Convert the price to a number, in case it's a string without a '$' sign
    price = parseFloat(price);

    // Check if the price is a valid number
    if (isNaN(price)) {
        return res.status(400).json({ success: false, message: 'Invalid price format' });
    }

    const newProduct = new Product({
        name: product.name,
        price: price,  // Store the sanitized price as a number
        image: product.image
    }); // Create a new product instance with the sanitized price

    try {
        await newProduct.save(); // Save the product to the database
        res.status(201).json({ success: true, data: newProduct }); // Send a success response with the created product
    } catch (error) {
        console.error("Error saving product:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}


const updateProduct = async (req, res) => {
    const { id } = req.params;

    const product = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Product ID" });
    } // Catch error from client input
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid Product ID" });
    } // Catch error from client input

    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product Deleted" });
    } catch (error) {
        console.log("error in deleting product", error.message);
        res.status(500).json({ success: false, message: "Server Error" })
    }
}

export { getProducts, createProduct, updateProduct, deleteProduct}