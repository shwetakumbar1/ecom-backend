const Product = require("../models/product");
const createProduct =async (req,res) => {
    try{
        const product = await Product.create(req,body);
        res.status(201).json(product);
    }
    catch(err) {
        console.log(err.message);
        res.status(500).json({
            message: "Something went wrong",
        });
    }
};

const getAllProducts = async (req,res) =>{
    try{
        const products =await Product.find();
        res.json(products);
    }
    catch(err) {
        console.log(err.message);
        res.status(500).json({
            message:"Something went wrong"
        });
    }
};
const getProductByID = async(req,res) => {
    try{
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if(product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        res.json(product);
    }
    catch(err) {
        console.log(err.message);
        res.status(500).json({
            message: "something went wrong",
        });
    }
};
const updateProduct = async(req, res,next) => {
    try{
        const product =await Product.findByIdAndUpdate
        (req.params.id,req.body,{
            new: true,

        });
        if(!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        res.json(product);
    } catch(err){
console.log(err.message);
        res.status(500).json({
            message: "something went wrong",
        });
    
    }
};


const deleteProduct = async(req,res,next) => {
    try{
        const product =await Product.findByIdAndDelete
        (req.params.id);
        if(!product){
            return res.status(404).json({
                message: "Product not found",
            });
        }
        res.json({
            message: " Product deleted",
        });
    }catch(err){
        console.log(err.message) ;
            res.status(500).json({
                message: "something went wrong",
            });
        
    }
};
module.exports = {
    createProduct,
    getAllProducts,
    getProductByID,
    updateProduct,
    deleteProduct
}