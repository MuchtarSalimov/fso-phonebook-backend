require('dotenv').config()
const process = require('node:process')
const mongoose = require('mongoose')

const mongoUrl = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(mongoUrl)

const personSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 1,
    required: true,
  },
}, { collection: 'persons' })

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

const getAllPersons = () => Person.find({})

const getPersonById = (givenId) => Person.findOne({ _id: givenId })

const addPerson = (newPerson) => {
  return Person.findOneAndUpdate({ name: newPerson.name }, { name: newPerson.name, number: newPerson.number }, { upsert: true, new: true, runValidators: true, context: 'query' })
}

const deletePersonById = (givenId) => {
 return Person.deleteOne({ _id: givenId })
}

module.exports = {
  getAllPersons,
  getPersonById,
  addPerson,
  deletePersonById,
}