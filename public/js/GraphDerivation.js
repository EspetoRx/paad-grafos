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
                            if(edges._data[l].to == nodes._data[k].id && nodes._data[edges._data[l].from].label == list_nodes[parseInt(n)+1] && newedges._data[l] === undefined){
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
        $('#modal-passeio').attr('style', 'height:50vh; background-color: #a0a0a0; padding: 0 !important;');
        var newcontainer = document.getElementById('modal-passeio');
        var newnetwork = new vis.Network(newcontainer, newdata, newoptions);
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
        $('#modal-passeio').attr('style', 'height: 50vh; background-color: #a0a0a0; padding: 0 !important; width: 100%;');
        var newcontainer = document.getElementById('modal-passeio');
        var newnetwork = new vis.Network(newcontainer, newdata, newoptions);
        
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
    var edges_on_data = p_data.edges._data;
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
                        if(edges._data[l].from == nodes._data[k].id && nodes._data[edges._data[l].to].label == list_nodes[parseInt(n)+1] && typeof(edges_visit[edges._data[l].id]) == 'undefined' ){
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
                color : color_edges[edges_visit[i]-1],
                highlight: color_edges[edges_visit[i]-1],
                hover: color_edges[edges_visit[i]-1]
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
    if(max(nodes_visit) == 2 && howMany2(nodes_visit) == 1 && fechado && howMany2(edges_visit)==0){
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

$(document).on('shown.bs.modal','#DerivarDistancias', function () {
    $('#modal-distancia').html('');
    $('#modal-distancia').removeAttr("style");
    $('#distancia_def').remove();
    /* NOMEAÇÃO SE NECESSÁRIO */
    for(var k in nodes._data){
        if(nodes._data[k].label == undefined || nodes._data[k].label == '' || nodes._data[k].label == ' '){
            nodes.update([{id: nodes._data[k].id, label: ""+nodes._data[k].id}]);
        }
    }

    var palavra = '<div class="container">';
    palavra += '<div class="row">';
    palavra += '<div class="col-md-6 mt-2">';
    palavra += '<label for="inicial_node">Vértice inicial</label>';
    palavra += '<select id="inicial_node" class="form-control">';
    for(let k in nodes._data){
        palavra += '<option value="'+nodes._data[k].id+'">'+nodes._data[k].label+'</option>';
    }
    palavra += '</select>';
    palavra += '</div>'
    palavra += '<div class="col-md-6 mt-2">';
    palavra += '<label for="final_node">Vértice final</label>';
    palavra += '<select id="final_node" class="form-control">';
    for(let k in nodes._data){
        palavra += '<option value="'+nodes._data[k].id+'">'+nodes._data[k].label+'</option>';
    }
    palavra += '</select>';
    palavra += '</div>';
    palavra += '<div class="col-md-12 text-center mt-2">';
    palavra += '<button onClick="GeraDerivaDistancia(document.getElementById(\'inicial_node\').value, document.getElementById(\'final_node\').value)" class="btn btn-success">Derivar Distância</button>';
    palavra += '</div>';
    palavra += '</div>';
    palavra += '</div>';
    palavra += '</div>';
    $('#modal-distancia').append(palavra);
});

function DerivaDistancia(node_inicial, node_final){
    var queue = [];
    var dist = [];
    var pai = [];
    var animacao = [];
    queue.push(node_inicial);
    for(let k in nodes._data){
        dist[k] = Infinity;
    }
    dist[node_inicial] = 0;
    pai[node_inicial] = node_inicial;
    animacao.push({
        acao: 'IN',
        target: node_inicial
    });
    animacao.push({
        acao: 'QU',
        target: {
            acao: 'push',
            target: 'fila',
            node: node_inicial
        }
    });
    animacao.push({
        acao: 'QU',
        target: {
            acao: 'update',
            target: 'dists',
            node: node_inicial,
            data: 0
        }
    });
    animacao.push({
        acao: 'QU',
        target: {
            acao: 'update',
            target: 'pai',
            node: node_inicial,
            data: node_inicial
        }
    });
    animacao.push({
        acao: 'INQE'
    });
    if(!ordenado && !ponderado){
        while(queue.length != 0){
            let v = queue[0];
            animacao.push({
                acao: 'SN',
                target: v
            });
            let adjacentes = GetVerticesAdjacentes(v);
            animacao.push({
                acao: 'IN',
                target: adjacentes
            });
            for(k in adjacentes){
                animacao.push({
                    acao: 'SN2',
                    target: adjacentes[k]
                });
                if(dist[adjacentes[k]] == Infinity){
                    dist[adjacentes[k]] = dist[v] + 1;
                    animacao.push({
                        acao: 'PE',
                        target: {
                            node1: adjacentes[k],
                            node2: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'dists',
                            node: adjacentes[k],
                            data: dist[v] + 1
                        }
                    });
                    pai[adjacentes[k]] = v;
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'pai',
                            node: adjacentes[k],
                            data: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'push',
                            target: 'fila',
                            node: adjacentes[k]
                        }
                    });
                    queue.push(adjacentes[k]);
                }
                if(dist[adjacentes[k]] > dist[v] + 1){
                    dist[adjacentes[k]] = dist[v] + 1;
                    animacao.push({
                        acao: 'PE',
                        target: {
                            node1: adjacentes[k],
                            node2: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'dists',
                            node: adjacentes[k],
                            data: dist[v] + 1
                        }
                    });
                    pai[adjacentes[k]] = v;
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'pai',
                            node: adjacentes[k],
                            data: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'push',
                            target: 'fila',
                            node: adjacentes[k]
                        }
                    });
                    queue.push(adjacentes[k]);
                }
            }
            queue.shift();
            animacao.push({
                acao: 'QU',
                target: {
                    acao: 'shift',
                    target: 'fila',
                }
            });
        }
    }
    if(!ordenado && ponderado){
        while(queue.length != 0){
            let v = queue[0];
            animacao.push({
                acao: 'SN',
                target: v
            });
            let adjacentes = GetVerticesAdjacentes(v);
            animacao.push({
                acao: 'IN',
                target: adjacentes
            });
            for(k in adjacentes){
                animacao.push({
                    acao: 'SN2',
                    target: adjacentes[k]
                });
                let escolha;
                for(e in edges._data){
                    if(edges._data[e].from == adjacentes[k] && edges._data[e].to == v || 
                        edges._data[e].from == v && edges._data[e].to == adjacentes[k]){
                            escolha = parseInt(edges._data[e].label);
                        }
                }

                if(dist[adjacentes[k]] == Infinity){
                    dist[adjacentes[k]] = dist[v] + escolha;
                    animacao.push({
                        acao: 'PE',
                        target: {
                            node1: adjacentes[k],
                            node2: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'dists',
                            node: adjacentes[k],
                            data: dist[adjacentes[k]]
                        }
                    });
                    pai[adjacentes[k]] = v;
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'pai',
                            node: adjacentes[k],
                            data: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'push',
                            target: 'fila',
                            node: adjacentes[k]
                        }
                    });
                    queue.push(adjacentes[k]);
                }

                if(dist[adjacentes[k]] > dist[v] + escolha){
                    dist[adjacentes[k]] = dist[v] + escolha;
                    animacao.push({
                        acao: 'PE',
                        target: {
                            node1: adjacentes[k],
                            node2: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'dists',
                            node: adjacentes[k],
                            data: dist[adjacentes[k]]
                        }
                    });
                    pai[adjacentes[k]] = v;
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'pai',
                            node: adjacentes[k],
                            data: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'push',
                            target: 'fila',
                            node: adjacentes[k]
                        }
                    });
                    queue.push(adjacentes[k]);
                }

            }
            queue.shift();
            animacao.push({
                acao: 'QU',
                target: {
                    acao: 'shift',
                    target: 'fila',
                }
            });
        }
    }
    if(ordenado && !ponderado){
        while(queue.length != 0){
            let v = queue[0];
            animacao.push({
                acao: 'SN',
                target: v
            });
            let adjacentes = GetVerticesAdjacentes(v);
            animacao.push({
                acao: 'IN',
                target: adjacentes
            });
            for(k in adjacentes){
                animacao.push({
                    acao: 'SN2',
                    target: adjacentes[k]
                });
                if(dist[adjacentes[k]] == Infinity){
                    dist[adjacentes[k]] = dist[v] + 1;
                    animacao.push({
                        acao: 'PE',
                        target: {
                            node1: adjacentes[k],
                            node2: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'dists',
                            node: adjacentes[k],
                            data: dist[v] + 1
                        }
                    });
                    pai[adjacentes[k]] = v;
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'pai',
                            node: adjacentes[k],
                            data: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'push',
                            target: 'fila',
                            node: adjacentes[k]
                        }
                    });
                    queue.push(adjacentes[k]);
                }
                if(dist[adjacentes[k]] > dist[v] + 1){
                    dist[adjacentes[k]] = dist[v] + 1;
                    animacao.push({
                        acao: 'PE',
                        target: {
                            node1: adjacentes[k],
                            node2: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'dists',
                            node: adjacentes[k],
                            data: dist[v] + 1
                        }
                    });
                    pai[adjacentes[k]] = v;
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'pai',
                            node: adjacentes[k],
                            data: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'push',
                            target: 'fila',
                            node: adjacentes[k]
                        }
                    });
                    queue.push(adjacentes[k]);
                }
            }
            queue.shift();
            animacao.push({
                acao: 'QU',
                target: {
                    acao: 'shift',
                    target: 'fila',
                }
            });
        }
    }
    if(ordenado && ponderado){
        while(queue.length != 0){
            let v = queue[0];
            animacao.push({
                acao: 'SN',
                target: v
            });
            let adjacentes = GetVerticesAdjacentes(v);
            animacao.push({
                acao: 'IN',
                target: adjacentes
            });
            for(k in adjacentes){
                animacao.push({
                    acao: 'SN2',
                    target: adjacentes[k]
                });
                let escolha;
                for(e in edges._data){
                    if(edges._data[e].to == adjacentes[k] && edges._data[e].from == v ){
                        escolha = parseInt(edges._data[e].label);
                    }
                }
                if(dist[adjacentes[k]] == Infinity){
                    dist[adjacentes[k]] = dist[v] + escolha;
                    animacao.push({
                        acao: 'PE',
                        target: {
                            node1: adjacentes[k],
                            node2: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'dists',
                            node: adjacentes[k],
                            data: dist[adjacentes[k]]
                        }
                    });
                    pai[adjacentes[k]] = v;
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'pai',
                            node: adjacentes[k],
                            data: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'push',
                            target: 'fila',
                            node: adjacentes[k]
                        }
                    });
                    queue.push(adjacentes[k]);
                }
                if(dist[adjacentes[k]] > dist[v] + escolha){
                    dist[adjacentes[k]] = dist[v] + escolha;
                    animacao.push({
                        acao: 'PE',
                        target: {
                            node1: adjacentes[k],
                            node2: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'dists',
                            node: adjacentes[k],
                            data: dist[adjacentes[k]]
                        }
                    });
                    pai[adjacentes[k]] = v;
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'update',
                            target: 'pai',
                            node: adjacentes[k],
                            data: v
                        }
                    });
                    animacao.push({
                        acao: 'QU',
                        target: {
                            acao: 'push',
                            target: 'fila',
                            node: adjacentes[k]
                        }
                    });
                    queue.push(adjacentes[k]);
                }
            }
            queue.shift();
            animacao.push({
                acao: 'QU',
                target: {
                    acao: 'shift',
                    target: 'fila',
                }
            });
        }
    }
    return ([dist, pai, animacao]);
}

