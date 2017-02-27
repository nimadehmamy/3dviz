# 3D Network Visualization
This is a simplified and lighter version of the
[3Nevis](https://github.com/nimadehmamy/3nevis) project.
Simply, make the following json file and uplaod it.

<pre>
netJSON = {
    'scale': (size of network. used to shrink down the network to fit in screen.)
    'links':{
            'link1': {
                'points': [[xi,yi,zi],...[xf,yf,zf]] (points along the link 2 minimum),
                'radius': r (thickness of the link),
                    },
            'link2': {...},
            ...
            },
     'nodes': {
        'labels':['n0',...,'nN']
        'positions':[[x1,y1,z1],...[xN,yN,zN]] (all nodes at once. labels will be supported later.),
        }
</pre>