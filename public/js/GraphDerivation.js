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
    $('#NovoGrafoEspalhamento').on('click', function(){
        var newedges, newnodes;
        var res = grafoSubjacente();
        newedges = res[0];
        newnodes = res[1];
        var newdata = {
            nodes: newnodes,
            edges: newedges
        };
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
            },
        }
    };
    var newdata = {
        nodes: newnodes,
        edges: newedges
    };
    var newcontainer = document.getElementById('networkSubIndVer');
    var newnetwork = new vis.Network(newcontainer, newdata, newoptions);
    if(ordenado){
        options = {
            edges:{
                arrows:'to'
            }
        };
        newnetwork.setOptions(options);
    }
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
    $('#collapseTwo').removeClass('show');
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
    if(ordenado){
        options = {
            edges:{
                arrows:'to'
            }
        };
        newnetwork.setOptions(options);
    }
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
    $('#collapseTwo').removeClass('show');
}

$(document).on('shown.bs.modal','#SubgrafoInducaoVertice', function () {
    subIndVertice();
    
});

$(document).on('shown.bs.modal','#SubgrafoInducaoAresta', function () {
    subIndAresta();
    
});

$(document).on('shown.bs.modal','#DerivacaoDePasseio', function () {
    $('#modal-passeio').attr('style', 'background-color: #ffffff');
    if($('#passeio-response').length > 0){
        $('#passeio-response').html('');
    }
    var list = '<p id="caminho_title"><b>Vértices</b></p>';
    list += '<ul id="draggable_vertices" class="draggable_vertices">';
    for(var k in nodes._data){
        if(nodes._data[k].label == undefined || nodes._data[k].label == '' || nodes._data[k].label == ' '){
            nodes.update([{id: nodes._data[k].id, label: ""+nodes._data[k].id}]);
        }
    }
    for(var k in nodes._data){
        list += '<li class="draggable_item"><b>'+nodes._data[k].label+'</b></li>';
    }
    list += '</ul>';
    list += '<p><b>Caixa de Derivacao</b></p>Arraste items para este campo para criar o passeio.'
    list += '<div id="CaixaDeDerivacao" class="caixa_derivacao"><ul id="lista_derivacao" class="draggable_vertices" style="padding-left: 5px; margin-top: 2px;"></ul></id>';
    $('#modal-passeio').html(list);
    $( ".draggable_item" ).draggable({
        cursor: 'pointer',
        revert: true
    });

    $("#CaixaDeDerivacao").droppable({
        accept: '.draggable_item',
        drop: function(ev, ui){
            var list2 = '';
            $('.remove_item').remove();
            ui.draggable.append(' <span class="remove_item" onclick="RemoveItem(this)">&nbsp;x&nbsp;</span>');
            $("#lista_derivacao").append(ui.draggable);
            $("#CaixaDeDerivacao").attr('style', 'height: auto');
            
            let escolha = ui.draggable[0].innerText.substr(0,ui.draggable[0].innerText.length-4);
            list2 = RetornaListaNodesPasseio(escolha);
            if(!list2.length){
                list2 = "<span >Não existem vértices alcançáveis a partir da última escolha.</span>";
            }
            $('#draggable_vertices').html(list2);
            $( ".draggable_item" ).draggable({
                cursor: 'pointer',
                revert: true
            });
            $('#lista_derivacao li').draggable({
                cancel: '.draggable_item',
            });
            if(!$('#btn-passeio').length){
                let modal = '<div class="mt-3 text-center" id="btn-passeio">';
                modal += '<button class="btn btn-success" onClick="DerivarPasseio()">Derivar Passeio</button>';
                modal += '</div>';
                $('#modal-passeio').append(modal);
            }
        }
    });
});

