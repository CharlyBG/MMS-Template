const root = document.getElementById('online-players'),
motd = document.getElementById('motd'),
updateTime = root.getAttribute('data-update-time'),
ipServer = root.getAttribute('data-server-ip'),
portServer = root.getAttribute('data-server-port')

const errorMSG = (err) => {
    if (err == 'offline') {
        root.innerHTML = 'The server is offline :('
        console.error('The server is offline :(');
    } else if (err == 'lost') {
        root.innerHTML = 'Could not connect with https://mcapi.us'
        console.error('Could not connect with https://mcapi.us');
    }
}

const showData = data => {

    const totalSpan = document.getElementById('total'),
        onlineSpan = document.getElementById('online')

    totalSpan.innerText = data.players.max
    onlineSpan.innerText = data.players.now
    motd.innerHTML = `<span>${ data.motd }</span><br>`
}

const infoServer = () => {

    let request = new XMLHttpRequest()

    request.open("GET", `https://mcapi.us/server/status?ip=${ ipServer }&port=${ portServer }`, true)
    request.send()

    request.onreadystatechange = () => {

        if (request.status == 200 && request.readyState == 4) {
            
            let data = JSON.parse(request.responseText)

            root.innerHTML = `<span id="online"></span> / <span id="total"></span>`

            if (data.online) {
                showData(data)
            } else {
                errorMSG('offline')
            }
            
        } else {
            errorMSG('lost')
            clearInterval(run)
        }

    }
}

let run = setInterval(() => { infoServer() }, updateTime)

const copyIP = () => prompt("IP:", `${ ipServer }`)

const darkModeToggler = document.getElementById('toggle-dark'),
    body = document.body

darkModeToggler.addEventListener('click', e => {
    e.preventDefault()
    body.classList.toggle('dark-mode')
    console.log('toggled')
})