/*
the node and link classes

v2.0
Network class
*/


function Network(name, data){
    net = this;
    console.log('net:',data);
    this.nodes = {};
    this.links = {};
    this.nodeGroup = new THREE.Object3D();
    this.linkGroup = new THREE.Object3D();
    
    this.info = data;

    this.Node = function(id,v,s, color){
        /* make node with id at v (vector) and with size s
        */
        this.type = 'node';
        this.color = color || controls.nodeColor; //nodecolor
        this.id = id;
        this.size = s;
        
        this.geometry = new THREE.TetrahedronGeometry( this.size, controls.nodeDetail );
        this.material = new THREE.MeshPhongMaterial( {
            color: this.color,
            shininess: 256,
            shading: THREE.SmoothShading // THREE.FlatShading
        } );
        
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.mesh.name = "Node: " + id;
        this.mesh.position.set(v.x,v.y,v.z);
        this.degree = 0;
    };
    
    this.Link = function(id, data){
        this.type ='link';
        this.id = id;
        this.data = data;
    };
    
    this.LinkGeometry = function(data){
        var xshape = net.linkXShape(data.radius * controls.edgeDiameter);
        if (data.points.length < 2) {
            console.log('!! Not enough points!!');
            return 1;
        }
        this.points = net.rescale(data.points);
        this.spline = new THREE.CatmullRomCurve3(this.points); //points);
        this.extrudeSettings = {
            steps: controls.edgeSegments,
            bevelEnabled: false,
            extrudePath: this.spline //closedSpline
        };
        if (controls.lines) {
            this.material = new THREE.LineBasicMaterial({
                color: controls.edgeColor,
                linewidth: Link.data.radius * 2
            });
            this.geometry = new THREE.Geometry();
            this.geometry.vertices = this.spline.getPoints(controls.edgeSegments);
            this.mesh = new THREE.Line(this.geometry, this.material);
        }
        else {
            this.shape = new THREE.Shape(xshape);
            this.geometry = new THREE.ExtrudeGeometry(this.shape, this.extrudeSettings);
            this.geometry.computeBoundingBox();
            this.geometry.computeVertexNormals();
            // this.geometry.name = "Link: " + id;
        }
    };
    
    this.linkXShape = function(radius, wings, starryness){
         var w = wings || controls.edgeCross //ngon
            ,st = starryness || controls.edgeStarriness //starry
        var xshape = [],
            count = w * (controls.edgeSimple ? 1 : 3);
        for (var i = 0; i < count; i++) {
            var a = 2 * i / count * Math.PI;
            var r = radius * (1 - st * Math.cos(w * a)) * Math.abs(controls.scale);
            xshape.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
        }
        return xshape;
    };
    
    this.makeLinks = function(){
        nid = net.info.links;
        net.links = {}; // reset
        console.log('making links!');
        for (var i in nid){
            net.links[i] = new net.Link(i,nid[i]);
        }
        net.makeLinkMaterials();
        net.makeLinkMesh();
        // scene.add(net.linksMergedMesh);
    };
    
    this.makeNodes = function(nodeloc, sizes){
        var c = controls.scale;
        net.nodes = {}; // reset
        for (var i in nodeloc) {
            var sz = sizes ? sizes[i] : 1;
            var ns = controls.nodeSize * net.sizeFunc(controls.scale * sz);
            var p = nodeloc[i];
            id = i;
            if (net.info.nodes.labels) { id = net.info.nodes.labels[i]; }
            
            net.nodes[id] = new net.Node(id, new THREE.Vector3(c * p[0], -c * p[1], c * p[2]), ns);
            net.nodeGroup.add(net.nodes[id].mesh);
            // net.nodes[id].mesh.name = "Node: " + id;
            scene.add(net.nodes[id].mesh);
        }
        net.nodeGroup.name = "nodeGroup";
        // scene.add(net.nodeGroup);
        // return nodes;
    };
    
    this.makeLinkMaterials = function(){
        net.linkMaterials = new THREE.MultiMaterial([]);
        if (controls.edgeColorRandom){
            for (var i in net.links) {
                net.linkMaterials.materials.push(new THREE.MeshPhongMaterial( {
                    color: Math.random() * 0xffffff,
                    transparent:true, shininess: 256, shading: THREE.SmoothShading }));
            }
        }else{
            net.linkMaterials.materials.push(new THREE.MeshBasicMaterial({
                color: 0xffffff }),
                new THREE.MeshPhongMaterial({color: controls.edgeColor,
                transparent:true, shininess: 256, shading: THREE.SmoothShading }));
        }
    };
    
    this.faceCount = 0;
    this.edgeIndex = {};
    
    this.makeLinkMesh = function(){
        net.linkGroup.children = [];
        removeMesh(net.linksMergedMesh);
        net.linksMergedGeometry = new THREE.Geometry();
        var ii = 0;
        for (var i in net.links) {
            net.links[i].link = new net.LinkGeometry(net.links[i].data)
            net.linksMergedGeometry.merge(net.links[i].link.geometry);
            net.edgeIndex[ii] = i;
            net.faceCount = net.links[i].link.geometry.faces.length;
            net.links[i].link.geometry.dispose();
            net.links[i].link.geometry = null;
            if (controls.edgeColorRandom){
                for(var j=0; j<net.faceCount; j++){
                    net.linksMergedGeometry.faces[ii*net.faceCount+j].materialIndex = ii;
                }
            }
            ii++;
        }
        net.linksMergedMesh = new THREE.Mesh(net.linksMergedGeometry, net.linkMaterials);
        net.linksMergedMesh.name = "linkMesh";
        scene.add(net.linksMergedMesh);
        
    }
    
    this.getClickedObject = function(inters){
        var obid;
        if(inters.object.name == "linkMesh"){
            obid = net.edgeIndex[parseInt(inters.faceIndex/net.faceCount)];
        }else{// if(inters.object.name == "nodeMesh"){
            obid = inters.object.name; //network.getClickedNode(inters);
        }
        return obid;
    }

    this.rescale= function(p0){
        var c = controls.scale;
        var pts = [];
        for (var j in p0) {
            // pts.push(new THREE.Vector3(c * p0[j].x, -c * p0[j].y, c * p0[j].z));
            pts.push(new THREE.Vector3(c * p0[j][0], -c * p0[j][1], c * p0[j][2]));
        }
        return pts;
    };
    
    this.getDegreesRMS = function(){
        var k = {};
        for (var ii in net.links) {
            var i = net.links[ii].data.end_points;
            var r2 = Math.pow(net.links[ii].data.radius, 2);
            if (k[i[0]]) { k[i[0]] += r2; }
            else { k[i[0]] = r2; }
            if (k[i[1]]) { k[i[1]] += r2; }
            else { k[i[1]] = r2; }
        }
        // RMS
        for (var i in k) {
            k[i] = Math.sqrt(k[i]);
        }
        return k;
    };
    
    this.weightFunc = function(w){
        return Math.asinh(edgethickness * w) / 2.0 + 0.4; //Math.asinh(edgethickness*w)/3+.1;
    };
    
    this.sizeFunc = function(s){
        return Math.pow(s, controls.nodeExp); // take s as volume, thus radius is cubic root
    };
    
    
    net.makeLinks();
    net.degrees = net.getDegreesRMS();
    net.makeNodes(net.info.nodes.positions, sizes = net.degrees);

}
