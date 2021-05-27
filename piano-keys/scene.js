const WhiteKey = function (note, topWidth, bottomWidth, topPositionX, wholePositionX) {
    return {
        build(scene, register, referencePositionX) {
            // Create bottom part
            var bottom = BABYLON.MeshBuilder.CreateBox("whiteKeyBottom", {width: bottomWidth, height: 1.5, depth: 4.5}, scene);

            // Create top part
            var top = BABYLON.MeshBuilder.CreateBox("whiteKeyTop", {width: topWidth, height: 1.5, depth: 5}, scene);
            top.position.z =  4.75;
            top.position.x += topPositionX;

            // Merge bottom and top parts
            const key = BABYLON.Mesh.MergeMeshes([bottom, top], true, false, null, false, false);
            key.position.x = referencePositionX + wholePositionX;
            key.name = note + register;

            return key;
        }
    }
}

const BlackKey = function (note, wholePositionX) {
    return {
        build(scene, register, referencePositionX) {
            // Create black color material
            const blackMat = new BABYLON.StandardMaterial("black");
            blackMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
            
            // Create black key
            const key = BABYLON.MeshBuilder.CreateBox(note + register, {width: 1.4, height: 2, depth: 5}, scene);
            key.position.z += 4.75;
            key.position.y += 0.25;
            key.position.x = referencePositionX + wholePositionX;
            key.material = blackMat;

            return key;
        }
    }
}

BABYLON.Mesh.prototype.scaleFromPivot = function(pivotPoint, sx, sy, sz) {
    var _sx = sx / this.scaling.x;
    var _sy = sy / this.scaling.y;
    var _sz = sz / this.scaling.z;
    this.scaling = new BABYLON.Vector3(sx, sy, sz); 
    this.position = new BABYLON.Vector3(pivotPoint.x + _sx * (this.position.x - pivotPoint.x), pivotPoint.y + _sy * (this.position.y - pivotPoint.y), pivotPoint.z + _sz * (this.position.z - pivotPoint.z));
}

const createScene = async function(engine) {
    const scene = new BABYLON.Scene(engine);
    const scale = 0.015;

    const alpha =  3*Math.PI/2;
    const beta = Math.PI/50;
    const radius = 220*scale;
    const target = new BABYLON.Vector3(0, 0, 0);
    
    const camera = new BABYLON.ArcRotateCamera("Camera", alpha, beta, radius, target, scene);
    camera.attachControl(canvas, true);
    
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.6;

    const keyParams = [
        WhiteKey("C", 1.4, 2.3, -0.45, -14.4),
        BlackKey("C#", -13.45),
        WhiteKey("D", 1.4, 2.4, 0, -12),
        BlackKey("D#", -10.6),
        WhiteKey("E", 1.4, 2.3, 0.45, -9.6),
        WhiteKey("F", 1.3, 2.4, -0.55, -7.2),
        BlackKey("F#", -6.35),
        WhiteKey("G", 1.3, 2.3, -0.2, -4.8),
        BlackKey("G#", -3.6),
        WhiteKey("A", 1.3, 2.3, 0.2, -2.4),
        BlackKey("A#", -0.85),
        WhiteKey("B", 1.3, 2.4, 0.55, 0)
    ]
    
    const keys = new Set();

    // Register 1 through 7
    var referencePositionX = -2.4*14;
    for (var octave = 1; octave <= 7; octave++) {
        keyParams.forEach(key => {
            keys.add(key.build(scene, octave, referencePositionX))
        })
        referencePositionX += 2.4*7;
    }

    // Register 0
    keys.add(WhiteKey("A", 1.9, 2.3, -0.20, -2.4).build(scene, 0, -2.4*21))
    keyParams.slice(10, 12).forEach(key => {
        keys.add(key.build(scene, 0, -2.4*21))
    })
    
    // Register 8
    keys.add(WhiteKey("C", 2.3, 2.3, 0, -2.4*6).build(scene, 8, 84))

    keys.forEach(key => {
        key.position.y += 80;
        key.scaleFromPivot(new BABYLON.Vector3(0, 0, 0), scale, scale, scale);
    })
    
    BABYLON.SceneLoader.ImportMesh("frame", "https://raw.githubusercontent.com/JING1201/babylonjs-exploration/main/piano-keys/", "pianoFrame.babylon", scene, function(meshes) {
        const frame = meshes[0];
        frame.scaleFromPivot(new BABYLON.Vector3(0, 0, 0), scale, scale, scale);
    });

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

    const xrHelper = await scene.createDefaultXRExperienceAsync();

    const featuresManager = xrHelper.baseExperience.featuresManager;

    const pointerSelection = featuresManager.enableFeature(BABYLON.WebXRFeatureName.POINTER_SELECTION, "stable", {
        xrInput: xrHelper.input,
        enablePointerSelectionOnAllControllers: true        
    });

    const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 400, height: 400});

    const teleportation = featuresManager.enableFeature(BABYLON.WebXRFeatureName.TELEPORTATION, "stable", {
        xrInput: xrHelper.input,
        floorMeshes: [ground],
        snapPositions: [new BABYLON.Vector3(2.4*3.5*scale, 0, -10*scale)],
    });

    const handTracking = featuresManager.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
        xrInput: xrHelper.input,
    });

    return scene;
}