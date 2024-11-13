require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('postData', (req) => JSON.stringify(req.body))

app.use(
  morgan((tokens, req, res) => {
    const format =
      req.method === 'POST'
        ? ':method :url :status :res[content-length] - :response-time ms :postData'
        : ':method :url :status :res[content-length] - :response-time ms'
    return morgan.compile(format)(tokens, req, res)
  })
)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malFormatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}

const internalServerError = (error, request, response, next) => {
  console.error(error.message)

  // Respond with 500 status code for any error
  response.status(500).send({ error: 'Internal Server Error' })
  next(error)
}

app.get('/api/persons', async (req, res, next) => {
  try {
    const persons = await Person.find({})
    res.status(200).json(persons)
  } catch (err) {
    next(err)
  }
})

app.get('/api/persons/:id', async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)
    if (person) {
      res.status(200).json(person)
    } else {
      res.status(404).send({ error: 'person not found' })
    }
  } catch (err) {
    next(err)
  }
})

app.get('/info', async (req, res, next) => {
  try {
    const count = await Person.countDocuments({})
    const info = `<div>
      <p>PhoneBook has info for ${count} people</p>
      <p>${new Date()}</p>
    </div>`
    res.status(200).send(info)
  } catch (err) {
    next(err)
  }
})

app.post('/api/persons', async (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' })
  }

  try {
    const existingPerson = await Person.findOne({ name })
    if (existingPerson) {
      return res.status(409).json({ error: 'Name must be unique' })
    }

    const person = new Person({ name, number })
    const savedPerson = await person.save()
    res.status(201).json(savedPerson)
  } catch (err) {
    next(err)
  }
})

app.put('/api/persons/:id', async (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return errorHandler((error) => next(error))
  }

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )

    if (updatedPerson) {
      res.json(updatedPerson)
    } else {
      res.status(404).send({ error: 'person not found' })
    }
  } catch (err) {
    next(err)
  }
})

app.delete('/api/persons/:id', async (req, res, next) => {
  try {
    await Person.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

app.use(errorHandler)
app.use(internalServerError)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
