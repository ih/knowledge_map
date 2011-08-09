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
  		 children: [{
			      id: 'e',
			      name: 'e',
			      data: {otherParents: ['b','a']},
			      children: []
			      }]
  	       }]
  };

  // The SpaceTree (ST) does not support diplaying a Directed Acyclic Graph (DAG), so we fake it by making a tree using
        // only the first prereq as a module's real parent, and storing the other parents as extra data in the node.
        // Then we use the following special node rendering implementation to draw the edges to those extra parents
        // when we draw a node.
  $jit.ST.Plot.NodeTypes.implement(
    {
      'rectangleWithOtherParents': {
	'render': function(node, canvas){
	  $jit.ST.Plot.NodeTypes.prototype.rectangle.render.call(this, node, canvas);
	  if (node.data && node.data.otherParents) {
	    var otherParents = node.data.otherParents;
	    for (var i = 0; i < otherParents.length; i++) {
	      var orn = this.getOrientation(), parent = this.viz.graph.getNode(otherParents[i]), child = node, dim = 5;
	      adj = new $jit.Graph.Adjacence(parent, child, null, this.viz.config.Edge, this.viz.config.Label);
	      this.plotLine(adj, canvas, false);
	    }
	  }
	},
	'contains': $jit.ST.Plot.NodeTypes.prototype.rectangle.contains
      }
    });

  var knowledgeMap = new $jit.ST({
  				   injectInto : 'map',
				   orientation : 'bottom',
  				   Navigation: {
  				     enable:true,
  				     panning:true
  				   },
				   Node: {
				     type: 'rectangleWithOtherParents'
				   },
				   onCreateLabel: function(label, node){
				     label.innerHTML = node.id;
				     $(label).contextMenu(
				       {
					 menu: 'nodeMenu'
				       },
				       function(action, el, pos){
					 alert('blue box');
				       });
				   }
  				 });
  knowledgeMap.loadJSON(json);
  knowledgeMap.compute();
  knowledgeMap.onClick(knowledgeMap.root);

  /* menu for adding/organizing map */
  $('#map').contextMenu(
      {
	menu: 'myMenu'
      },
      function(action, el, pos){
	switch(action){
	  case 'add':
	    addNode();
	    break;
	  case 'organize':
	    organizeNodes();
	    break;
	  };
      });

  $('#innerTest').contextMenu(
      {
	menu: 'nodeMenu'
      },
      function(action, el, pos){
	alert('blue box');
      });
  function addNode(){
    var newNode = {
      id: Math.random(),
      name: 'q',
      data: {},
      children: []
    };
    json.children.push(newNode);
    knowledgeMap.addSubtree(json, 'animate');
  };
  function organizeNodes(){
    alert('organize nodes');
  };
};
