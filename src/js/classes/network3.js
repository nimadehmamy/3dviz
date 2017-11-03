/*
the node and link classes

v1.0
New paradigm:
1) link: add to scene when created.
2) link: use curving tube from A to B instead of rotating and moving cylinders.

*/


var network = {
  node : function(id,v,s, box, color){
    /* make node with id at v (vector) and with size s
    */
    this.type = 'node';
    var bx = box || false;
    this.color = color || controls.nodeColor; //nodecolor
    this.id = id;
    this.size = s;
    var detail = controls.nodeDetail;
    
    this.geometry = new THREE.TetrahedronGeometry( this.size, detail );
    // this.material = new THREE.MeshLambertMaterial( {
    //   color: this.color,
    //   vertexColors: THREE.FaceColors,
    // });
    this.material = new THREE.MeshPhongMaterial( {
        color: this.color,
        emissive: 0x072534,
        //side: THREE.DoubleSide,
        shading: THREE.SmoothShading // THREE.FlatShading
    } );
    
    this.node = new THREE.Mesh( this.geometry, this.material );
    this.position = this.node.position;
    this.position.set(v.x,v.y,v.z);
    this.degree = 0;
  },
  linkXShape: function(radius, w,st){
      var xshape = [], count = w*(controls.edgeSimple ? 1 : 3);
      for ( var i = 0; i < count; i ++ ) {
          var a = 2 * i / count * Math.PI;
          var r = radius * (1 - st * Math.cos(w * a)) * Math.abs(controls.scale);
          xshape.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
      }
      return xshape;
  },

  linkWithCrossSection: function(points ,radius, segs, color, wings,starryness, hide, opacity){
      
    `NOTE: rescales with controls.scale!!!`
    var w = wings || controls.edgeCross //ngon
      ,st = starryness || controls.edgeStarriness //starry
      ,col = color || controls.edgeColor //linkcolor
      ,op = opacity || 1;
      
    // console.log('new edge color:',col);
    // if (controls.edgeColorRandom){
    //     col = Math.random() * 0xffffff;
    // }
    //console.log("starryness:", st, col)
    // var xshape = [], count = w*3;
    // for ( var i = 0; i < count; i ++ ) {
    // 	var a = 2 * i / count * Math.PI;
    // 	var r = radius * ( 1 - st * Math.cos( w * a )) * Math.abs(controls.scale);
    // 	xshape.push( new THREE.Vector2 ( Math.cos( a ) * r, Math.sin( a ) * r ) );
    // }
    var xshape = network.linkXShape(radius,w,st);
    if (points.length <2) {
      console.log('!!! Not enough points!!');
      this.mesh = 'hi';
      return 1;
    }//points.push(points[0]);
    pts = network.rescale(points);
    var spline =  new THREE.CatmullRomCurve3(pts);//points);
    this.extrudeSettings = {
    	steps			: segs,
    	bevelEnabled	: false,
    	extrudePath		: spline //closedSpline
    };
    this.shape = new THREE.Shape( xshape );
    
    //console.log(xshape, shape);
    this.geometry = new THREE.ExtrudeGeometry( this.shape, this.extrudeSettings );
    // this.material = new THREE.MeshLambertMaterial( {
    //   color: col,
    //   opacity: op,
    //   transparent: true,
    //   side: THREE.DoubleSide,
    // } );//, wireframe: true MeshBasicMaterial
    this.material = new THREE.MultiMaterial([
        new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
        new THREE.MeshPhongMaterial( {
            color: col,
            // emissive: 0x072534,
            opacity: op,
            transparent: true,
            //side: THREE.DoubleSide,
            shading: THREE.SmoothShading
        } ) // side
    ]);
    
    
    this.geometry.computeBoundingBox();
    this.geometry.computeVertexNormals();
    
    // for ( var i = 0; i < this.geometry.faces.length; i ++ ) {
    //     var face = this.geometry.faces[ i ];
    //     if (face.materialIndex == 1 ) {
    //         for ( var j = 0; j < face.vertexNormals.length; j ++ ) {
    //             face.vertexNormals[ j ].z = 0;
    //             face.vertexNormals[ j ].normalize();
    //         }
    //     }
    // }
    // this.material = new THREE.MeshPhongMaterial( {
    //     color: col,
    //     // emissive: 0x072534,
    //     opacity: op,
    //     transparent: true,
    //     //side: THREE.DoubleSide,
    //     shading: THREE.SmoothShading // THREE.FlatShading
    // } );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.points = pts;
    if (!hide){
      scene.add(this.mesh);
    }
    
  },
  
  rescale3: function(p0){
    var c = controls.scale;
    var pts = [];
    for (var j in p0){
      //if (j> 500) break;
      pts.push(new THREE.Vector3(c*p0[j].x,-c*p0[j].y,c*p0[j].z));
    }
      
    return pts;
  },
  rescale: function(p0){
    var c = controls.scale;
    var pts = [];
    for (var j in p0){
      //if (j> 500) break;
      pts.push(new THREE.Vector3(c*p0[j][0],-c*p0[j][1],c*p0[j][2]));
    }
      
    return pts;
  },
  
  get_degrees : function(elist){
    var k = {};
    for (var i in elist){
      if (k[elist[i][0]]){k[elist[i][0]] +=1;}
      else {k[elist[i][0]] =1;}
      if (k[elist[i][1]]){k[elist[i][1]] +=1;}
      else {k[elist[i][1]] =1;}
    }
    return k;
  },
  
  getDegrees : function(edges){
    var k = {};
    for (var ii in edges){
        var i = edges[ii].endPoints;
        if (k[i[0]]) { k[i[0]] += 1; }
        else { k[i[0]] = 1; }
        if (k[i[1]]) { k[i[1]] += 1; }
        else { k[i[1]] = 1; }
    }
    return k;
  },
  
  getDegreesRMS : function(edges){
    var k = {};
    for (var ii in edges){
        var i = edges[ii].endPoints;
        var r2 = Math.pow(edges[ii].size,2);
        if (k[i[0]]) { k[i[0]] += r2; }
        else { k[i[0]] = r2; }
        if (k[i[1]]) { k[i[1]] += r2; }
        else { k[i[1]] = r2; }
    }
    // RMS
    for (var i in k){
        k[i] = Math.sqrt(k[i]);
    }
    return k;
  },
  getDegrees0 : function(edges){
    var k = {};
    for (var ii in edges){
        var i = ii.split(',');
      if (k[parseInt(i[0])]){k[parseInt(i[0])] +=1;}
      else {k[parseInt(i[0])] =1;}
      if (k[parseInt(i[1])]){k[parseInt(i[1])] +=1;}
      else {k[parseInt(i[1])] =1;}
    }
    return k;
  },
  
  
  
  get_nodes : function(nodeloc, center, sizes, sizeFunc, hide){
    var c = controls.scale;
    var nodes = {};
    if(!sizeFunc){
      sizeFunc = network.sizeFunc;
    }
    
    for(i in nodeloc){
      var bx = false;
      if (!sizes){ var sz = 1; }
      else{ var sz = sizes[i];}
      console.log('size',i,':',sz);
      var ns = controls.nodeSize*network.sizeFunc(controls.scale*sz);
      console.log(ns);
      var ii = nodeloc[i];
      id = i;
      if (network.info.nodes.labels){ id = network.info.nodes.labels[i];}
    //  if (ii.length == 3){ id = i;}
      
      nodes[id] = new network.node(id, new THREE.Vector3(c*ii[0],-c*ii[1],c*ii[2]),ns);
      scene.add(nodes[id].node);
    //   camera.position.z = Math.max(cam_loc,ii[2]);
    //   cam_speed = camera.position.z/100.0 ;
    }
    
    return nodes;
  },
  
  
  weightFunc : function(w){
    return Math.asinh(edgethickness*w)/2.0+0.4;//w*edgethickness; // Math.asinh(edgethickness*w)/3+.1;
  },
  
  sizeFunc : function(s){
    return Math.pow(s, controls.nodeExp); // take s as volume, thus radius is cubic root
  }
  
}
