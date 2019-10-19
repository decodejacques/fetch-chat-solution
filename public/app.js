let loadChatPage = () => {
    let body = document.querySelector('body')

    // I removed the forms relating to changing the text color,
    // changing your username and ignore a user.
    // Try it add them back to make sure
    // you really understand this solution

    body.innerHTML =
        `<html>

<head>
  <style>
    .two-column {
      display: flex
    }
  </style>
</head>

<body>
  <div class="two-column">
    <div>
      <div id="main-topic"></div>
      <ul id="msg-list"></ul>

      <form id="message-form">
        File
        <input id="message-file" type="file" />
        Message
        <input id="message-text" type="text"></input>
        <input type="submit"></input>
      </form>
   

    </div>
    <div id="active-users" />
  </div>
</body>

</html>`


    let messageForm = document.getElementById("message-form")
    // Perform an action when the form is submitted
    messageForm.addEventListener('submit', ev => {
        // stop the page from reloading
        ev.preventDefault()
        // prepare the HTTP request body
        let data = new FormData()
        // You can find these ids in chat.html
        let msgText = document.getElementById("message-text").value
        let file = document.getElementById("message-file").files[0]
        data.append("message", msgText)
        data.append("img", file)
        fetch('/messages', { method: "POST", body: data })
    })

}

let fetchAndUpdate = async () => {
    let response = await fetch('/messages')
    let responseBody = await response.text()
    let parsed = JSON.parse(responseBody)
    document.getElementById("main-topic").innerText = parsed.topic
    let messages = parsed.msgs
    let userColors = parsed.colors
    let msgListUL = document.getElementById('msg-list')
    msgListUL.innerHTML = ""
    messages.forEach(elem => {
        // Default color is black
        let usernameColor = "black"
        if (userColors[elem.user] !== undefined) {
            // The user has explicitly set their username color
            usernameColor = userColors[elem.user]
        }
        let li = document.createElement("li")
        // User the style property to change the color
        li.style.color = usernameColor
        li.innerText = elem.user + ": " + elem.msg
        msgListUL.append(li)
        if (elem.imgPath) {
            let imgli = document.createElement("li")
            // quick hack so we don't have to go through the whole DOM node creation process
            imgli.innerHTML = '<img height="100px" src="' + elem.imgPath + '"/>'
            msgListUL.append(imgli)
        }
    })
    let activeUsersDiv = document.getElementById("active-users")
    // clear the active users div from chat.html
    activeUsersDiv.innerHTML = ""
    // add all the users from the activeusers property of the response
    // see what is sent back from the /messages endpoint
    parsed.active.forEach(username => {
        let userDiv = document.createElement("div")
        userDiv.innerText = username
        activeUsersDiv.append(userDiv)
    })
}




let signupForm = document.getElementById('signup-form')
signupForm.addEventListener('submit', async ev => {
    ev.preventDefault()
    let formData = new FormData()
    formData.append('username', document.getElementById('signup-username').value)
    formData.append('password', document.getElementById('signup-password').value)
    let responseObject = await fetch('/signup', { method: "POST", body: formData })
    let responseBody = await responseObject.text()
    let parsedBody = JSON.parse(responseBody)
    if (parsedBody.success) {
        alert("signup successful")
    } else {
        alert("signup failed")
    }
})

let loginForm = document.getElementById('login-form')
loginForm.addEventListener('submit', async ev => {
    ev.preventDefault()
    let formData = new FormData()
    formData.append('username', document.getElementById('signup-username').value)
    formData.append('password', document.getElementById('signup-password').value)
    let responseObject = await fetch('/login', { method: "POST", body: formData })
    let responseBody = await responseObject.text()
    let parsedBody = JSON.parse(responseBody)
    if (parsedBody.success) {
        loadChatPage()
        fetchAndUpdate()
        setInterval(fetchAndUpdate, 500)
    } else {
        alert("invalid login")
    }
})
