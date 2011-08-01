function init(){
  //document.getElementById("map").innerHTML=Date();
  json = {
    id:'a',
    name:'a',
    data: {},
    children: [{
  		 id: 'b',
  		 name: 'b',
  		 data: {},
  		 children: []
  	       },
  	       {
  		 id: 'c',
  		 name: 'c',
  		 data: {},
  		 children: []
  	       },
  	       {
  		 id: 'd',
  		 name: 'd',
  		 data: {},
  		 children: []
  	       }]
  }
  var knowledgeMap = new $jit.ST({
  				   'injectInto': 'map',
  				   Navigation: {
  				     enable:true,
  				     panning:true
  				   }
  				 });
  knowledgeMap.loadJSON(json);
  knowledgeMap.compute();
  knowledgeMap.onClick(knowledgeMap.root);
}
