const User = require("../model/user-Model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sendEmail = require("../utils/sendEmail")
const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) // Declare the client variable

//registration
const registration = async (req, res) => {
  const {
    fullname,
    email,
    password,
    gender,
    fathername,
    phone,
    dateOfBirth,
    District,
    tehsil,
    villageName,
    address,
    pincode,
  } = req.body

  const existingEmail = await User.findOne({
    email,
    accountVerified: true,
  })

  if (existingEmail) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
    })
  }
  const userPhone = await User.findOne({
    phone,
    accountVerified: true,
  })

  if (userPhone) {
    return res.status(400).json({
      success: false,
      message: "Phone number already registered",
    })
  }

  const registerationAttemptsByUser = await User.find({
    $or: [
      { phone, accountVerified: false },
      { email, accountVerified: false },
    ],
  })
  if (registerationAttemptsByUser.length > 5) {
    return res.status(429).json({
      success: false,
      message: "You have exceeded the maximum number of attempts (5). Please try again after 1 hour.",
    })
  }

  const hashPassword = await bcrypt.hash(password, 10)

  const newUser = User({
    fullname,
    fathername,
    phone,
    dateOfBirth,
    District,
    tehsil,
    villageName,
    address,
    gender,
    pincode,
    email,
    password: hashPassword,
  })
  await newUser.save()

  //otp generation
  const verificationcode = Math.floor(100000 + Math.random() * 900000)
  newUser.verificationCode = verificationcode
  newUser.verificationCodeExpire = Date.now() + 10 * 60 * 1000 // 1 hour
  //otp save into user schema
  await newUser.save()
  const verificationMethod = newUser.verificationMethod

  //otp send to user
  sendVerificationCode(verificationMethod, verificationcode, email, phone, res)
}

async function sendVerificationCode(verificationMethod, verificationCode, email, phone, res) {
  try {
    if (verificationMethod === "email") {
      const message = generateEmailTemplate(verificationCode)
      sendEmail({ email, subject: "Your Verification Code", message })
      res.status(200).json({
        success: true,
        message: "verification code send successfully to your email",
      })
    } else if (verificationMethod === "text_message") {
      await client.messages.create({
        body: `Your verification code is ${verificationCode}.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      })
      res.status(200).json({
        success: true,
        message: `OTP sent.`,
      })
    } else if (verificationMethod === "phone") {
      const verificationCodeWithSpace = verificationCode.toString().split("").join(" ")
      await client.calls.create({
        twiml: `<Response><Say>Your verification code is ${verificationCodeWithSpace}. Your verification code is ${verificationCodeWithSpace}.</Say></Response>`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      })
      res.status(200).json({
        success: true,
        message: `Calling....`,
      })
    } else {
      return res.status(500).json({
        success: false,
        message: "Invalid verification methods",
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "verification code failed to send",
    })
  }
}

function generateEmailTemplate(verificationCode) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #4CAF50; text-align: center;">Jharkhand Civic Portal - Email Verification</h2>
      <p style="font-size: 16px; color: #333;">Dear User,</p>
      <p style="font-size: 16px; color: #333;">Your One-Time Password (OTP) for verifying your email address is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
          ${verificationCode}
        </span>
      </div>
      <p style="font-size: 16px; color: #333;">Please use this OTP to verify your email address. The code will expire in 10 minutes.</p>
      <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>Ministry of Social Justice & Empowerment(MoSJE) Team</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>`
}

//otp verification
const verifyOtp = async (req, res) => {
  try {
    const { email, verificationCode } = req.body

    if (!email || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // checking for Already verified
    if (user.accountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already verified",
      })
    }

    // checking for otp Expired
    if (!user.verificationCodeExpire || user.verificationCodeExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Verification code expired",
      })
    }

    // Code mismatch
    if (String(user.verificationCode) !== String(verificationCode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      })
    }

    // Mark verified and clear otp fields
    user.accountVerified = true
    user.verificationCode = undefined
    user.verificationCodeExpire = undefined
    await user.save()

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("verifyOtp error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password, phone } = req.body
    if (!phone) {
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and Password are required",
        })
      }
      const user = await User.findOne({ email, accountVerified: true })
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found or not verified",
        })
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password)
      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        })
      }

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          fullname: user.fullname,
          fathername: user.fathername,
          dateOfBirth: user.dateOfBirth,
          email: user.email,
          phone: user.phone,
          address: user.address,
          District: user.District,
          pincode: user.pincode,
          villageName: user.villageName,
          tehsil: user.tehsil,
          department: user.department,
          assignedDistrict: user.assignedDistrict,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE },
      )

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
      })
    }
    if (!email) {
      if (!phone || !password) {
        return res.status(400).json({
          success: false,
          message: "Phone and Password are required",
        })
      }
      const user = await User.findOne({ phone, accountVerified: true })
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found or not verified",
        })
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password)
      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        })
      }

      const token = jwt.sign(
        {
          id: user._id,
          role: user.role,
          fullname: user.fullname,
          fathername: user.fathername,
          dateOfBirth: user.dateOfBirth,
          email: user.email,
          phone: user.phone,
          address: user.address,
          District: user.District,
          pincode: user.pincode,
          villageName: user.villageName,
          tehsil: user.tehsil,
          department: user.department,
          assignedDistrict: user.assignedDistrict,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE },
      )

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Login failed due to server error",
    })
  }
}

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      })
    }
    const user = await User.findOne({ email, accountVerified: true })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or not verified",
      })
    }

    //otp generation
    const verificationcode = Math.floor(100000 + Math.random() * 900000)
    user.verificationCode = verificationcode
    user.verificationCodeExpire = Date.now() + 10 * 60 * 1000 // 10 minutes
    //otp save into user schema
    await user.save()

    //otp send to user
    const message = generateEmailTemplate(verificationcode)
    sendEmail({ email, subject: "Your Verification Code", message })

    //generate jwt token for reset password
    const token = jwt.sign(
      {
        id: user._id,
        villageName: user.villageName,
        tehsil: user.tehsil,
        department: user.department,
        assignedDistrict: user.assignedDistrict,
      },
      process.env.JWT_SECRET,
      { expiresIn: 10 * 60 },
    )

    res.status(200).json({
      success: true,
      message: "verification code send successfully to your email",
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}

//verify otp for forget password
const forgetPasswordVerification = async (req, res) => {
  try {
    const { verificationCode } = req.body
    const userId = req.userInfo.id
    if (!verificationCode) {
      return res.status(400).json({
        success: false,
        message: "Verification code is required",
      })
    }
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // checking for otp Expired
    if (!user.verificationCodeExpire || user.verificationCodeExpire < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Verification code expired",
      })
    }

    // Code mismatch
    if (String(user.verificationCode) !== String(verificationCode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      })
    }

    // Mark verified and clear otp fields
    user.verificationCode = undefined
    user.verificationCodeExpire = undefined
    await user.save()

    const token = jwt.sign(
      {
        id: user._id,
        villageName: user.villageName,
        tehsil: user.tehsil,
        department: user.department,
        assignedDistrict: user.assignedDistrict,
      },
      process.env.JWT_SECRET,
      { expiresIn: 10 * 60 },
    )

    return res.status(200).json({
      success: true,
      message: "Verification code matched",
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password are required",
      })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      })
    }

    const userId = req.userInfo.id
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const hashPassword = await bcrypt.hash(newPassword, 10)
    user.password = hashPassword
    await user.save()

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
}

module.exports = {
  registration,
  verifyOtp,
  login,
  forgetPassword,
  forgetPasswordVerification,
  resetPassword,
}
