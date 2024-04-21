class Monster extends Phaser.Scene {
    constructor() {
        super("monsterScene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        //Create constants for the monster location
        this.bodyX = 300;
        this.bodyY = 350;

        this.faceX = 300;
        this.faceY = 160;

        this.fangsX = this.bodyX;
        this.fangsY = this.bodyY - 135;

        this.frownX = this.bodyX;
        this.frownY = this.bodyY - 135;

        this.smileX = this.bodyX;
        this.smileY = this.bodyY - 135;

        this.leftArmX = this.bodyX - 100;
        this.leftArmY = this.bodyY + 45;

        this.rightArmX = this.bodyX + 100;
        this.rightArmY = this.bodyY + 45;

        this.leftLegX = this.bodyX - 120;
        this.leftLegY = this.bodyY + 150;

        this.rightLegX = this.bodyX + 120;
        this.rightLegY = this.bodyY + 150;

        //this.rightBrowX = this.bodyX - 100;
        //this.rightBrowY = this.bodyY + 10;

        //this.leftBrowX = this.bodyX + 100;
        //this.leftBrowY = this.bodyY + 10;

        this.rightEyeX = this.bodyX - 40;
        this.rightEyeY = this.bodyY - 210; 

        this.leftEyeX = this.bodyX + 40;
        this.leftEyeY = this.bodyY - 210; 

        this.rightEarX = this.bodyX - 82;
        this.rightEarY = this.bodyY - 225;

        this.leftEarX = this.bodyX + 82;
        this.leftEarY = this.bodyY - 225;

        this.antennaX = 325;
        this.antennaY = 35;
        
        this.counter = 0;
        this.smileType = 'Smile';
        
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        // Assets from Kenny Assets pack "Monster Builder Pack"
        // https://kenney.nl/assets/monster-builder-pack
        this.load.setPath("./assets/");

        // Load sprite atlas
        this.load.atlasXML("monsterParts", "spritesheet_default.png", "spritesheet_default.xml");

        // The loading of monster body parts::
        this.load.image("redBody", "body_redF.png");
        this.load.image("redFace", "body_redD.png");
        this.load.image("arm", "arm_darkB.png");
        this.load.image("catEar", "detail_dark_ear.png");
        this.load.image("antenna", "detail_white_antenna_large.png");
        this.load.image("eye", "eye_angry_red.png");
        //this.load.image("eyebrow", "eyebrowB.png");
        this.load.image("leg", "leg_redC.png");
        this.load.image("fangs", "mouthB.png");
        this.load.image("frown", "mouth_closed_fangs.png");
        this.load.image("smile", "mouth_closed_happy.png");
        
        // update instruction text
        document.getElementById('description').innerHTML = '<h2>Monster.js<br>S - smile // F - show fangs<br>A - move left // D - move right</h2>'

    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        // Create the main body sprite
        //
        // this.add.sprite(x,y, "{atlas key name}", "{name of sprite within atlas}")
        //
        // look in spritesheet_default.xml for the individual sprite names
        // You can also download the asset pack and look in the PNG/default folder.
        my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "monsterParts", "body_redF.png");

        my.sprite.face = this.add.sprite(this.faceX, this.faceY, "monsterParts", "body_redD.png");
       
        my.sprite.frown = this.add.sprite(this.frownX, this.frownY, "frown");
        my.sprite.fangs = this.add.sprite(this.fangsX, this.fangsY, "fangs");
        my.sprite.smile = this.add.sprite(this.smileX, this.smileY, "smile");
        
        my.sprite.leftEye = this.add.sprite(this.leftEyeX, this.leftEyeY, "eye");
        //leftEye.set_size(0.5);
        my.sprite.leftEye.scale = 0.5;
        my.sprite.leftEye.flipX = true;
        my.sprite.rightEye = this.add.sprite(this.rightEyeX, this.rightEyeY, "eye");
        //rightEye.set_size(0.5);
        my.sprite.rightEye.scale = 0.5; 
        
        my.sprite.leftLeg = this.add.sprite(this.leftLegX, this.leftLegY, "leg");
        my.sprite.leftLeg.flipX = true;
        my.sprite.rightLeg = this.add.sprite(this.rightLegX, this.rightLegY, "leg");

        my.sprite.leftArm = this.add.sprite(this.leftArmX, this.leftArmY, "arm");
        my.sprite.leftArm.flipX = true;
        my.sprite.rightArm = this.add.sprite(this.rightArmX, this.rightArmY, "arm");

        /*
        my.sprite.leftBrow = this.add.sprite(this.leftBrowX, this.leftBrowY, "eyebrow");
        my.sprite.leftBrow.flipX = true;
        my.sprite.rightBrow = this.add.sprite(this.rightBrowX, this.rightBrowY, "eyebrow");
        */

        my.sprite.leftEar = this.add.sprite(this.leftEarX, this.leftEarY, "catEar");
        my.sprite.leftEar.flipX = true;
        my.sprite.rightEar = this.add.sprite(this.rightEarX, this.leftEarY, "catEar");

        my.sprite.antenna = this.add.sprite(this.antennaX, this.antennaY, "antenna");

        // Create S Key: 
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        // Create F Key: 
        this.fKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        // Create A Key: 
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        // Create D Key: 
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.sKey.on('down', (key, event) => {
            my.sprite.smile.visible = true;
            my.sprite.fangs.visible = false;
            my.sprite.frown.visible = false; 
        });

        this.fKey.on('down', (key, event) => {
            my.sprite.smile.visible = false;
            my.sprite.fangs.visible = true;
            my.sprite.frown.visible = false;
        });

        my.sprite.smile.visible = false;
        my.sprite.fangs.visible = false;

    }

    update() {
        let my = this.my;    // create an alias to this.my for readability

        if(this.aKey.isDown){            
            for(const prop in my.sprite){
                my.sprite[prop].x = my.sprite[prop].x - 1;
            }
        }

        if(this.dKey.isDown){
            for(const prop in my.sprite){
                my.sprite[prop].x = my.sprite[prop].x + 1;
            }
        }
    }
}