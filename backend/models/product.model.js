import mongoose from "mongoose";

const productSchema = new mongoose.Schema({ // Define the schema for the Product model
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

const Product = mongoose.model("Product", productSchema); // Create a new model called Product using the productSchema
export default Product; // Export the Product model so it can be used in other files