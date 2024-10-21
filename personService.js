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
}, { collection: 'persons'})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject.id.toString(),
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

const getAllPersons = () => Person.find({})

const getPersonById = (givenId) => Person.findOne({ id: givenId })

const addPerson = (newPerson) => {
  const person = new Person({
    id: (Math.random()*100000).toFixed(0),
    name: newPerson.name,
    number: newPerson.number
  })

  return person.save()
}

module.exports = {
  getAllPersons,
  getPersonById,
  addPerson,
}