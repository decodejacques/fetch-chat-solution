let express = require("express")
let app = express()
let cookieParser = require('cookie-parser')
let multer = require("multer")
let upload = multer()
app.use(cookieParser())
let passwordsAssoc = {}
let sessions = {}
let messages = []
let usernameColor = {}
app.use('/static', express.static(__dirname + '/public'))
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
})
app.post("/messages", upload.none(), (req, res) => {
  console.log('POST messages body', req.body)
  let newMessage = {
    user: sessions[req.cookies["sid"]],
    msg: req.body.message
  }
  messages.push(newMessage)
  res.sendFile(__dirname + '/public/chat.html')
})
app.get("/messages", (req, res) => {
  console.log('Sending back the messages')
  res.send(JSON.stringify({ msgs: messages, colors: usernameColor }))
})
app.post("/signup", upload.none(), (req, res) => {
  let username = req.body.username
  let password = req.body.password
  passwordsAssoc[username] = password
  res.send("<html><body> signup successful </body></html>")
})
app.post("/login", upload.none(), (req, res) => {
  let username = req.body.username
  let passwordGiven = req.body.password
  let expectedPassword = passwordsAssoc[username]
  if (expectedPassword !== passwordGiven) {
    res.send("<html><body> invalid username or password </body></html>")
    return
  }
  let sid = Math.floor(Math.random() * 10000000)
  sessions[sid] = username
  res.cookie('sid', sid)
  res.sendFile(__dirname + '/public/chat.html')
})
app.post("/change-username", upload.none(), (req, res) => {
  console.log('Changing username', req.body)

  let oldUsername = sessions[req.cookies["sid"]]
  let newUsername = req.body["new-name"]

  if (passwordsAssoc[newUsername] !== undefined) {
    res.sendFile(__dirname + '/public/chat.html')
    return
  }

  // change the username in the passwordsAssoc object
  let password = passwordsAssoc[oldUsername]
  passwordsAssoc[newUsername] = password
  // delete the property from the passwordsAssoc object
  // `passwordsAssoc[oldUsername] = undefined` could also work
  delete passwordsAssoc[oldUsername]

  // change the usernames in the sessions object
  let sessionIds = Object.keys(sessions)
  sessionIds.forEach(sid => {
    if (sessions[sid] === oldUsername) {
      sessions[sid] = newUsername
    }
  })

  messages.forEach(msg => {
    if (msg.user === oldUsername) {
      msg.user = newUsername
    }
  })

  res.sendFile(__dirname + '/public/chat.html')
})

app.post('/color-pink', (req, res) => {
  console.log("changing to pink")
  let username = sessions[req.cookies["sid"]]
  usernameColor[username] = "pink"
  res.sendFile(__dirname + '/public/chat.html')
})

app.post('/color-black', (req, res) => {
  console.log("changing to black")
  let username = sessions[req.cookies["sid"]]
  usernameColor[username] = "black"
  res.sendFile(__dirname + '/public/chat.html')
})

app.post('/color-red', (req, res) => {
  console.log("changing to red")
  let username = sessions[req.cookies["sid"]]
  usernameColor[username] = "red"
  res.sendFile(__dirname + '/public/chat.html')
})

app.listen(4000) 