
var eventlogger = document.getElementById('logger');

var clicked = {type: null, id: null}; // stores the id of clicked element
misc.clickNode();

// nodes may update cam location, so

var network, netName, vars, edge_list, nodes_loc, nodes = {}, degrees, conflicts, mergedMesh;
var Err;
var Viz = function(data,name){
    console.log(data);
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

