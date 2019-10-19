let fetchAndUpdate = async () => {
    let response = await fetch('/messages')
    let responseBody = await response.text()
    let parsed = JSON.parse(responseBody)
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
}
fetchAndUpdate()
setInterval(fetchAndUpdate, 500) 