let DEBUG = false;
let FRAMERATE = 60;
let TICKSPEED = 60;

const SCENE = {
    updateWindow: true,
    x: 0,
    y: 0,
    scale: 1,
    width: 800,
    height: 600,
    window: {
        top: 0,
        left: 0,
    },
};

const global = {
    DELTA: 0,
    MSPT: 0,
    FPS: 0,
    SPEED: 1,
};

var MOUSE_X = 0;
var MOUSE_Y = 0;

const ALL_AROUND = 0;
const LEFT_RIGHT = 1;
const NO_ROTATE = 2;

const SPRITES = new Map();
const CLONES = [];
const DRAWING = [];

function makeSprite(name) {
    return new SpriteElement(name);
}

function sprite(name) {
    let sprite = SPRITES.get(name);
    if (!sprite) {
        console.error(
            `Sprite "${name}" does not exist. Create it using:\n\nmakeSprite(<sprite name>)`
        );
        return;
    }
    return sprite;
}

function clone(name) {
    let sprite = SPRITES.get(name);
    if (!sprite) {
        console.error(
            `Sprite "${name}" does not exist. Create it using:\n\nmakeSprite(<sprite name>)`
        );
        return;
    }
    return sprite.clone;
}

class SpriteElement {
    constructor(name, m_scale = 1, isClone = false) {
        this.name = name;
        this.x = 0;
        this.y = 0;
        this.direction = 0;
        this.scale = m_scale;

        this.sounds = new Map();
        this.costumes = new Map();

        this.costume = null;
        this.opacity = 255;
        this.colorEffect = 0;
        this.brightness = 255;
        this.hidden = false;

        this.rotationMode = ALL_AROUND;
        this.initiated = false;

        this.polygon = new ImageSprite();
        this.polygon.setDirection(90);
        this.polygon.setScale(2);

        this.displayVariables = new Map();

        this.clones = [];

        if (SPRITES.get(this.name)) {
            console.error(
                `Error when creating sprite ${SPRITES.size + 1}: Sprite "${
                    this.name
                }" already exists.`
            );
            delete this;
        } else {
            SPRITES.set(this.name, this);
            DRAWING.push(this);
        }
    }

    // functions that will never be used in the main.js file are known as primitives
    // the function checks to make sure that the sprite follows some basic rules when generating
    primitiveSetup() {
        this.initiated = true;
        if (this.costumes.size < 1) {
            console.error(
                `${this.name} has no costumes defined. At least 1 required.\n\nUsage:\nsprite.addCostume(<name>, <image source>);\n\n`
            );
            delete this;
        }

        if (!this.costume) {
            const costumeName = this.costumes.keys().next().value;
            this.switchCostume(costumeName);
            // console.log("Costume: engine.js:78", this.costume);
        }

        this.onstart();
    }

    primitiveColor() {
        fill(this.col[0], this.col[1], this.col[2]);
    }

    primitiveDraw() {
        this.onupdate();
        this.polygon.setScale(this.scale);
        this.polygon.setDirection(this.direction);
        this.polygon.setPosition(this.x, this.y);
        this.polygon.opacity = this.opacity;
        if (!this.hidden) {
            fill(0);
            this.polygon.draw();
        }
    }

    primitiveKeyPressed(keyCode) {
        this.onkeypress(keyCode);
    }

    // Event code that is designed to be overwritten
    onstart() {
        // Override this method
    }

    onupdate() {
        // Override this method
    }

    onkeypress(keyCode) {
        // Override this method
    }

    onevent(event) {
        // Override this method
    }

    onclone() {
        // Override this method
    }

    // Below is just a huge list of methods that makes dealing with the sprite much easier

    addSound(name, sourcePath) {
        if (this.initiated) {
            return console.error(
                "Sounds must to be loaded before project starts"
            );
        }
        this.sounds.set(name, sourcePath);
    }

    playSound(name) {
        if (!this.initiated) {
            return console.error(
                "Cannot start sound before starting the project"
            );
        }
        const sound = this.sounds.get(name);
        if (!sound) {
            return console.error("That sound does not exists");
        }
        sound.play();
    }

    soundIsPlaying(name) {
        if (!this.initiated) {
            return console.error(
                "Cannot start sound before starting the project"
            );
        }
        const sound = this.sounds.get(name);
        if (!sound) {
            return console.error("That sound does not exists");
        }
        return sound.isPlaying();
    }

    stopAllSounds() {
        if (!this.initiated) {
            return console.error(
                "Cannot start sound before starting the project"
            );
        }
        this.sounds.forEach((sound) => {
            sound.stop();
        });
    }

    addCostume(name, sourcePath) {
        if (this.initiated) {
            return console.error(
                "Costumes must to be loaded before project starts"
            );
        }
        this.costumes.set(name, sourcePath);
    }

