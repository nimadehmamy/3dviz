var controls = new function(){
    this.scale = 1;
    this.nodeSize = 1.0;
    this.nodeExp = 1.0;
    //this.nodeColor = '#0000ff';
	  this.nodeColor = '#ede7e4';
    this.edgeDiameter = 1.;
    this.edgeSegments = 20;
    this.edgeOpacity = 1;
    this.nodeDetail = 3;
    this.edgeCross = 8;
    this.edgeStarriness = .0;
    this.edgeColorRandom = true;
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

guiNode.add(controls, 'nodeSize', 0.0001, 2000).step(0.001).onFinishChange(redrawNodes);
guiNode.add(controls, 'nodeDetail', 0, 10).step(1).onFinishChange(redrawNodes);
guiNode.add(controls, 'nodeExp', 0.1, 2).onFinishChange(redrawNodes);
guiNode.addColor(controls, 'nodeColor').onChange(redrawNodes);

guiEdge.add(controls, 'edgeDiameter', 0.001, 4).step(0.01).onFinishChange(redrawEdges);
guiEdge.add(controls, 'edgeSegments', 1, 200).step(1).onFinishChange(redrawEdges);
guiEdge.add(controls, 'edgeCross', 3, 100).step(1).onFinishChange(redrawEdges);
guiEdge.add(controls, 'edgeStarriness', -.9,.9 ).step(.01).onFinishChange(redrawEdges);
guiEdge.addColor(controls, 'edgeColor').onChange(redrawEdges);

guiEdge.add(controls, 'edgeColorRandom').onFinishChange(redrawEdges);

guiEdge.add(controls, 'edgeOpacity', 0.0, 1).onFinishChange(redrawEdges);


var guiCamera = gui.addFolder('Camera');
controls.follow = false;
guiCamera.add(controls,'follow').onChange(function(){
  if(controls.follow){
    console.log('Following ',clicked.id);
  }
  else console.log( "Warning: No element selected!");
});


controls.offset = 0.002;
guiCamera.add(controls,'offset', 0.0001,.01);

controls.camHelper = false;
guiCamera.add(controls, 'camHelper').onChange(function(){
    if (controls.camHelper === false) {
        scene.remove(cameraHelper);
    }
    else {
        scene.add(cameraHelper);
    }
});


var guiMisc = gui.addFolder('Misc.');

controls.grow = false;
guiMisc.add(controls, 'grow');

controls.axisHelper = false;
var axisHelper = new THREE.AxisHelper( 10 );

guiMisc.add(controls, 'axisHelper').onChange(function(){
    if (controls.axisHelper){
        scene.add( axisHelper );
    }else scene.remove( axisHelper );

})


