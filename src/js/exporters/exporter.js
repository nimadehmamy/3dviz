var exporter = {
  exportToObj : function(){
    	var exporter = new THREE.OBJExporter ();
    	var result = exporter.parse (scene);
    	//floatingDiv.style.display = 'block';
    	//floatingDiv.innerHTML = result.split ('\n').join ('<br />');
    	return result;
    },
    
  dlObj : function(){
      var name = prompt("Enter file name");
      var res = exporter.exportToObj();
      //dl.href="data:text/plain,"+encodeURIComponent(res);
      //dl.click();
      download(res, name + ".obj", "text/plain")
    }

}