function GeraDerivaDistancia(inicial, final){
    let distanciaDerivada = DerivaDistancia(inicial, final);
    $('#modal-distancia').html('');
    var newnodes = new vis.DataSet([]);
    var newedges = new vis.DataSet([]);
    var newoptions;
    for(let k in nodes._data){
        newnodes.add(nodes._data[k]);
    }
    for(let k in edges._data){
        newedges.add(edges._data[k]);
    }
    if(!ordenado){
        newoptions = {
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
                    color: 'white',
                    strokeWidth: 2, // px
                    strokeColor: '#black',
                }
            },
            edges:{
                font: {
                    color: 'black',
                }
            }
        };
    }else{
        newoptions = {
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
                    color: 'white',
                    strokeWidth: 2, // px
                    strokeColor: '#black',
                }
            },
            edges:{
                font: {
                    color: 'black',
                },
                arrows: 'to'
            }
        };
    }
    var newdata = {
        nodes: newnodes,
        edges: newedges
    };
    var newcontainer = document.getElementById('modal-distancia');
    $('#modal-distancia').attr('style', 'height: 270px; background-color: #a0a0a0; padding: 0 !important; width: 100%;');
    var newnetwork = new vis.Network(newcontainer, newdata, newoptions);
    var palavra = '<div class="container" id="distancia_def">';
    palavra += '<div class="row mt-1">';
    palavra += '<div class="col-md-12 text-center">';
    palavra += '<button id="volta_primeiro" class="btn btn-success btn-sm"><i class="fas fa-fast-backward"></i></button> ';
    palavra += '<button id="volta_um" class="btn btn-success btn-sm "><i class="fas fa-step-backward"></i></button> ';
    palavra += '<button id="para" class="btn btn-success btn-sm" ><i class="fas fa-stop"></i></button> ';
    palavra += '<button id="play" class="btn btn-success btn-sm"><i class="fas fa-play"></i></button> ';
    palavra += '<button id="passa_um" class="btn btn-success btn-sm"><i class="fas fa-step-forward"></i></button> ';
    palavra += '<button id="passa_todos" class="btn btn-success btn-sm"><i class="fas fa-fast-forward"></i></button> ';
    palavra += '</div><div class="col-md-12 text-center">';
    palavra += 'Delay: 100ms <input type="range" min="1" max="10" step="1" value="5" class="slider round" id="range_delay"> 1s &nbsp;&nbsp;';
    palavra += ' Animação: <span id="atual">0</span> de <span id="total">'+distanciaDerivada[2].length+'</span>';
    palavra += '</div>';
    palavra += '<div class="col-md-12">';
    palavra += '<div class="card shadow mb-2 mt-2 pb-0" height="250px">';
    palavra += '    <a href="#collapseCardExample" class="d-block card-header py-3" data-toggle="collapse" role="button" aria-expanded="true" aria-controls="collapseCardExample">';
    palavra += '        <h6 class="m-0 font-weight-bold text-primary">Algoritmo</h6>';
    palavra += '    </a>';
    palavra += '    <div class="collapse show" id="collapseCardExample" style="">';
    palavra += '        <div class="card-body">';
    palavra += '<pre class"code">';
    palavra += '<code id="algL1">1. Seja v o vértice inicial.</code><br>';
    palavra += '<code id="algL2">2. Coloque v na fila. //Defina dist e pai</code><br>';
    palavra += '<code id="algL3">3. Enquanto fila não for vazia, faça:</code><br>';
    palavra += '<code id="algL4">4. &#09;v = fila[0]:</code><br>';
    palavra += '<code id="algL5">5. &#09;Para cada vizinho w de v:</code><br>';
    palavra += '<code id="algL6">6. &#09;&#09;Se dist[w] está Indefinido ou <br>&#09;&#09;dist[w] > dist[v] + peso_aresta então:</code><br>';
    palavra += '<code id="algL7">7. &#09;&#09;&#09;dist[w] = dist[v] + peso_aresta</code><br>';
    palavra += '<code id="algL8">8. &#09;&#09;&#09;pais[w] = v</code><br>';
    palavra += '<code id="algL9">9. &#09;&#09;&#09;Coloque w na fila.</code><br>';
    palavra += '<code id="algL10">10. &#09;Remova v da fila.</code><br>';
    palavra += '</pre>';
    palavra += '        </div>';
    palavra += '    </div>';
    palavra += '</div>';
    palavra += '</div>';
    palavra += '<div id="listas" class="col-md-12"><div class="col-md-12"><p>Fila</p>';
    palavra += '<ul class="list-inline lista-pai" id="fila">';
    palavra += '</ul>';
    palavra += '</div><div class="col-md-12"><p>Lista de Pais';
    palavra += '<ul class="list-inline lista-pai" id="pai">';
    palavra += '</ul>';
    palavra += '</div><div class="col-md-12"><p>Lista de Distâncias</p>';
    palavra += '<ul class="list-inline lista-pai" id="dists">';
    palavra += '</ul>';
    palavra += '</div>';
    palavra += 'Caminho: ';
    if(node_aux != inicial){
        var caminho = [];
        var p = "";
        var node_aux = final;
        while(node_aux != inicial){
            if(node_aux != undefined){
                caminho.push(newnodes._data[node_aux].label);
                node_aux = distanciaDerivada[1][node_aux];
            }else{
                caminho.push("Não definido");
                break;
            }
        }
        if(caminho[caminho.length-1] != "Não definido"){
            caminho.push(newnodes._data[node_aux].label);
            for(let i=caminho.length-1; i>=0; i--){
                p += caminho[i] + ' ';
            }
            p = p.substring(0,(p.length - 1));
            p = p.replace(/ /g, "&rarr;");
        }else{
            p = 'Não definido';
        }
        
        palavra += p + '  |  ';
    }else{
        palavra += node_aux + '   |   ';
    }
    palavra += 'Distância: ' + distanciaDerivada[0][final];
    palavra += '</div>';
    palavra += '</div>';
    palavra += '</div>';
    $('#modal-distancia').after(palavra);
    var lista_pais = '';
    var lista_distancia = '';
    for(k in newnodes._data){
        lista_pais += '<li class="list-inline-item" id="pai'+newnodes._data[k].id+'">'+newnodes._data[k].label+' | Ind</li>';
        lista_distancia += '<li class="list-inline-item" id="dists'+newnodes._data[k].id+'">'+newnodes._data[k].label+' | Inf</li>';
    }
    $('#pai').append(lista_pais);
    $('#dists').append(lista_distancia);
    $('#passa_um').on('click', () => {
        var valor = distanciaDerivada[2][$('#atual').html()];
        if(valor.acao == 'IN'){
            NormalizaDesenho(newnodes, newedges);
            if(typeof(valor.target) == 'string'){
                newnodes.update([{id: valor.target, color: 'red'}]);
                for(k in newedges._data){
                    if(newedges._data[k].from == valor.target){
                        newedges.update([{id: newedges._data[k].id, color: {color: '#458B74'}}])
                    }
                }
                if(valor.target == inicial){
                    NormalizeAlgorithm();
                    $('#algL1').attr('style','color: red');
                }else{
                    $('#algL5').attr('style','color: red');
                }
            }else{
                for(let k in valor.target){
                    newnodes.update([{id: valor.target[k], color: 'red'}]);
                }
                for(k in newedges._data){
                    if(newedges._data[k].from == valor.target[k]){
                        newedges.update([{id: newedges._data[k].id, color: {color: '#458B74'}}])
                    }
                }
                if(valor.target == inicial){
                    NormalizeAlgorithm();
                    $('#algL1').attr('style','color: red');
                }else{
                    $('#algL5').attr('style','color: red');
                }
            }
        }
        if(valor.acao == 'QU'){
            if(valor.target.acao == 'push'){
                if(valor.target.node == inicial){
                    NormalizeAlgorithm();
                    $('#algL2').attr('style', 'color: green');
                }
                palavra = '<li class="list-inline-item">'+newnodes._data[valor.target.node].label+'</li>';
                $('#'+valor.target.target).append(palavra);
            }
        }
        if(valor.acao == 'SN'){
            NormalizaCompleto(newnodes, newedges);
            newnodes.update([{id: valor.target, color: 'blue'}]);
            for(k in newedges._data){
                if(newedges._data[k].from == valor.target){
                    newedges.update([{id: newedges._data[k].id, color: {color: '#458B74'}}]);
                }
            }
            NormalizeAlgorithm();
            $('#algL4').attr('style', 'color: blue');
        }
        if(valor.acao == 'SN2'){
            NormalizaDesenho(newnodes, newedges);
            newnodes.update([{id: valor.target, color: 'purple'}]);
            for(k in newedges._data){
                if(newedges._data[k].from == valor.target){
                    newedges.update([{id: newedges._data[k].id, color: {color: '#458B74'}}]);
                }
            }
            $('#algL9').removeAttr('style');
            $('#algL5').attr('style', 'color: purple');
            $('#algL6').attr('style', 'color: green');
        }
        if(valor.acao == 'PE'){
            if(!ordenado){
                for(k in newedges._data){
                    if(newedges._data[k].from == valor.target.node1 && newedges._data[k].to == valor.target.node2 || 
                        newedges._data[k].to == valor.target.node1 && newedges._data[k].from == valor.target.node2){
                            newedges.update([{id: newedges._data[k].id, color: {color: 'black'}}]);
                    }
                }
            }else{
                for(k in newedges._data){
                    if(newedges._data[k].from == valor.target.node1 && newedges._data[k].to == valor.target.node2){
                            newedges.update([{id: newedges._data[k].id, color: {color: 'balck'}}]);
                    }
                }
            }
            $('#algL6').removeAttr('style');
            $('#algL6').attr('style', 'font-weight: bold');
        }
        if(valor.acao == 'QU'){
            if(valor.target.acao == 'update'){
                var possibilidades = $('#'+valor.target.target+valor.target.node).html(newnodes._data[valor.target.node].label + ' | ' + valor.target.data);
            }
            if(valor.target.acao == 'push'){
                var palavra;
                for(let n in valor.target.node){
                    var palavra = '<li class="list-inline-item">'+newnodes._data[valor.target.node[n]].label+'</li>';
                }
            }
            if(valor.target.acao == 'shift'){
                $('#'+valor.target.target).find('>:first-child').remove();
                $('#algL9').removeAttr('style');
                $('#algL4').removeAttr('style');
                $('#algL5').removeAttr('style');
                $('#algL6').removeAttr('style');
                $('#algL10').attr('style', 'color: blue');
            }
            if(valor.target.node != inicial && valor.target.acao != 'shift'){
                if(valor.target.target == 'dists'){
                    $('#algL7').attr('style', 'font-weight: bold');
                }else if(valor.target.target == 'pai'){
                    $('#algL7').removeAttr('style');
                    $('#algL8').attr('style', 'font-weight: bold');
                }else if(valor.target.target == 'fila'){
                    $('#algL8').removeAttr('style');
                    $('#algL9').attr('style', 'font-weight: bold');
                }
            }
            
        }
        if(valor.acao == 'INQE'){
            NormalizeAlgorithm();
            $('#algL3').attr('style', 'color: green');
        }
        let newatual = $('#atual').html();
        newatual++;
        $('#atual').html(newatual);
    });
    $('#volta_um').on('click', ()=>{
        var atual = $('#atual').html();
        $('#atual').html('0');
        limpaTudo();
        for(let i=0; i<parseInt(atual)-1; i++){
            $('#passa_um').click();
        }
    });
    $('#volta_primeiro').on('click', () => {
        var atual = $('#atual').html();
        $('#atual').html('0');
        limpaTudo();
        NormalizaCompleto(newnodes, newedges);
    });
    $('#play').on('click',() => {
        var sentinel = false;
        var cont = $('#atual').html();
        PlayAnimation(sentinel);
    });
    $('#passa_todos').on('click', ()=>{
        var total = $('#total').html();
        $('#atual').html('0');
        limpaTudo();
        for(let i=0; i<parseInt(total); i++){
            $('#passa_um').click();
        }
    });
    /* $('#atual').on('update', () =>{
        let atual = $('#atual').html();
        console.log(atual);
        if(atual == 3){
            $('#volta_primeiro').attr('disabled', 'disabled');
        }else{
            $('#volta_primeiro').removeAttr('disabled');
        }
    }) */
}

