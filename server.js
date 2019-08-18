const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser')
const fs = require('fs')
const events = require('./db/events.json')

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API.'
  })
})

// 此一口需經verifyToken中介
app.get('/dashboard', verifyToken,(req, res) => {

  // the_secret_key是你加密的key 透過jwt進行驗證key
  jwt.verify(req.token, 'the_secret_key', err => {
    // 有錯誤就噴錯
    if (err) {
      res.sendStatus(401)
    } else {
    // 沒錯誤就返回events
      res.json({
        events: events
      })
    }
  })
})

app.post('/register', (req, res) => {
  if (req.body) {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
      // In a production app, you'll want to encrypt the password
    }

    const data = JSON.stringify(user, null, 2)
    var dbUserEmail = require('./db/user.json').email
    // 宣告錯誤陣列準備送出
    var errorsToSend = [] // array to collect errors
    // 如果dbuser跟送來的依樣
      if (dbUserEmail === user.email) { // check to see if email already exists in db
        // 推入已經存在的email
        errorsToSend.push('An account with this email already exists.')
      }
      // 密碼長度小於5也要擋
      if (user.password.length < 5) { // validate password is in correct format
        errorsToSend.push('Password too short.')
      }
      // 只要errors陣列大於０就要傳送400
      if (errorsToSend.length > 0) { // check if there are any errors
        // 並帶入errors陣列
        res.status(400).json({ errors: errorsToSend }) // send errors back with status code
      } else {
        // 如果沒有就寫入user.json代表登入成功
      fs.writeFile('./db/user.json', data, err => {
        if (err) {
          console.log(err + data)
        } else {
          // 寫入成功 並註冊這個user用secretkey加密
          const token = jwt.sign({ user }, 'the_secret_key')
          // In a production app, you'll want the secret key to be an environment variable
          // 把這token給他 下次他會帶著這token進入
          res.json({
            token,
            email: user.email,
            name: user.name
          })
        }
      })
    }
  } else {
    res.sendStatus(400)
  }
})

app.post('/login', (req, res) => {
  const userDB = fs.readFileSync('./db/user.json') // reading db
  const userInfo = JSON.parse(userDB)
  if ( // 判斷user資料是否相同
    req.body &&
    req.body.email === userInfo.email &&
    req.body.password === userInfo.password
  ) {
    // 相同就產生token給他 他會拿著token存取資料
    const token = jwt.sign({ userInfo }, 'the_secret_key')
    res.json({
      token,
      email: userInfo.email,
      name: userInfo.name
    })
  } else {
    res.status(401).json({ error: 'Invalid login. Please try again.'}) // send error if credentials don't match record
  }
})

// 中介認證Token
function verifyToken (req, res, next) {
  // 取得header的authorization
  const bearerHeader = req.headers['authorization']

  // 檢查header有沒有authorization
  if (typeof bearerHeader !== 'undefined') {
    // 切開bearer 實際為 bearer xxxxxxxToken
    const bearer = bearerHeader.split(' ')
    // 取Token
    const bearerToken = bearer[1]
    // 把req.token設為Token
    req.token = bearerToken
    // 進行下一步囉
    next()
  } else {
    // 如果沒有header authorization 返回401
    res.sendStatus(401)
  }
}

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
