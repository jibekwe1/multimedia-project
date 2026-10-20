// ---------- sounds ----------

// loads files like sounds/stickPush_0.wav
function loadSounds(name, count) {
  let list = [];
  for (let i = 0; i < count; i++) {
    list.push(new Audio(`sounds/${name}_${i}.wav`));
  }
  return list;
}

// how many files each sound has in the sounds folder
let sounds = {
  stickPush: loadSounds("stickPush", 4),
  stickRelease: loadSounds("stickRelease", 4),
  btnDown: loadSounds("btnDown", 2),
  btnUp: loadSounds("btnUp", 2),
};

// plays a random file from one of the lists
function playSound(name) {
  let list = sounds[name];
  let sound = list[Math.floor(Math.random() * list.length)];
  sound.currentTime = 0;
  sound.play().catch(() => {}); // ignore the error if the browser blocks it
}


// ---------- keys ----------

// true means the key is being held down right now
let keys = {
  w: false, a: false, s: false, d: false,
  ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
  o: false, x: false, t: false, q: false,
};

// each stick has its html element and the keys that move it.
// current is the key it is pointing toward right now (or null if it's in the middle).
// pushed remembers if it was pushed last time, so the sound only plays once
let sticks = [
  {
    element: document.getElementById("left"),
    up: "w", down: "s", left: "a", right: "d",
    current: null,
    pushed: false,
  },
  {
    element: document.getElementById("right"),
    up: "ArrowUp", down: "ArrowDown", left: "ArrowLeft", right: "ArrowRight",
    current: null,
    pushed: false,
  },
];

let buttonKeys = ["o", "x", "t", "q"];


// ---------- updating things ----------

// a stick only points one way at a time (no diagonals).
// if you hold two keys, the one you pressed last wins
function updateStick(stick, key, isDown, quiet) {
  let directions = [stick.up, stick.down, stick.left, stick.right];

  if (isDown && directions.includes(key)) {
    stick.current = key;
  } else if (!isDown && stick.current === key) {
    // the key we were following was let go
    // so go to another key that is still held, or back to the middle
    stick.current = null;
    for (let other of directions) {
      if (keys[other]) stick.current = other;
    }
  }

  let x = 0;
  let y = 0;
  if (stick.current === stick.up) y = -1;
  if (stick.current === stick.down) y = 1;
  if (stick.current === stick.left) x = -1;
  if (stick.current === stick.right) x = 1;

  // the css uses these to move the dot
  stick.element.style.setProperty("--x", x);
  stick.element.style.setProperty("--y", y);

  let pushed = stick.current !== null;
  if (pushed !== stick.pushed && !quiet) {
    playSound(pushed ? "stickPush" : "stickRelease");
  }
  stick.pushed = pushed;
}

// runs every time a key goes down or comes back up
function keyChanged(key, isDown, quiet) {
  // turn the letter or button blue (the css has a rule for .on)
  let element = document.querySelector(`[data-key="${key}"]`);
  element.classList.toggle("on", isDown);

  for (let stick of sticks) {
    updateStick(stick, key, isDown, quiet);
  }

  if (buttonKeys.includes(key) && !quiet) {
    playSound(isDown ? "btnDown" : "btnUp");
  }
}


// ---------- listening for keys ----------

function getKey(event) {
  // lowercase single letters so a capital W works too
  return event.key.length === 1 ? event.key.toLowerCase() : event.key;
}

document.addEventListener("keydown", (event) => {
  // leave things like ctrl+w alone
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  let key = getKey(event);
  if (keys[key] === undefined) return; // not one of our keys

  event.preventDefault(); // stops the arrow keys scrolling the page

  if (keys[key]) return; // already held, this is just the key repeating
  keys[key] = true;
  keyChanged(key, true, false);
});

document.addEventListener("keyup", (event) => {
  let key = getKey(event);
  if (!keys[key]) return; // not one of our keys, or it wasn't held

  keys[key] = false;
  keyChanged(key, false, false);
});

// when the window loses focus we never get the keyup,
// so let go of every key (quietly)
window.addEventListener("blur", () => {
  for (let key in keys) {
    if (keys[key]) {
      keys[key] = false;
      keyChanged(key, false, true);
    }
  }
});
