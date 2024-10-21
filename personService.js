require('dotenv').config()
const process = require('node:process')
const mongoose = require('mongoose')

const mongoUrl = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(mongoUrl)

const personSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
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

const getPersonById = (givenId) => Person.findOne({ id: givenId })

const addPerson = (newPerson) => {
  const person = new Person({
    name: newPerson.name,
    number: newPerson.number
  })

  return person.save()
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