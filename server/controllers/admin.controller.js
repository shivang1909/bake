import bcrypt from 'bcryptjs';
import bcryptjs from 'bcryptjs'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import genertedRefreshToken from '../utils/generatedRefreshToken.js'
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import AdminModel from '../models/Admin.model.js';

//login controller
export async function loginController(request,response){
    try {
        const { email , password } = request.body


        if(!email || !password){ 
            return response.status(400).json({
                message : "provide email, password",
                error : true,
                success : false
            })
        }

        const user = await AdminModel.findOne({ email })
      console.log("------------------");
      console.log(user); 
        if(!user){
            return response.status(400).json({
                message : "User not register",
                error : true,
                success : false
            })
        }

        const checkPassword = await bcryptjs.compare(password,user.password)

        if(!checkPassword){
            return response.status(400).json({
                message : "Check your password",
                error : true,
                success : false
            })
        }

        const accesstoken = await generatedAccessToken(user._id)
        const refreshToken = await genertedRefreshToken(user._id)

        const updateUser = await AdminModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })

        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        response.cookie('accessToken',accesstoken,cookiesOption)
        response.cookie('refreshToken',refreshToken,cookiesOption)

        return response.json({
            message : "Login successfully",
            error : false,
            success : true,
            data : {
                accesstoken,
                refreshToken
            }
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


export const addUser = async (req, res) => {
    const { name, email, mobile, role } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !role) {
        return res.status(400).json({ message: 'All fields are required!' });
    }
  
    try {
        // Check if the user already exists
        const existingUser = await AdminModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists!' });
        }

        // Create the new user
        const newUser = await AdminModel.create({ name, email, mobile, role });

        // Initialize the email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Check if the transporter is set up correctly
        await transporter.verify();

        // Generate the reset link
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/set-admin-password/${newUser._id}`;

        // Email options
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Set Your Password',
            html: `
                <p>Hello ${name},</p>
                <p>Your account has been created with the role of <strong>${role}</strong>.</p>
                <p>Please <a href="${resetLink}">set your password</a> to activate your account.</p>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        // Respond to the client
        res.status(201).json({
            message: 'User created and email sent!',
            user: newUser,
        });
    } catch (error) {
        console.error('Error in addUser:', error);

        // Handle specific error cases
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data provided', error: error.message });
        }

        if (error.response) {
            console.error('Email sending error:', error.response);
            return res.status(500).json({ message: 'Error sending email', error: error.response });
        }

        res.status(500).json({ message: 'Error adding user', error: error.message });
    }
};

// Set a new password for a user
export const setPassword = async (req, res) => {
    const { userId } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    try {
        const user = await AdminModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if password is already set
        if (user.isPasswordSet) {
            return res.status(400).json({ message: 'Password is already set for this user.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.isPasswordSet = true; // Mark password as set
        await user.save();

        res.status(200).json({ message: 'Password set successfully' });
    } catch (error) {
        console.error('Error in setPassword:', error);
        res.status(500).json({ message: 'Error setting password', error });
    }
};


// Get all users (only accessible to admin)
export const getUsers = async (req, res) => {
    try {
        // if (req.user.role !== 'Admin') {
        //     return res.status(403).json({ message: 'Forbidden: admin access required.' });
        // }
        const users = await AdminModel.find();
        console.log(users);
        
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Update user
export const updateUser = async (req, res) => {


    let { id } = req.params;
    // console.log(id);
    if (id===undefined) {
        id=req.userId;
    }
    const { name, email, mobile, role } = req.body;
       console.log(req.body);
       console.log(id);
       
       try {
           const updateData = { name, email, mobile, role };
           
           const updatedUser = await AdminModel.findByIdAndUpdate(
               id,
               updateData,
               { new: true, runValidators: true }
            );
            
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            console.log(mobile)
            
        res.status(200).json({ message: 'User updated', user: updatedUser , success: true });
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await AdminModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};


//get login user details
export async function userDetails(request,response){
    try {
        const userId  = request.userId

        console.log(userId)

        const user = await AdminModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message : 'user details',
            data : user,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : "Something is wrong",
            error : true,
            success : false
        })
    }
}