    switchCostume(name) {
        if (!this.initiated) {
            return console.error(
                "Cannot set costume outside the event scripts"
            );
        }
        let costume = this.costumes.get(name);
        if (costume && costume !== this.costume) {
            this.costume = costume;
            this.polygon.setImage(this.costume);
        }
    }

    isTouchingPoint(point) {
        return this.polygon.isTouchingPoint(point);
    }

    isTouchingSprite(sprite) {
        return this.polygon.isTouchingPolygon(sprite.polygon);
    }

    directionTo(point) {
        var deltaX = point.x - this.x;
        var deltaY = point.y - this.y;
        var rad = Math.atan2(deltaY, deltaX);
        var deg = rad * (180 / Math.PI);
        return deg;
    }

    turnDegrees(deg) {
        this.direction += deg;
    }

    showVariable(name, label = "", global = false) {
        try {
            const variable = {
                label: `${!global ? `(${this.name}) ` : ""}${
                    label ? label : name
                }`,
                sprite: this.name,
                global,
                name,
            };
            this.displayVariables.set(
                global ? "global_" : "local_" + name,
                variable
            );
        } catch (e) {
            console.error(
                "Error when trying to show variable. Make sure you are using a variable reference."
            );
        }
    }

    hideVariable(name, global = false) {
        this.displayVariables.delete(global ? "global_" : "local_" + name);
    }

    secondsPast1970() {
        return Math.floor(Date.now() / 1000);
    }

    keyIsPressed(key) {
        // if the key is a string, convert it to a keycode
        if (typeof key === "string") {
            key = stringToKeyCode(key);
        }
        return keyIsDown(key);
    }

    broadcast(event) {
        for(const sprite of DRAWING) {
            if(!sprite) {
                continue;
            }

            if(sprite.onevent) {
                sprite.onevent(event);
            }
        }
    }

    clone = {
        onupdate: function() {
            // replace with clone code
        },

        onstart: function() {
            // replace with clone code
        },

        onkeypress: function(keyCode) {
            // replace with clone code
        }
    }

    createCloneOf(spriteName) {
        // get the sprite as a json object
        const targetSprite = sprite(spriteName);
        // copy the object without stringifying it
        let clone = Object.assign(Object.create(Object.getPrototypeOf(targetSprite)), targetSprite);

        clone.isClone = true;
        clone.initiated = false;
        clone.onupdate = clone.clone.onupdate;
        clone.onstart = clone.clone.onstart;
        clone.onkeypress = clone.clone.onkeypress;
        clone.onevent = clone.clone.onevent || clone.onevent;
        delete clone.clones;
        delete clone.clone;
        CLONES.push(clone);
        DRAWING.push(clone);
    }

    deleteClone() {
        if(this.isClone) {
            const index = CLONES.indexOf(this);
            const layer = DRAWING.indexOf(this);
            CLONES[index] = null;
            DRAWING[layer] = null;
            delete this;
        }
    }

    hide() {
        this.hidden = true;
    }

    show() {
        this.hidden = false;
    }

    goToFrontLayer() {
        const index = DRAWING.indexOf(this);
        DRAWING.splice(index, 1);
        DRAWING.push(this);
    }

    goToBackLayer() {
        const index = DRAWING.indexOf(this);
        DRAWING.splice(index, 1);
        DRAWING.unshift(this);
    }

    goToLayer(layer) {
        const index = DRAWING.indexOf(this);
        DRAWING.splice(index, 1);
        DRAWING.splice(layer, 0, this);
    }

    touchingMouse() {
        return this.isTouchingPoint(p(MOUSE_X, MOUSE_Y));
    }

    pointTowardsMouse() {
        this.direction = this.directionTo(p(MOUSE_X, MOUSE_Y));
    }

    move(steps) {
        this.x += Math.cos((this.direction * Math.PI) / 180) * steps;
        this.y += Math.sin((this.direction * Math.PI) / 180) * steps;
    }
}

const timer = {
    start: Date.now(),
    pauseTime: 0,
    deltaTimeMs: 0,
    deltaSmooth: [],

    reset: function() {
        this.start = Date.now();
    },

    getSeconds: function() {
        return (Date.now() - this.start) / 1000;
    },

    pause: function() {
        this.pauseTime = Date.now();
    },

    unpause: function() {
        this.start += Date.now() - this.pauseTime;
    }
}

let delta = Date.now();
let averageFps = []

function getFPS() { // return the average fps over the last 5 frames
    let fps = 1000 / (Date.now() - delta);
    delta = Date.now();
    averageFps.push(fps);
    if (averageFps.length > 60) {
        averageFps.shift();
    }
    const sum = averageFps.reduce((a, b) => a + b, 0);
    return Math.floor(sum / averageFps.length);
}