const express = require('express')
const router = new express.Router()
const User = require('../models/user')

// creating a user
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.status(201).send(user)
  } catch (e) { res.status(400).send(e) }
})

// getting all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.status(200).send(users)
  } catch (e) {
    res.status(500).send(e)
  }
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
    // updating the user with findByIdAndUpdate method
    const update_user = await User.findByIdAndUpdate({ _id }, req.body, { new: true })
    // checking if the update_user is not exist
    if (!update_user) return res.status(400).send({ err: `invalid Update` })
    // saving the update_user to database
    await update_user.save()
    res.status(200).send(update_user)
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