$(function (){
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
  		   children: [{
				id: 'f',
				name: 'f',
				data: {},
				children: [{
					     id: 'g',
					     name: 'g',
					     data: {},
					     children: []
					   }]
			      }]
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
				     constrained: false,
				     levelsToShow: 70,
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
					   switch(action){
					   case 'edit':
					     alert(node.toSource());
					   }

					 });
				     }
  				   });
    knowledgeMap.loadJSON(json);
    knowledgeMap.compute();
    knowledgeMap.onClick(knowledgeMap.root);

    /* menu for adding/organizing map */
    $('#map').contextMenu(
      {
	menu: 'mapMenu'
      },
      function(action, el, pos){
	switch(action){
	case 'add':
	  $('#addNode').show('slow');
	  break;
	};
      });

    $('#addNode').submit(
      function(event){
	var values = $(this).serializeArray();
	var parents = $('#as-values-parents')[0].value.split(',');
	parents = validateParents(parents); //temporary, fix in autoSuggest
	//alert(parents.split(',')[1]);
	var children = getChildrenIds(values);
	var data = getData(values);
	var id = $('#label')[0].value;
	addNode(id, parents, children, data);
	//hide and reset the form (this might automatically be done when connecting to backend
	$(this).hide('slow');
	$(this)[0].reset(); //TODO: make sure autosuggest field resets
	event.preventDefault();
      });

    function validateParents(parents){
      parents = _.without(parents, "");
      parents = _.map(parents, _.trim);
      return parents;
    }
    function getChildrenIds(values){
      return [];
    }
    function getData(values){
      return {};
    }

    function addNode(initId, initParentIds, initChildrenIds, initData){
      var sortedByDepth = sortByDepth(initParentIds, json);
      var newNode = {
	id: initId,
	name: initId,
	data: initData,
	children: initChildrenIds
      };
      var deepestParentId = sortedByDepth.pop();
      addAsChild(newNode, deepestParentId, json);
      knowledgeMap.addSubtree(json, 'animate');
    };
    function addAsChild(node, parentId, tree){
      if(tree.id == parentId){
	tree.children.push(node);
      }
      else{
	$.each(tree.children, function(index, value){
		 addAsChild(node, parentId, value);
	       });
      }
    }
    //TODO make tree an object with a depth function and pass this to map
    function sortByDepth(parentIds, tree){
      //assumes parentIds are valid and in the tree
      var parentDepths = _.map(parentIds, function(parentId){return depth(parentId, tree);});
      var depthsAndIds = _.zip(parentIds,parentDepths);
      var sortedByDepth = _.sortBy(depthsAndIds, function(depthAndId){return depthAndId[1];});
      var justSortedIds = _.map(sortedByDepth, function(depthAndId){return depthAndId[0];});
      return justSortedIds;
    }

    function depth(nodeId, tree){
      if(nodeId == tree.id){
	return 0;
      }
      else{
	return _.min(_.map(tree.children, function(child){return depth(nodeId,child);}))+1;
      }
    }
    //for autocomplete fields in add/edit node forms
    var data = {items:[
		  {value: 'aaaa', name: 'aaaa'},
		  {value: 'aab', name: 'aab'}
		]};
    $('#parents').autoSuggest(data.items, {selectedItemProp: 'name', searchObjProps: 'name', asHtmlID:'parents'});
  });