function RemoveItem(item){
    var element = item.parentNode;
    var father = element.parentNode;
    element.parentNode.removeChild(element);
    if (father.hasChildNodes()){
        escolha = father.lastElementChild.innerText.substr(0,father.lastElementChild.innerText.length);
        father.lastElementChild.innerHTML += ' <span class="remove_item" onclick="RemoveItem(this)">&nbsp;x&nbsp;</span>';
        list2 = RetornaListaNodesPasseio(escolha);
        if(!list2.length){
            list2 = "<span>Não existem vértices alcançáveis a partir da última escolha.</span>";
        }
        $('#draggable_vertices').html(list2);
        $( ".draggable_item" ).draggable({
            cursor: 'pointer',
            revert: true
        });
        $('#lista_derivacao li').draggable({
            cancel: '.draggable_item',
        });
    }else{
        list = '';
        for(var k in nodes._data){
            list += '<li class="draggable_item"><b>'+nodes._data[k].label+'</b></li>';
        }
        $('.caixa_derivacao').css('height', '50px');
        if(!list.length){
            list = "<span >Não existem vértices alcançáveis a partir da última escolha.</span>";
        }
        $('#draggable_vertices').html(list);
        $( ".draggable_item" ).draggable({
            cursor: 'pointer',
            revert: true
        });
        $('#lista_derivacao li').draggable({
            cancel: '.draggable_item',
        });
        $('#btn-passeio').remove();
    }
}

function RetornaListaNodesPasseio(escolha){
    let list2 = '';
    let idescolha = '';
    for(let k in nodes._data){
        if(nodes._data[k].label == escolha){
            idescolha = nodes._data[k].id;
        };
    }
    if(!ordenado){        
        for(let k in edges._data){
            if(edges._data[k].from == idescolha){
                list2 += '<li class="draggable_item"><b>'+nodes._data[edges._data[k].to].label+'</b></li>';
            }
            if(edges._data[k].to == idescolha){
                list2 += '<li class="draggable_item"><b>'+nodes._data[edges._data[k].from].label+'</b></li>';
            }
        }
    }else{
        for(var k in edges._data){
            if(edges._data[k].from == idescolha){
                list2 += '<li class="draggable_item"><b>'+nodes._data[edges._data[k].to].label+'</b></li>';
            }
        }
    }
    return list2;
}

