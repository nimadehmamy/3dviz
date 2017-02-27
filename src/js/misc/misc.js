var misc = {

    max: function(ls) {
        var mx = -Infinity;
        for (i in ls) {
            mx = Math.max(ls[i], mx);
        }
        return mx;
    },

    getConflictColors: function(conflicts) {
        var dum = [];
        for (i in conflicts) {
            dum = dum.concat(conflicts[i]);
        }
        conflicts = dum;

        var maxConf = Math.max(1, misc.max(conflicts)); // in case there are no conflicts = 1
        // color based on amount of conflicts
        var colors = []
        for (i in conflicts) {
            console.log(conflicts[i] / maxConf);
            colors = colors.concat(0xffffff - (257 * 255 * conflicts[i]) / maxConf);
            // var col = 0xffffff;
            // if (conflicts[i] != 0){
            //   col = 0xff0000;
            // }
            //colors = colors.concat(col)
        }
        return colors;
    },

    /*
    reshape the edge "2,3" to a hanging wire (cosh ~ parabola)
    */

    getParabolaDeltas: function(n1, n2, segs) {
        // 1) get the position of the nodes,
        // 2) find the line connecting them with segs segments.
        // 3) find a neat Parabola connecting them
        // 4) find deltas
        if (n1.position.y > n2.position.y) {
            var p2 = n1.position,
                p1 = n2.position;
        }
        else {
            var p1 = n1.position,
                p2 = n2.position;
        }
        //the vectors breaking the line from p1 to p2 into segs segments is p1+ n*(p1-p2)
        deltas = {};
        var dv = new THREE.Vector3().subVectors(p2, p1);
        for (var i = 0; i < segs + 1; i++) {
            ddv = new THREE.Vector3(dv.x, dv.y, dv.z).multiplyScalar(i / segs);
            //console.log(dv);
            //deltas[i]=
            var dum = new THREE.Vector3().addVectors(p1, ddv);
            //deltas[i].add({x:0,y:1,z:0});
            // find radius, then add the parabola to it
            var r = Math.pow(ddv.x, 2) + Math.pow(ddv.z, 2);
            // scale it so it passes through endpoints of dv
            r *= dv.y / (Math.pow(dv.x, 2) + Math.pow(dv.z, 2));
            //console.log(r);
            deltas[i] = new THREE.Vector3(0, r - ddv.y, 0);
        }
        return deltas;
    },

    getDeltas: function(n1, n2, segs, func) {
        // 1) get the position of the nodes,
        // 2) find the line connecting them with segs segments.
        // 3) connect using function func
        // 4) find deltas
        if (n1.position.y > n2.position.y) {
            var p2 = n1.position,
                p1 = n2.position;
        }
        else {
            var p1 = n1.position,
                p2 = n2.position;
        }
        //the vectors breaking the line from p1 to p2 into segs segments is p1+ n*(p1-p2)
        deltas = {};
        var dv = new THREE.Vector3().subVectors(p2, p1);
        for (var i = 0; i < segs + 1; i++) {
            ddv = new THREE.Vector3(dv.x, dv.y, dv.z).multiplyScalar(i / segs);
            //console.log(dv);
            //deltas[i]=
            var dum = new THREE.Vector3().addVectors(p1, ddv);
            //deltas[i].add({x:0,y:1,z:0});
            // find radius, then add the parabola to it
            var r = Math.pow(ddv.x, 2) + Math.pow(ddv.z, 2);
            // scale it so it passes through endpoints of dv
            r *= dv.y / (Math.pow(dv.x, 2) + Math.pow(dv.z, 2));
            //console.log(r);
            deltas[i] = new THREE.Vector3(Math.random(), r - ddv.y, Math.random());
        }
        return deltas;
    },

    getParabola: function(n1, n2, segs) {
        // 1) get the position of the nodes,
        // 2) find the line connecting them with segs segments.
        // 3) find a neat Parabola connecting them
        // 4) find deltas
        if (n1.position.y > n2.position.y) {
            var p2 = n1.position,
                p1 = n2.position;
        }
        else {
            var p1 = n1.position,
                p2 = n2.position;
        }
        //the vectors breaking the line from p1 to p2 into segs segments is p1+ n*(p1-p2)
        points = [];
        var dv = new THREE.Vector3().subVectors(p2, p1);
        for (var i = 0; i < segs + 1; i++) {
            ddv = new THREE.Vector3(dv.x, dv.y, dv.z).multiplyScalar(i / segs);
            //console.log(dv);
            //deltas[i]=
            var dum = new THREE.Vector3().addVectors(p1, ddv);
            //deltas[i].add({x:0,y:1,z:0});
            // find radius, then add the parabola to it
            var r = Math.pow(ddv.x, 2) + Math.pow(ddv.z, 2);
            // scale it so it passes through endpoints of dv
            r *= dv.y / (Math.pow(dv.x, 2) + Math.pow(dv.z, 2));
            //console.log(r);
            points.push(new THREE.Vector3(p1.x + ddv.x, p1.y + r, p1.z + ddv.z));
        }
        return points.reverse();
    },


    makeParabola: function() {
        for (s in edges) {
            //var s = "2,3";
            var y = edges[s];
            // get the number of segments and position of endcaps
            var m = y.link.geometry.parameters.heightSegments;
            var n = y.link.geometry.parameters.radialSegments;

            // take the two endpoints and connect their positions with a parabola
            var si = s.split(",");
            var ni = nodes[parseInt(si[0])],
                nf = nodes[parseInt(si[1])];

            var deltas = misc.getParabolaDeltas(ni, nf, edgesegments);

            for (i in deltas) {
                y.moveSect(edgesegments - i, deltas[i]);

            }
        }

    }

};



misc.growth = 0;

misc.growEdge = function(){
    //console.log('change');
    if (clicked.type == 'link') {
        var i = clicked.id;
        misc.growth = (misc.growth + 1 / (60 * 5)) % 1;
        try {
            scene.remove(edges[i].link.mesh);
            var l = edges[i].points.length;
            edges[i].link = new network.linkWithCrossSection(
                edges[i].points.slice(0, 2 + l * misc.growth),
                edges[i].size * controls.edgeDiameter,
                parseInt(controls.edgeSegments * misc.growth + 1),
                0xffff00
                , undefined, undefined //starryness = .1
                , hide = undefined);
        }
        catch (err) {
            null;
        };
    }
}
