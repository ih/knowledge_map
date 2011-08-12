$(function (){
    var data = {items:[
		  {value: 'aaaa', name: 'aaaa'},
		  {value: 'aab', name: 'aab'}
		]};
    $('input[type=text]').autoSuggest(data.items, {selectedItemProp: 'name', searchObjProps: 'name'});
  });


// $(function(){
//     $('#map').contextMenu(
//       {
// 	menu: 'myMenu'
//       },
//       function(action, el, pos){
// 	alert(
//             'Action: ' + action + '\n\n' +
//             'Element ID: ' + $(el).attr('id') + '\n\n' +
//             'X: ' + pos.x + '  Y: ' + pos.y + ' (relative to element)\n\n' +
//             'X: ' + pos.docX + '  Y: ' + pos.docY+ ' (relative to document)'
//             );
//       });

//   });
//document.getElementById("infovis").innerHTML=Date();