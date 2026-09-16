const userModel = require('../models/user.model');
const orderModel = require('../models/order.model');
const productModel = require('../models/product.model');

const getAdminStats = async(req,res)=>{
    try{
       const totalUsers = await userModel.countDocuments({role:'user'});
       const totalOrders = await orderModel.countDocuments({});
       const totalProducts = await productModel.countDocuments({});

       const orders = await orderModel.find({});

       const totalRevenue = orders.reduce((acc, item) => acc + item.totalAmount, 0);

       res.json({
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue
       })
    }catch(error){
        res.status(500).json({message: error.message});
    }

}

module.exports = { getAdminStats };