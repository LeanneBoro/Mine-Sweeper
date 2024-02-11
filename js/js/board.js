'use strict'

const gLevel = { SIZE: 4, MINES: 2 }
const MINE = '<img src="img/images.png">'

function buildBoard() {

    const board = []

    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: '',
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}
function setMineNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            const count = findMineNegs(board, i, j)
            board[i][j].minesAroundCount = count
        }
    }
}
function findMineNegs(board, rowIdx, colIdx) {
    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine === true) count++
        }
    }
    return count
}

function addMines(row, col) {
    var isFound
    const indexes = []

    for (var i = 0; i < gLevel.MINES; i++) {

        while (!isFound) {
            var randI = getRandomInt(0, gLevel.SIZE)
            var randJ = getRandomInt(0, gLevel.SIZE)
            if (randI !== row && randJ !== col) {
                if (!gBoard[randI][randJ].isMine) {
                    gBoard[randI][randJ].isMine = true
                    isFound = true
                }
            }
        }
        isFound = false
    }
}
function startTimer() {
    if (gTimerInterval) clearInterval(gTimerInterval)

    const startTime = Date.now()
    gTimerInterval = setInterval(() => {
        const timeDiff = Date.now() - startTime
        const seconds = getFormatSeconds(timeDiff)
        const milliSeconds = getFormatMilliSeconds(timeDiff)
        document.querySelector('span.seconds').innerText = seconds
        document.querySelector('span.milli-seconds').innerText = milliSeconds
    }, 10)
}
function getFormatSeconds(timeDiff) {
    const seconds = Math.floor(timeDiff / 1000)
    return (seconds + '').padStart(2, '0')
}

function getFormatMilliSeconds(timeDiff) {
    const milliSeconds = new Date(timeDiff).getMilliseconds()
    return (milliSeconds + '').padStart(3, '0')
}
