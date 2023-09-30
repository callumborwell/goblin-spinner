// the game itself
var game;
var hordeCount = 0;

var gameOptions = {

    // slices (prizes) placed in the wheel
    slices: 100,

    // prize names, starting from 12 o'clock going clockwise
    slicePrizes: [
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "Goblin",
        "2 Goblins in a Trenchcoat",
        "2 Goblins in a Trenchcoat",
        "2 Goblins in a Trenchcoat",
        "2 Goblins in a Trenchcoat",
        "2 Goblins in a Trenchcoat",
        "2 Goblins in a Trenchcoat",
        "2 Goblins in a Trenchcoat",
        "2 Goblins in a Trenchcoat",
        "2 Goblins in a Trenchcoat",
        "2 Goblins in a Trenchcoat",
        "2 Goblins in a Trenchcoat",
        "2 Goblins in a Trenchcoat",
        "2 Goblins in a Trenchcoat",
        "2 Goblins in a Trenchcoat",
        "2 Goblins in a  Trenchcoat",
        "Three Goblins in a Trenchcoat",
        "Three Goblins in a Trenchcoat",
        "Three Goblins in a Trenchcoat",
        "Three Goblins in a Trenchcoat",
        "Three Goblins in a Trenchcoat",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Goblin Archer",
        "Uncommon Magic Item",
        "Uncommon Magic Item",
        "Uncommon Magic Item",
        "Uncommon Magic Item",
        "Uncommon Magic Item",
        "Uncommon Magic Item",
        "Uncommon Magic Item",
        "Uncommon Magic Item",
        "Uncommon Magic Item",
        "Uncommon Magic Item",
        "Rare Magic Item",
        "Rare Magic Item",
        "Rare Magic Item",
        "Rare Magic Item",
        "Rare Magic Item",
        "Goblin Brute",
        "Goblin Brute",
        "Goblin Brute",
        "Goblin Brute",
        "Goblin Brute",
        "Warg Rider",
        "Warg Rider",
        "Warg Rider",
        "Goblin Mage",
        "Goblin Mage"
    ],

    // wheel rotation duration, in milliseconds
    rotationTime: 3000
}

// once the window loads...
window.onload = function () {

    // game configuration object
    var gameConfig = {

        // render type
        type: Phaser.CANVAS,

        // game width, in pixels
        width: 850,

        // game height, in pixels
        height: 850,

        // game background color
        backgroundColor: '#000000',//0x880044,

        // scenes used by the game
        scene: [playGame]
    };

    // game constructor
    game = new Phaser.Game(gameConfig);

    // pure javascript to give focus to the page/frame and scale the game
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);

    // visibility
    document.getElementById("popUpList").style.visibility = "hidden";
    document.getElementById("popUpFail").style.visibility = "hidden";
    document.getElementById("horde").style.visibility = "hidden";
    document.getElementById("hide").style.visibility = "hidden";

    // disable all buttons
    const buttons = document.getElementsByTagName("button"); for (let button of buttons) { button.disabled = true; }
    //game.setSpin(false);

    // Control buttons on based on if donor name is blank
    document.getElementById("donorName").addEventListener("keyup", (event) => {
        if (event.target.value == "") {
            for (let button of buttons) { button.disabled = true; }
            //game.setSpin(false);
        } else {
            for (let button of buttons) { button.disabled = false; }
            //game.setSpin(true);
        }
    });

}

// PlayGame scene
class playGame extends Phaser.Scene {

    // constructor
    constructor() {
        super("PlayGame");
    }

    // method to be executed when the scene preloads
    preload() { // loading assets

        this.load.image("wheel", "https://i.imgur.com/CnX4XV8.png");
        this.load.image("pin", "https://i.imgur.com/Tmh3Hgn.png");
    }

    // method to be executed once the scene has been created
    create() {

        // adding the wheel in the middle of the canvas
        this.wheel = this.add.sprite(game.config.width / 2, game.config.height / 2, "wheel");

        // adding the pin in the middle of the canvas
        this.pin = this.add.sprite(game.config.width / 2, game.config.height / 2, "pin");

        // adding the text field
        this.prizeText = this.add.text(game.config.width / 2, game.config.height - 35, "", {
            font: "bold 64px Rajdhani",
            align: "center",
            color: "black"
        });

        // center the text
        this.prizeText.setOrigin(0.5);

        // the game has just started = we can spin the wheel
        this.canSpin = true;

        // waiting for your input, then calling "spinWheel" function
        this.input.on("pointerdown", this.spinWheel, this);
    }

    setSpin(bool) {
        this.canSpin = bool;
    }

    // function to spin the wheel
    spinWheel() {

        // can we spin the wheel?
        if (this.canSpin) {

            // resetting text field
            this.prizeText.setText("");

            // the wheel will spin round from 2 to 4 times. This is just coreography
            var rounds = Phaser.Math.Between(4, 6);

            // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
            var degrees = Phaser.Math.Between(0, 360);

            // before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
            var prize = gameOptions.slices - 1 - Math.floor(degrees / (360 / gameOptions.slices));

            // now the wheel cannot spin because it's already spinning
            this.canSpin = false;

            // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
            // the quadratic easing will simulate friction
            this.tweens.add({

                // adding the wheel to tween targets
                targets: [this.wheel],

                // angle destination
                angle: 360 * rounds + degrees,

                // tween duration
                duration: gameOptions.rotationTime,

                // tween easing
                ease: "Cubic.easeOut",

                // callback scope
                callbackScope: this,

                // function to be executed once the tween has been completed
                onComplete: function (tween) {
                    // displaying prize text
                    this.prizeText.setText(gameOptions.slicePrizes[prize]);

                    // add prize to horde
                    switch(gameOptions.slicePrizes[prize]) {
                        case "2 Goblins in a Trenchcoat":
                            goblintrenchcoatAdd(2);
                            break;
                        case "Three Goblins in a Trenchcoat":
                            goblintrenchcoatAdd(3);
                            break;
                        case "Uncommon Magic Item":
                            goblinitemAdd("Uncommon Item");
                            break;
                        case "Rare Magic Item":
                            goblinitemAdd("Rare Item");
                            break;
                        default:
                            goblinAdd(gameOptions.slicePrizes[prize]);
                      }

                    // player can spin again
                    this.canSpin = true;
                }
            });
        }
    }
}

