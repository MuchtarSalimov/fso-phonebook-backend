const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const personService = require('./personService')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(express.urlencoded({ extended: true }))

morgan.token('body', (req, res) => { return req.method === 'POST'? JSON.stringify(req.body) : null})

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res),
  ].join(' ')
}))

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
  response.redirect('/index.html')
})

app.get('/api/persons', (request, response) => {
  personService.getAllPersons().then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', async (request, response) => {
  const person = await personService.getPersonById(request.params.id)
    if (!person) {
      return response.status(404).send({ error: 'id not found' })
    } else {
      return response.json(person)
    }
})

app.post('/api/persons', async (request, response) => {
  if (!request.body.name) {
    return response.status(400).send({ error: 'name missing' })
  }
  if (!request.body.number) {
    return response.status(400).send({ error: 'number missing' })
  }
  // if(persons.find(person=>person.name === request.body.name)) {
  //   return response.status(409).send({ error: 'name must be unique' })
  // }

  personService
    .addPerson({
      name: request.body.name,
      number: request.body.number
    }).
    then((result)=>response.status(201).send(result))
})

app.delete('/api/persons/:id', async (request, response) => {
  console.log(request.params)
  personService.deletePersonById(request.params.id)
  .then(result => {
    if ( result.deletedCount === 0 ) {
      return response.status(204).end()
    } else {
      return response.status(204).end()
    }
  })
  .catch(err=> response.status(500).end())
})

app.get('/info', (request, response) => {
  const date = new Date(Date.now())
  Person.find({}).then(persons => {
    response.send(`Phonebook has info for ${ persons.length } people <br/> ${date.toString()}`)
  })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})