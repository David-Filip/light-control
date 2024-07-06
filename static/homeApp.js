let modeSelection
let timeInput

function main(){
    modeSelection = document.getElementById('mode_selection')
    timeInput = document.getElementById('time_input')
    modeSelection.onchange = setTimeInputType

    setTimeInputType()
}

function setTimeInputType(){
    let selectedMode = modeSelection.value
    if (selectedMode === 'daily'){
        timeInput.type = 'time'
    }
    else if (selectedMode === 'one-shot'){
        timeInput.type = 'datetime-local'
    }
}

main()