import {prisma} from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {sendEmail} from "../utils/email.js";
//Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("EMAIL FROM REQUEST:", email);
    // Check if user already exists
    const existingUser = await prisma.User.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    console.log("GENERATED TOKEN:", verificationToken);

    // Create user
    const user = await prisma.User.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isVerified: false,
        verificationToken,
      },
    });
    const verificationLink =
  `http://localhost:5173/verify-email/${verificationToken}`;

await sendEmail(
  email,
  "Verify your PizzaDelivery account",
  `Hello ${name},

Thank you for registering with PizzaDelivery!

Please click the link below to verify your email address:

${verificationLink}

If you did not create this account, you can ignore this email.

Thank you,
PizzaDelivery Team`
);

    res.status(201).json({
      message:
        "User created successfully. Please check your email to verify your account.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
};
// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log("TOKEN RECEIVED FROM URL:", token)

    if (!token) {
      return res.status(400).json({
        message: "Verification token is required.",
      });
    }

    const user = await prisma.User.findFirst({
      where: {
        verificationToken: token,
      },
    });
    console.log("USER FOUND:", user)

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification token.",
      });
    }

    // Already verified
    if (user.isVerified) {
      return res.status(200).json({
        message: "Email is already verified.",
      });
    }

    // Verify user
    const updatedUser = await prisma.User.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    res.status(200).json({
      message: "Email verified successfully.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);

    res.status(500).json({
      message: "Error verifying email.",
      error: error.message,
    });
  }
};
//Login
export const loginUser =async(req, res)=>{
    try{
        const {email,password}=req.body;
        const user= await prisma.User.findUnique({
            where:{email}
        })
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"})
        }
        if(!user.isVerified){
          return res.status(403).json({
            message:"please verify your email before logging in."
          })
        }
        const token= jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.json({message: "Login successful", token,
          user:{
            id:user.id,
            name:user.name,
            email:user.email,
            isAdmin: user.isAdmin,
          }
        }
        )
    } catch (error) {
        res.status(500).json({message: "Error logging in", error})
    }

}
// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    // Find user
    const user = await prisma.User.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token expires in 15 minutes
    const resetTokenExpiresAt = new Date(
      Date.now() + 15 * 60 * 1000
    );

    // Save reset token in database
    await prisma.User.update({
      where: {
        id: user.id,
      },
      data: {
        resetToken,
        resetTokenExpiresAt,
      },
    });

    // Reset password link
    const resetLink =
      `http://localhost:5173/reset-password/${resetToken}`;

    // Send email
    await sendEmail(
      email,
      "Reset your PizzaDelivery password",
      `Hello ${user.name},

We received a request to reset your PizzaDelivery account password.

Please click the link below to reset your password:

${resetLink}

This link will expire in 15 minutes.

If you did not request a password reset, you can ignore this email.

Thank you,
PizzaDelivery Team`
    );

    res.status(200).json({
      message:
        "Password reset link has been sent to your email.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    res.status(500).json({
      message: "Error processing forgot password request.",
      error: error.message,
    });
  }
};
// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Reset token is required.",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "New password is required.",
      });
    }

    // Find user using reset token
    const user = await prisma.User.findFirst({
      where: {
        resetToken: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token.",
      });
    }

    // Check token expiration
    if (
      !user.resetTokenExpiresAt ||
      user.resetTokenExpiresAt < new Date()
    ) {
      return res.status(400).json({
        message: "Reset token has expired.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    const updatedUser = await prisma.User.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null,
      },
    });

    res.status(200).json({
      message: "Password reset successfully.",
    });

  } catch (error) {
    console.error("Reset password error:", error);

    res.status(500).json({
      message: "Error resetting password.",
      error: error.message,
    });
  }
};
export default {registerUser, loginUser,forgotPassword,resetPassword};