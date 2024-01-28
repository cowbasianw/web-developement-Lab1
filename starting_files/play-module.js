/* In this module, create three classes: Play, Act, and Scene. */


class Scene {
    constructor(name, title, stageDirection, speeches = []) {
        this.name = name;
        this.title = title;
        this.stageDirection = stageDirection;
        this.speeches = speeches.map(speechData => ({
            speaker: speechData.speaker,
            lines: speechData.lines.map(line => String(line)), // Convert to string
        }));

    }
}



class Act {
    constructor(name, scenes = []) {
        this.name = name;
        this.scenes = scenes.map(sceneData => new Scene(sceneData.name, sceneData.title, sceneData.stageDirection, sceneData.speeches));
    }


}

class Play {
    constructor(title, acts = [], persona) {
        this.title = title;
        this.acts = acts.map(actData => new Act(actData.name, actData.scenes));
        this.persona = persona;
    }
}


export { Scene, Act, Play };
