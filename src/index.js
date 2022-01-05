const express = require('express')
const mongoose = require('mongoose')
const { MongoClient, ObjectId } = require("mongodb")
require('dotenv').config()

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// connecting the database
mongoose.connect(process.env.DATABASE_URL)

// intializing the app
const app = express()
const port = process.env.PORT || 3000

// parsing incoming json to an object
app.use(express.json())

// register the userRouter
app.use(userRouter)

// register the taskRouter
app.use(taskRouter)


app.listen(port, () => console.log(`Server is up on port ${port}`))