function DerivarPasseio(){
    if(!ordenado){
        let el = document.getElementById('lista_derivacao');
        var list_nodes = new Array();
        for(let k=0; k < el.childNodes.length; k++){
            //console.log(el.childNodes[k].innerText, el.childNodes[k].innerText);
            if(el.childNodes[k] != el.lastElementChild){
                list_nodes.push(el.childNodes[k].innerText.substr(0, el.childNodes[k].innerText.length-1));
            }else{
                list_nodes.push(el.lastElementChild.innerText.substr(0, el.lastElementChild.innerText.length-4));
            }
        }
        var newnodes = new vis.DataSet([]);
        var newedges = new vis.DataSet([]);
        for(var n in list_nodes){
            for(var k in nodes._data){
                if(nodes._data[k].label == list_nodes[n]){
                    if(newnodes._data[k] === undefined){
                        newnodes.add([nodes._data[k]]);
                    }
                    
                    if(typeof(list_nodes[parseInt(n)+1]) != 'undefined'){
                        for(var l in edges._data){
                            
                            if(edges._data[l].from == nodes._data[k].id && nodes._data[edges._data[l].to].label == list_nodes[parseInt(n)+1] && newedges._data[l] === undefined){
                                
                                newedges.add([edges._data[l]]);
                            }
                        }
                    }
                    break;
                }
            }
        }
        var newoptions = {
            height: '100%',
            width: '100%',
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
                    color: 'black',
                    strokeWidth: 2, // px
                    strokeColor: '#ffffff',
                }
            },
            edges:{
                font: {
                    color: 'black',
                    strokeWidth: 2, // px
                    strokeColor: '#ffffff',
                }
            }
        };
        var newdata = {
            nodes: newnodes,
            edges: newedges
        };
        
        var newcontainer = document.getElementById('modal-passeio');
        var newnetwork = new vis.Network(newcontainer, newdata, newoptions);
        $('#modal-passeio').attr('style', 'height:auto; background-color: #a0a0a0; padding: 0 !important;');
        $('#modal-passeio').after('<div id="passeio-response" class="container"></div>');
        colorePasseio(list_nodes, newnetwork, newdata);
    }else{
        let el = document.getElementById('lista_derivacao');
        var list_nodes = new Array();
        for(let k=0; k < el.childNodes.length; k++){
            if(el.childNodes[k] != el.lastElementChild){
                list_nodes.push(el.childNodes[k].innerText.substr(0, el.childNodes[k].innerText.length-1));
            }else{
                list_nodes.push(el.lastElementChild.innerText.substr(0, el.lastElementChild.innerText.length-4));
            }
        }
        var newnodes = new vis.DataSet([]);
        var newedges = new vis.DataSet([]);
        for(var n in list_nodes){
            for(var k in nodes._data){
                if(nodes._data[k].label == list_nodes[n]){ 
                    if(newnodes._data[k] === undefined){
                        newnodes.add([nodes._data[k]]);
                    }
                    if(typeof(list_nodes[parseInt(n)+1]) != 'undefined'){
                        for(var l in edges._data){
                            if(edges._data[l].from == nodes._data[k].id && nodes._data[edges._data[l].to].label == list_nodes[parseInt(n)+1] && newedges._data[l] === undefined){
                                newedges.add([edges._data[l]]);
                            }
                        }
                    }
                    break;
                }
            }
        }
        var newoptions = {
            height: '100%',
            width: '100%',
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
                    color: 'black',
                    strokeWidth: 2, // px
                    strokeColor: '#ffffff',
                }
            },
            edges:{
                font: {
                    color: 'black',
                },
                arrows: 'to'
            }
        };
        var newdata = {
            nodes: newnodes,
            edges: newedges
        };
        
        var newcontainer = document.getElementById('modal-passeio');
        var newnetwork = new vis.Network(newcontainer, newdata, newoptions);
        $('#modal-passeio').attr('style', 'height:auto; width: 100%;');
        $('#modal-passeio').attr('style', 'height:auto; background-color: #a0a0a0; padding: 0 !important;');
        $('#modal-passeio').after('<div id="passeio-response" class="container"></div>');
        colorePasseio(list_nodes, newnetwork, newdata);
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function max(vector){
    var max;
    for(let i=0; i<vector.length; i++){
        if(i==0){
            max = vector[i];
        }else{
            if(vector[i] > max || typeof(max) == 'undefined'){
                max = vector[i];    
            }
        }
    }
    return max;
}

function howMany2(vector){
    var number = 0;
    for(let i =0; i<vector.length; i++){
        if(vector[i] == 2){
            number ++;
        }
    }
    return number;
}

