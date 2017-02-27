

function redrawEdges(){
    console.log('change');
    for (var i in edges) {
        var col = (controls.edgeColorRandom ? Math.random() * 0xffffff : controls.edgeColor);
        scene.remove(edges[i].link.mesh);
        edges[i].link = new network.linkWithCrossSection(
            edges[i].points, edges[i].size * controls.edgeDiameter, controls.edgeSegments, col //Math.random() * 0xffffff
            , undefined, undefined //starryness = .1
            , hide = undefined, opacity = controls.edgeOpacity);
    }
}

function redrawNodes(){
    console.log('redrawing nodes...');
  for (var i in nodes){
    scene.remove(nodes[i].node);
  }
  nodes = network.get_nodes(network.info.nodes.positions, center = false, sizes = undefined
//   , sizeFunc = function(s){return Math.abs(controls.scale)*controls.nodeSize*network.sizeFunc(s)}
  );
  //
}


function redrawAll(){
  redrawNodes();
  redrawEdges();
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
