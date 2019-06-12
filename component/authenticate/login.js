const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)
const fs = require(`fs`)
const _ = require(`lodash`)
// const path = require(`path`)

const db = require('../../config/db/dbConn')
const apiResponse = require(`../../helper/formatResponse`)
const errorCode = require(`../../config/errorCode/errorCode`)
const genericErrorRes = require(`../../utils/errorResponse`).errorResponse

class Login {
  generateAccessToken (password, hash, userId) {
    return new Promise((resolve, reject) => {
      // bcrypt compare generated hash and password
      bcrypt.compare(password, hash)
        .then(function (result) {
          if (!result) {
            // function broke, throw error
            const errorResponse = {
              code: `ERR_002`,
              message: errorCode.ERR_002
            }
            reject(apiResponse.errorFormat(`fail`, errorCode.ERR_002, {}, [errorResponse], 401))
          } else {
            // jwt payload
            const payload = { userId }

            // private key to generate jwt authToken
            const privateKey = fs.readFileSync(`${__basedir}/config/keys/private.key`, `utf8`)

            // signature options
            const signOptions = {
              expiresIn: '1h',
              algorithm: 'RS256'
            }

            // create a token
            var authToken = jwt.sign(payload, privateKey, signOptions)
            resolve({ authToken, userId })
          }
        })
        .catch(function () {
          // function broke, throw error
          const errorResponse = {
            code: `ERR_001`,
            message: errorCode.ERR_001
          }
          reject(apiResponse.errorFormat(`fail`, errorCode.ERR_001, {}, [errorResponse], 500))
        })
    })
  }

  async getLoginData(userid){
    return new Promise((resolve, reject) => {
      db.sequelize.query(`CALL SP_Userdata( :_USERID)`,
      {
        replacements: {
          _USERID: userid
        },
        type: db.Sequelize.QueryTypes.SELECT
      })
      .then(response => {
        // console.log('response', response)
         console.log(`sp response ${JSON.stringify(response)}`)
         console.log('hi')
         console.log(response[0]['0'])
         const Details = response[0]['0']
         let responseObj = {}
         _.forOwn(response[0]['0'], (value, key) => {
          console.log(`key ${key}`)
          console.log(`value ${value}`)
          responseObj[key] = value
         })
         console.log(`responseObj ${JSON.stringify(responseObj)}`)
         resolve({ responseObj })
      })
      .catch(() => {
        // console.log(`er ${error}`)
        // console.log(`sp error ${JSON.stringify(error)}`)
        const errorObj = {
          code: `err_001`,
          message: errorCode.err_001
        }
        reject(apiResponse.errorFormat(`fail`, errorCode.ERR_001, {}, [errorResponse], 500))
      })
    })
  }


  async getUserData (username) {
    const userExist = await db.users
      .findOne({
        where: {
          email_id: username
        },
        attributes: { exclude: ['email_id', 'mobile_no', 'created_by', 'created_on', 'updated_by', 'ba_details_verification', 'action_by', 'action_on', 'updated_on'] }
      })
    console.log('details', userExist)

    const userData = (!_.isEmpty(userExist)) ? { userId: userExist.user_id, password: userExist.password, status: userExist.status, baId: userExist.ba_id } : {}
    return userData
  }

    
    async addTokenInDB (userId, token) {
    // register user
    let user = await db.users.update(
      { auth_token: token },
      { where: {
        user_id: userId
      } }
    )
    let dataObj = {
      authToken: token,
      userId: userId
    }
    return (dataObj)
  }


  async userApps (userId) {
    try {
      let newUserApp = await db.userApps.findAll({
        where: {
          user_id: userId
        },
        attributes: { exclude: ['id', 'user_id', 'created_by', 'updated_by', 'created_on', 'updated_on', 'status'] }
      })
      console.log('newUser', newUserApp)
      return newUserApp
    } catch (error) {
      console.log(error)
      console.log(`error ${JSON.stringify(error)}`)
      let Eresponse = genericErrorRes(error)
      return Eresponse
    }
  }
}


const login = async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const loginCls = new Login()

  try {
    // check if user exist and get the userId
    const userData = await loginCls.getUserData(username)

    if (!_.isEmpty(userData) && userData.status && userData.status === 'active') {
      // get the token generated
      const responseData = await loginCls.generateAccessToken(password, userData.password, userData.userId)
      let userId = responseData.userId
      let authToken = responseData.authToken
      console.log('userid', userId, authToken)
      // Add token in the database

      const tokenUpdate = await loginCls.addTokenInDB(userId, authToken)

      // user accessed apps

      const apps = await loginCls.userApps(userId)

      const userdetail= await loginCls.getLoginData(userId)
      
      console.log(userdetail)
      //  user details  

      let resObj = {
        token: tokenUpdate,
        userApps: apps,
        userdata:userdetail
      }
      // send success response
      res.status(200).send(apiResponse.successFormat(`success`, `login successful`, resObj, []))
    } else if (!_.isEmpty(userData) && userData.status && userData.status === 'inactive') {
      // throw error if no account inactive
      const errorResponse = {
        code: `ERR_003`,
        message: errorCode.ERR_003
      }

      throw (apiResponse.errorFormat(`fail`, errorCode.ERR_003, {}, [errorResponse], 401))
    } else {
      // throw error if no account exists
      const errorResponse = {
        code: `ERR_002`,
        message: errorCode.ERR_002
      }

      throw (apiResponse.errorFormat(`fail`, errorCode.ERR_002, {}, [errorResponse], 401))
    }
  } catch (error) {
    console.log(`error ${JSON.stringify(error)}`)
    let errorResponse = genericErrorRes(error)
    let code = (Object.prototype.hasOwnProperty.call(error, 'status')) ? error.code : 500
    res.status(code).send(errorResponse)
  }
}


module.exports = { login }
