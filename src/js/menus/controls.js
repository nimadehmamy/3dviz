var controls = new function(){
    this.scale = 1;
    this.nodeSize = 2.0;
    this.nodeExp = 1.0;
    //this.nodeColor = '#0000ff';
	  this.nodeColor = '#ede7e4';
    this.edgeDiameter = 1.;
    this.edgeSegments = 20;
    this.edgeOpacity = 1;
    this.nodeDetail = 3;
    this.edgeCross = 8;
    this.edgeStarriness = .0;
    this.edgeColorRandom = false;
    //this.edgeColor = '#ffffff';
	  this.edgeColor = '#0070c0';

    this.background = '#ffffff';
    // this.conflicts = 0.2;
    this.th = [];
    // this.showStress = false;
    // this.stressOpacity = false;
}


//gui.add(controls, 'edgeDiameter', 0.01, 0.5).onFinishChange(redrawEdges);
//gui.add(controls, 'edgeSegments', 1, 200).step(1).onFinishChange(redrawEdges);
var guiNet = gui.addFolder('Network Properties');
// guiNet.add(controls, 'scale', 0.00001, 10).onFinishChange(redrawAll);

var guiNode = guiNet.addFolder("Nodes");
var guiEdge = guiNet.addFolder("Edges");
gui.addColor(controls, 'background' ).onChange(background);
function background(){
  renderer.setClearColor( parseInt(controls.background.slice(1),16),1);
}

guiNode.add(controls, 'nodeSize', 0.0001, 10).step(0.001).onFinishChange(redrawNodes);
guiNode.add(controls, 'nodeDetail', 0, 10).step(1).onFinishChange(redrawNodes);
guiNode.add(controls, 'nodeExp', 0, 2).onFinishChange(redrawNodes);
guiNode.addColor(controls, 'nodeColor').onChange(recolorNodes);
controls.nodeGroupColor = false;
guiNode.add(controls, 'nodeGroupColor').onChange(function(){
    if (controls.nodeGroupColor) nodeGroupColor();
    else recolorNodes();
});


//----------
guiEdge.add(controls, 'edgeDiameter', 0.001, 4).step(0.01).onFinishChange(redrawEdges);
guiEdge.add(controls, 'edgeSegments', 1, 200).step(1).onFinishChange(redrawEdges);
guiEdge.add(controls, 'edgeCross', 3, 100).step(1).onFinishChange(redrawEdges);
guiEdge.add(controls, 'edgeStarriness', -.9,.9 ).step(.01).onFinishChange(redrawEdges);
guiEdge.addColor(controls, 'edgeColor').onChange(recolorEdges);

guiEdge.add(controls, 'edgeColorRandom').onFinishChange(recolorEdges);

guiEdge.add(controls, 'edgeOpacity', 0.0, 1).onChange(recolorEdges);


var guiCamera = gui.addFolder('Camera');
controls.follow = false;
guiCamera.add(controls,'follow').onChange(function(){
  if(controls.follow){
    console.log('Following ',clicked.id);
  }
  else console.log( "Warning: No element selected!");
});


controls.offset = 0.002;
// guiCamera.add(controls,'offset', 0.0001,.01);

// controls.camHelper = false;
// guiCamera.add(controls, 'camHelper').onChange(function(){
//     if (controls.camHelper === false) {
//         scene.remove(cameraHelper);
//     }
//     else {
//         scene.add(cameraHelper);
//     }
// });

misc.rotateCam = false;
guiCamera.add(misc, 'rotateCam').onChange(function(){
    if (misc.rotateCam){
        misc.rotCam();
    }else{
        clearTimeout(misc.rotCamTO);
    }
});
guiCamera.add(misc, 'camDist', 0.0001,100);
guiCamera.add(misc, 'camHeight', 0,3);
guiCamera.add(misc, 'camSpeed', 0.001,0.1);



var guiMisc = gui.addFolder('Misc.');

controls.grow = false;
guiMisc.add(controls, 'grow');

controls.axisHelper = false;
var axisHelper = new THREE.AxisHelper( 10 );

guiMisc.add(controls, 'axisHelper').onChange(function(){
    if (controls.axisHelper){
        scene.add( axisHelper );
    }else scene.remove( axisHelper );

});

var guiText = guiNode.addFolder('Text');
guiText.add(misc, 'fontSize', 0.1,20).onChange(misc.labelRedraw);
guiText.add(misc, 'textExtrusion', 1,2).onChange(misc.labelRedraw);
guiText.addColor(misc, 'textColor').onChange(misc.labelRecolor);
guiText.add(misc, 'textMin', 0,2).onFinishChange(misc.getNodeLabels);