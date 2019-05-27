/*GRAFO SUBJACENTE*/
function grafoSubjacente (){
    var newnodes = new vis.DataSet([]);
    var newedges = new vis.DataSet([]);
    var token;
    for(var k in edges._data){
        if(edges._data[k].from != edges._data[k].to){
            token = 0;
            for(var l in newedges._data){
                if(edges._data[k].from == newedges._data[l].from && 
                    edges._data[k].to == newedges._data[l].to ||
                    edges._data[k].from == newedges._data[l].to &&
                    edges._data[k].to == newedges._data[l].from){
                    token = 1;
                }
            }
            if(!token){
                newedges.add(edges._data[k]);
                newedges.update([{id: newedges._data[k].id, label: ' '}])
            }
        }
    }
    for(var k in nodes._data){
        newnodes.add(nodes._data[k]);
    }
    var newcontainer = document.getElementById('networkGrafoSubjacente');
    var newdata = {
        nodes: newnodes,
        edges: newedges
    };
    var newoptions = {
        nodes:{
            color: {
                border: '#698B69',
                background: '#458B74',
                highlight: {
                    border: '#698B69',
                    background: '#458B74'
                },
            },
            font:{
                color: 'white',
            }
        },
    };
    var newnetwork = new vis.Network(newcontainer, newdata, newoptions);
    return [newedges, newnodes];
}

$(document).on('shown.bs.modal','#GrafoSubjacenteModal', function () {
  grafoSubjacente();
  $('#collapseTwo').removeClass('show');
})

/*GRAFO ESPELHAMENTO*/

$(document).on('shown.bs.modal','#SubgrafoEspalhamento', function () {
  var newedges, newnodes;
  var res = grafoSubjacente();
  newedges = res[0];
  newnodes = res[1];
  var newdata = {
        nodes: newnodes,
        edges: newedges
    };
  $('#collapseTwo').removeClass('show');
  var newcontainer = document.getElementById('networkSubgrafoEspalhamento');
    var newoptions = {
        nodes:{
        color: {
            border: '#698B69',
            background: '#458B74',
            highlight: {
                border: '#698B69',
                background: '#458B74'
            },
        },
        font:{
            color: 'white',
        }
    },
    };
    var newnetwork = new vis.Network(newcontainer, newdata, newoptions);
    for(var k in newedges._data){
        if(Math.random()>0.5){
            newedges.remove([{id: newedges._data[k].id}]);
        }
    }
    if(ordenado){
        var options = {
            edges:{
                arrows: 'to'
            }
        }
        newnetwork.setOptions(options);
    }
});

/*INDUÇÃO DO GRAFO*/
function subIndVertice(){
    $('#textindver').show();
    $('#verticesAInduzir').html('');
    $('#verticesAInduzir').show();
    $('#btnindver').show();
    for(var k in nodes._data){
        if(nodes._data[k].label == undefined || nodes._data[k].label == '' || nodes._data[k].label == ' '){
            nodes.update([{id: nodes._data[k].id, label: ""+nodes._data[k].id}]);
        }
    }

    var newnodes = new vis.DataSet([]);
    for(var k in nodes._data){
        newnodes.add([nodes._data[k]]);
    }
    var newedges = new vis.DataSet([]);
    for(var l in edges._data){
        newedges.add([edges._data[l]]);
    }
    for(var k in newnodes._data){
        $('#verticesAInduzir').append(
            '<div class="col-md-6"><input type="checkbox" id="node'+ newnodes._data[k].id +'" value="'+newnodes._data[k].id+'"/> '+newnodes._data[k].label+'</div>'
            );
    }

    var newoptions = {
        nodes:{
            color: {
                border: '#698B69',
                background: '#458B74',
                highlight: {
                    border: '#698B69',
                    background: '#458B74'
                },
            },
            font:{
                color: 'white',
            }
        },
        edges:{
            font: {
                color: 'white',
            }
        }
    };
    var newdata = {
        nodes: newnodes,
        edges: newedges
    };
    var newcontainer = document.getElementById('networkSubIndVer');
    var newnetwork = new vis.Network(newcontainer, newdata, newoptions);
    $('#induzirVertices').on('click', function(){
        for(var k in newnodes._data){
            if($('#node'+newnodes._data[k].id).prop('checked') == false){
                newnodes.remove([{id: newnodes._data[k].id}]);
            }
        }
        $('#verticesAInduzir').hide();
        $('#btnindver').hide();
        $('#textindver').hide();
    });
}

function subIndAresta(){
    $('#textindar').show();
    $('#arestasAInduzir').html('');
    $('#arestasAInduzir').show();
    $('#btnindar').show();
    for(var k in nodes._data){
        if(nodes._data[k].label == undefined || nodes._data[k].label == '' || nodes._data[k].label == ' '){
            nodes.update([{id: nodes._data[k].id, label: ""+nodes._data[k].id}]);
        }
    }

    var newnodes = new vis.DataSet([]);
    for(var k in nodes._data){
        newnodes.add([nodes._data[k]]);
    }
    var newedges = new vis.DataSet([]);
    for(var l in edges._data){
        newedges.add([edges._data[l]]);
    }
    for(var k in newedges._data){
        $('#arestasAInduzir').append(
            '<div class="col-md-6"><input type="checkbox" id="edge'+ newedges._data[k].id +'" value="'+newedges._data[k].id+'"/> {'+newnodes._data[newedges._data[k].from].label+', '+newnodes._data[newedges._data[k].to].label+'}</div>'
            );
    }

    var newoptions = {
        nodes:{
            color: {
                border: '#698B69',
                background: '#458B74',
                highlight: {
                    border: '#698B69',
                    background: '#458B74'
                },
            },
            font:{
                color: 'white',
            }
        },
        edges:{
            font: {
                color: 'white',
            }
        }
    };
    var newdata = {
        nodes: newnodes,
        edges: newedges
    };
    var newcontainer = document.getElementById('networkSubIndAre');
    var newnetwork = new vis.Network(newcontainer, newdata, newoptions);
    $('#induzirArestas').on('click', function(){
        var inuse = false;
        for(var k in newedges._data){
            if($('#edge'+newedges._data[k].id).prop('checked') == false){
                newedges.remove([{id: newedges._data[k].id}]);
            }
        }
        for(var n in newnodes._data){
            inuse = false;
            for(var e in newedges._data){
                if(newedges._data[e].from == newnodes._data[n].id || 
                   newedges._data[e].to == newnodes._data[n].id ){
                    inuse = true;
                }
            }
            if(!inuse){
                newnodes.remove([{id: newnodes._data[n].id}]);
            }
        }
        $('#arestasAInduzir').hide();
        $('#btnindar').hide();
        $('#textindar').hide();
    });
}

$(document).on('shown.bs.modal','#SubgrafoInducaoVertice', function () {
    subIndVertice();
});

$(document).on('shown.bs.modal','#SubgrafoInducaoAresta', function () {
    subIndAresta();
});