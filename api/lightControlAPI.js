import { spawn } from 'child_process'
import fs from 'fs'

export function switchLights(action, actions, lights){
    console.log(`new status: ${action.status}`)
    let process = spawn('python', ['./scripts/switch_lights.py', action.status]);
    
    process.on('close', (code) => {
        console.log(`python code exited with code: ${code}`)

        if (action.mode === 'one-shot') {
            action.cancel()
            actions.splice(actions.indexOf(action), 1)
        }

        if (code !== 0) {
            dumpError(action, lights)
            return
        }

        lights.status = action.status === 'ON'
    })
}

export function quickToggle(res, lights){
    let newStatus = lights.status ? 'OFF' : 'ON'
    console.log(`new status: ${newStatus}`)
    let process = spawn('python', ['./scripts/switch_lights.py', newStatus]);

    process.on('close', (code) => {
        console.log(`python code exited with code: ${code}`)

        if (code !== 0) {
            res.send('quick toggle failed')
            dumpError({time: new Date(), mode: 'quick-toggle', newStatus: newStatus}, lights)
            return
        }

        lights.status = !lights.status

        res.redirect('/home')
    })
}

function dumpError(action, lights){
    let dump = {action: action, lights: lights} 
    fs.appendFile('./errorDumps.txt', `${JSON.stringify(dump)},\n`, (err) => {if (err) console.log(err)})
}
