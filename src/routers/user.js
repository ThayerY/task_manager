const express = require('express')
const router = new express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
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
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })

  } catch (e) {
    res.status(400).send(e.message)
  }
})

// logout user
router.post('/users/logout', auth, async (req, res) => {
  try {
    // req.user.tokens = req.user.tokens.filter(token => {
    //   return token.token !== req.token
    req.user.tokens = req.user.tokens.filter(current_token => {
      return current_token.token !== req.token
    })
    await req.user.save()
    res.status(200).send('Successfully logout')
  } catch (e) {
    res.status(400).send(e.message)
  }
})

// getting your profile
router.get('/users/me', auth, async (req, res) => {
  res.status(200).send(req.user)
})

// updatting a user
router.patch('/users/me', auth, async (req, res) => {
  // pulling out the keys
  const updates = Object.keys(req.body)
  // fields that allows to updates
  const update_fields = ['name', 'email', 'password', 'age']
  // will return True if everything went right and False if something went wrong
  const validate_update = updates.every(update => update_fields.includes(update))

  if (!validate_update) return res.status(400).send({ msg: 'Invalid update' })

  try {
    updates.forEach(update => req.user[update] = req.body[update])
    // saving the user to database
    await req.user.save()
    res.status(200).send(req.user)
  } catch (e) {
    res.status(500).send(e.message)
  }
})

// deletting user
router.delete('/users/me', auth, async (req, res) => {

  try {
    await req.user.remove()
    res.status(200).send(req.user)
  } catch (e) {
    res.status(500).send(e)
  }
})

// uploading files and images
const upload = multer({
  limits: { fileSize: 4000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/.(jpg|jpeg|png)$/)) {
      return (cb(new Error('Invalid extenstion')))
    }
    cb(null, true)
  }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    // const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    // const buffer = await sharp(req.file.buffer).png()//.toBuffer()
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send('Successfully uploaded')
  } catch (e) {
    res.send(e.message)
  }
}, (err, req, res, next) => res.status(400).send({ error: err.message }))

// Deletting the avatar 
router.delete('/users/me/avatar', auth, async (req, res) => {
  try {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send('Successfully deleted')
  } catch (e) {
    res.send(e.message)
  }
})

// Getting user image
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
      throw new Error('there is no user or user avatar')
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(404).send(e.message)
  }
})

module.exports = router