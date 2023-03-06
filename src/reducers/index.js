import configAttributes from '../config/attributes'

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
    { color: "white", isOccupied: false }
)

const createInitialMoves = () => {
    return Array(2).fill(true).map(() => [])
}

const initialState = {
    board: createInitialBoard(),
    moves: createInitialMoves(),
    phase: 0,
    nextColor: 'black',
    winnerColor: null,
    haveAWinner: false,
    lastRotateDirection: null,
    lastRotateSectionIdx: null,
    showUndoButton: false,
    modalOpen: false,
    modalMessage: '',
    undo: false,
    modalOpen: false,
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
                winnerColor: newWinner
            }
        }

        case 'UPDATE PHASE': {
            const newPhase = action.phase
            return {
                ...state,
                curPhase: newPhase
            }
        }
        case 'TOGGLE MODAL OPEN': {
            return {
                ...state,
                modalOpen: !state.modalOpen
            }
        }
        case 'UPDATE MODAL MESSAGE': {
            const newModalMessage = action.modalMessage
            return {
                ...state,
                modalMessage: newModalMessage
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
        case 'UPDATE MESSAGE CENTER': {
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
            return {...initialState}
        }
    }
}

export { reducer, initialState }