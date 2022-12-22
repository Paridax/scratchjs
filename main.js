DEBUG = true;
SCENE.width = 1920;
SCENE.height = 1080;

makeSprite("player");
sprite("player").addCostume("cube", "media/Cube004.png");
sprite("player").addSound(
    "stereo madness",
    "media/Forever Bound - Stereo Madness.mp3"
);

sprite("player").onstart = function () {
    this.switchCostume("cube");
    this.x = 0;
    this.y = 0;
    this.scale = 1;

    this.opacity = 100;
    this.playSound("stereo madness");
    this.showVariable("scale");
    this.showVariable("FPS", "FPS", true);

    this.broadcast("hi guys");
}

sprite("player").onupdate = function () {
    this.pointTowardsMouse();
    this.move(3 * global.SPEED);
    this.turnDegrees(90);

    //if it is touching the mouse, change the scale
    if (this.touchingMouse()) {
        this.scale = 1.1;
    } else {
        this.scale = 1;
    }

    if (this.keyIsPressed("w")) {
        this.y -= 5 * global.SPEED;
    }
    if (this.keyIsPressed("a")) {
        this.x -= 5 * global.SPEED;
    }
    if (this.keyIsPressed("s")) {
        this.y += 5 * global.SPEED;
    }
    if (this.keyIsPressed("d")) {
        this.x += 5 * global.SPEED;
    }
}

sprite("player").onkeypress = function (key) {
    if (this.keyIsPressed("k")) {
        this.createCloneOf("player");
    }
    if (this.keyIsPressed("n")) {
        this.goToFrontLayer();
    }
    if (this.keyIsPressed("m")) {
        this.broadcast("delete");
    }
}

clone("player").onevent = function (event) {
    if(event == "delete") {
        console.log("Delete");
        this.deleteClone();
    }
}

console.log(sprite("player"));