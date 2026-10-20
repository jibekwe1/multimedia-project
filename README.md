# Keyboard DualShock

Makes a keyboard acts like a very basic ps4 dual shock controller. Press the key and a stick moves or a button lights up with sound.

## Keys

| Keys | What it does |
| --- | --- |
| W A S D | Left joystick |
| Arrow keys | Right joystick |
| O X T Q | Circle, Cross, Triangle, Square |

A pressed key turns blue.

## How it works

1. `keys` keeps track of which keys are down right now.
2. Every key press or release runs `keyChanged`.
3. `keyChanged` turns the letter or button blue, updates both sticks, and plays the button sounds.
4. `updateStick` points a stick one way (up down left right). Hold two keys and the newest one wins. Let go of it and the stick goes back to the other key if it's still down. If not, it goes to the middle.
5. The stick position goes into `--x` and `--y` as a number from -1 to 1. The CSS turns that into how far the circle moves.
6. Click away from the window and every key lets go, with no sound. The browser never tells us the key came up, so we do it ourselves.

## Sounds

I cut these from a recording of me moving the sticks and clicking the buttons. It was harder to pick up the buttons compared to the sticks.

| Name | Plays when | Files |
| --- | --- | --- |
| `stickPush` | A stick leaves the middle | 4 |
| `stickRelease` | A stick goes back to the middle | 4 |
| `btnDown` | A button goes down | 2 |
| `btnUp` | A button comes up | 2 |

Each time, one file from the group plays. It's random.

## Challenges

There were not many challenges since I was using GitHub Pages which I've used in the past before. The main diffculty was the waiting for the page to publish, and changes to the repo to go live.