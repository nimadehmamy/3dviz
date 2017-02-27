var loader = {
    
  readTextFile : function(file){
    var allText;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                //alert(allText);
            }
        }
    };
    rawFile.send(null);
    return allText;
  },
  
  readMatrix : function(file,sep){
    "First split to get lines, then split with 'sep' and conver to numbers";
    var text = loader.readTextFile(file);
    //console.log(text);
    var mat = [];
    var s = text.split('\n');
    for (i in s){
      if(s[i] == ''){continue;}
      i = s[i].split(sep);
      var ii = [];
      for (j in i){
        ii = ii.concat(Number(i[j]));
        //console.log(i);
      }
      //console.log([ii]);
      mat = mat.concat([ii]);
      //console.log(mat);
    }
    return mat;
  }

}
