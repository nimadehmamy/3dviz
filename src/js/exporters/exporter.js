var exporter = {
    exportToObj: function() {
        var exporter = new THREE.OBJExporter();
        var result = exporter.parse(scene);
        //floatingDiv.style.display = 'block';
        //floatingDiv.innerHTML = result.split ('\n').join ('<br />');
        return result;
    },

    dlObj: function() {
        var name = prompt("Enter file name");
        var res = exporter.exportToObj();
        //dl.href="data:text/plain,"+encodeURIComponent(res);
        //dl.click();
        download(res, name + ".obj", "text/plain")
    },

    dlGroupObjs: function() {
        // remove all nodes and links from scene
        var groups = network.info.info.nodes.groups;
        for (var i in nodes) removeMesh(nodes[i].node);

        var res = exporter.exportToObj();
        var fnam = "Links";
        download(res, fnam + ".obj", "text/plain");
        for (i in edges) removeMesh(edges[i].link.mesh);

        var groupnodes = {};
        for (i in groups) {
            if (groupnodes[groups[i]] === undefined) {
                groupnodes[groups[i]] = [i];
                console.log(i);
            }
            else { groupnodes[groups[i]] = groupnodes[groups[i]].concat([i]); }
        }

        for (i in groupnodes) {
            for (var j in groupnodes[i]) {
                k = groupnodes[i][j];
                n = nodes[k];
                if (n === undefined) continue;
                scene.add(n.node);
            }
            console.log(i);
            res = exporter.exportToObj();
            download(res, i + ".obj", "text/plain");
            for (j in groupnodes[i]) {
                k = groupnodes[i][j];
                n = nodes[k];
                if (n === undefined) continue;
                removeMesh(n.node);
            }
        }
    }
};

