function removeMesh(v) {
    if (v!== undefined){
        v.material.dispose();
        v.geometry.dispose();
        scene.remove(v);
        v.material = null;
        v.geometry = null;
        v = null;
        
    }else{
        console.log('undef!!!')
    }
}

function redrawEdges(){
    console.log('redrawing links...');
    for (var i in edges) {
        var col = (controls.edgeColorRandom ? Math.random() * 0xffffff : controls.edgeColor);
        //scene.remove(edges[i].link.mesh);
        removeMesh(edges[i].link.mesh);
        edges[i].link = new network.linkWithCrossSection(
            edges[i].points, edges[i].size * controls.edgeDiameter, controls.edgeSegments, col //Math.random() * 0xffffff
            , undefined, undefined //starryness = .1
            , hide = undefined, opacity = controls.edgeOpacity);
    }
}

function redrawNodes(){
    console.log('redrawing nodes...');
    for (var i in nodes) {
        // scene.remove(nodes[i].node);
        removeMesh(nodes[i].node);
    }
    nodes = network.get_nodes(network.info.nodes.positions, center = false, sizes = degrees
        //   , sizeFunc = function(s){return Math.abs(controls.scale)*controls.nodeSize*network.sizeFunc(s)}
    );
    //
}


function redrawAll(){
  redrawNodes();
  redrawEdges();
}


function recolorEdges(){
    for (var i in edges) {
        var col = (controls.edgeColorRandom ? Math.random() * 0xffffff : controls.edgeColor);
        edges[i].link.material.color.set(col);
        edges[i].link.material.opacity = controls.edgeOpacity;
    }
}

function recolorNodes(){
    for (var i in nodes) {
        nodes[i].material.color.set(controls.nodeColor);
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
        n.node.material.color.set(cols[gr[i]]); //(cols[gr[i]]);
    }
}


var raycaster, mouse;

misc.clickNode = function(){
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    container.addEventListener('mousedown', onDocumentMouseDown, false);
    container.addEventListener('touchstart', onDocumentTouchStart, false);


    //

    window.addEventListener('resize', onWindowResize, false);

}

misc.hide = function(){
  if (clicked.type == 'node'){
    console.log('Removing node %s from scene', clicked.id);
    scene.remove(nodes[clicked.id].node);
  }
  if (clicked.type == 'link'){//edges[edge_list[0].slice(0,2)].type
    console.log('Removing edge '+clicked.id+' from scene');
    scene.remove(edges[clicked.id].link.mesh)
  }
}
