var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
directionalLight.position.set( 0, 1, 1 );
scene.add( directionalLight );


var geometry = Array(new THREE.BoxGeometry( 1, 1, 1 ));
geometry= geometry.concat([new THREE.TetrahedronGeometry( 1, 0 )]);
var material = new THREE.MeshLambertMaterial( { color: 0x0000ff } );
var cube = new THREE.Mesh( geometry[0], material );
//scene.add( cube );

//geometry.concat([new THREE.TetrahedronGeometry( 1, 0 )]);
material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
var tet = new THREE.Mesh( geometry[1], material );
//scene.add( tet);

var len = 3;
geometry = new THREE.CylinderGeometry( radiusTop=0.2, 0.2, len, 3, thetaLength=2 );
material = new THREE.MeshLambertMaterial( {color: 0xffff00} );

var cyls=[];
var n =4;
for (var i=0; i<n; i++){
  var cylinder = new THREE.Mesh( geometry, material );
  cylinder.position.set(len/2*Math.cos(2*i*Math.PI/n),len/2*Math.sin(2*i*Math.PI/n),0);
  cylinder.rotateZ(2*i*Math.PI/n+Math.PI/2);
  cyls = cyls.concat([cylinder]);
  scene.add( cyls[cyls.length - 1] );
 
}

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
//var light = new THREE.PointLight( 0xffffff, 1, 100 );
//light.position.set( 0, -1, -1 );
//scene.add( light );

camera.position.z = 5;

var axisHelper = new THREE.AxisHelper( 3 );
scene.add( axisHelper );

//var light = new THREE.AmbientLight( 0xAA0040 ); // soft white light
//scene.add( light );
var s=1;


// to get keypress

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

var cam_speed = .1;

var cam_update = function() {
    for(var key in keysDown) {
      var value = Number(key);
      if(value == 37) { // left arrow
        camera.position.x +=cam_speed;
      } else if (value == 39) { // right arrow
        camera.position.x -=cam_speed;
      } else if (value == 38) { // down arrow
        camera.position.z -=cam_speed;
      } else if (value == 40) { // up arrow
        camera.position.z +=cam_speed;
      } else {
        //
      }
    }
};


var link = function(v1,v2,alpha){
  /* constructs a link between points v1 and v2
  */
  var dv = new THREE.Vector3();
  dv.subVectors(v1,v2);
  // the midpoint of the link has to be the start position of the cylinder
  var start_pos = new THREE.Vector3().addVectors(v1,v2).divideScalar(2.0);
  //var start_pos = dv.divideScalar(2.0);
  //start_pos.addVectors(start_pos, v1);
  // to set rotations using a vector and angle (not needed yet)
  var quat = new THREE.Quaternion();
  quat.setFromAxisAngle(start_pos,alpha);
  cylinder.matrix.makeRotationFromQuaternion(quat);
  cylinder.matrixAutoUpdate = false;
  //cylinder.updateMatrix();
  
  return start_pos;
  
};

var link2 = function(v1,v2){
  /* constructs a link between points v1 and v2
  */
  cylinder.matrixAutoUpdate = false;
  
  var dv = new THREE.Vector3();
  dv.subVectors(v2,v1);
  // the midpoint of the link has to be the start position of the cylinder
  var start_pos = new THREE.Vector3().addVectors(v1,v2).divideScalar(2.0);
  
  // axis of cylinder
  var ax = new THREE.Vector3(0,1,0);
  // vr: normal to surface spanned by cylinder and dv
  var vr = new THREE.Vector3().crossVectors(dv, ax).normalize();
  cylinder.rotateOnAxis(vr,Math.acos(dv.dot(ax)/dv.length()/ax.length()));
  //cylinder.height = dv.length();
  cylinder.position.set(start_pos.x,start_pos.y,start_pos.z);
  
  cylinder.updateMatrix();
  return [start_pos, vr, dv,Math.acos(dv.dot(ax)/dv.length()/ax.length()),dv.length()];
  
};


var cylinder = cyls[cyls.length - 1];

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
	cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
/*
  cylinder.rotation.x += 0.01;
  if((cylinder.position.x < 2)&&(cylinder.position.x > -2) ){
  cylinder.position.x += 0.01*s;}
  else{
    s*=-1;
    cylinder.position.x += 0.01*s;
  }
  */
  tet.rotation.x +=0.01;
  cam_update();
}
render();