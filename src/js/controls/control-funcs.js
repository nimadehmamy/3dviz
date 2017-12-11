function removeMesh(v) {
    // console.log("v: ",v);
    if (v!== undefined){
        try{
            v.material.dispose();
        }catch(err){
            for(var i in v.material.materials){
                v.material.materials[i].dispose();
            }
        }
        scene.remove(v);
        v.geometry.dispose();
        v.geometry = null;
        v.material = null;

        v = null;

    }else{
        console.log('undef!!!')
    }
}

var faceCount,edgeIndex={};

function redrawEdges(){
    network.makeLinkMesh();
}
function redrawNodes(){
    console.log('redrawing nodes...');
    network.nodeGroup.children = [];
    for (var i in network.nodes) {
        removeMesh(network.nodes[i].mesh);
        // removeMesh(network.nodeGroup[i]);
    }
    network.makeNodes(network.info.nodes.positions, sizes = network.degrees);
}

function redrawAll(){
  redrawNodes();
  redrawEdges();
}

function toggleRandomEdgeCol(){
    network.makeLinkMaterials();
    network.makeLinkMesh();
}

function recolorEdges(){
    if (controls.edgeColorRandom){
        var ii = 0;
        for (var i in network.links) {
            network.linkMaterials.materials[ii].color.set(Math.random() * 0xffffff);
            network.linkMaterials.materials[ii++].opacity = controls.edgeOpacity;
        }
    }else{
        network.linkMaterials.materials[1].color.set(controls.edgeColor);
        network.linkMaterials.materials[1].opacity = controls.edgeOpacity;
    }
}

function recolorNodes(){
    for (var i in network.nodes) {
        network.nodes[i].material.color.set(controls.nodeColor);
    }
}

function nodeGroupColor(){
    var gr = network.info.info.nodes.groups;
    /*
    cols = {};
    for (var i in nodes){
        cols[gr[i]] = Math.random() * 0xffffff;
    }
    */
    var cols = network.info.info.nodes.colors;
    for (var i in nodes) {
        var n = nodes[i];
        n.mesh.material.color.set(cols[gr[i]]); //(cols[gr[i]]);
    }
}


var raycaster, mouse;

misc.clickNode = function(){
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    container.addEventListener('mousedown', onDocumentMouseDown, false);
    container.addEventListener('touchstart', onDocumentTouchStart, false);

    window.addEventListener('resize', onWindowResize, false);
};
