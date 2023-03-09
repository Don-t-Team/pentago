import configAttributes from '../config/attributes'
import testBoards from '../tests'

const getStartColorAndMoves = (board) => {
    const calcOccupiedCellsByColor = (color) => (
        board.reduce((sum, section, sectionIdx) => {
            const sectionSum = section.reduce((sum, row, rowIdx) => {
                const rowSum = row.reduce((sum, cell, colIdx) => {
                    if (cell['color'] === color) {
                        const player = cell['color'] === 'black' ? 0 : 1    
                        moves[player].push([sectionIdx, rowIdx, colIdx])
                        return sum + 1
                    }
                    return sum
                }, 0)
                return sum + rowSum
            }, 0)
            return sum + sectionSum
        }, 0)
    )
    const moves = createInitialMoves()
    const blackColorsOccupied = calcOccupiedCellsByColor('black')
    const whiteColorsOccupied = calcOccupiedCellsByColor('white')

    return [blackColorsOccupied >= whiteColorsOccupied ? 'black' : 'white', moves]
}

const createInitialBoard = () => {
    const createInitalSection = (sectionIdx) => {
        const section = Array(configAttributes.num_rows / 2).fill(Array(configAttributes.num_columns / 2).fill(createInitialCell()))
        const initialSection = section.map((row, rowIdx) => row.map((col, colIdx) => {
            return {...section[rowIdx][colIdx], section: sectionIdx, row: rowIdx, column: colIdx}
        }))
        return initialSection
    }

    const sectionsIdx = Array(configAttributes.num_sections).fill().map((_, index) => index)
    const initialBoard = sectionsIdx.map((idx, _) => createInitalSection(idx))

    return initialBoard
}

const createInitialCell = () => (
    { color: configAttributes.cellBackground, isOccupied: false }
)

const createInitialMoves = () => {
    return Array(2).fill(true).map(() => [])
}

const testBoard = testBoards[0]
const [startPlayer, startMoves] = getStartColorAndMoves(testBoard)

const initialState = {
    // board: createInitialBoard(),
    board: testBoard,
    // moves: createInitialMoves(),
    moves: startMoves,
    phase: 0,
    nextColor: startPlayer,
    winnerColor: null,
    haveAWinner: false,
    haveADraw: false,
    lastRotateDirection: null,
    lastRotateSectionIdx: null,
    showUndoButton: false,
    modalOpen: false,
    modalMessage: "",
    undo: false,
    modalOpen: false,
    topMessage: ` ${startPlayer} clicks next`,
}

const reducer = (state, action) => {
    switch(action.type) {
        case 'UPDATE BOARD': {
            const newBoard = action.board
            return {
                ...state,
                board: newBoard
            }
        }
        case 'UPDATE MOVES': {
            const newMoves = action.moves
            return {
                ...state,
                moves: newMoves
            }
        }
        case "UPDATE STATE AFTER PHASE": {
            const newStateKeys = Object.keys(action.newState)
            const newState = {...state}
            newStateKeys.forEach((key) => {
                newState[key] = action.newState[key]
            })
            return newState
        }
        case "UPDATE WINNER": {
            const newWinner = action.winnerColor
            return {
                ...state,
                haveAWinner: true,
                winnerColor: newWinner,
            }
        }
        case 'UPDATE DRAW': {
            return {
                ...state,
                haveADraw: true,
                topMessage: "Draw"
            }
        }
        case 'UPDATE PHASE': {
            const newPhase = action.phase
            return {
                ...state,
                curPhase: newPhase
            }
        }

        case 'UPDATE MODAL' : {
            const { modalOpen, modalMessage } = action
            return {
                ...state,
                modalOpen: modalOpen != null ? modalOpen : state.modalOpen,
                modalMessage: modalMessage != null ? modalMessage : state.modalMessage
            }
        }

        case 'UPDATE NEXT COLOR': {
            const newNextColor = action.nextColor
            return {
                ...state,
                nextColor: newNextColor
            }
        }
        case 'TOGGLE UNDO BUTTON': {
            return {
                ...state,
                showUndoButton: !state.showUndoButton
            }
        }
        case 'UPDATE LAST ROTATE DIRECTION': {
            const newLastRotateDirection = action.lastRotateDirection
            return {
                ...state,
                lastRotateDirection: newLastRotateDirection
            }
        }
        case 'UPDATE LAST ROTATE SECTION INDEX': {
            const newLastRotateSectionIdx = action.lastRotateSectionIdx
            return {
                ...state,
                lastRotateSectionIdx: newLastRotateSectionIdx
            }
        }
        case 'UPDATE TOP MESSAGE': {
            const newModalOpen = action.modalOpen
            const newModalMessage = action.modalMessage
            return {
                ...state,
                modalOpen: newModalOpen,
                modalMessage: newModalMessage
            }
        }
        case 'UPDATE STATE AFTER MODAL CLICK': {
            const { nextColor, modalOpen, modalMessage } = action.newState
            return {
                ...state,
                nextColor: nextColor,
                modalOpen: modalOpen,
                modalMessage: modalMessage
            }
        }
        case 'RESET GAME': {
            return {
                ...initialState,
                board: createInitialBoard(),
                moves: createInitialMoves()
            }
        }
    }
}

export { reducer, initialState }