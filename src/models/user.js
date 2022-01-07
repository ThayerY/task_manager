const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true,
    min: 1,
    max: 20,
    validate: (n => { if (n !== 'string') throw new Error('invalid Name') })
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
  }
})

module.exports = User