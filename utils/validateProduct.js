const validateProduct = (req, res, next) => {
  const { title, price, description, category, image, rating } = req.body;
  if (
    !title ||
    !price ||
    !description ||
    !category ||
    !image ||
    !rating ||
    rating.rate == null ||
    rating.count == null
  ) {
    return res.status(400).json({ message: "Invalid product data" });
  }
  next();
};

module.exports = validateProduct;