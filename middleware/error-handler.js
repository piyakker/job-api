// const { CustomAPIError } = require('../errors')
const { StatusCodes, INTERNAL_SERVER_ERROR } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'something went wrong, try again later'
  }
  
  // if (err instanceof CustomAPIError) {
    //   return res.status(err.statusCode).json({ msg: err.message })
    // }
  if (err.code && err.code === 11000) {
    customError.statusCode = StatusCodes.BAD_REQUEST,
    customError.msg = `Duplicated value entered for ${Object.keys(err.keyValue)}, please choose another value!`
  }

  if (err.name ==='ValidationError') {
    customError.statusCode = StatusCodes.BAD_REQUEST,
    customError.msg = Object.values(err.errors).map(item => item.message).join(',')
  }

  if (err.name ==='CastError') {
    customError.statusCode = StatusCodes.NOT_FOUND,
    customError.msg = `No item found with ID ${err.value}`
  }

  // return res.status(customError.statusCode).json(err)
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
