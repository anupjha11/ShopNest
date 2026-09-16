const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'});
}

 const otpStore = {}

//resister user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await userModel.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({ name, email, password: hashedPassword });
    if (user) {
      
      // Generate a mock OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

       // Store OTP with 10 minute expiry
      otpStore[user.email] = {
        otp: otp.toString(),
        expiresAt: Date.now() + 10 * 60 * 1000
      };
      
      // Send Welcome / OTP Email
      const message = `
        <h2>Welcome to ShopNest, ${name}!</h2>
        <p>Thank you for registering on our platform.</p>
        <p>Your one-time verification/discount OTP is: <strong>${otp}</strong></p>
      `;

      await sendEmail({
        email: user.email,
        subject: 'Welcome to ShopNest - Your OTP',
        message
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//login user
const loginUser = async(req,res) =>{
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email});
        if(user && (await bcrypt.compare(password,user.password))){
            res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
                token:generateToken(user._id)
            });
        }else{
            res.status(400).json({message:'Invalid email and password'})
        }

    }catch(error){
       res.status(500).json({message:'Server error'});
    }
}

// Get all user details
const getUsers = async(req,res)=>{
   try{
 const users = await userModel.find({}).select('-password');
   res.json(users);
   }catch(error){
      res.status(500).json({message:'Server error'});
   }
}

const verifyUserEmail = async(req,res) =>{

  const {email, otp} = req.body;
  try{
   const user = await userModel.findOne({email});

   if(!user){
   return  res.status(404).json({message:'user not found'})
   }
   const stored = otpStore[email];
    if (!stored){
    return res.status(400).json({ message: 'OTP not found or already used. Please register again.' });
    }
   if (Date.now() > stored.expiresAt)
    return res.status(400).json({ message: 'OTP expired' });

   if (stored.otp !== otp.toString())
    return res.status(400).json({ message: 'Invalid OTP' });

   user.verified = true;
   await user.save();
    delete otpStore[email];

    res.json({ message: 'Email verified successfully' });
  }catch(error){
     return res.status(500).json({message: error.message});
  }
}
module.exports = {
    registerUser,
    loginUser,
    getUsers,
    verifyUserEmail
}
