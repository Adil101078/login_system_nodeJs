class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

const handleError = (err, res) => {
  const { statusCode, message } = err
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  })
}
const handleResponse = ({
  res,
  statusCode = 200,
  msg = 'Success',
  data = {},
  token,
  result = 1,
}) => {
  res.status(statusCode).send({ result, msg, data, token })
}

export { ErrorHandler, handleError, handleResponse }
