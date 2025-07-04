const express = require("express");
const { createProduct, getAllProducts, getProductByID, updateProduct, deleteProduct } = require("../controllers/productcontroller");

const ProductRoutes = express.Router();
ProductRoutes.post("/",createProduct);
ProductRoutes.get("/",getAllProducts);
ProductRoutes.get("//:id",getProductByID);
ProductRoutes.put("//:id",updateProduct);
ProductRoutes.delete("//:id",deleteProduct);

module.exports = ProductRoutes;
