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
scene.add( cube );

//geometry.concat([new THREE.TetrahedronGeometry( 1, 0 )]);
var material1 = new THREE.MeshLambertMaterial( { color: 0xffff00 } );
var tet = new THREE.Mesh( geometry[1], material1 );
scene.add( tet);

var geometry2 = new THREE.CylinderGeometry( radiusTop=1, 1, 2, 5, thetaLength=1 );
var material2 = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var cylinder = new THREE.Mesh( geometry2, material1 );
//cylinder.rotation.y=0.1;
scene.add( cylinder );

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




function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
	cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cylinder.rotation.x += 0.01;
  if((cylinder.position.x < 2)&&(cylinder.position.x > -2) ){
  cylinder.position.x += 0.01*s;}
  else{
    s*=-1;
    cylinder.position.x += 0.01*s;
  }
  tet.rotation.x +=0.01;
  cam_update();
}
render();