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
    return nullSafeGetBrightness(0, col) == nullSafeGetBrightness(1, col) && nullSafeGetBrightness(1, col) == nullSafeGetBrightness(2, col)
}
function checkDraw () {
    for (let index = 0; index < 9; index++) {
        if (cache[calcIndex(draw_checker.get(LedSpriteProperty.X), draw_checker.get(LedSpriteProperty.Y))] == null) {
            return false
        }
        movePointer(draw_checker)
    }
    return true
}
function checkValid (x: number, y: number) {
    if (cache[calcIndex(x, y)] != null) {
        return false
    }
    return true
}
input.onButtonPressed(Button.A, function () {
    movePointer(my_pos)
})
function checkDia (x: number, y: number) {
    if (x == y) {
        if (nullSafeGetBrightness(0, 0) == nullSafeGetBrightness(1, 1) && nullSafeGetBrightness(1, 1) == nullSafeGetBrightness(2, 2)) {
            return true
        }
    }
    if (x + y == 3) {
        if (nullSafeGetBrightness(0, 2) == nullSafeGetBrightness(1, 1) && nullSafeGetBrightness(1, 1) == nullSafeGetBrightness(2, 0)) {
            return true
        }
    }
    return false
}
function nullSafeGetBrightness (x: number, y: number) {
    if (cache[calcIndex(x, y)] != null) {
        return cache[calcIndex(x, y)].get(LedSpriteProperty.Brightness)
    }
    return -1
}
function checkEnd (x: number, y: number) {
    if (checkRow(x) || (checkCol(y) || checkDia(x, y))) {
        if (your_turn) {
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Entertainer), music.PlaybackMode.InBackground)
            basic.showString("You won!")
        } else {
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Dadadadum), music.PlaybackMode.InBackground)
            basic.showString("You lost!")
        }
    }
    if (checkDraw()) {
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Funk), music.PlaybackMode.InBackground)
        basic.showString("Draw")
    }
}
input.onButtonPressed(Button.B, function () {
    if (your_turn && checkValid(my_pos.get(LedSpriteProperty.X), my_pos.get(LedSpriteProperty.Y))) {
        cache[calcIndex(my_pos.get(LedSpriteProperty.X), my_pos.get(LedSpriteProperty.Y))] = game.createSprite(my_pos.get(LedSpriteProperty.X), my_pos.get(LedSpriteProperty.Y))
        cache[calcIndex(my_pos.get(LedSpriteProperty.X), my_pos.get(LedSpriteProperty.Y))].set(LedSpriteProperty.Brightness, 180)
        radio.sendValue("x", my_pos.get(LedSpriteProperty.X))
        radio.sendValue("y", my_pos.get(LedSpriteProperty.Y))
        checkEnd(my_pos.get(LedSpriteProperty.X), my_pos.get(LedSpriteProperty.Y))
        your_turn = false
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.BaDing), music.PlaybackMode.InBackground)
    } else {
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.JumpDown), music.PlaybackMode.InBackground)
    }
})
function calcIndex (x: number, y: number) {
    return x * 10 + y
}
radio.onReceivedValue(function (name, value) {
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.BaDing), music.PlaybackMode.InBackground)
    if (name.compare("x") == 0) {
        radio_pos.set(LedSpriteProperty.X, value)
    } else {
        radio_pos.set(LedSpriteProperty.Y, value)
        cache[calcIndex(radio_pos.get(LedSpriteProperty.X), radio_pos.get(LedSpriteProperty.Y))] = game.createSprite(radio_pos.get(LedSpriteProperty.X), radio_pos.get(LedSpriteProperty.Y))
        cache[calcIndex(radio_pos.get(LedSpriteProperty.X), radio_pos.get(LedSpriteProperty.Y))].set(LedSpriteProperty.Brightness, 20)
        checkEnd(radio_pos.get(LedSpriteProperty.X), radio_pos.get(LedSpriteProperty.Y))
        your_turn = true
    }
})
function checkRow (row: number) {
    return nullSafeGetBrightness(row, 0) == nullSafeGetBrightness(row, 1) && nullSafeGetBrightness(row, 1) == nullSafeGetBrightness(row, 2)
}
let cache: game.LedSprite[] = []
let your_turn = false
let draw_checker: game.LedSprite = null
let radio_pos: game.LedSprite = null
let my_pos: game.LedSprite = null
my_pos = game.createSprite(-1, -1)
my_pos.set(LedSpriteProperty.Brightness, 255)
radio_pos = game.createSprite(-1, -1)
radio_pos.set(LedSpriteProperty.Brightness, 0)
draw_checker = game.createSprite(-1, -1)
draw_checker.set(LedSpriteProperty.Brightness, 0)
your_turn = true
basic.forever(function () {
    if (your_turn) {
        my_pos.set(LedSpriteProperty.Brightness, 255)
        my_pos.set(LedSpriteProperty.Blink, 700)
    } else {
        my_pos.set(LedSpriteProperty.Brightness, 0)
    }
})
