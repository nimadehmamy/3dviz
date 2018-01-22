document.mouse = {
    x: 0,
    y: 0
};
document.touch = {
    x: 0,
    y: 0
};

events = {
    getMouse: function(e) {
        document.mouse.x = e.clientX;
        document.mouse.y = e.clientY;
    },

    getTouch: function(e) {
        document.touch.x = e.touches[0].clientX;
        document.touch.y = e.touches[0].clientY;
    },

    dragAround: function(id) {

        var elem = document.getElementById(id);
        var loc = elem.getBoundingClientRect();
        elem.newLoc = {
            x: loc.left,
            y: loc.top
        };
        elem.style.left = elem.newLoc.x + "px";
        elem.style.top = elem.newLoc.y + "px";
        elem.draggable = true;

        elem.ondrag = elem.ontouchmove = function(e) {
            var curX = parseInt(elem.style.left.slice(0, -2));
            var curY = parseInt(elem.style.top.slice(0, -2));
            //console.log('dragging', e.clientX, e.touches[0].clientX);
            if (e.touches){
                var left = (curX + (e.touches[0].clientX - document.touch.x)) + "px";
                var top = (curY + (e.touches[0].clientY - document.touch.y)) + "px";
                elem.newLoc = {
                    x: left,
                    y: top
                };
            }
            if (e.clientX > 0) {
                var left = (curX + (e.clientX - document.mouse.x)) + "px";
                var top = (curY + (e.clientY - document.mouse.y)) + "px";
                elem.newLoc = {
                    x: left,
                    y: top
                };
            }

        };

        elem.ondragend = elem.ontouchend =  function() {
            elem.style.left = elem.newLoc.x;
            elem.style.top = elem.newLoc.y;
        };


    },

};


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentTouchStart( event ) {

    event.preventDefault();

    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown(event);

}

function onDocumentMouseDown( event ) {

    event.preventDefault();

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera, 1,20);

    //intersects = raycaster.intersectObjects(scene.children);//(nodeGroup.children.concat(edgeGroup.children));//for old version with grouped nodes and edges
        // scene.children.slice(4, scene.children.length)); // to skip non-network objects

    // for(var i = 4; i < scene.children.length; i++){
    //   if(scene.children[i].geometry){
    //     if(raycaster.intersectObject(scene.children[i]).length > 0){
    //       intersects = raycaster.intersectObject(scene.children[i]);
    //     }
    //   }
    // }

    var octreeObjects;
    octreeObjects = octree.search( raycaster.ray.origin, raycaster.ray.far, true, raycaster.ray.direction );
	  intersects = raycaster.intersectOctreeObjects( octreeObjects );

    if (intersects.length > 0) {
        //intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
        // console.log(intersects[0]);
        // console.log(intersects[0].object.geometry.type);
        //var obid = intersects[0].object.name;//.id;
        var obid = network.getClickedObject(intersects[0]);
        try {
                eventlogger.innerHTML = obid;
            }
        catch (err) { 1; }

    }


    /*
    // Parse all the faces
    for ( var i in intersects ) {

    	intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xffffff | 0x80000000 );

    }
    */
}



document.addEventListener('mousedown', events.getMouse,false);
document.addEventListener('mousewheel', events.wheel, false );
document.addEventListener('touchstart', events.getTouch,false);