function colorePasseio(list_nodes, p_network, p_data){
    let nodes_visit = [];
    let edges_visit = [];
    let colors_nodes = [];
    let color_edges = [];
    let comprimento = 0;
    for(var n in list_nodes){
        for(var k in nodes._data){
            if(nodes._data[k].label == list_nodes[n]){ 
                if(nodes_visit[nodes._data[k].id] === undefined){
                    nodes_visit[nodes._data[k].id] = 1;
                }else{
                    nodes_visit[nodes._data[k].id]++;
                }
                if(typeof(list_nodes[parseInt(n)+1]) != 'undefined'){
                    for(var l in edges._data){
                        if(edges._data[l].from == nodes._data[k].id && nodes._data[edges._data[l].to].label == list_nodes[parseInt(n)+1] && typeof(edges_visit[edges._data[l].id]) == 'undefined'){
                            edges_visit[edges._data[l].id] = 1;
                            if(!ponderado){
                                comprimento++;
                            }else{
                                comprimento += parseInt(edges._data[l].label);
                            }
                        }else if(edges._data[l].from == nodes._data[k].id && nodes._data[edges._data[l].to].label == list_nodes[parseInt(n)+1]){
                            edges_visit[edges._data[l].id]++;
                            if(!ponderado){
                                comprimento++;
                            }else{
                                comprimento += parseInt(edges._data[l].label);
                            }
                        }
                        if(edges._data[l].to == nodes._data[k].id && nodes._data[edges._data[l].from].label == list_nodes[parseInt(n)+1] && typeof(edges_visit[edges._data[l].id]) == 'undefined'){
                            edges_visit[edges._data[l].id] = 1;
                            if(!ponderado){
                                comprimento++;
                            }else{
                                comprimento += parseInt(edges._data[l].label);
                            }
                        }else if(edges._data[l].to == nodes._data[k].id && nodes._data[edges._data[l].from].label == list_nodes[parseInt(n)+1]){
                            edges_visit[edges._data[l].id]++;
                            if(!ponderado){
                                comprimento++;
                            }else{
                                comprimento += parseInt(edges._data[l].label);
                            }
                        }
                    }
                }
                break;
            }
        }
    }
    for(let i=0; i<max(nodes_visit); i++){
        colors_nodes[i] = getRandomColor();
    }
    for(let i=0; i<max(edges_visit); i++){
        color_edges[i] = getRandomColor();
    }
    
    for(let i=0; i<nodes_visit.length; i++){
        if(typeof(nodes_visit[i]) != 'undefined'){
            p_data.nodes._data[i].color = colors_nodes[nodes_visit[i]-1];
        }
    }
    for(let i=0; i<edges_visit.length; i++){
        if(typeof(edges_visit[i]) != 'undefined'){
            p_data.edges._data[i].color = {
                'color' : color_edges[edges_visit[i]-1], 
                'highlight' : color_edges[edges_visit[i]-1],
                'hover' : color_edges[edges_visit[i]-1]
            };
        }
    }
    p_network.setData(p_data);
    var palavra = '<p><b>Legenda</b></p><p><b>Vértices</b></p>';
    for(let i=0; i<colors_nodes.length; i++){
        palavra += '<div><div style="width: 10px; height: 10px; background-color: ' + colors_nodes[i] +'; display: inline-block"></div> ' +(i+1) + ' passagem(ns)</div>';
    }
    palavra += '<p><b>Arestas / Arcos</b></p>';
    for(let i=0; i<color_edges.length; i++){
        palavra += '<div><div style="width: 10px; height: 10px; background-color: ' + color_edges[i] +'; display: inline-block"></div> ' +(i+1) + ' passagem(ns)</div>';
    }
    $('#passeio-response').append(palavra);
    var passeio = '<p><b>É fechado: </b>';
    var fechado;
    if(list_nodes[0] == list_nodes[list_nodes.length-1]){
        passeio += 'Sim';
        fechado = true;
    }else{
        passeio += 'Não';
        fechado = false;
    }
    passeio += '</p>';
    passeio += '<p><b>É uma cadeia ou trilha:</b> ';
    if(max(edges_visit) != 1){
        passeio += 'Não';
    }else{
        passeio += 'Sim';
    }
    passeio += '</p>';
    passeio += '<p><b>É caminho:</b> ';
    if(max(nodes_visit) != 1){
        passeio += 'Não';
    }else{
        passeio += 'Sim';
    }
    passeio += '</p><p><b>Comprimento: </b>' + comprimento + '</p>';
    passeio += '<p><b>É ciclo ou circuito:</b> ';
    if(max(nodes_visit) == 2 && howMany2(nodes_visit) == 1 && fechado){
        passeio += 'Sim';
    }else{
        passeio += 'Não';
    }
    passeio += '</p>';
    $('#passeio-response').append(passeio);
}

$(document).on('hidden.bs.modal', '#DerivacaoDePasseio', () => {
    $('#collapseTwo').removeClass('show');
});