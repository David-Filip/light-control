import express from 'express'
import { Action } from './api/action.js'
import { quickToggle } from './api/lightControlAPI.js'

const app = new express()

app.use(express.urlencoded( {extended: false}))
app.use(express.static('./static'))
app.set('view engine', 'ejs');
app.set('views', './pages')

const actions = []
let lights = {status: false}

app.get('/', (req, res) => {
    res.redirect('/home')
})

app.get('/home', (req, res) =>{
    res.render('home.ejs', {actions, lightsOn: lights.status})
})

app.post('/schedule', (req, res) =>{
    let action = new Action(req.body['new-status'], req.body['mode'], req.body['time'])
    action.schedule(actions, lights)
    actions.push(action)
    res.redirect('/home')
})

app.post('/toggle', (req, res) => {
    quickToggle(res, lights)
})

app.post('/delete', (req, res) =>{
    console.log(req.query.index)
    actions[req.query.index].cancel()
    actions.splice(req.query.index, 1)
    res.redirect('/home')
})

const hostname = '127.0.0.1'
const port = 3000
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})