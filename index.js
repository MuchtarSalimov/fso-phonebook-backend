const express = require('express')
var morgan = require('morgan')

const app = express()

app.use(express.json());
app.use(express.urlencoded());
app.use(morgan('tiny'))

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

app.post('/api/persons', (request, response) => {
  if (!request.body.name) {
    return response.status(400).send({ error: 'name missing' })
  }
  if (!request.body.number) {
    return response.status(400).send({ error: 'number missing' })
  }
  if(persons.find(person=>person.name === request.body.name)) {
    return response.status(409).send({ error: 'name must be unique' })
  }

  const newData = {
    id: (Math.random()*100000).toFixed(0),
    name: request.body.name,
    number: request.body.number
  }
  persons.push(newData)

  return response.status(201).send(newData)
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