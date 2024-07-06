import { switchLights } from './lightControlAPI.js'
import { v1 as uuid } from 'uuid'
import schedule from 'node-schedule'


export class Action {
    constructor(status, mode, time){
        if (Action.isValidStatus(status)){
            throw Error(`invalid state: ${status}`)
        }
        
        time.replace('%3A', ':')
        if (mode === 'daily'){
            this.time = Action.getTime(time)
            if (!Action.isValidTime(this.time)){
                throw Error(`invalid time: ${this.time.hour}:${this.time.minute}`)
            }
            this.timeString = time
        }
        else if (mode === 'one-shot'){
            this.time = new Date(time)
            if (!Action.isValidDate(this.time)){
                throw Error(`invalid date: ${this.time}`)
            }
            this.timeString = Action.formatDate(this.time)
        }
        else{
            throw Error(`invalid mode ${mode}`)
        }

        this.status = status
        this.mode = mode
        this.id = uuid()
    }

    static isValidStatus(s){
        return s !== 'ON' && s !== 'OFF'
    }

    static isValidDate(d){
        return d instanceof Date && !isNaN(d) && d > new Date();
    }
    
    static getTime(t){
        let time = t.split(':')
        return {hour: time[0], minute: time[1]}
    }

    static isValidTime(t){
        return t.hour < 24 && t.hour >= 0 && t.minute >= 0 && t.minute < 60
    }
    
    static formatDate(d){
        return `${(d.getMonth()+1).toString().padStart('2', '0')}/${d.getDate().toString().padStart('2', '0')}/${d.getFullYear()} ${d.getHours().toString().padStart('2', '0')}:${d.getMinutes().toString().padStart('2', '0')}`
    }

    schedule(actions, lights){
        this.job = schedule.scheduleJob(this.time, () => { switchLights(this, actions, lights) })
    }

    cancel(){
        this.job.cancel()
    }
}

