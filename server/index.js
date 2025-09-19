require("dotenv").config()
const express = require("express")
const cors = require("cors") 
const dbConnection = require("./DB/connectDB")
const userRouter = require("./routes/user-router")
const reportRouter = require("./routes/report-router") 
const path = require("path")
const fs = require("fs")
const multer = require("multer") 
const removedUnverifiedData = require("./authomation/removedUnverifiedData")
const stateAdminRouter = require("./routes/state-admin-router")

const app = express()

const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

//Database connection
dbConnection()

//Middleware
app.use(cors()) 
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

//removing all the unverified users every 60 minutes
removedUnverifiedData()

app.use("/uploads", express.static("uploads"))

// Routes
app.use("/api/v1/auth", userRouter)
app.use("/api/v1/reports", reportRouter) 
app.use("/api/v1/state-admin", stateAdminRouter)

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully",
    timestamp: new Date().toISOString(),
  })
})

app.use((error, req, res, next) => {
  console.error("Global Error:", error)

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 10MB.",
      })
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Too many files. Maximum 2 files allowed.",
      })
    }
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : "Something went wrong",
  })
})



const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
