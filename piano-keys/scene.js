const scale = 1;
const keyHeight = 80;

const WhiteKey = function (note, topWidth, bottomWidth, topPositionX, wholePositionX) {
    return {
        note: note,
        topWidth: topWidth,
        bottomWidth: bottomWidth,
        topPositionX: topPositionX,
        wholePositionX: wholePositionX,

        build(scene, octave, referencePositionX) {
            var bottom = BABYLON.MeshBuilder.CreateBox("whiteKeyBottom", {width: bottomWidth*scale, height: 1.5*scale, depth: 4.5*scale}, scene);
            var top = BABYLON.MeshBuilder.CreateBox("whiteKeyTop", {width: topWidth*scale, height: 1.5*scale, depth: 5*scale}, scene);
            top.position.z =  4.75*scale;
            top.position.x += topPositionX*scale;

            const key = BABYLON.Mesh.MergeMeshes([bottom, top], true, false, null, false, false);
            key.position.x = referencePositionX*scale + wholePositionX*scale;
            key.name = note+octave;
            
            key.position.y += keyHeight*scale;

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

            const key = BABYLON.MeshBuilder.CreateBox(note+octave, {width: 1.4*scale, height: 2*scale, depth: 5*scale}, scene);
            key.position.z += 4.75*scale;
            key.position.y += 0.25*scale;
            key.position.x = referencePositionX*scale + positionX*scale;
            key.material = blackMat;
            
            key.position.y += keyHeight*scale;

            return key;
        }
    }
}


const createScene = async function (engine) {
    const scene = new BABYLON.Scene(engine);

    const alpha =  3*Math.PI/2;
    const beta = Math.PI/50;
    const radius = 3.3;
    const target = new BABYLON.Vector3(0, 0, 0);
    
    const camera = new BABYLON.ArcRotateCamera("Camera", alpha, beta, radius, target, scene);
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.6;

    const keyParams = [
        WhiteKey("C", 1.4, 2.3, -0.45, -2.4*6),
        BlackKey("C#", -2.4*6+0.95),
        WhiteKey("D", 1.4, 2.4, 0, -2.4*5),
        BlackKey("D#", -2.4*6+0.95+2.85),
        WhiteKey("E", 1.4, 2.3, 0.45, -2.4*4),
        WhiteKey("F", 1.3, 2.4, -0.55, -2.4*3),
        BlackKey("F#", -2.4*6+0.95+0.45 + 2.4 * 2 + 1.85),
        WhiteKey("G", 1.3, 2.3, -0.2, -2.4*2),
        BlackKey("G#", -2.4*6+0.95+0.45 + 2.4 * 2 + 1.85 + 2.75),
        WhiteKey("A", 1.3, 2.3, 0.2, -2.4*1),
        BlackKey("A#", -2.4*6+0.95+0.45 + 2.4 * 2 + 1.85 + 2.75 *2),
        WhiteKey("B", 1.3, 2.4, 0.55, 0)
    ]

    const keys = new Set();

    //Octave 0
    keys.add(WhiteKey("A", 1.9, 2.3, -0.20, -2.4).build(scene, 0, -2.4*21))
    keyParams.slice(10, 12).forEach(key => {
        keys.add(key.build(scene, 0, -2.4*21))
    })

    //Octave 1-7
    var referencePositionX = -2.4*14;
    for (var octave=1; octave<=7; octave++) {
        keyParams.forEach(key => {
            keys.add(key.build(scene, octave, referencePositionX))
        })
        referencePositionX += 2.4*7;
    }

    //Octave 8
    keys.add(WhiteKey("C", 2.3, 2.3, 0, -2.4*6).build(scene, 8, referencePositionX))

    BABYLON.Mesh.prototype.scaleFromPivot = function(pivotPoint, sx, sy, sz) {
        var _sx = sx / this.scaling.x;
        var _sy = sy / this.scaling.y;
        var _sz = sz / this.scaling.z;
        this.scaling = new BABYLON.Vector3(sx, sy, sz); 
        this.position = new BABYLON.Vector3(pivotPoint.x + _sx * (this.position.x - pivotPoint.x), pivotPoint.y + _sy * (this.position.y - pivotPoint.y), pivotPoint.z + _sz * (this.position.z - pivotPoint.z));
    }

    keys.forEach(key => {
        key.scaleFromPivot(new BABYLON.Vector3(0, 0, 0), 0.015, 0.015, 0.015);
    })
    
    console.log(referencePositionX);
    // Piano Frame
    BABYLON.SceneLoader.ImportMesh("frame", "https://raw.githubusercontent.com/JING1201/babylonjs-exploration/main/piano-keys/", "pianoFrame.babylon", scene);

    const pointerToKey = new Map()
    const piano = await Soundfont.instrument(new AudioContext(), 'acoustic_grand_piano');

    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                if(pointerInfo.pickInfo.hit) {
                    const pickedMesh = pointerInfo.pickInfo.pickedMesh;
                    const pointerId = pointerInfo.event.pointerId;
                    if (keys.has(pickedMesh)) {
                        pickedMesh.position.y -= 0.5*scale;
                        pointerToKey.set(pointerId, {
                            mesh: pickedMesh,
                            note: piano.play(pointerInfo.pickInfo.pickedMesh.name)
                        });
                    }
                }
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                const pointerId = pointerInfo.event.pointerId;
                if (pointerToKey.has(pointerId)) {
                    pointerToKey.get(pointerId).mesh.position.y += 0.5*scale;
                    pointerToKey.get(pointerId).note.stop();
                    pointerToKey.delete(pointerId);
                }
                break;
        }

    });

    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 400*scale, height: 400*scale});
    ground.material = groundMat;

    const xrHelper = await scene.createDefaultXRExperienceAsync();
    
    const featuresManager = xrHelper.baseExperience.featuresManager;

    const pointerSelection = featuresManager.enableFeature(BABYLON.WebXRFeatureName.POINTER_SELECTION, "stable" /* or latest */, {
        xrInput: xrHelper.input,
        enablePointerSelectionOnAllControllers: true        
    });

    const teleportation = featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable", {
        xrInput: xrHelper.input,
        floorMeshes: [ground],
        snapPositions: [new BABYLON.Vector3(2.4*3.5*scale, 0, -10*scale)],
    });

    const handTracking = featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
        xrInput: xrHelper.input,
    });

    return scene;
};