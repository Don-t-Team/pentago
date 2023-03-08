// const rotationNoEffect = (rotateSectionIdx) => (

// )

const format = (object, formatter) => {
    return formatter(object)
}

const rotationNoEffectMessage = (sectionIdx) => (
    `Rotation has no effect on block ${sectionIdx}.`
)

const nextPhaseMessage = (nextColor, action) => {
    let formattedNextColor = format(nextColor, () => (nextColor.split('').map((char, index) => 
        index === 0 ? char.toUpperCase() : char
    ).join('')))

    let formattedAction = format(action, () => (action + 's'))
    
    return `${formattedNextColor} ${formattedAction} next.`
}

const reportLastActionMessage = (lastColor, action) => {
    
}

export { rotationNoEffectMessage, nextPhaseMessage }