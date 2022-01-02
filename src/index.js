const express = require('express')
const mongoose = require('mongoose')
const { MongoClient, ObjectId } = require("mongodb")
require('dotenv').config()
// require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

//Set up default mongoose connection
// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api')
mongoose.connect(process.env.DATABASE_URL)

// intializing the app
const app = express()
const port = process.env.PORT || 3000

// parsing incoming json to an object
app.use(express.json())


// creating a user
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.status(201).send(user)
  } catch (e) { res.status(400).send(e) }
})

// creating a Task
app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body)
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// getting all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).send(users)
  } catch (e) {
    res.status(500).send(e)
  }
})

// getting user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const _id = req.params.id
    // checking if the id is valid id
    if (!mongoose.isValidObjectId(_id)) return res.status(404).send({ err: 'invalid id' })

    const userId = await User.findById(_id)
    if (!userId) return res.status(404).send()
    res.status(200).send(userId)
  } catch (e) {
    res.status(500).send(e)
  }
})

// getting all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.status(200).send(tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

// getting task by ID
app.get('/tasks/:id', async (req, res) => {
  try {
    const _id = req.params.id
    // checking if the id is a valid id
    if (!mongoose.isValidObjectId(_id)) return res.status(404).send({ err: 'invalid id' })

    const taskId = await Task.findById(_id)
    if (!taskId) return res.status(404).send()
    res.status(200).send(taskId)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.listen(port, () => console.log(`Server is up on port ${port}`))