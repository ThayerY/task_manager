const express = require('express')
const router = new express.Router()
const mongoose = require('mongoose')
const auth = require('../middleware/auth')
const Task = require('../models/task')
const User = require('../models/user')

// creating a Task
router.post('/tasks', auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, owner: req.user._id })
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e.message)
  }
})

// getting all tasks
router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}
  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(req.query.limit) || null,
        skip: parseInt(req.query.skip) || null,
        sort
      }
    })
    res.status(200).send(req.user.tasks)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

// getting task by ID
router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    if (!task) return res.status(404).send()
    res.status(200).send(task)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

// updatting Task
router.patch('/tasks/:id', auth, async (req, res) => {
  updates = Object.keys(req.body)
  const fields_updates = ['description', 'completed']
  const validate_update = updates.every(update => fields_updates.includes(update))
  if (!validate_update) return res.status(400).send({ msg: 'Invalid Update' })

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    if (!task) return res.status(400).send({ msg: 'Invalid Update' })
    updates.forEach(update => task[update] = req.body[update])
    await task.save()
    res.status(200).send(task)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

// Delete Task
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const delete_task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    if (!delete_task) return res.status(400).send(`There is no Task found`)

    // if everything went well
    res.status(200).send('Deleted Successfully')
  } catch (e) {
    res.status(500).send(e.message)
  }
})





module.exports = router