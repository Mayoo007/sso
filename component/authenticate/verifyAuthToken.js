const jwt = require(`jsonwebtoken`)
const fs = require(`fs`)
const _ = require(`lodash`)

const apiResponse = require(`../../helper/formatResponse`)

const apiFn = (req, res, next) => {
  try {
    // console.log(`headers`, req.headers)
    const authToken = req.headers.authtoken
    const verifyOptions = {
      expiresIn: '1h',
      algorithm: ['RS256']
    }

    // public key to generate jwt authToken
    const publicKey = fs.readFileSync(`${__basedir}/config/keys/public.key`, `utf8`)

    const legit = jwt.verify(authToken, publicKey, verifyOptions)
    // console.log(`legit ${JSON.stringify(legit)}`)

    const passedUserId = (req.body && req.body.userId) ? req.body.userId : (req.headers.userid) ? req.headers.userid : ''

    // console.log(`passedUserId ${passedUserId}`)

    if (legit.userId === passedUserId) {
      res.status(200).send(apiResponse.successFormat(`success`, `Vaild AuthToken`, {}, []))
    } else {
      throw new Error()
    }
  } catch (error) {
    // console.log(`error ${error}`)
    let errorResponse = {}
    if (error.name === 'TokenExpiredError') {
      errorResponse = apiResponse.errorFormat(`fail`, `Token Expired`, {}, [], 401)
    } else if (error.name === 'JsonWebTokenError') {
      errorResponse = apiResponse.errorFormat(`fail`, `Invalid Token`, {}, [], 401)
    } else {
      errorResponse = apiResponse.errorFormat(`fail`, `Authentication Failed`, {}, [], 401)
    }

    errorResponse = _.omit(errorResponse, ['code'])
    res.status(401).send(errorResponse)
  }
}

module.exports = { apiFn }
