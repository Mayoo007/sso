const successFormat = (status, message, data, error) => {
  return {
    status,
    message,
    data,
    error
  }
}

const errorFormat = (status, message, data, error, code = 400) => {
  return {
    status,
    message,
    data,
    error,
    code
  }
}

module.exports = { successFormat, errorFormat }
