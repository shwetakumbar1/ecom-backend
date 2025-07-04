const express = require("express");
const { createProduct, getAllProducts, getProductByID, updateProduct, deleteProduct } = require("../controllers/productcontroller");
const { isAuth, isAdmin } = require("../middlewares/authmiddlewares");
const validateProduct = require("../utils/validateProduct");

const ProductRoutes = express.Router();
ProductRoutes.post("/",isAuth, isAdmin, validateProduct, createProduct);
ProductRoutes.get("/",isAuth,getAllProducts);
ProductRoutes.get("//:id",isAuth,getProductByID);
ProductRoutes.put("//:id",isAuth,isAdmin,validateProduct,updateProduct);
ProductRoutes.delete("//:id",isAuth,isAdmin,validateProduct,deleteProduct);

module.exports = ProductRoutes;
