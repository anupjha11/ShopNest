require('dotenv').config()

const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db");
const userRoutes = require("./routes/authRoutes");
const productsRoutes = require("./routes/productsRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const paymentRoutes = require("./routes/paymentsRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

connectDB();

const app = express();
app.use(cors(
    {
        origin:['https://shop-nest-jet-two.vercel.app',process.env.FRONTEND_URL],
        credentials:true
    }
));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.send("ShopNest backend is working");
})

app.use('/api/auth', userRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running port ${PORT}`);
})
