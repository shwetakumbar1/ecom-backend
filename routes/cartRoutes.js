const express = require("express");
const { addToCart, updateQuantity, removeProduct, getCart, clearCart } = require("../controllers/cartcontroller");
const { isAuth } = require("../middlewares/authmiddlewares");


const cartRoutes = express.Router();
cartRoutes.get("/",isAuth,getCart);
cartRoutes.post("/add",isAuth,addToCart);
cartRoutes.put("/",isAuth,updateQuantity);
cartRoutes.delete("/product",isAuth,removeProduct);
cartRoutes.delete("/product", isAuth,clearCart);
module.exports = cartRoutes;