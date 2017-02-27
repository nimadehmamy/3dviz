var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
// camera orbit control
cameraCtrl = new THREE.OrbitControls(camera, container);
cameraCtrl.object.position.y = 150;
cameraCtrl.update();

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
directionalLight.position.set( 0, 1, 1 );
scene.add( directionalLight );


var light = new THREE.AmbientLight( 0x505050 ); // soft white light
scene.add( light );
//var light = new THREE.PointLight( 0xffffff, 1, 100 );
//light.position.set( 0, -1, -1 );
//scene.add( light );

//camera.position.z = 5;


//==============
var detail = 3;
var ngon = 8; //cross-section n-gon
var sz = 3.0;

var axisHelper = new THREE.AxisHelper( 3 );
scene.add( axisHelper );

//var light = new THREE.AmbientLight( 0xAA0040 ); // soft white light
//scene.add( light );

function readTextFile(file){
  var allText
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


var node = function(id,v,s){
  /* make node with id at v (vector) and with size s
  */
  this.id = id;
  this.size = s;
  this.geometry = new THREE.TetrahedronGeometry( s, detail );
  this.material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
  this.node = new THREE.Mesh( this.geometry, this.material );
  this.position = this.node.position
  this.position.set(v.x,v.y,v.z);
};
var link = function(id1,id2,rad){
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
  
  
  this.size = s;
  this.geometry = new THREE.CylinderGeometry( radiusTop=rad, rad, dv.length(), ngon, thetaLength=2 );
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
var nodes_loc= readMatrix('src/js/nodes.txt',' ');
var edge_list= readMatrix('src/js/edgelist.txt',' ');
var nodes = {};
for(i in nodes_loc){
  var ii = nodes_loc[i];
  //console.log(ii);
  if (ii.length == 3){ id = i;}
  //nodes = nodes.concat(new node(i, new THREE.Vector3(ii[0],ii[1],ii[2]),1));
  nodes[id] = new node(id, new THREE.Vector3(ii[0],ii[1],ii[2]),sz);
  scene.add(nodes[id].node);
  cam_loc = Math.max(cam_loc,ii[2]);
  cam_speed = cam_loc/100.0 ;
  //scene.add(nodes[nodes.length-1].node);
}

var edges = {};
for(i in edge_list){
  var ii = edge_list[i];
  //console.log(ii);
  id = ii;
  edges[id] = new link(ii[0],ii[1],sz/3);
  scene.add(edges[id].link);
}

camera.position.z = cam_loc;


var s=1;


// to get keypress

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

function render() {
	requestAnimationFrame( render );
	renderer.render( scene, camera );
  cam_update();
}
render();
