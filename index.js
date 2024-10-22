const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const { errorHandler, genericErrorHandler } = require('./middleware/error-middleware')
const personService = require('./personService')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(express.urlencoded({ extended: true }))

morgan.token('body', (req) => { return req.method === 'POST'? JSON.stringify(req.body) : null})

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

app.get('/', (request, response) => {
  response.redirect('/index.html')
})

app.get('/api/persons', (request, response, next) => {
  personService
    .getAllPersons()
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', async (request, response, next) => {
  personService
    .getPersonById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).send({ error: 'id not found' })
      } else {
        return response.json(person)
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', async (request, response, next) => {
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
    })
    .then(result => response.status(201).send(result))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', async (request, response, next) => {
  personService.deletePersonById(request.params.id)
    .then(() => {
      return response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const date = new Date(Date.now())
  personService
    .find({})
    .then(persons => {
      response.send(`Phonebook has info for ${ persons.length } people <br/> ${date.toString()}`)
    })
    .catch(error => next(error))
})

// error handling middleware. goes last
app.use(errorHandler)
app.use(genericErrorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})