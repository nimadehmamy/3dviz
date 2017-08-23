
function colorEdges(){
  
  for(var i in edge_list){
    var l = edges[ edge_list[i]];
    //var c = Math.pow(1 - ds0[i]/mx, 4) ;
	var c = Math.pow(1 - ds0[i], 1) ;
	if (c==1){
		l.link.material.color.setRGB(0,0.43922,0.75294)
	} else { l.link.material.color.setRGB(1,0,0)
		
	}

    //l.link.material.color.setRGB(1,.3*c,c);
  }
}


var geo,mat,trig;
function makeSurface(){
  geo = new THREE.Geometry();
  for (var i in nodes){geo.vertices.push(nodes[i].position)}
  mat = new THREE.MeshLambertMaterial( {
      color: 0xff70c0,
      //vertexColors: THREE.FaceColors,
		  side: THREE.DoubleSide,
		  transparent: true,
    });
    tr = network.info.trigs;
    for (i in tr){ u=tr[i]; geo.faces.push(new THREE.Face3(u[0],u[1],u[2]));}
    geo.computeFaceNormals ();
    geo.computeVertexNormals ();
    trig = new THREE.Mesh( geo, mat );
    scene.add(trig);
}



var eventlogger = document.getElementById('logger');

var clicked = {type: null, id: null}; // stores the id of clicked element
misc.clickNode();

// nodes may update cam location, so


var netName, vars, edge_list, edges = {}, nodes_loc, nodes = {}, degrees, conflicts;
var Err;
var Viz = function(data,name){
    netName = name;
    var nam = document.getElementById('netName');
    nam.innerText = netName;
    // edge_list = loader.readMatrix('assets/network/' + netName + '/edgelist.txt', ' ');
    // nodes_loc = loader.readMatrix('assets/network/' + netName + '/nodes.txt', ' ');
    network.info = data;
    network.makeLinks();
    controls.scale = 1 / data.scale;
    redrawEdges();
    // redrawNodes();
    degrees = network.getDegreesRMS(edges);
    //nodes_loc = network.info.nodes.positions;
    nodes = network.get_nodes(network.info.nodes.positions, center = false, sizes = degrees);
    
    vars = {
        edgeGeometry: "ExtrudeGeometry",
        nodeGeometry: "TetrahedronGeometry"
    };

    render();
} // Vizz

network.makeLinks = function(){
    nid = network.info.links;
    console.log('making links!');
    for (var i in nid){
        edges[i] = {
            type :'link',
            id : i,
            size : nid[i].radius,
            weight : nid[i].weight,
            points : nid[i].points,
            endPoints : nid[i].end_points,
            link : {}
        };
    }
};


function animate() {
	requestAnimationFrame( animate );
	render();
	cameraCtrl.update();
	stats.update();
	if (controls.grow) misc.growEdge();
}

animate();
