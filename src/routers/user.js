const express = require('express')
const router = new express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const auth = require('../middleware/auth')

// creating a user
router.post('/users', async (req, res) => {
  // checking if the user is already in database
  const user_exist = await User.findOne({ email: req.body.email })
  if (user_exist) return res.status(400).send(`Email is already exist`)

  try {
    const user = new User(req.body)
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (e) { res.status(400).send(e.message) }
})

// login user
router.post('/users/login', async (req, res) => {
  try {
    const login_user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await login_user.generateAuthToken()
    res.send({ login_user, token })

  } catch (e) {
    res.status(400).send(e)
  }
})

// getting your profile
router.get('/users/me', auth, async (req, res) => {
  res.status(200).send(req.user)
})

// getting user by ID
router.get('/users/:id', async (req, res) => {
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

// updatting a user
router.patch('/users/:id', async (req, res) => {
  // pulling out the id
  const _id = req.params.id
  // checking if the id is a valid id
  if (!mongoose.isValidObjectId(_id)) return res.status(400).send({ err: `invalid id: [${_id}]` })

  // pulling out the keys
  const updates = Object.keys(req.body)
  // fields that allows to updates
  const update_fields = ['name', 'email', 'password', 'age']
  // will return True if everything went right and False if something went wrong
  const validate_update = updates.every(update => update_fields.includes(update))

  if (!validate_update) return res.status(400).send({ msg: 'Invalid update' })

  try {
    const user = await User.findById(req.params.id)
    updates.forEach(update => user[update] = req.body[update])

    if (!user) return res.status(400).send({ err: `invalid Update` })
    // saving the user to database
    await user.save()
    res.status(200).send(user)
  } catch (e) {
    res.status(500).send(e)
  }
})

// deletting user
router.delete('/users/:id', async (req, res) => {
  const _id = req.params.id
  if (!mongoose.isValidObjectId(_id)) return res.status(400).send({ err: `invalid id: ${_id}` })
  try {
    const delete_user = await User.findByIdAndDelete({ _id })
    if (!delete_user) return res.status(400).send({ msg: `there is no ${delete_user}` })
    res.status(204).send({ msg: `The ${delete_user} with id: ${_id} has been deleted from the database` })
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router