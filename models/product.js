const mongoose =require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    price: {
        type: number,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    image: {
        type: String,
        require: true,
    },
    rating: {
        rate: {
            type: number,
        require: true,
        },
    },
    count: {
        type: number,
        require: true,
    },
});
const product =mongoose.model("product", productSchema);
module.exports = product;













