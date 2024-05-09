class ArrayBoom extends Phaser.Scene {
    constructor() {
        super("arrayBoom");

        // Initialize a class variable "my" which is an object.
        // The object has two properties, both of which are objects
        //  - "sprite" holds bindings (pointers) to created sprites
        //  - "text"   holds bindings to created bitmap text objects
        this.my = {sprite: {}, text: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.laserBullet = [];   
        this.maxBullets = 10;           // Don't create more than this many bullets
        
        this.myScore = 0;       // record a score as a class variable
        // More typically want to use a global variable for score, since
        // it will be used across multiple scenes

        this.deltaX = 1;
        this.deltaY = 0.4;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("pinkAlien", "shipPink_manned.png");
        this.load.image("laserBullet", "laserGreen16.png");
        this.load.image("enemy1", "enemyRed5.png");

        // For animation
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        // Load the Kenny Rocket Square bitmap font
        // This was converted from TrueType format into Phaser bitmap
        // format using the BMFont tool.
        // BMFont: https://www.angelcode.com/products/bmfont/
        // Tutorial: https://dev.to/omar4ur/how-to-create-bitmap-fonts-for-phaser-js-with-bmfont-2ndc
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        // Sound asset from the Kenny Music Jingles pack
        // https://kenney.nl/assets/music-jingles
        this.load.audio("dadada", "jingles_NES13.ogg");
    }

    create() {
        let my = this.my;

        my.sprite.pinkAlien = this.add.sprite(game.config.width/2, game.config.height - 40, "pinkAlien");
        my.sprite.pinkAlien.setScale(0.5);

        my.sprite.enemy1 = this.add.sprite(game.config.width/2, 80, "enemy1");
        my.sprite.enemy1.setScale(0.5);
        my.sprite.enemy1.scorePoints = 25;

        // Notice that in this approach, we don't create any bullet sprites in create(),
        // and instead wait until we need them, based on the number of space bar presses

        // Create white puff animation
        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 20,    // Note: case sensitive (thank you Ivy!)
            repeat: 5,
            hideOnComplete: true
        });

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 7;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Array Boom.js</h2><br>A: left // D: right // Space: fire/emit // S: Next Scene'

        // Put score on screen
        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);

        // Put title on screen
        this.add.text(10, 5, "ADORABLE ALIEN STRIKES BACK!", {
            fontFamily: 'Courier, monospace',
            fontSize: 24,
            wordWrap: {
                width: 60
            }
        });
    }

    update() {
        let my = this.my;

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.pinkAlien.x > (my.sprite.pinkAlien.displayWidth/2)) {
                my.sprite.pinkAlien.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.pinkAlien.x < (game.config.width - (my.sprite.pinkAlien.displayWidth/2))) {
                my.sprite.pinkAlien.x += this.playerSpeed;
            }
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.laserBullet.length < this.maxBullets) {
                my.sprite.laserBullet.push(this.add.sprite(
                    my.sprite.pinkAlien.x, my.sprite.pinkAlien.y-(my.sprite.pinkAlien.displayHeight/2), "laserBullet")
                );
            }
        }

        // Remove all of the bullets which are offscreen
        // filter() goes through all of the elements of the array, and
        // only returns those which **pass** the provided test (conditional)
        // In this case, the condition is, is the y value of the bullet
        // greater than zero minus half the display height of the bullet? 
        // (i.e., is the bullet fully offscreen to the top?)
        // We store the array returned from filter() back into the bullet
        // array, overwriting it. 
        // This does have the impact of re-creating the bullet array on every 
        // update() call. 
        my.sprite.laserBullet = my.sprite.laserBullet.filter((laserBullet) => laserBullet.y > -(laserBullet.displayHeight/2));

        // Check for collision with the hippo
        for (let bullet of my.sprite.laserBullet) {
            if (this.collides(my.sprite.enemy1, bullet)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.enemy1.x, my.sprite.enemy1.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.enemy1.visible = false;
                my.sprite.enemy1.x = -100;
                my.sprite.enemy1.y = 100;
                // Update score
                this.myScore += my.sprite.enemy1.scorePoints;
                this.updateScore();
                // Play sound
                this.sound.play("dadada", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
                // Have new hippo appear after end of animation
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.enemy1.visible = true;
                    this.my.sprite.enemy1.x = Math.random()*config.width;
                }, this);

            }
        }
        
        if(this.my.sprite.enemy1.x == config.width){
            this.deltaX = -1;
            //this.deltaY = -1;
        } else if (this.my.sprite.enemy1.x == 0){
            this.deltaX = 1;
            //this.deltaY = 1;
        }

        //this.my.sprite.enemy1.y = (Math.sin((this.my.sprite.enemy1.x/5000) * 300) + 300);
        this.my.sprite.enemy1.x += this.deltaX;
        //this.my.sprite.enemy1.y += this.deltaY;

        
        if(this.my.sprite.enemy1.y > 0){
            this.deltaY = 1;
        } 
        this.my.sprite.enemy1.y += this.deltaY; 
        
        console.log("[", this.my.sprite.enemy1.x, ", " , this.my.sprite.enemy1.y, "]");
        // Make all of the bullets move
        for (let bullet of my.sprite.laserBullet) {
            bullet.y -= this.bulletSpeed;
        }

        /*
        // Load high score from local storage if available
        //var storedHighScore = localStorage.getItem('highScore');
        if (this.myScore) {
            highScore = parseInt(this.myScore);
            this.myScore.setText('High Score: ' + highScore);
        }

        // Example of updating the score
        if (this.myScore > highScore) {
            highScore = this.myScore;
            highScoreText.setText('High Score: ' + highScore);
            localStorage.setItem('highScore', highScore);
        }
        */
        
        if(this.my.sprite.enemy1.y > 600){
            this.add.text(game.config.width/2, 25, "GAME OVER!!! ENEMYSHIP ENTERS THE ALIEN'S PLANET!!! Press SPACE to continue", {
                fontFamily: 'Impact, sans-serif',
                fontSize: 42,
                wordWrap: {
                    width: 50
                }
            });
            if(this.space.isDown){
                this.scene.start("arrayBoom");
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            //this.scene.start("fixedArrayBullet");
            this.scene.start("arrayBoom");
        }

    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }

}
         