function NormalizaDesenho(newnodes, newedges){
    for(k in newnodes._data){
        if(newnodes._data[k].color != 'blue'){
            newnodes.update([{id: newnodes._data[k].id, color: '#458B74'}]);
        }
    }
    for(k in newedges._data){
        newedges.update([{id: newedges._data[k].id, color: {color: '#458B74'}}]);
    }
}

function NormalizaCompleto(newnodes, newedges){
    for(k in newnodes._data){
        newnodes.update([{id: newnodes._data[k].id, color: '#458B74'}]);
    }
    for(k in newedges._data){
        newedges.update([{id: newedges._data[k].id, color: {color: '#458B74'}}]);
    }
}

function limpaTudo(){
    $('#fila').html('');
    var lista_pais = '';
    var lista_distancia = '';
    for(k in nodes._data){
        lista_pais += '<li class="list-inline-item" id="pai'+nodes._data[k].id+'">'+nodes._data[k].label+' | Ind</li>';
        lista_distancia += '<li class="list-inline-item" id="dists'+nodes._data[k].id+'">'+nodes._data[k].label+' | Inf</li>';
    }
    $('#pai').html(lista_pais);
    $('#dists').html(lista_distancia);
}

function PlayAnimation(sentinel){
    if(sentinel){
        return;
    }else{
        if(parseInt($('#atual').html()) < parseInt($('#total').html())){
            $('#play').addClass
            $('#para').on('click', () =>{
                sentinel = true;
            });
            setTimeout(()=>{
                $('#passa_um').click();
                return PlayAnimation(sentinel);
            },$('#range_delay').val()*100);
        }
    }
}

function GetVerticesAdjacentes(vertice){
    let list = [];
    if(!ordenado){
        for(let k in edges._data){
            if(edges._data[k].from == vertice){
                list[list.length] = edges._data[k].to;
            }
            if(edges._data[k]. to == vertice){
                list[list.length] = edges._data[k].from;
            }
        }
    }else{
        for(let k in edges._data){
            if(edges._data[k].from == vertice){
                list[list.length] = edges._data[k].to;
            }
        }
    }
    return list;
}

$(document).on('hidden.bs.modal', '#DerivarDistancias', () => {
    $('#collapseTwo').removeClass('show');
});

function NormalizeAlgorithm(){
    $('#algL1').removeAttr('style');
    $('#algL2').removeAttr('style');
    $('#algL3').removeAttr('style');
    $('#algL4').removeAttr('style');
    $('#algL5').removeAttr('style');
    $('#algL6').removeAttr('style');
    $('#algL7').removeAttr('style');
    $('#algL8').removeAttr('style');
    $('#algL9').removeAttr('style');
    $('#algL10').removeAttr('style');
}