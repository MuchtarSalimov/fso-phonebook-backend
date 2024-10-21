// run
// node mongo.js yourpassword "Anna Bork" 040-1234556
// prints
// added Anna number 040-1234556 to phonebook

// if run
// node mongo.js yourpassword
// prints
// phonebook:
// Anna 040-1234556
// Arto Vihavainen 045-1232456
// Ada Lovelace 040-1231236

const commandLineArgs = require('node:process').argv
const mongoose = require('mongoose')

const password = commandLineArgs[2]

const url = `mongodb+srv://muchtarsalimov:${password}@cluster0.4doem.mongodb.net/phonebookDB?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
}, { collection: 'persons'})

const Person = mongoose.model('Person', personSchema)

if ( commandLineArgs.length < 4 ) {
  // print
  console.log('phonebook')
  Person.find({}).then(result => {
    result.forEach(note => {
      console.log(`${note.name} ${note.number}`)
    })
    mongoose.connection.close()
  })

} else {
  // save
  const person = new Person({
    id: (Math.random()*100000).toFixed(0),
    name: commandLineArgs[3],
    number: commandLineArgs[4]
  })

  person.save().then(result => {
    console.log(`added ${commandLineArgs[3]} number ${commandLineArgs[4]} to phonebook`)
    mongoose.connection.close()
  })
}


