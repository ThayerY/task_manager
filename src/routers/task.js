const express = require('express')
const router = new express.Router()
const mongoose = require('mongoose')
const Task = require('../models/task')

// creating a Task
router.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body)
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// getting all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.status(200).send(tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

// getting task by ID
router.get('/tasks/:id', async (req, res) => {
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

// updatting Task
router.patch('/tasks/:id', async (req, res) => {
  // pulling out the id
  const _id = req.params.id
  // checking if it is a valid id
  if (!mongoose.isValidObjectId(_id)) return res.status(400).send({ err: `invalid id: [${_id}]` })

  // pulling out the keys
  updates = Object.keys(req.body)

  // fields that allowed to updates
  const fields_updates = ['description', 'completed']
  // will return True if everything went right and False if something went wrong
  const validate_update = updates.every(update => fields_updates.includes(update))
  // checking if validate_update is true
  if (!validate_update) return res.status(400).send({ msg: 'Invalid Update' })

  try {
    // pulling out the id
    const task = await Task.findById(req.params.id)
    // iderate over the updates keys
    updates.forEach(update => task[update] = req.body[update])
    // checking if the task is true
    if (!task) return res.status(400).send({ msg: 'Invalid Update' })
    // if everything went right then we gunna save the update task
    const save_task = await task.save()
    res.status(200).send(save_task)
  } catch (e) {
    res.status(500).send(e)
  }
})

// Delete Task
router.delete('/tasks/:id', async (req, res) => {
  // pulling out the id
  const _id = req.params.id
  // checking if the id is a valid id
  if (!mongoose.isValidObjectId(_id)) return res.status(400).send({ msg: `` })
  try {
    const delete_task = await Task.findByIdAndDelete({ _id })
    if (!delete_task) return res.status(400).send()

    // if everything went well
    res.status(200).send(delete_task)
  } catch (e) {
    res.status(500).send(e)
  }
})





module.exports = router