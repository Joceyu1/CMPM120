class Start extends Scene {
    create() {
        let storyData = this.engine.storyData;
        this.engine.setTitle(storyData.Title); 
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        let storyData = this.engine.storyData;
        this.engine.gotoScene(Location, storyData.InitialLocation); 
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body); 
        if ("Choices" in locationData) { 
            for(let choice of locationData.Choices) { 
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.")
        }

    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            if (choice == "The Mission") {
                this.keyAcquired = true;
            } else if (choice == "The Continuation") {
                this.clueObtained = true;
            } else if (choice == "Dimmed Building") {
                if (this.keyAcquired) {
                    this.engine.gotoScene(Location, choice.Target);
                } else {
                    this.engine.gotoScene(End);
                }
            } else if (choice == "The REAL Danger") {
                if (this.clueObtained) { 
                    this.engine.gotoScene(Location, choice.Target);
                } else {
                    this.gotoScene(End);
                }
            } else if (choice == "The Continuation") {
                if (this.flashlightOn){
                    this.engine.gotoScene(Location, choice.Target);
                } else {
                    this.gotoScene(End);
                }
            }
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');