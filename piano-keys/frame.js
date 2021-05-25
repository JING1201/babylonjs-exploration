const scale = 0.015;
const keyHeight = 80;

const buildFrame = function(scene, leftPositionX, rightPositionX) {
    const frameLeft = BABYLON.MeshBuilder.CreateBox("frameLeft", {width: 2.4*scale, height: (keyHeight+2)*scale, depth: 15*scale}, scene);
    frameLeft.position = new BABYLON.Vector3(leftPositionX*scale, (keyHeight+2)/2*scale, 4*scale);
    const frameRight = BABYLON.MeshBuilder.CreateBox("frameRight", {width: 2.4*scale, height: (keyHeight+2)*scale, depth: 15*scale}, scene);
    frameRight.position = new BABYLON.Vector3(rightPositionX*scale, (keyHeight+2)/2*scale, 4*scale);
    const frameBack = BABYLON.MeshBuilder.CreateBox("frameBack", {width: (2.4*52)*scale, height: (keyHeight+10)*scale, depth: 5*scale}, scene);
    frameBack.position = new BABYLON.Vector3(2.4*3.5*scale, (keyHeight+10)/2*scale, 9*scale);
    const wingLeft = BABYLON.MeshBuilder.CreateBox("wingLeft", {width: 2.4*scale, height: 8*scale, depth: 5*scale}, scene);
    wingLeft.position =  new BABYLON.Vector3(leftPositionX*scale, (keyHeight+6)*scale, 9*scale);
    const wingRight = BABYLON.MeshBuilder.CreateBox("wingRight", {width: 2.4*scale, height: 8*scale, depth: 5*scale}, scene);
    wingRight.position =  new BABYLON.Vector3(rightPositionX*scale, (keyHeight+6)*scale, 9*scale);
    
    const frame = BABYLON.Mesh.MergeMeshes([frameLeft, frameRight, frameBack, wingLeft, wingRight], true, false, null, false, false);
    const frameMat = new BABYLON.StandardMaterial("frameMat");
    frameMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
    frame.material = frameMat;

    frame.name = "frame";

    return frame;
}

var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    const frame = buildFrame(scene, -2.4*23, 84-2.4*5)
    return scene;
};
