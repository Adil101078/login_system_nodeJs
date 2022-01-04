class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
    this.message = message
    this.isOperatinal = true
    Error.captureStackTrace(this, this.constructor)
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
  statusCode=200,
  msg = 'Success',
  data = {},
  token,
  result = 1,
}) => {
  res.status(statusCode).send({ result,msg, data, token })
}

export { ErrorHandler, handleError, handleResponse }
