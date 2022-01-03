input.onButtonPressed(Button.A, function () {
    Leuchtet = 1 - Leuchtet
})
let BeschleunigungRotation = 0
let Beschleunigung_y = 0
let Änderung = 0
let Geschwindigkeit = 0
let Leuchtet = 0
let Messungen_y: number[] = []
let Richtung = 1
let Neigung = 5.7
let Winkel = 17
let Radius = 0.05
let millig = 9.81 / 1000
let Pi = 3.1415
let _2Pi = 2 * Pi
let GradBogenmaß = Pi / 180
let Offset = 1000 * Math.sin(Neigung * GradBogenmaß)
let Faktor = Math.cos(Winkel * GradBogenmaß)
let Verzögerung = 5
let Minimum = 0.5
let Index = 0
let Länge = 24
for (let index = 0; index < 10; index++) {
    Messungen_y.push(0)
}
input.setAccelerometerRange(AcceleratorRange.FourG)
let Streifen = neopixel.create(DigitalPin.P0, Länge, NeoPixelMode.RGB)
Leuchtet = 0
Streifen.clear()
Streifen.show()
basic.forever(function () {
    while (Geschwindigkeit > Minimum) {
        Änderung = 360 * (Geschwindigkeit * Verzögerung / 1000)
        Index += 360 - Änderung * Richtung
        Index = Index % 360
        Streifen.showRainbow(Math.round(Index) + 1, Math.round(Index) + 360)
        basic.pause(Verzögerung)
    }
})
basic.forever(function () {
    if (Leuchtet) {
        while (Leuchtet) {
            basic.pause(200)
        }
        basic.pause(2000)
    } else {
        Streifen.clear()
        Streifen.show()
    }
    basic.pause(200)
})
basic.forever(function () {
    led.plotBarGraph(
    Math.abs(Geschwindigkeit),
    5
    )
})
basic.forever(function () {
    while (true) {
        Messungen_y.unshift(input.acceleration(Dimension.Y))
        Beschleunigung_y = Beschleunigung_y + (Messungen_y[0] / 10 - Messungen_y.pop() / 10)
        if (Beschleunigung_y > Offset) {
            BeschleunigungRotation = (Beschleunigung_y - Offset) / Faktor * millig
            Geschwindigkeit = Math.sqrt(BeschleunigungRotation / Radius) / _2Pi
        } else {
            Geschwindigkeit = 0
        }
        if (Geschwindigkeit > Minimum) {
            Leuchtet = 1
        } else {
            Leuchtet = 0
        }
        basic.pause(50)
    }
})
