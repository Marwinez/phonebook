const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url).then(() => {
  console.log('connected to MongoDB')
})
  .catch(error => {
    console.log('error connecting to MongoDB: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [ 3, 'Name must have at least 3 characters' ],
    required: [ true, 'Person name is required' ]
  },
  number: {
    type: String,
    minLength: [ 8, 'Phone number must have at least 8 characters' ],
    validate: {
      validator: function(number) {
        return /^\d{2,3}-\d{5,}$/gm.test(number)
      },
      message: 'Number must match structure: 2-3 numbers, '-' sign, at least 5 more numbers\nexamples: 12-345678, 123-45678'
    },
    required: [ true, 'Phone number is required' ]
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)