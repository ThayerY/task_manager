const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    min: 1,
    max: 20,
    // validate: (n => { if (n !== 'string') throw new Error('invalid Name') })
  },

  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validate: (v => {
      if (v.toLowerCase().includes('password')) throw new Error('invalid Password')
    })
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: (val => {
      if (!validator.isEmail(val)) throw new Error('Email is invalid')
    })
  },
  createdAt: {
    type: Date,
    default: () => Date.now()
  },
  age: {
    type: Number,
    default: 1,
    validate: (val => {
      if (val <= 0) throw new Error('Age must be a postive number')
    })
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

// this is how to connect the user with tasks
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})

// hidding private data
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

// authontakation user
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'thisisjwt')
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

// login user
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error('Unable to login')

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new Error('Unable to login')

  return user
}

// hashing the password with bcryptjs
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password'))
    user.password = await bcrypt.hash(user.password, 8)
  next()
})

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
  const user = this
  await Task.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User