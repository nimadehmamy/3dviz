
	var container, stats;
	var scene, camera, cameraCtrl, renderer;

	// ---- scene
	container = document.getElementById('canvas-container');
	scene = new THREE.Scene();

	// ---- camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
	// camera orbit control
	cameraCtrl = new THREE.OrbitControls(camera, container);
	cameraCtrl.object.position.y = 150;
	cameraCtrl.update();

	// ---- renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	// ---- stats
	stats = new Stats();
	container.appendChild(stats.domElement);

	// ---- scene settings
	var scene_settings = {
		pause: false,
		bgColor: 0x0d0d0f
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

var directionalLight2 = new THREE.DirectionalLight( 0xff8800, 0.9 );
directionalLight2.position.set( 0, -2, -2 );
scene.add( directionalLight2 );


var light = new THREE.AmbientLight( 0x505050 ); // soft white light
scene.add( light );
//var light = new THREE.PointLight( 0xffffff, 1, 100 );
//light.position.set( 0, -1, -1 );
//scene.add( light );

//camera.position.z = 5;


//==============
var detail = 3;
var ngon = 8; //cross-section n-gon
var sz = 1.0;
var tubseg = 20;
var theta = Math.PI/4;

var axisHelper = new THREE.AxisHelper( 3 );
scene.add( axisHelper );

//var light = new THREE.AmbientLight( 0xAA0040 ); // soft white light
//scene.add( light );

function readTextFile(file){
  var allText;
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function ()
  {
      if(rawFile.readyState === 4)
      {
          if(rawFile.status === 200 || rawFile.status == 0)
          {
              allText = rawFile.responseText;
              //alert(allText);
          }
      }
  };
  rawFile.send(null);
  return allText;
}

function readMatrix(file,sep){
  "First split to get lines, then split with 'sep' and conver to numbers";
  var text = readTextFile(file);
  //console.log(text);
  var mat = [];
  var s = text.split('\n');
  for (i in s){
    if(s[i] == ''){continue;}
    i = s[i].split(sep);
    var ii = [];
    for (j in i){
      ii = ii.concat(Number(i[j]));
      //console.log(i);
    }
    //console.log([ii]);
    mat = mat.concat([ii]);
    //console.log(mat);
  }
  return mat;
}

function arc_len(d,theta){
  return d/(2*Math.sin(theta/2))
}

var node = function(id,v,s){
  /* make node with id at v (vector) and with size s
  */
  this.id = id;
  this.size = s;
  this.geometry = new THREE.TetrahedronGeometry( this.size, detail );
  this.material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  this.node = new THREE.Mesh( this.geometry, this.material );
  this.position = this.node.position
  this.position.set(v.x,v.y,v.z);
  this.degree = 0;
};

//TorusGeometry(radius, tube, radialSegments, tubularSegments, arc)
var link = function(id1,id2,rad,torus, theta){
  /* make a link from v1 to v2 (vectors) with radius rad and length len
  */
  this.endpoints = [id1,id2];
  var v1 = nodes[id1].position;
  var v2 = nodes[id2].position;
  var dv = new THREE.Vector3();
  dv.subVectors(v2,v1);
  // the midpoint of the link has to be the start position of the cylinder
  var start_pos = new THREE.Vector3().addVectors(v1,v2).divideScalar(2.0);
  // axis of cylinder
  var ax = new THREE.Vector3(0,1,0);
  // vr: normal to surface spanned by cylinder and dv
  var vr = new THREE.Vector3().crossVectors( ax, dv).normalize();
  
  //arc_len(dv.length , theta)
  this.size = s;
  if (!(torus)){
    this.geometry = new THREE.CylinderGeometry( radiusTop=rad, rad, dv.length(), ngon, thetaLength=2 );
  }
  else {
    this.geometry = new THREE.TorusGeometry(radius = 1, tube=rad, radialSegments=ngon, tubularSegments=tubseg, arc = theta)
  }
  this.material = new THREE.MeshLambertMaterial( { color: 0xffff00 } );
  this.link = new THREE.Mesh( this.geometry, this.material );
  this.position = this.link.position;
  
  this.link.matrixAutoUpdate = false;
  
  this.link.rotateOnAxis(vr,Math.acos(dv.dot(ax)/dv.length()/ax.length()));
  this.link.position.set(start_pos.x,start_pos.y,start_pos.z);
  this.link.updateMatrix();
};



var cam_speed = .1;
var cam_loc= 5;
var nodes_loc= readMatrix('assets/network/nodes-Jianxi.txt',' ');
var edge_list= readMatrix('assets/network/edgelist-Jianxi.txt',' ');
var weights = readMatrix('assets/network/weights-Jianxi.txt',' ');
//var nodes_loc= readMatrix('assets/network/nodes-test.txt',' ');
//var edge_list= readMatrix('assets/network/edge-test.txt',' ');
//var weights = readMatrix('assets/network/weight-test.txt',' ');


var nodes = {};
// first find center of all points
var com = [0,0,0];
for(i in nodes_loc){
  var ii = nodes_loc[i];
  com = [com[0]+ii[0],com[1]+ii[1],com[2]+ii[2]];
}
var nl = nodes_loc.length
com = [com[0]/nl,com[1]/nl,com[2]/nl];

function get_degrees(elist){
  var k = {};
  for (i in elist){
    if (k[elist[i][0]]){k[elist[i][0]] +=1;}
    else {k[elist[i][0]] =1;}
    if (k[elist[i][1]]){k[elist[i][1]] +=1;}
    else {k[elist[i][1]] =1;}
  }
  return k
}

var degrees = get_degrees(edge_list);
var sc = 20.0;

for(i in nodes_loc){
  var ii = nodes_loc[i];
  //console.log(ii);
  if (ii.length == 3){ id = i;}
  //nodes = nodes.concat(new node(i, new THREE.Vector3(ii[0],ii[1],ii[2]),1));
  nodes[id] = new node(id, new THREE.Vector3(ii[0]-com[0],ii[1]-com[1],ii[2]-com[2]),degrees[i]/sc);
  scene.add(nodes[id].node);
  cam_loc = Math.max(cam_loc,ii[2]);
  cam_speed = cam_loc/100.0 ;
  //scene.add(nodes[nodes.length-1].node);
}

for (id in nodes){
  var r = nodes[id].position.z / cam_loc;
  nodes[id].material.color = new THREE.Color(r,0 , 1-r);
  //  (Math.exp(-2*r), Math.exp(-Math.pow(r-.5,2)/4), 1-Math.exp(2*(r-1)));//*Math.exp(-Math.pow(r-.5,2)/40)
}

var edges = {};
for(i in edge_list){
  var ii = edge_list[i];
  //console.log(ii);
  id = ii;
  edges[id] = new link(ii[0],ii[1],Math.asinh(1*weights[i])/3+.1);
  //edges[id] = new link(ii[0],ii[1],1,torus =1 ,theta );
  scene.add(edges[id].link);
}

camera.position.z = cam_loc;


var s=1;


// to get keypress
/*
var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});


var cam_update = function() {
    for(var key in keysDown) {
      var value = Number(key);
      console.log(value);
      if(value == 39) { // left arrow
        camera.position.x +=cam_speed;
      } else if (value == 37) { // right arrow
        camera.position.x -=cam_speed;
      } else if (value == 38) { // down moves
        camera.position.z -=cam_speed;
      } else if (value == 40) { // up moves in
        camera.position.z +=cam_speed;
      } else if (value == 32) { // space moves up
        camera.position.y +=cam_speed;
      } else if (value == 17) { // ctrl moves down
        camera.position.y -=cam_speed;
      } else {
        //
      }
    }
};

*/

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
  //cam_update();
}
render();
