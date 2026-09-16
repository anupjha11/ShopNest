const productModel = require('../models/product.model');
const cloudinary = require('../config/cloudinary');

const getProducts = async(req,res)=>{
    try{
        const products = await productModel.find({});
        res.json(products)
    }catch(error){
        res.status(500).json({message:'Server error'});
    }
}

const getProductById = async(req,res)=>{
    try{
        const product = await productModel.findById(req.params.id);
        if(product){
            res.json(product);
        }else{
            res.status(404).json({message:'Product not found'});
        }
    }catch(error){
        res.status(500).json({message:'Server error'});
    }
}

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
      resource_type: "auto",
    }
      );
      imageUrl= result.secure_url;
    }
    const product = new productModel({
      name, description, price, category, stock, imageUrl
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async(req,res) =>{
try{
    const {name, description, price, category, stock } = req.body;
    const product = await productModel.findById(req.params.id);
    if(product){
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price|| product.price;
        product.category = category || product.category;
        product.stock = stock || product.stock;
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            console.log(result);
            product.imageUrl = result.secure_url;
        }

        const updateProduct= await product.save();
        res.json(updateProduct);
    }else{
        res.status(404).json({message:'Product not found'});
        }
}catch(error){
        res.status(500).json({message:'Server error'});
}
}

const deleteProduct = async(req,res)=>{
try{
    const product = await productModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Product deleted successfully', product });
}catch(error){
        res.status(500).json({message:'Server error'});
}
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}