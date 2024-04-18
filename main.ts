function movePointer (pointer: game.LedSprite) {
    if (pointer.get(LedSpriteProperty.X) >= 2) {
        pointer.set(LedSpriteProperty.X, 0)
        if (pointer.get(LedSpriteProperty.Y) >= 2) {
            pointer.set(LedSpriteProperty.X, 0)
            pointer.set(LedSpriteProperty.Y, 0)
        } else {
            pointer.change(LedSpriteProperty.Y, 1)
        }
    } else {
        pointer.change(LedSpriteProperty.X, 1)
    }
}
function checkCol (col: number) {
    return getBrightnessNullSafe(0, col) == getBrightnessNullSafe(1, col) && getBrightnessNullSafe(1, col) == getBrightnessNullSafe(2, col)
}
function checkDraw () {
    for (let index = 0; index < 9; index++) {
        if (storage[calcStorageIndex(draw_checker.get(LedSpriteProperty.X), draw_checker.get(LedSpriteProperty.Y))] == null) {
            return false
        }
        movePointer(draw_checker)
    }
    return true
}
function checkGameOver (x: number, y: number) {
    if (checkRow(x) || (checkCol(y) || checkDia(x, y))) {
        if (your_turn) {
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Entertainer), music.PlaybackMode.InBackground)
            basic.showString("You won!")
        } else {
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Dadadadum), music.PlaybackMode.InBackground)
            basic.showString("You lost!")
        }
        game_over = true
    }
    if (checkDraw()) {
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Funk), music.PlaybackMode.InBackground)
        basic.showString("Draw")
        game_over = true
    }
}
// Ensures unique storage indexes for each point.
function calcStorageIndex (x: number, y: number) {
    return x * 10 + y
}
// Move selector.
input.onButtonPressed(Button.A, function () {
    movePointer(my_pos)
    moveDisplayPointFromModel(my_pos, my_pos_display)
})
function checkDia (x: number, y: number) {
    if (x == y) {
        if (getBrightnessNullSafe(0, 0) == getBrightnessNullSafe(1, 1) && getBrightnessNullSafe(1, 1) == getBrightnessNullSafe(2, 2)) {
            return true
        }
    }
    if (x + y == 2) {
        if (getBrightnessNullSafe(0, 2) == getBrightnessNullSafe(1, 1) && getBrightnessNullSafe(1, 1) == getBrightnessNullSafe(2, 0)) {
            return true
        }
    }
    return false
}
function getBrightnessNullSafe (x: number, y: number) {
    if (storage[calcStorageIndex(x, y)] != null) {
        return storage[calcStorageIndex(x, y)].get(LedSpriteProperty.Brightness)
    }
    return -1
}
function checkValidPos (x: number, y: number) {
    if (storage[calcStorageIndex(x, y)] != null) {
        return false
    }
    return true
}
// Maps the internal logic model to a view - if non-standard display sizes are used, only this function needs to be changed.
function moveDisplayPointFromModel (modelPoint: game.LedSprite, displayPoint: game.LedSprite) {
    displayPoint.set(LedSpriteProperty.X, modelPoint.get(LedSpriteProperty.X) * 2)
    displayPoint.set(LedSpriteProperty.Y, modelPoint.get(LedSpriteProperty.Y) * 2)
}
// Create point at selector and end turn.
input.onButtonPressed(Button.B, function () {
    if (!(game_over)) {
        if (your_turn && checkValidPos(my_pos.get(LedSpriteProperty.X), my_pos.get(LedSpriteProperty.Y))) {
            createPoint(my_pos).set(LedSpriteProperty.Brightness, 180)
            radio.sendValue("x", my_pos.get(LedSpriteProperty.X))
            radio.sendValue("y", my_pos.get(LedSpriteProperty.Y))
            checkGameOver(my_pos.get(LedSpriteProperty.X), my_pos.get(LedSpriteProperty.Y))
            your_turn = false
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.BaDing), music.PlaybackMode.InBackground)
        } else {
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.JumpDown), music.PlaybackMode.InBackground)
        }
    }
})
radio.onReceivedValue(function (name, value) {
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.BaDing), music.PlaybackMode.InBackground)
    if (name.compare("x") == 0) {
        opponent_pos.set(LedSpriteProperty.X, value)
    } else {
        opponent_pos.set(LedSpriteProperty.Y, value)
        createPoint(opponent_pos).set(LedSpriteProperty.Brightness, 20)
        checkGameOver(opponent_pos.get(LedSpriteProperty.X), opponent_pos.get(LedSpriteProperty.Y))
        your_turn = true
    }
})
function checkRow (row: number) {
    return getBrightnessNullSafe(row, 0) == getBrightnessNullSafe(row, 1) && getBrightnessNullSafe(row, 1) == getBrightnessNullSafe(row, 2)
}
function createDisplayPointFromModel (modelPoint: game.LedSprite) {
    moveDisplayPointFromModel(modelPoint, modelPoint)
    return modelPoint
}
function createPoint (sprite: game.LedSprite) {
    storage[calcStorageIndex(sprite.get(LedSpriteProperty.X), sprite.get(LedSpriteProperty.Y))] = createDisplayPointFromModel(game.createSprite(sprite.get(LedSpriteProperty.X), sprite.get(LedSpriteProperty.Y)))
    return storage[calcStorageIndex(sprite.get(LedSpriteProperty.X), sprite.get(LedSpriteProperty.Y))]
}
let storage: game.LedSprite[] = []
let game_over = false
let your_turn = false
let my_pos_display: game.LedSprite = null
let draw_checker: game.LedSprite = null
let opponent_pos: game.LedSprite = null
let my_pos: game.LedSprite = null
music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.InBackground)
my_pos = game.createSprite(-1, -1)
my_pos.set(LedSpriteProperty.Brightness, 0)
opponent_pos = game.createSprite(-1, -1)
opponent_pos.set(LedSpriteProperty.Brightness, 0)
draw_checker = game.createSprite(-1, -1)
draw_checker.set(LedSpriteProperty.Brightness, 0)
my_pos_display = game.createSprite(-1, -1)
draw_checker.set(LedSpriteProperty.Brightness, 0)
your_turn = true
game_over = false
// Only used for simulator: Pre-Loads second micro:bit
radio.sendValue("x", 0)
basic.forever(function () {
    if (your_turn && !(game_over)) {
        my_pos_display.set(LedSpriteProperty.Brightness, 255)
        my_pos_display.set(LedSpriteProperty.Blink, 700)
    } else {
        my_pos_display.set(LedSpriteProperty.Brightness, 0)
    }
})
