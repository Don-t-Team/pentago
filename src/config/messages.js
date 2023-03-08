// const rotationNoEffect = (rotateSectionIdx) => (

// )

const format = (object, formatter) => {
    return formatter(object)
}

const rotationNoEffectMessage = (sectionIdx) => (
    `Rotation is not applicable on block ${sectionIdx}.`
)

const nextPhaseMessage = (nextColor, action) => {
    let formattedNextColor = format(nextColor, () => (nextColor.split('').map((char, index) => 
        index === 0 ? char.toUpperCase() : char
    ).join('')))

    let formattedAction = format(action, () => (action + 's'))
    
    return `${formattedNextColor} ${formattedAction} next.`
}

const reportLastActionMessage = (lastColor, action, sectionIdx) => {
    let formattedLastColor = format(lastColor, () => (lastColor.split('').map((char, index) => {
        if (index === 0 )
            return char.toUpperCase()
        return char 
    }).join('')))

    const formattedLastAction = format(action, () => (
        action[action.length - 1] === 'e' ? action + 'd' : action + 'ed'
    ))  

    return `${formattedLastColor} ${formattedLastAction} block ${sectionIdx}.`
}

const reportUndoMessage = (lastColor, action) => {
    const formattedLastColor = format(lastColor, () => (lastColor.split('').map((char, index) => 
        index === 0 ? char.toUpperCase() : char
    ).join('')) ) 

    return `${formattedLastColor} undo ${action}. Click on a new cell.`
}


// const getNextActionMessage = (nextColor, nextAction) => {
//     const formattedNextColor = format(nextColor, () => (nextColor.split('').map((char, index) => 
//         index === 0 ? char.toUpperCase() : char
//     ).join('')))
//     const formattedNextAction = format(nextAction, () => (nextAction + "s"))

//     return 
// }

export { rotationNoEffectMessage, nextPhaseMessage, reportLastActionMessage, reportUndoMessage }