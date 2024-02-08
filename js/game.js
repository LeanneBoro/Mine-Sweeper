'use strict'

var gBoard
const gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }
const SMILEY = '😆'
const SAD = '😭'
const VICTORY = '😎'
const FLAG = '🚩'
const HINTOFF = '💡'
const HINTON = '🚨'
// var gLives

var gSafeClicks
var gIsHint
var gHintCount
var gManualMode
var gManualHap
var gMineIdx
var gExterminated
var gMegaHint
var megaIdx
var gTimerInterval
var gIsDarkMode

function onInit() {
    clearInterval(gTimerInterval)
    gExterminated = false
    gManualMode = false
    gSafeClicks = 3
    gHintCount = 3
    gIsHint = false
    gMegaHint = false
    megaIdx = []
    gIsDarkMode = false
    // gLives = 3
    // document.querySelector('.life').innerHTML = gLives
    gGame.isOn = false
    gBoard = buildBoard()
    renderBoard(gBoard)
    document.querySelector('.smiley').innerHTML = SMILEY
    document.querySelector('.bulb').innerHTML = HINTOFF
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            strHTML += `<td data-i="${i}" data-j="${j}" class="hidden" onclick="onCellClicked(this)" 
            oncontextmenu="onCellMarked(this,event)"></td>`
        }
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function setGameLevel(level) {
    if (level === 4) {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    } else if (level === 8) {
        gLevel.SIZE = 8
        gLevel.MINES = 14
    } else if (level === 12) {
        gLevel.SIZE = 12
        gLevel.MINES = 32
    }
    onInit()
}
function onCellMarked(elCell, eve) {
    eve.preventDefault()
    const rowIdx = +elCell.dataset.i
    const colIdx = +elCell.dataset.j
    if (gBoard[rowIdx][colIdx].isShown) return
    if (!gBoard[rowIdx][colIdx].isMarked) {
        gBoard[rowIdx][colIdx].isMarked = true
        elCell.innerHTML = FLAG
    } else {
        gBoard[rowIdx][colIdx].isMarked = false
        elCell.innerHTML = " "
    }
}
function onCellClicked(elCell) {
    if (checkWin()) {
        document.querySelector('.smiley').innerHTML = VICTORY
        gManualHap = false
    }
    if (gIsHint) {
        showHint(elCell)
        return
    }
    if (gManualMode) {
        findMinesManualIdx(elCell)
        return
    }
    if (gMegaHint) {
        onMegaHint(elCell)
        return
    }
    const rowIdx = +elCell.dataset.i
    const colIdx = +elCell.dataset.j
    if (!gGame.isOn) {
        gGame.isOn = true
        startTimer()
        if (gManualHap) {
            setMinesManual()
        } else {
            // gBoard[0][2].isMine = true
            // gBoard[1][3].isMine = true
            addMines(rowIdx, colIdx)
        }
        setMineNegsCount(gBoard)
        gBoard[rowIdx][colIdx].isShown = true
        elCell.classList.remove('hidden')
        if (!gBoard[rowIdx][colIdx].minesAroundCount) elCell.innerHTML = " "
        else elCell.innerHTML = gBoard[rowIdx][colIdx].minesAroundCount
    }
    if (gBoard[rowIdx][colIdx].isMine) {
        elCell.innerHTML = MINE
        elCell.classList.remove('hidden')
        gBoard[rowIdx][colIdx].isShown = true
        handelMine()
    } else {
        gBoard[rowIdx][colIdx].isShown = true
        if (!gBoard[rowIdx][colIdx].minesAroundCount) elCell.innerHTML = " "
        else elCell.innerHTML = gBoard[rowIdx][colIdx].minesAroundCount
        elCell.classList.remove('hidden')
        revealNeighs(elCell, rowIdx, colIdx)
    }
}
function handelMine() {
    document.querySelector('.smiley').innerHTML = SAD
    gManualHap = false
    showAllMines()
    // gLives--
    // document.querySelector('.life').innerHTML = gLives
}

function showAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true
                var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
                elCell.innerHTML = MINE
                elCell.classList.remove('hidden')
            }
        }
    }
}

function checkWin() {
    for (var i = 0; i < (gBoard.length); i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]
            if (!currCell.isMine && !currCell.isShown) return false
            // else if (currCell.isMine && !currCell.isMarked) return false
        }
    }
    return true
}

