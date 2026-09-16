const orderModel = require('../models/order.model');
const sendEmail = require('../utils/sendEmail');

//create a new order
const createOrder = async(req, res) =>{
    try{
      const { items, totalAmount, address, paymentId } = req.body;
      if(!items || items.length==0 || !totalAmount || !address ){
        return res.status(400).json({message:'Invalid order data'});

      }else{
        const order = new orderModel({
            user:req.user._id,
            items,
            totalAmount,
            address,
            paymentId,
        });
        await order.save();
       
        const message = `Dear ${req.user.name},\n\n Thank You for your order! Your order has been successfully created with the following detail:\n\n Order Id: ${order._id} \nTotal Amount: $${totalAmount} \nShipping Address:  ${address.street}, ${address.city}, ${address.postalCode}, ${address.country}\n\n We will notify you once your order is shipped.\n\nBest regards,\nShopNest Team`

        await sendEmail(req.user.email,'Order Created', message );
        res.status(201).json({message:'Order created successfully', order});
      }
    }catch(error){
       res.status(500).json({message:'Error creating order', error})
    }
};

const myOrders = async(req,res)=>{
    try{
      const orders = await orderModel.find({user:req.user._id}).populate('items.productId','name price');
      res.json(orders);

    }catch(error){
       res.status(500).json({message:'Error fetching order', error})
    }
};

const getOrders = async(req,res)=>{
    try{
        const orders = await orderModel.find({}).populate('user','id name');
      res.json(orders);
    }catch(error){
       res.status(500).json({message:'Error fetching order', error})
    }
}

const updateOrderStatus = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    createOrder, myOrders, getOrders, updateOrderStatus
}