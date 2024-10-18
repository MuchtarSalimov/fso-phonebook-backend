const express = require('express')
const app = express()

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  const date = new Date(Date.now())
  response.send(`Phonebook has info for ${ persons.length } people <br/> ${date.toString()}`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find(entry=> entry.id === request.params.id)
  if ( !person ) {
    return response.status(404).send({ error: 'id not found' })
  }
  return response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const person = persons.find(entry=> entry.id === request.params.id)
  if ( !person ) {
    return response.status(204).send({ error: 'id not found' })
  }
  persons = persons.filter(entry=>entry.id !== request.params.id)
  return response.status(200).json(person)
})

app.get('/info', (request, response) => {
  const date = new Date(Date.now())
  response.send(`Phonebook has info for ${ persons.length } people <br/> ${date.toString()}`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})