// pure javascript to scale the game
function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = 500;
    var windowHeight = 500;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

// add goblin to list
function goblinAdd(goblinType) {
    var text = document.getElementById("donorName").value; 
    var li = "<li id='g"+hordeCount+"' onclick=\"death('g"+hordeCount+"')\">" + goblinType + " " + text + "</li>";
    document.getElementById("list").innerHTML += li;
    hordeCount++;
    goblinCounter(hordeCount);
    fumbleCheck(goblinType);
    document.getElementById("donorName").value = "";
}

// add goblin trenchcoats to list
function goblintrenchcoatAdd(goblinCount) {
    var text = document.getElementById("donorName").value; 
    var li = "<li id='g"+hordeCount+"' style='display:inline' onclick=\"death('g"+hordeCount+"')\">" + goblinCount + " Goblins " + text; li += "</li>";
    for (let i = 0; i < goblinCount; i++) {
        li += "<input type='checkbox'>";
    }
    li += "<br>"
    document.getElementById("list").innerHTML += li;
    hordeCount++;
    goblinCounter(hordeCount);
    fumbleCheck(goblinCount+" Goblins");
    document.getElementById("donorName").value = "";
}

// add goblin items to list
function goblinitemAdd(goblinRarity) {
    var text = document.getElementById("donorName").value; 
    var li = "<li id='g"+hordeCount+"' style='display:inline' onclick=\"death('g"+hordeCount+"')\">Goblin " + text + " with </li><input type='text' value='"+goblinRarity+"'>";
    li += "<br>"
    document.getElementById("list").innerHTML += li;
    hordeCount++;
    goblinCounter(hordeCount);
    fumbleCheck(goblinRarity+" Goblin");
    document.getElementById("donorName").value = "";
}

// add death css
function death(idValue) {
    document.getElementById(idValue).classList.add('death');
}

// set goblin Count
function goblinCounter(count) {
    document.getElementById("hordeCount").innerHTML = count;
    setFumblePrompt();
}

// check horde
function checkHorde() {
    document.getElementById("hordeTitle").innerHTML = "Growing Horde";
    document.getElementById("popUpList").style.visibility = "visible";
    document.getElementById("horde").style.visibility = "hidden";
    document.getElementById("hide").style.visibility = "visible";
}

// hide horde
function hideHorde() {
    document.getElementById("popUpList").style.visibility = "hidden";
    document.getElementById("horde").style.visibility = "hidden";
    document.getElementById("hide").style.visibility = "hidden";
}

// show horde
function showHorde() {
    document.getElementById("popUpList").style.visibility = "visible";
    document.getElementById("horde").style.visibility = "visible";
    document.getElementById("hide").style.visibility = "hidden";
}

// change header to leader
function hordeLeader(goblinType) {
    var text = document.getElementById("donorName").value; 
    document.getElementById("hordeTitle").innerHTML = goblinType + " " + text + "'s Horde!";
    document.getElementById("hordeTitle").classList.remove("death");
    document.getElementById("donorName").value = "";
    hordeCount = 0;
    goblinCounter(hordeCount);
    document.getElementById("popUpList").style.visibility = "visible";
    document.getElementById("horde").style.visibility = "visible";
    document.getElementById("hide").style.visibility = "hidden";
}

// set fumblePrompt
function setFumblePrompt() {
    document.getElementById("fumblePrompt").innerHTML = "roll above "+hordeCount+" on a d100";
}

// fumble check
function fumbleCheck(fumblerType) {
    // perform roll animation

    // roll d100
    let x = Math.floor((Math.random() * 100) + 1);
    document.getElementById("fumbleRoll").innerHTML = x;

    // check if fumble
    if (x >= hordeCount) {
        document.getElementById("fumbleResult").innerHTML = "Fumble Check passed";
    } else {
        document.getElementById("fumbleResult").innerHTML = "Fumble Check FAILED!";
        var text = document.getElementById("donorName").value;
        document.getElementById("popUpFail").style.visibility = "visible";
        document.getElementById("fumbleCulprit").innerHTML = fumblerType+" "+text+" stumbles into the open!";
        document.getElementById("hordeTitle").innerHTML = fumblerType + " " + text + "'s Horde!";
        document.getElementById("hordeTitle").classList.remove("death");
    }
}

function fumbleHorde() {
    document.getElementById("popUpFail").style.visibility = "hidden";
    document.getElementById("popUpList").style.visibility = "visible";
    document.getElementById("horde").style.visibility = "visible";
    document.getElementById("hide").style.visibility = "hidden";
}

// end an encounter
function confirmEnd() {
    if (confirm('Are you sure you want to end this goblin horde?')) {
        // delete the list
        document.getElementById("list").innerHTML = "";

        // reset the heading to growing horde
        document.getElementById("hordeTitle").innerHTML = "Growing Horde";
        document.getElementById("hordeTitle").classList.remove("death");

        // set goblin horde count to 0
        hordeCount = 0;
        goblinCounter(hordeCount);

        // invis the horde list window
        hideHorde();
    } else {
        // Do nothing!
    }
}