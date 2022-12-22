global.MSPT = 1000 / TICKSPEED;

function preload() {
    if (DEBUG) console.log("Preloading...");
    soundFormats("mp3", "ogg");

    global.FPS = getFPS();
    global.DELTA = deltaTime;
    global.PERCENT_TICK = global.MSPT / global.DELTA;

    for (const [_, sprite] of SPRITES.entries()) {
        for (let [key, img] of sprite.costumes.entries()) {
            sprite.costumes.set(key, loadImage(img));
        }

        for (let [key, sound] of sprite.sounds.entries()) {
            sprite.sounds.set(key, loadSound(sound));
        }
    }
}

function setup() {
    if (DEBUG) console.log("Setting up...");
    frameRate(FRAMERATE);

    updateMouseCoords();

    for (const [_, sprite] of SPRITES.entries()) {
        sprite.primitiveSetup();
    }

    createCanvas(SCENE.width, SCENE.height);

    updateScreen();
}

function draw() {
    global.FPS = getFPS();
    global.DELTA = deltaTime;
    global.PERCENT_TICK = global.MSPT / global.DELTA;
    updateMouseCoords();

    push();
    scale(SCENE.scale);
    translate(SCENE.width / 2 + SCENE.x, SCENE.height / 2 - SCENE.y);

    background(255);
    for (const sprite of DRAWING) {
        if (!sprite) {
            CLONES.splice(CLONES.indexOf(clone), 1);
            continue;
        }
        if (!sprite.initiated) {
            sprite.primitiveSetup();
            sprite.initiated = true;
        }
        sprite.primitiveDraw();
    }
    pop();
    displayVariables();
}

const TEXT_SIZE = 12;
const SPACING = 5;

function displayVariables() {
    push();
    scale(1.5);
    if (DEBUG) {
        let varCount = 0;
        for (const [_, sprite] of SPRITES.entries()) {
            for (const [_, value] of sprite.displayVariables.entries()) {
                // write the variable name to the top left corner of the screen with 10px spacing, and move down TEXT_SIZE + SPACING pixels each variable
                let variable = undefined;
                if (!value.global) {
                    variable = sprite[value.name];
                } else {
                    variable = global[value.name];
                }
                text(
                    `${value.label}: ${variable}`,
                    SPACING,
                    SPACING * 3 + (TEXT_SIZE + SPACING) * varCount
                );
                varCount++;
            }
        }
    }
    pop();
}

function windowResized() {
    updateScreen();
}

function updateScreen() {
    let normalX = windowWidth / SCENE.width;
    let normalY = windowHeight / SCENE.height;

    if (normalY < normalX) {
        SCENE.scale = normalY;
    } else {
        SCENE.scale = normalX;
    }

    resizeCanvas(SCENE.width * SCENE.scale, SCENE.height * SCENE.scale);
}

function updateMouseCoords() {
    if (mouseX < 0) {
        mouseX = 0;
    } else if (mouseX > windowWidth) {
        mouseX = windowWidth;
    }
    if (mouseY < 0) {
        mouseY = 0;
    } else if (mouseY > windowHeight) {
        mouseY = windowHeight;
    }
    MOUSE_X = mouseX / SCENE.scale - SCENE.x - SCENE.width / 2;
    MOUSE_Y = mouseY / SCENE.scale - SCENE.y - SCENE.height / 2;
}

function keyPressed() {
    for (const [_, sprite] of SPRITES.entries()) {
        sprite.primitiveKeyPressed(keyCode);
        for (const clone of sprite.clones) {
            clone.primitiveKeyPressed(keyCode);
        }
    }

    for (const clone of CLONES) {
        if (!clone) {
            CLONES.splice(CLONES.indexOf(clone), 1);
            continue;
        }
        clone.primitiveKeyPressed(keyCode);
    }
}