const express =  require("express");
const mongoose =  require("mongoose");
const dotenv = require("dotenv");
const ProductRoutes = require("./routes/ProductRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.get("/",(request,responese) => {
    responese.status(200).json({
        success: "true",
        message: " Server is running fine"
    });
})
app.use("/products",ProductRoutes)

mongoose
.connect(process.env.MONGO_URL)
.then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error("MongoDB connection error:", err);

});