const express = require('express')
let persons = require('./data.json')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))

morgan.token('person', (req, res) => Object.keys(req.body).length !== 0 ? JSON.stringify(req.body) : null)
app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['person'](req, res)
    ].join(' ')
  }))


app.use(express.json())

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.send(person)
    } else {
        response.status(400).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    people = persons.filter(person => person.id !== id)
    response.status(204).end()
}) 

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: String(Math.floor(Math.random() * 100)),
        name: body.name,
        number: String(body.number)
    }

    persons = persons.concat(person)
    response.json(person) 
})




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})