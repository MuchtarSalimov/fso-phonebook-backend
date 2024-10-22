
const errorHandler = (error, request, response, next) => {
  // const status = error.status || 500;
  // const message = status === 500 ? 'Server Error' : error.message

  // return response.status(error.status).send({
  //   message: error.message
  // })

  if (error.name ==='CastError') {
    console.error(error.message)
    return response.status(400).send({ error: 'malformatted id'})
  }

  next(error)
}

const genericErrorHandler = (error, request, response, next) => {
  console.error(error.message)
  const status = error.status || 500;
  const message = status === 500 ? 'Server Error' : error.message

  return response.status(error.status).send({
    message: message
  })
}

module.exports = {
  errorHandler,
  genericErrorHandler,
}