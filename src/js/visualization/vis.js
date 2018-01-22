
var eventlogger = document.getElementById('logger');

var clicked = {type: null, id: null}; // stores the id of clicked element
misc.clickNode();

// nodes may update cam location, so

var network, netName, vars, edge_list, nodes_loc, nodes = {}, degrees, conflicts, mergedMesh, meregedNodeMesh;
var Err;
var Viz = function(data,name){
    netName = name;
    var nam = document.getElementById('netName');
    nam.innerText = netName;
    network = new Network(netName, data);
    controls.scale = 1 / network.info.scale;

    render();
    centerCamera();
} // Vizz

vars = {
    edgeGeometry: "ExtrudeGeometry",
    nodeGeometry: "TetrahedronGeometry"
};
var rend_id;

var octree = new THREE.Octree({
	radius: 1, // optional, default = 1, octree will grow and shrink as needed
	undeferred: false, // optional, default = false, octree will defer insertion until you call octree.update();
	depthMax: Infinity, // optional, default = Infinity, infinite depth
	objectsThreshold: 8, // optional, default = 8
	overlapPct: 0.15, // optional, default = 0.15 (15%), this helps sort objects that overlap nodes
	scene: scene // optional, pass scene as parameter only if you wish to visualize octree
} );

function animate() {
	rend_id = requestAnimationFrame( animate );
	render();
	cameraCtrl.update();
	stats.update();
	if (controls.grow) misc.growEdge();
}

animate();
// use this to stop animation
// cancelAnimationFrame( rend_id );
// animate(); // to resume
