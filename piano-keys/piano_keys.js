const scale = 1;
const keyHeight = 130;

const WhiteKey = function (note, topWidth, bottomWidth, topPositionX, wholePositionX) {
    return {
        note: note,
        topWidth: topWidth,
        bottomWidth: bottomWidth,
        topPositionX: topPositionX,
        wholePositionX: wholePositionX,

        build(scene, octave, referencePositionX) {
            var bottom = BABYLON.MeshBuilder.CreateBox("whiteKeyBottom", {width: bottomWidth/scale, height: 1.5/scale, depth: 4.5/scale}, scene);
            var top = BABYLON.MeshBuilder.CreateBox("whiteKeyTop", {width: topWidth/scale, height: 1.5/scale, depth: 5/scale}, scene);
            top.position.z =  4.75/scale;
            top.position.x += topPositionX/scale;

            const key = BABYLON.Mesh.MergeMeshes([bottom, top], true, false, null, false, false);
            key.position.x = referencePositionX + wholePositionX/scale;
            key.name = note+octave;
            
            key.position.y += keyHeight/scale;

            return key;
        }
    }
}

const BlackKey = function (note, positionX) {
    return {
        note: note,
        positionX: positionX,
        
        build(scene, octave, referencePositionX) {
            const blackMat = new BABYLON.StandardMaterial("black");
            blackMat.diffuseColor = new BABYLON.Color3(0, 0, 0);

            const key = BABYLON.MeshBuilder.CreateBox(note+octave, {width: 1.4/scale, height: 2/scale, depth: 5/scale}, scene);
            key.position.z += 4.75/scale;
            key.position.y += 0.25/scale;
            key.position.x = referencePositionX + positionX/scale;
            key.material = blackMat;
            
            key.position.y += keyHeight/scale;

            return key;
        }
    }
}



var createScene = async function () {
    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    const alpha =  3*Math.PI/2;
    const beta = Math.PI/6;
    const radius = 1000/scale;
    const target = new BABYLON.Vector3(0, 0, 0);
    
    const camera = new BABYLON.ArcRotateCamera("Camera", alpha, beta, radius, target, scene);
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    const keyParams = [
        WhiteKey("C", 1.4, 2.3, -0.45, -2.4*6),
        WhiteKey("D", 1.4, 2.4, 0, -2.4*5),
        WhiteKey("E", 1.4, 2.3, 0.45, -2.4*4),
        WhiteKey("F", 1.3, 2.4, -0.55, -2.4*3),
        WhiteKey("G", 1.3, 2.3, -0.2, -2.4*2),
        WhiteKey("A", 1.3, 2.3, 0.2, -2.4*1),
        WhiteKey("B", 1.3, 2.4, 0.55, 0),
        BlackKey("C#", -2.4*6+0.95),
        BlackKey("D#", -2.4*6+0.95+2.85),
        BlackKey("F#", -2.4*6+0.95+0.45 + 2.4 * 2 + 1.85),
        BlackKey("G#", -2.4*6+0.95+0.45 + 2.4 * 2 + 1.85 + 2.75),
        BlackKey("A#", -2.4*6+0.95+0.45 + 2.4 * 2 + 1.85 + 2.75 *2),
    ]

    const keys = new Set();
    var referencePositionX = -2.4*7;
    for (var octave=2; octave<=6; octave++) {
        keyParams.forEach(key => {
            keys.add(key.build(scene, octave, referencePositionX))
        })
        referencePositionX += 2.4*7;
    }

    let pointerToKey = new Map()

    let piano = await Soundfont.instrument(new AudioContext(), 'acoustic_grand_piano');

    scene.onPointerObservable.add((pointerInfo) => {
        
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                console.log(pointerInfo);
                console.log("POINTER DOWN");
                if(pointerInfo.pickInfo.hit) {
                    const pickedMesh = pointerInfo.pickInfo.pickedMesh;
                    const pointerId = pointerInfo.event.pointerId;
                    if (keys.has(pickedMesh)) {
                        pickedMesh.position.y -= 0.5/scale;
                        pointerToKey.set(pointerId, {
                            mesh: pickedMesh,
                            note: piano.play(pointerInfo.pickInfo.pickedMesh.name)
                        });
                    }
                }
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                console.log("POINTER UP");
                const pointerId = pointerInfo.event.pointerId;
                if (pointerToKey.has(pointerId)) {
                    pointerToKey.get(pointerId).mesh.position.y += 0.5/scale;
                    pointerToKey.get(pointerId).note.stop();
                    pointerToKey.delete(pointerId);
                }
                break;
        }

    });

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 400/scale, height: 400/scale});
    ground.position.x -= 0.1;

    // const xrHelper = await scene.createDefaultXRExperienceAsync({
    //     floorMeshes: [ground]
    // });
    
    // const featureManager = xrHelper.baseExperience.featuresManager;

    // featureManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
    //     xrInput: xrHelper.input,
    // });

    return scene;
};