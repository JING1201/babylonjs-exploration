    var whiteKeyBottom = BABYLON.MeshBuilder.CreateBox("whiteKeyBottom", {width: 2.3, height: 1.5, depth: 4.5}, scene);
    console.log(whiteKeyBottom.position);
    var whiteKeyTop = BABYLON.MeshBuilder.CreateBox("whiteKeyTop", {width: 1.4, height: 1.5, depth: 5}, scene);
    whiteKeyTop.position.z += 4.75;
    whiteKeyTop.position.x -= 0.45;
    const whiteKeyV1 = BABYLON.Mesh.MergeMeshes([whiteKeyBottom, whiteKeyTop], true, false, null, false, false);
    whiteKeyV1.position.x -= 2.4*7;
    whiteKeyV1.name = "C";

    var whiteKeyBottom = BABYLON.MeshBuilder.CreateBox("whiteKeyBottom", {width: 2.4, height: 1.5, depth: 4.5}, scene);
    var whiteKeyTop = BABYLON.MeshBuilder.CreateBox("whiteKeyTop", {width: 1.4, height: 1.5, depth: 5}, scene);
    whiteKeyTop.position.z += 4.75;
    const whiteKeyV2 = BABYLON.Mesh.MergeMeshes([whiteKeyBottom, whiteKeyTop], true, false, null, false, false);
    whiteKeyV2.position.x -= 2.4*6;

    var whiteKeyBottom = BABYLON.MeshBuilder.CreateBox("whiteKeyBottom", {width: 2.3, height: 1.5, depth: 4.5}, scene);
    var whiteKeyTop = BABYLON.MeshBuilder.CreateBox("whiteKeyTop", {width: 1.4, height: 1.5, depth: 5}, scene);
    whiteKeyTop.position.z += 4.75;
    whiteKeyTop.position.x += 0.45;
    const whiteKeyV3 = BABYLON.Mesh.MergeMeshes([whiteKeyBottom, whiteKeyTop], true, false, null, false, false);
    whiteKeyV3.position.x -= 2.4*5;

    var whiteKeyBottom = BABYLON.MeshBuilder.CreateBox("whiteKeyBottom", {width: 2.4, height: 1.5, depth: 4.5}, scene);
    var whiteKeyTop = BABYLON.MeshBuilder.CreateBox("whiteKeyTop", {width: 1.3, height: 1.5, depth: 5}, scene);
    whiteKeyTop.position.z += 4.75;
    whiteKeyTop.position.x -= 0.55;
    const whiteKeyV4 = BABYLON.Mesh.MergeMeshes([whiteKeyBottom, whiteKeyTop], true, false, null, false, false);
    whiteKeyV4.position.x -= 2.4*4;

    var whiteKeyBottom = BABYLON.MeshBuilder.CreateBox("whiteKeyBottom", {width: 2.3, height: 1.5, depth: 4.5}, scene);
    var whiteKeyTop = BABYLON.MeshBuilder.CreateBox("whiteKeyTop", {width: 1.3, height: 1.5, depth: 5}, scene);
    whiteKeyTop.position.z += 4.75;
    whiteKeyTop.position.x -= 0.2;
    const whiteKeyV5 = BABYLON.Mesh.MergeMeshes([whiteKeyBottom, whiteKeyTop], true, false, null, false, false);
    whiteKeyV5.position.x -= 2.4*3;

    var whiteKeyBottom = BABYLON.MeshBuilder.CreateBox("whiteKeyBottom", {width: 2.3, height: 1.5, depth: 4.5}, scene);
    var whiteKeyTop = BABYLON.MeshBuilder.CreateBox("whiteKeyTop", {width: 1.3, height: 1.5, depth: 5}, scene);
    whiteKeyTop.position.z += 4.75;
    whiteKeyTop.position.x += 0.2;
    const whiteKeyV6 = BABYLON.Mesh.MergeMeshes([whiteKeyBottom, whiteKeyTop], true, false, null, false, false);
    whiteKeyV6.position.x -= 2.4*2;

    var whiteKeyBottom = BABYLON.MeshBuilder.CreateBox("whiteKeyBottom", {width: 2.4, height: 1.5, depth: 4.5}, scene);
    var whiteKeyTop = BABYLON.MeshBuilder.CreateBox("whiteKeyTop", {width: 1.3, height: 1.5, depth: 5}, scene);
    whiteKeyTop.position.z += 4.75;
    whiteKeyTop.position.x += 0.55;
    const whiteKeyV7 = BABYLON.Mesh.MergeMeshes([whiteKeyBottom, whiteKeyTop], true, false, null, false, false);
    whiteKeyV7.position.x -= 2.4;

    var blackKey = BABYLON.MeshBuilder.CreateBox("blackKey", {width: 1.4, height: 2, depth: 5}, scene);
    blackKey.position.z += 4.75;
    blackKey.position.y += 0.25;
    blackKey.material = blackMat;
    blackKey.position.x -= 2.4*7 - 0.95

    var blackKey2 = blackKey.createInstance("blackKey2");
    blackKey2.position.x += 2.85

    var blackKey3 = blackKey.createInstance("blackKey3");
    blackKey3.position.x += 0.45 + 2.4 * 2 + 1.85

    var blackKey4 = blackKey.createInstance("blackKey4");
    blackKey4.position.x += 0.45 + 2.4 * 2 + 1.85 + 2.75

    var blackKey4 = blackKey.createInstance("blackKey5");
    blackKey4.position.x += 0.45 + 2.4 * 2 + 1.85 + 2.75 *2