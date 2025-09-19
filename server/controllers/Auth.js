const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv"); 
dotenv.config();

exports.signup = async(req, res) => {
    try {
        //fetch data
        const {firstName, lastName, email, password,phoneNO, confirmPassword, role } = req.body;

        //validation
        if(!firstName || !lastName || !email || !password || !confirmPassword || !role || !phoneNO){
            return res.status(400).json({
                success: false,
                messsage: "All fields are mendatory"
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "password and confirmPassword does not match"
            })
        }


        //check user already exist
        const userDetails = await User.findOne({email});

        if(userDetails){
            return res.status(400).json({
                success: false,
                message: "User is already exist"
            })
        }

        //passord hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        //create user
        const user = await User.create({
            firstName, 
            lastName, 
            email,
            password: hashedPassword,
            role,
            phoneNO
        })

        //return response
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            errors: error.message
        })
    }
}

exports.login = async(req, res) => {
    try {
        //fetch data
        const {email , password} = req.body;

        //validation
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "All fields are mendatory"
            })
        }

        //check User is already exist
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User is not registered"
            })
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role
        }

        //match password
        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"});

            user.token = token;
            user.password = undefined;
            
            //jwt token
            const options = {
                expires: new Date(Date.now() + 3* 24 * 60 * 60 * 1000),
                httpOnly: true
            }

            //create cookie
            res.cookie("token", token, options).status(200).json({
                success: true,
                token: token,
                message: "Logged in successfull"
            })
            //return result
        }
        else{
            return res.status(400).json({
                success: false,
                message: "password does not match"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            errors: error.message
        })
    }
}

// Add to your auth controller
exports.verifyToken = async (req, res) => {
  try {
    // The auth middleware already verified the token
    // We just need to return the user info
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        schoolId: user.schoolId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};