function activateHint() {
    if (!gGame.isOn || !gHintCount) return
    document.querySelector('.bulb').innerHTML = HINTON
    gIsHint = true
    console.log(gHintCount)
    gHintCount--
}
function showHint(elCell) {
    const rowIdx = +elCell.dataset.i
    const colIdx = +elCell.dataset.j

    showHideShown(gBoard, rowIdx, colIdx)
    document.querySelector('.bulb').innerHTML = HINTOFF
    gIsHint = false
}

function showHideShown(gBoard, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (gBoard[i][j].isShown) continue
            const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            elCell.classList.remove('hidden')
            if (gBoard[i][j].isMine) elCell.innerHTML = MINE
            else if (gBoard[i][j].minesAroundCount > 0) elCell.innerHTML = gBoard[i][j].minesAroundCount
            else elCell.innerHTML = " "
            setTimeout(() => {
                elCell.classList.add('hidden')
                elCell.innerHTML = " "
            }
                , 1000)
        }
    }
}

function safeClick() {
    if (!gGame.isOn || !gSafeClicks) return
    var isFound = false
    while (!isFound) {
        var randI = getRandomInt(0, gLevel.SIZE)
        var randJ = getRandomInt(0, gLevel.SIZE)
        if (!gBoard[randI][randJ].isMine && !gBoard[randI][randJ].isShown) isFound = true
    }
    var elCell = document.querySelector(`[data-i="${randI}"][data-j="${randJ}"]`)
    elCell.innerHTML = FLAG

    setTimeout(() => {
        elCell.innerHTML = " "
    }
        , 1000)
    gSafeClicks--
}

function onManualMines() {
    if (!gManualMode) {
        gManualMode = true
        gManualHap = true
        gMineIdx = []
    }
}

function findMinesManualIdx(elCell) {
    const currRow = +elCell.dataset.i
    const currCol = +elCell.dataset.j
    gMineIdx.push({ i: currRow, j: currCol })
    elCell.innerHTML = MINE
}

function setMinesManual() {
    for (var i = 0; i < gMineIdx.length; i++) {
        var currIdx = gMineIdx[i]
        gBoard[currIdx.i][currIdx.j].isMine = true
    }
}

function MineExterminator() {
    if (!gGame.isOn || gExterminated) return
    gMineIdx = findAllMines()

    var count = (gLevel.MINES > 3) ? 3 : 1
    for (var i = 0; i < count; i++) {
        var randIdx = getRandomInt(0, gMineIdx.length)
        var rowIdx = gMineIdx[randIdx].i
        var colIdx = gMineIdx[randIdx].j
        gBoard[rowIdx][colIdx].isMine = false
    }
    setMineNegsCount(gBoard)
    renderCellCount()
    gExterminated = true
}
function renderCellCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            if (gBoard[i][j].isShown) {
                if (gBoard[i][j].minesAroundCount === 0) elCell.innerHTML = " "
                else elCell.innerHTML = gBoard[i][j].minesAroundCount
            }
        }
    }
}
function activateMegaHint() {
    if (!gGame.isOn) return
    if (megaIdx.length === 2) return
    gMegaHint = true
}

function onMegaHint(elCell) {
    // if (!gMegaHint) return
    megaIdx.push({ i: +elCell.dataset.i, j: +elCell.dataset.j })
    if (megaIdx.length === 2) {
        showMegaHint()
    }
}

function showMegaHint() {
    var firstCell = megaIdx[0]
    var secondCell = megaIdx[1]

    for (var i = firstCell.i; i <= secondCell.i; i++) {
        for (var j = firstCell.j; j <= secondCell.j; j++) {
            if (gBoard[i][j].isShown) return
            const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
            elCell.classList.remove('hidden')
            if (gBoard[i][j].isMine) elCell.innerHTML = MINE
            else if (gBoard[i][j].minesAroundCount > 0) elCell.innerHTML = gBoard[i][j].minesAroundCount
            else elCell.innerHTML = " "

            setTimeout(() => {
                elCell.classList.add('hidden')
                elCell.innerHTML = " "
                gMegaHint = false
            }
                , 1000)
        }
    }
}
// function saveActions() {
//     gActions.push(input.value)
//     console.log(gActions)
// }

// function undo() {
//     const lastAction = gActions.pop()
//     if (!lastAction) console.log('No action to undo')
// }

function darkMode() {
    const elBody = document.querySelector('body')
    if (!gIsDarkMode) {
        elBody.style.filter = 'brightness(70%)'
        gIsDarkMode = true
    } else {
        elBody.style.filter = 'brightness(100%)'
        gIsDarkMode = false
    }
}
