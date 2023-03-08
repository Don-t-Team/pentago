import configAttributes from "../config/attributes"

const num_sections = configAttributes.num_sections
const num_rows = configAttributes.num_rows / 2
const num_cols = configAttributes.num_columns / 2
const num_colors = 3
const colors = ['black', 'white', configAttributes.cellBackground]

const createTestBoard = () => {
    const createInitalSection = (sectionIdx) => {
        const section = Array(configAttributes.num_rows / 2).fill(Array(configAttributes.num_columns / 2).fill(createInitialCell()))
        const initialSection = section.map((row, rowIdx) => row.map((cell, colIdx) => {
            let color = colors[Math.floor(Math.random(randomColors))]
            if (blackColorsOccupied - whiteColorsOccupied > 1) {
                color = 'white'
            }
            else {
                color = 'black'
            }

            if (sectionIdx === randomSections[sectionIdx] && rowIdx === randomRows[rowIdx] && colIdx === randomCols[colIdx]) {
                if (color === 'black') blackColorsOccupied++
                if (color === 'white') whiteColorsOccupied++
                return {...cell, section: sectionIdx, row: rowIdx, column: colIdx, color: color}
            }
            return {...cell, section: sectionIdx, row: rowIdx, column: colIdx}
        }))
        return initialSection
    }

    let randomSections = Array(num_sections).fill().map(() => Math.floor(Math.random() * num_sections))
    let randomRows = Array(num_rows).fill().map(() => Math.floor(Math.random() * num_rows))
    let randomCols = Array(num_cols).fill().map(() => Math.floor(Math.random() * num_cols))
    let randomColors = Array(num_colors).fill().map(() => Math.floor(Math.random() * num_colors))

    randomSections = Object.fromEntries(randomSections.map((section, _) => [section, section]))
    randomRows = Object.fromEntries(randomRows.map((row, _) => [row, row]))
    randomCols = Object.fromEntries(randomCols.map((col, _) => [col, col]))

    let blackColorsOccupied = 1
    let whiteColorsOccupied = 0

    const sectionsIdx = Array(configAttributes.num_sections).fill().map((_, index) => index)
    const initialBoard = sectionsIdx.map((idx, _) => createInitalSection(idx))

    return initialBoard
}

const createInitialCell = () => (
    { color: configAttributes.cellBackground, isOccupied: false }
)


const tests = Array(5).fill().map(() => createTestBoard())

export default tests