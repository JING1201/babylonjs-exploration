
const WhiteKey = function (name, topWidth, bottomWidth, topPositionX, wholePositionX) {
    return {
        name: name,
        topWidth: topWidth,
        bottomWidth: bottomWidth,
        topPositionX: topPositionX,
        wholePositionX: wholePositionX,
        build(scene) {
            var bottom = BABYLON.MeshBuilder.CreateBox("whiteKeyBottom", {width: bottomWidth, height: 1.5, depth: 4.5}, scene);
            var top = BABYLON.MeshBuilder.CreateBox("whiteKeyTop", {width: topWidth, height: 1.5, depth: 5}, scene);
            top.position.z += 4.75;
            top.position.x += topPositionX;
            const key = BABYLON.Mesh.MergeMeshes([bottom, top], true, false, null, false, false);
            key.position.x = wholePositionX;
            key.name = name;
        }
    }
}

const BlackKey = function (name, positionX) {
    return {
        name: name,
        positionX: positionX,
        build(scene) {
            const blackMat = new BABYLON.StandardMaterial("black");
            blackMat.diffuseColor = new BABYLON.Color3(0, 0, 0);

            const key = BABYLON.MeshBuilder.CreateBox(name, {width: 1.4, height: 2, depth: 5}, scene);
            key.position.z += 4.75;
            key.position.y += 0.25;
            key.position.x = positionX;
            key.material = blackMat;
        }
    }
}

const keys = [
    WhiteKey("C4", 1.4, 2.3, -0.45, -2.4*7),
    WhiteKey("D4", 1.4, 2.4, 0, -2.4*6),
    WhiteKey("E4", 1.4, 2.3, 0.45, -2.4*5),
    WhiteKey("F4", 1.3, 2.4, -0.55, -2.4*4),
    WhiteKey("G4", 1.3, 2.3, -0.2, -2.4*3),
    WhiteKey("A4", 1.3, 2.3, 0.2, -2.4*2),
    WhiteKey("B4", 1.3, 2.4, 0.55, -2.4*1),
    BlackKey("C#4", -2.4*7+0.95),
    BlackKey("D#4", -2.4*7+0.95+2.85),
    BlackKey("F#4", -2.4*7+0.95+0.45 + 2.4 * 2 + 1.85),
    BlackKey("G#4", -2.4*7+0.95+0.45 + 2.4 * 2 + 1.85 + 2.75),
    BlackKey("A#4", -2.4*7+0.95+0.45 + 2.4 * 2 + 1.85 + 2.75 *2),
]

var createScene = async function () {
    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 0);
    camera.setPosition(new BABYLON.Vector3(-40, 30, -50))
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    keys.forEach(key => key.build(scene));

    camera.lockedTarget = new BABYLON.Vector3(-10, 0, 2);

    let pointerToKey = new Map()

    let piano = await Soundfont.instrument(new AudioContext(), 'acoustic_grand_piano');

    scene.onPointerObservable.add((pointerInfo) => {
        
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                console.log(pointerInfo);
                console.log("POINTER DOWN");
                if(pointerInfo.pickInfo.hit) {
                    pointerInfo.pickInfo.pickedMesh.position.y -= 0.5;
                    pointerToKey.set(pointerInfo.event.pointerId, {
                        mesh: pointerInfo.pickInfo.pickedMesh,
                        note: piano.play(pointerInfo.pickInfo.pickedMesh.name)
                    });
                }
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                console.log("POINTER UP");
                if (pointerToKey.has(pointerInfo.event.pointerId)) {
                    pointerToKey.get(pointerInfo.event.pointerId).mesh.position.y += 0.5;
                    pointerToKey.get(pointerInfo.event.pointerId).note.stop();
                    pointerToKey.delete(pointerInfo.event.pointerId);
                }
                break;
        }

    });

    const xrPromise = scene.createDefaultXRExperienceAsync({});
    
    return xrPromise.then((xrExperience) => {
        console.log("Done, WebXR is enabled.");
        return scene;
    });


    // const featureManager = xrHelper.baseExperience.featuresManager;

    // featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
    //     xrInput: xrHelper.input,
    // });
};