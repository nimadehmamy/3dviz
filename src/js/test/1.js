var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
directionalLight.position.set( 0, 1, 1 );
scene.add( directionalLight );


var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshLambertMaterial( { color: 0xffff00 } );
var cube = new THREE.Mesh( geometry, material );
//scene.add( cube );

var geometry1 = new THREE.TetrahedronGeometry( 1, 0 );
var material1 = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
var tet = new THREE.Mesh( geometry1, material1 );
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

//var light = new THREE.AmbientLight( 0xAA0040 ); // soft white light
//scene.add( light );
var s=1;
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
}
render();