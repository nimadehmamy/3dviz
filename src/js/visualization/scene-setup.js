
var container, stats;
var scene, camera, cameraCtrl, renderer;

// ---- scene
container = document.getElementById('canvas-container');
scene = new THREE.Scene();

// ---- renderer
renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setClearColor( 0xffffff,1);//0x232329 0xffffff
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);


// ---- camera
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

camera.position.z = 15;
// camera orbit control

// cameraCtrl = new THREE.OrbitControls(camera, container);
cameraCtrl = new THREE.TrackballControls(camera, container);
cameraCtrl.object.position.y = 50;
cameraCtrl.update();


// ---- stats
stats = new Stats();
//container.appendChild(stats.domElement);
var obj = document.getElementById('obj');
obj.appendChild(stats.domElement);
stats.domElement.style.width = "100%"
stats.domElement.children.ms.children.msText.style.padding = "0 0 0 10px";
stats.domElement.children.fps.children.fpsText.style.padding = "0 0 0 10px";
stats.domElement.children.ms.children.msGraph.style.padding = "0";
stats.domElement.children.fps.children.fpsGraph.style.padding = "0";
// stats.domElement.children.ms.children.msGraph.style.width = "100%";
// stats.domElement.children.fps.children.fpsGraph.style.width = "100%";

// ---- scene settings
var scene_settings = {
	pause: false,
	bgColor: 0x0f0f0f
};


/*
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
container = document.getElementById('canvas-container');
// camera orbit control
cameraCtrl = new THREE.OrbitControls(camera, container);
cameraCtrl.object.position.y = 150;
cameraCtrl.update();

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

*/

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
directionalLight.position.set( 0, 1, 1 );
scene.add( directionalLight );

var directionalLight2 = new THREE.DirectionalLight( 0xaaaaaa, 0.9 );
directionalLight2.position.set( 0, -2, -2 );
scene.add( directionalLight2 );


var light = new THREE.AmbientLight( 0x505050 ); // soft white light
scene.add( light );
//var light = new THREE.PointLight( 0xffffff, 1, 100 );
//light.position.set( 0, -1, -1 );
//scene.add( light );

//camera.position.z = 5;


//==============


// function render() {
// 	requestAnimationFrame( render );
// 	renderer.render( scene, camera );
//   //cam_update();
//   stats.update();
// }

// function animate() {
// 	requestAnimationFrame( animate );
// 	render();
// 	stats.update();
// 	misc.grow();
// }

var gui = new dat.GUI();


      var parent1;
      var tube, tubeMesh;
      var animation = false, lookAhead = false;
      var showCameraHelper = false;
      var targetRotation = 0;
      
      parent1 = new THREE.Object3D();
			parent1.position.y = 1.0;
			scene.add( parent1 );
			splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 1000 );
			parent1.add( splineCamera );
			cameraHelper = new THREE.CameraHelper( splineCamera );
			//scene.add( cameraHelper );
			
			var normal = new THREE.Vector3();
			//var cameraEye = new THREE.Mesh( new THREE.SphereGeometry( 5 ), new THREE.MeshBasicMaterial( { color: 0xdddddd } ) );
			//parent1.add( cameraEye );



function render() {
	// Try Animate Camera Along Spline
	var time = Date.now();
	var looptime = 20 * 1000;
	var t = ( time % looptime ) / looptime;
	if (clicked){
	  if ((clicked.type == 'link')&& controls.follow){
	    tube = edges[clicked.id].link;
	    var pos = tube.extrudeSettings.extrudePath.getPointAt( t );//tube.parameters.path.getPointAt( t );
      //console.log(pos);
	 
		//pos.multiplyScalar( scale );
    	// interpolation
    	var segments = tube.extrudeSettings.steps; //tube.tangents.length;
// 	var pickt = t * segments;
// 	var pick = Math.floor( pickt );
// 	var pickNext = ( pick + 1 ) % segments;
// 	binormal.subVectors( tube.binormals[ pickNext ], tube.binormals[ pick ] );
// 	binormal.multiplyScalar( pickt - pick ).add( tube.binormals[ pick ] );
     	var dir = tube.extrudeSettings.extrudePath.getTangentAt(t);
     	//tube.parameters.path.getTangentAt( t );
     	var offset = controls.offset;
  // 	normal.copy( binormal ).cross( dir );
  // 	// We move on a offset on its binormal
      normal = new THREE.Vector3().copy(dir).cross(new THREE.Vector3(1,0,0));
      pos.add( normal.clone().multiplyScalar( offset )); //.multiplyScalar( offset ) );
     	splineCamera.position.copy( pos );
     	//cameraEye.position.copy( pos );
  // 	// Camera Orientation 1 - default look at
  // 	// splineCamera.lookAt( lookAt );
  // 	// Using arclength for stablization in look ahead.
   	  var lookAt = tube.extrudeSettings.extrudePath.getPointAt( ( t + 0.0001 ) % 1 );//.multiplyScalar( scale );
  // 	// Camera Orientation 2 - up orientation via normal
     	if (!lookAhead)
     	lookAt.copy( pos ).add( dir );
     	splineCamera.matrix.lookAt(splineCamera.position, lookAt, normal);
     	splineCamera.rotation.setFromRotationMatrix( splineCamera.matrix, splineCamera.rotation.order );
     	cameraHelper.update();
     	parent1.rotation.y += ( targetRotation - parent1.rotation.y ) * 0.05;
	  }
	}
	renderer.render( scene, controls.follow === true ? splineCamera : camera );
}


function centerCamera(){
    var ii = 0, com = {x:0,y:0,z:0};
    for (i in nodes){
        ii++;
        p = nodes[i].node.position;
        com.x += p.x;
        com.y += p.y;
        com.z += p.z;
    }
    com.x /= ii; com.y/=ii; com.z/=ii;
    cameraCtrl.target.set(com.x,com.y,com.z);
}