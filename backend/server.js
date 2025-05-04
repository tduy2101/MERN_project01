import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import productRoutes from "./routes/product.route.js";
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
console.log(process.env.MONGO_URI);

//  Config app
app.use(express.json()); // middleware parse the raw data to JSON 
app.use(express.urlencoded({ extended: true }));


// Khởi tạo đường dẫn
console.log("Mounting product routes...");
app.use("/api/products", productRoutes);

// Serve static files (from Vite build)
const __dirname = path.resolve();



// Update your catch-all route to be more explicit about what it should match
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    // Only handle non-API routes with the catch-all
    app.get(/^(?!\/api).*$/, (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log("Server start at http://localhost:" + PORT);
})

// 