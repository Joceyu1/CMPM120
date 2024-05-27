class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }
 
 
    init() {
        // variables and settings
        this.ACCELERATION = 200;
        this.DRAG = 500;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
    }
 
 
     preload(){
         this.load.scenePlugin("AnimatedTiles", "./lib/AnimatedTiles.js", "animatedTiles", "animatedTiles");
         this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");
     }
 
 
     create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 120, 30);
 
 
        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
 
 
        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
 
 
        this.flag = this.map.createFromObjects("Objects", {
            name: "flag",
            key: "tilemap_sheet",
            frame: 151
        });
 
 
        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });
 
 
        // TODO: Add createFromObjects here
        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });
       
        this.enemies = this.map.createFromObjects("Objects", {
            name: "enemy",
            key: "platformer_characters",
            frame: "tile_0015.png",
        });
 
 
        /*
        this.spikes = this.map.createFromObjects("Objects", {
            name: "spike",
            key: "tilemap_sheet"
        });
        */
        /*
        this.anims.create({
            key: 'spin',
            defaultTextureKey: "tilemap_sheet",
            frames: this.anims.generateFrameNumbers("coin", {start: 0, end: 5}),
            frameRate: 10,
            repeat: -1
        });
 
 
        this.objectsLayer = this.map.createLayer("Objects", this.tileset, 0, 0);    
       
        let coinObjects = this.map.filterObjects("Objects", obj => obj.name === "coin")
        this.coins = this.add.group();
        for (let coin of coinObjects) {
            let animCoinSprite = this.physics.add.sprite(coin.x, coin.y, coin.key);
            this.coins.add(animCoinSprite);
            animCoinSprite.anims.play('spin'); // anim_key comes from prior this.anims.create call
         }  
        */
        //this.animatedTiles.init(this.map);
        // TODO: Add turn into Arcade Physics here
        // Since createFromObjects returns an array of regular Sprites, we need to convert
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move)
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
 
 
        //Create a Phaser group out of the arry this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);
       
        //Create group for enemies::
        this.enemyGroup = this.add.group(this.enemies);
        this.moveSpeed = 13;
        for(let enemy of this.enemies){
            enemy.rightbound = enemy.x + 200;
            enemy.leftbound = enemy.x - 200;
            enemy.gotoRight = true;
        }
        //this.animatedTiles.init(this.map);
 
 
        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 345, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);
 
 
        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
       
        this.myScore = 0;
        my.text.score = this.add.text(32, 32, `Coins: ${this.myScore}`, {
            fontFamily: "rocketSquare",
            fontSize: '32px',
            backgroundColor: '#000000'
        }).setScrollFactor(0);
        // TODO: Add coin collision handler
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); //Removes the coin on overlap
            this.myScore += 10;
            my.text.score.text = `Coins: ${this.myScore}`;
            console.log(this.myScore);
        });
 
 
        this.animatedTiles.init(this.map);
 
 
        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
 
 
        this.rKey = this.input.keyboard.addKey('R');
 
 
        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
 
 
        // TODO: Add movement vfx here
        // ************ The main issue of my program is located at here::
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            //random: true,
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 8,
           lifespan: 350,
            // TODO: Try: gravityY: -400,
            gravityY: -400,
            alpha: {start: 1, end: 0.1},
       });
 
 
        my.vfx.walking.stop();
 
 
        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['star_02.png', 'star_09.png'],
            // TODO: Try: add random: true
            random: true,
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 18,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            gravityY: -400,
            alpha: {start: 1, end: 0.1},
        });
 
 
        my.vfx.jumping.stop();
       
        // TODO: add camera code here
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
       
        //my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);
 
 
        this.add.text(10, 100, "FLOATY COLLECTS THEIR COINS~! *Watch out for the enemies.... >:)", {
            fontFamily: 'Times, serif',
            fontSize: 12,
            wordWrap: {
                width: 60
            }
        });
    }
 
 
    update() {
        if(cursors.left.isDown) {
            //console.log("jfdkjfksdfjskf"); //Testing to see if the console of the game even goes here (which it does).
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
 
 
            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }
        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(-this.PARTICLE_VELOCITY, 0);
 
 
            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }
        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            // TODO: have the vfx stop playing
            my.vfx.walking.stop();
            my.vfx.jumping.stop();
        }
        this.doubleJumpActive = true;
        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            this.sound.play("bongbong");
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.doubleJumpActive = false;
            my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.jumping.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            my.vfx.jumping.start();
        } else if(!my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up) && this.doubleJumpActive === true){
            //Double Jumping Here  
            this.sound.play("bongbong");  
            my.sprite.player.body.setVelocityY(-300);
        }
       
        this.moveSpeed = 1;
        for(let enemy of this.enemies){
            if(enemy.gotoRight){
                enemy.setX(enemy.x + this.moveSpeed);
            } else {
                enemy.setX(enemy.x - this.moveSpeed);
            }
            if(enemy.x > enemy.rightbound){
                enemy.gotoRight = false;
            } else if (enemy.x < enemy.leftbound){
                enemy.gotoRight = true;
            }
            if(this.collides(my.sprite.player, enemy)){
                this.add.text(500, 125, "GAME OVER! Press r to reset the game...", {
                fontFamily: 'Times, serif',
                fontSize: 35,
                wordWrap: {
                    width: 100
                }
            });
            } 
        }
        
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
 }
 