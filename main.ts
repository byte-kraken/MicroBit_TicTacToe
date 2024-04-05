function movePointer () {
    if (my_pos.get(LedSpriteProperty.X) >= 2) {
        my_pos.set(LedSpriteProperty.X, 0)
        if (my_pos.get(LedSpriteProperty.Y) >= 2) {
            my_pos.set(LedSpriteProperty.X, 0)
            my_pos.set(LedSpriteProperty.Y, 0)
        } else {
            my_pos.change(LedSpriteProperty.Y, 1)
        }
    } else {
        my_pos.change(LedSpriteProperty.X, 1)
    }
}
function checkCol (col: number) {
    return cache[calcIndex(1, col)].get(LedSpriteProperty.Brightness) == cache[calcIndex(2, col)].get(LedSpriteProperty.Brightness) && cache[calcIndex(1, col)].get(LedSpriteProperty.Brightness) == cache[calcIndex(3, col)].get(LedSpriteProperty.Brightness)
}
function checkDraw () {
    for (let index = 0; index <= 3; index++) {
        for (let index = 0; index <= 3; index++) {
        	
        }
    }
    return 0
}
function checkValid (x: number, y: number) {
    if (cache[calcIndex(x, y)] != null) {
        return false
    }
    return true
}
input.onButtonPressed(Button.A, function () {
    movePointer()
})
function checkDia (x: number, y: number) {
    return 0
}
function checkEnd (x: number, y: number) {
    if (checkRow(x) || (checkCol(y) || checkDia(x, y))) {
        if (your_turn) {
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Entertainer), music.PlaybackMode.InBackground)
        } else {
            music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Dadadadum), music.PlaybackMode.InBackground)
        }
    }
    if (checkDraw()) {
        music._playDefaultBackground(music.builtInPlayableMelody(Melodies.Funk), music.PlaybackMode.InBackground)
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
    }
    checkEnd(radio_pos.get(LedSpriteProperty.X), radio_pos.get(LedSpriteProperty.Y))
    your_turn = true
})
function checkRow (row: number) {
    return cache[calcIndex(row, 1)].get(LedSpriteProperty.Brightness) == cache[calcIndex(row, 2)].get(LedSpriteProperty.Brightness) && cache[calcIndex(row, 1)].get(LedSpriteProperty.Brightness) == cache[calcIndex(row, 3)].get(LedSpriteProperty.Brightness)
}
let cache: game.LedSprite[] = []
let your_turn = false
let radio_pos: game.LedSprite = null
let my_pos: game.LedSprite = null
my_pos = game.createSprite(-1, -1)
my_pos.set(LedSpriteProperty.Brightness, 255)
radio_pos = game.createSprite(-1, -1)
radio_pos.set(LedSpriteProperty.Brightness, 0)
your_turn = true
basic.forever(function () {
    if (your_turn == true) {
        my_pos.set(LedSpriteProperty.Brightness, 255)
        my_pos.set(LedSpriteProperty.Blink, 1000)
    } else {
        my_pos.set(LedSpriteProperty.Brightness, 0)
    }
})
