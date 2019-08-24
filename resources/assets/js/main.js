import vis from 'vis-network';
$('.nav a').on('click', function(){
    $('.btn-navbar').click(); //bootstrap 2.x
    $('.navbar-toggle').click(); //bootstrap 3.x by Richard
    $('.navbar-toggler').click(); //bootstrap 4.x
});

$.fn.confirm = function (options) {
  var settings = $.extend({}, $.fn.confirm.defaults, options);

  return this.each(function () {
    var element = this;

    $('.modal-title', this).html(settings.title);
    $('.message', this).html(settings.message);
    $('.confirm', this).html(settings.confirm);
    $('.dismiss', this).html(settings.dismiss);

    $(this).on('click', '.confirm', function (event) {
      $(element).data('confirm', true);
    });

    $(this).on('hide.bs.modal', function (event) {
      if ($(this).data('confirm')) {
        $(this).trigger('confirm', event);
        $(this).removeData('confirm');
      } else {
        $(this).trigger('dismiss', event);
      }

      $(this).off('confirm dismiss');
    });

    $(this).modal('show');
  });
};

$.fn.confirm.defaults = {
  title: 'Confirmação de laço',
  message: 'Deseja conectar o vértice a ele mesmo?',
  confirm: 'Sim',
  dismiss: 'Não'
};

// create an array with nodes
var nodes = new vis.DataSet([
    {id: 1, label: '', color: undefined},
    {id: 2, label: '', color: undefined},
    {id: 3, label: '', color: undefined},
    {id: 4, label: '', color: undefined},
    {id: 5, label: '', color: undefined}
]);

// create an array with edges
var edges = new vis.DataSet([
    {from: 1, to: 3, id: 1, color: {}},
    {from: 1, to: 2, id: 2, color: {}},
    {from: 2, to: 4, id: 3, color: {}},
    {from: 2, to: 5, id: 4, color: {}}
]);

var id = 6;
var edgeid = 5;

var ordenado = false;
var ponderado = false;

var EditarVertice = false;
var EditarAresta = false;

var GrafoCompleto;

var GraphContext = false;
var Propriedades = false;

// create a network
var container = document.getElementById('mynetwork');

// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};

var options = {
    locale: 'pt-br',
    manipulation: {
        enabled: false,
        addEdge: function (data, callback) {
            if (data.from == data.to) {
                $('#confirm').confirm().on({
                    confirm: function () {
                        if(ponderado) data.label = '1';
                        else data.label = ' ';
                        data.id = parseInt(edgeid++);
                        data.color = {};
                        callback(data);
                        network.addEdgeMode();
                    },
                    dismiss: function () {
                        network.addEdgeMode();
                    }
                })
            }else{
                if(ponderado) data.label = '1';
                else data.label = ' ';
                data.id = edgeid++;
                data.color = {};
                callback(data);
                network.addEdgeMode();
            }
            // after each adding you will be back to addEdge mode
            
        },
        addNode: function (data, callback){
            data.label = '';
            data.id = id++;
            data.color = undefined;
            callback(data);
            network.addNodeMode();
        },
        deleteNode: function (data, callback){
            callback(data);
        }
    },
    edges: {
        font:{
            color: "#ffffff",
            strokeWidth: 0,
            size: 18
        }
    },
    nodes:{
        color: {
            border: '#698B69',
            background: '#458B74',
            highlight: {
                border: '#698B69',
                background: '#4f6e4f'
            },
        },
        font: {
            color: 'white',
        }
    }
};

// initialize your network!
var network = new vis.Network(container, data, options);

/*CONTEXTO DO GRAFO*/
window.enableGraphContext = function(){
    if(Propriedades){
        desabilitarPropriedades();
    }
    $('#context').html("<div class=\"dropdown\">" + 
                    "<button class=\"btn btn-sm dropdown-toggle btn-success\" type=\"button\" id=\"dropdownMenuButtonVertice\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">"+
                        "<i class=\"fas fa-circle\"></i>"+
                    "</button>"+
                    "<div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"dropdownMenuButtonVertice\">"+
                        "<button class=\"dropdown-item\" onClick=\"enableCreateNode()\"><i class=\"fas fa-circle\"></i> <i class=\"far fa-plus-square\"></i> Adicionar</button>"+
                        "<button class=\"dropdown-item\" onClick=\"removeNode()\"><i class=\"fas fa-circle\"></i> <i class=\"far fa-minus-square\"></i> Remover</button>"+
                        "<button class=\"dropdown-item\" onClick=\"editNode()\"><i class=\"fas fa-circle\"></i> <i class=\"fas fa-edit\"></i> Editar</button>"+
                    "</div>"+
                "</div>&nbsp;"+
                "<div class=\"dropdown\">"+
                    "<button class=\"btn  btn-sm dropdown-toggle btn-success\" type=\"button\" id=\"dropdownMenuButtonAresta\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">"+
                        "<i class=\"fas fa-code-branch\"></i>"+
                    "</button>"+
                    "<div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"dropdownMenuButtonAresta\">"+
                        "<button class=\"dropdown-item\" onClick=\"adicionarAresta()\"><i class=\"fas fa-code-branch\"></i> <i class=\"far fa-plus-square\"></i> Adicionar</button>"+
                        "<button class=\"dropdown-item\" onClick=\"removeEdge()\"><i class=\"fas fa-code-branch\"></i> <i class=\"far fa-minus-square\"></i> Remover</button>"+
                        "<button class=\"dropdown-item\" onClick=\"editAresta()\"><i class=\"fas fa-code-branch\"></i> <i class=\"fas fa-edit\"></i> Editar</button>"+
                    "</div>"+
                "</div>&nbsp;"+
                "<div class=\"dropdown\">"+
                    "<button class=\"btn btn-sm dropdown-toggle btn-success\" type=\"button\" id=\"dropdownMenuButtonAresta\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">"+
                        "<i class=\"fas fa-cog\"></i>"+
                    "</button>"+
                    "<div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"dropdownMenuButtonAresta\">"+
                        "<button class=\"dropdown-item\" onClick=\"HabilitarOrdenado()\" id=\"ordenacao\"><input type=\"checkbox\" id=\"check_ordenado\" > <i class=\"fas fa-arrow-up\"></i> Orientado</button>"+
                        "<button class=\"dropdown-item\" onClick=\"HabilitarPonderado()\" id=\"ponderacao\"><input type=\"checkbox\" id=\"check_ponderado\"> <i class=\"fas fa-sort-numeric-up\"></i> Ponderado</button>"+
                        "<div class=\"dropdown-divider\"></div>"+
                        "<button class=\"dropdown-item\" onClick=\"ShowLimparGrafo()\"><i class=\"fas fa-skull\"></i> Limpar Grafo</button>"+
                        "<div class=\"dropdown-divider\"></div>"+
                        "<button class=\"dropdown-item\" onClick=\"exportNetwork()\"><i class=\"far fa-save\"></i> Salvar</button>"+
                        "<button class=\"dropdown-item\" onClick=\"abrirModalImportacao()\"><i class=\"far fa-file\"></i> Abrir</button>"+
                    "</div>"+
                "</div>&nbsp;"+
                "<button class=\"btn btn-danger btn-sm\" type=\"button\" onClick=\"disableGraphContext()\">"+
                    "<i class=\"fas fa-times\"></i>"+
                "</button>");
    $('#graphMenu').attr('onClick', 'disableGraphContext()');
    $('#footer').html("<spam>Use <i class=\"fas fa-circle\"></i> para os vértices e <i class=\"fas fa-code-branch\"></i> para as arestas.</spam>");
    GraphContext = true;
    $('#accordionSidebar').addClass("toggled");
    if(ordenado){
        $('#ordenacao').html("<input type=\"checkbox\" checked=\"checked\" id=\"check_ordenado\"> <i class=\"fas fa-slash\"></i> Não orientado");
        $("#ordenacao").attr("onclick","DesabilitarOrdenado()");    }
    if(ponderado){
        $('#ponderacao').html("<input type=\"checkbox\" id=\"check_ordenado\" checked=\"checked\"> <i class=\"fas fa-sort-numeric-down\"></i> Não Ponderado");
        $("#ponderacao").attr("onclick","DesabilitarPonderado()");
    }
    if($('#collapseTwo').hasClass('show')){
        $('#collapseTwo').removeClass('show');
    }
}

window.disableGraphContext = function(){
    normalizeGraph();
    $('#context').html("");
    $('#graphMenu').attr('onClick', 'enableGraphContext()');
    $('#footer').html("<span>Copyright &copy; Lucas Carvalho 2019</span>");
    GraphContext = false;
}

window.normalizeGraph = function(){
    network.disableEditMode();
    EditarVertice = false;
    EditarAresta = false;
}

window.setGraphStatus = function(){
    $('#footer').html("<spam>Use <i class=\"fas fa-circle\"></i> para os vértices e <i class=\"fas fa-code-branch\"></i> para as arestas.</spam>");
    $('#mynetwork').css('height', '76vh');
}

/*NODE MAKING*/
window.enableCreateNode = function(){
    normalizeGraph();

    $('#footer').html("<span>Clique ou toque no canvas para criar um Vértice. "+
        "<button class=\"btn btn-danger btn-sm\" type=\"button\" onClick=\"disableCreateNode()\">"+
            "<i class=\"fas fa-times\"></i>"+
        "</button></span>");
    $('#mynetwork').css('height', '74vh');

    network.addNodeMode();
}

window.disableCreateNode = function(){
    normalizeGraph();
    setGraphStatus();
}

/*REMOVE NODES*/
window.removeNode = function(){
    normalizeGraph();
    network.unselectAll();
    $('#mynetwork').css('height', '74vh');
    $('#footer').html("<span>"+
        "<button class=\"btn btn-success btn-sm\" type=\"button\" onClick=\"removeN()\">"+
            "<i class=\"far fa-minus-square\"></i> Excluir"+
        "</button>&nbsp;"+
        "<button class=\"btn btn-danger btn-sm\" type=\"button\" onClick=\"cancelRemove()\">"+
            "<i class=\"fas fa-times\"></i> Cancelar"+
        "</button>"+
        "</span>");

}

window.cancelRemove = function(){
    normalizeGraph();
    setGraphStatus();
}

window.removeN = function(){
    network.deleteSelected();
}

/*NODE EDITING*/
window.editNode = function(){
    normalizeGraph();

    network.unselectAll();
    $('#mynetwork').css('height', '74vh');
    $('#footer').html("<span>Selecione um Vértice para editar. "+
        "&nbsp;"+
        "<button class=\"btn btn-danger btn-sm\" type=\"button\" onClick=\"cancelEdit()\">"+
            "<i class=\"fas fa-times\"></i>"+
        "</button>"+
        "</span>");

    EditarVertice = true;

    network.on('selectNode', function(){
        if(EditarVertice){
            showEditModal();
        }
    });
}

window.cancelEdit = function(){
    normalizeGraph();
    setGraphStatus();
}

window.showEditModal = function(){

    $('#editNodeModal').on('shown.bs.modal', function(){
        var selecionados = network.getSelectedNodes();
        if(network.getSelectedNodes().length == 0){
            $('#editNodeBody').html('<p>Você não selecionou nenhum vértice.</p>');
            $('#editNodeFooter').html('<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Fechar</button>');
        }else{
            var label = data.nodes._data[selecionados[0]].label;
            if(label == ''){
                $('#editNodeBody').html('<label>Label (Nome do vértice):</label><input type=\"text\" class=\"form-control\" id=\"labelNode\" placeholder=\"Não definido\"/>');
                $('#editNodeFooter').html('<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Fechar</button><button type=\"button\" class=\"btn btn-primary\" onClick=\"editNodeLabel('+ selecionados[0] +')\">Salvar</button>');
            }else{
                $('#editNodeBody').html('<label>Label (Nome do vértice):</label><input type=\"text\" class=\"form-control\" id=\"labelNode\" placeholder=\"'+label+'\"/>');
                $('#editNodeFooter').html('<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Fechar</button><button type=\"button\" class=\"btn btn-primary\" onClick=\"editNodeLabel('+ selecionados[0] +')\">Salvar</button>');
            }
            $('#labelNode').focus();
            $('#labelNode').on("keypress", function(event){
                if(event.keyCode == 13){
                    editNodeLabel(selecionados[0]);
                }
            });
        }
    });
    $('#editNodeModal').modal('show');
}

window.editNodeLabel = function (id){

    nodes.update([{id: id, label:$('#labelNode').val()}]);
    $('#editNodeModal').modal('hide');
}


/*ARESTAS*/
window.adicionarAresta = function(){
    normalizeGraph();
    network.unselectAll();
    network.addEdgeMode();
    $('#footer').html("<span>Clique e arraste de um vértice a outro. "+
        "<button class=\"btn btn-danger btn-sm\" type=\"button\" onClick=\"cancelaAdicionarAresta()\">"+
            "<i class=\"fas fa-times\"></i>"+
        "</button>"+
        "</span>");
    $('#mynetwork').css('height', '76vh');
}

window.cancelaAdicionarAresta = function(){
    normalizeGraph();
    setGraphStatus();
}

window.removeEdge = function (){
    normalizeGraph();

    network.off('click');
    $('#mynetwork').css('height', '74vh');
    $('#footer').html("<span>"+
        "<button class=\"btn btn-success btn-sm\" type=\"button\" onClick=\"removeAresta()\">"+
            "<i class=\"far fa-minus-square\"></i> Excluir"+
        "</button>&nbsp;"+
        "<button class=\"btn btn-danger btn-sm\" type=\"button\" onClick=\"cancelRemoveAresta()\">"+
            "<i class=\"fas fa-times\"></i> Cancelar"+
        "</button>"+
        "</span>");
    network.unselectAll();
}

window.removeAresta = function (){
    network.deleteSelected();
}

window.cancelRemoveAresta = function(){
    normalizeGraph();
    setGraphStatus();
}

window.editAresta = function(){
    normalizeGraph();
    network.unselectAll();
    $('#mynetwork').css('height', '74vh');
    $('#footer').html("<span>Selecione uma Aresta para editar. "+
        "&nbsp;"+
        "<button class=\"btn btn-danger btn-sm\" type=\"button\" onClick=\"cancelEditAresta()\">"+
            "<i class=\"fas fa-times\"></i>"+
        "</button>"+
        "</span>");
    var options = {
        nodes:{
            chosen: false
        }
    };
    network.setOptions(options);
    EditarAresta = true;

    network.on('selectEdge', function(){
        if(EditarAresta){
            showEditArestaModal();
        }
    });
}

window.showEditArestaModal = function(){

    $('#editArestaModal').on('shown.bs.modal', function(){
        var selecionados = network.getSelectedEdges();
        if(selecionados.length == 0){
            $('#editEdgeBody').html('<p>Você não selecionou nenhuma aresta.</p>');
            $('#editEdgeFooter').html('<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Fechar</button>');
        }else{
            var label = data.edges._data[selecionados[0]].label;
            if(label == '' || label === undefined || label == ' '){
                $('#editEdgeBody').html('<label>Label (Peso da aresta):</label><input type=\"number\" class=\"form-control\" id=\"labelEdge\" placeholder=\"Não definido\"/><br><button type=\"button\" class=\"btn btn-primary\" onClick=\"InverterAresta(\''+ selecionados[0] +'\')\">Inverter ordem de conexão</button>');
                $('#editEdgeFooter').html('<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Fechar</button><button type=\"button\" class=\"btn btn-primary\" onClick=\"editEdgeLabel(\''+ selecionados[0] +'\')\">Salvar</button>');
            }else{
                $('#editEdgeBody').html('<label>Label (Peso da aresta):</label><input type=\"number\" class=\"form-control\" id=\"labelEdge\" placeholder=\"'+label+'\"/><br><button type=\"button\" class=\"btn btn-primary\" onClick=\"InverterAresta(\''+ selecionados[0] +'\')\">Inverter ordem de conexão</button>');
                $('#editEdgeFooter').html('<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Fechar</button><button type=\"button\" class=\"btn btn-primary\" onClick=\"editEdgeLabel(\''+ selecionados[0] +'\')\">Salvar</button>');
            }
            $('#labelEdge').focus();
            $('#labelEdge').on("keypress", function(event){
                if(event.keyCode == 13){
                    editEdgeLabel(selecionados[0]);
                }
            });
        }
    });
    $('#editArestaModal').modal('show');
}

window.editEdgeLabel = function(id){
    if(!ponderado){
        HabilitarPonderado();
    }
    edges.update([{id: id, label:$('#labelEdge').val()}]);
    $('#editArestaModal').modal('hide');
    ponderado = true;

}

window.InverterAresta = function(id){
    var aux;
    console.log(id, edges._data[id]);
    aux = edges._data[id].from;
    edges.update([{id:id, from: edges._data[id].to, to: aux}]);
    $('#editArestaModal').modal('hide');
}

window.cancelEditAresta = function(){
    normalizeGraph();
    setGraphStatus();
}


/*CONFIGURAÇÕES DO GRAFO*/


/*ORDENADO*/
window.HabilitarOrdenado = function(){
    normalizeGraph();
    setGraphStatus();
    var options = {
        edges:{
            arrows: 'to'
        }
    }
    network.setOptions(options);
    $('#ordenacao').html("<input type=\"checkbox\" checked=\"checked\" id=\"check_ordenado\"> <i class=\"fas fa-slash\"></i> Não orientado");
    $("#ordenacao").attr("onclick","DesabilitarOrdenado()");
    ordenado = true;
}

/*DESORDENADO*/
window.DesabilitarOrdenado = function(){
    normalizeGraph();
    setGraphStatus();
    var options = {
        edges:{
            arrows: {
                to: {
                    enabled: false
                }
            }
        }
    }

    network.setOptions(options);
    $('#ordenacao').html("<input type=\"checkbox\" id=\"check_ordenado\"> <i class=\"fas fa-arrow-up\"></i> Orientado");
    $("#ordenacao").attr("onclick","HabilitarOrdenado()");
    ordenado = false;
}



/*PONDERADO*/
window.HabilitarPonderado = function(){
    normalizeGraph();
    setGraphStatus();

    for(var edge in data.edges._data){
        if(data.edges._data[edge].label === undefined | data.edges._data[edge].label == '' | data.edges._data[edge].label == ' '){
            edges.update([{id: data.edges._data[edge].id, label: '1'}]);
        }
    }
    network.setOptions(options);
    $('#ponderacao').html("<input type=\"checkbox\" id=\"check_ordenado\" checked=\"checked\"> <i class=\"fas fa-sort-numeric-down\"></i> Não Ponderado");
    $("#ponderacao").attr("onclick","DesabilitarPonderado()");
    ponderado = true;
}

/*NÃO PONDERADO*/
window.DesabilitarPonderado = function(){
    normalizeGraph();
    setGraphStatus();
    $.fn.confirm.defaults = {
      title: 'Confirmação de exclusão de pesos',
      message: 'Tem certeza que deseja excluir o peso de todas as arestas?',
      confirm: 'Sim',
      dismiss: 'Não'
    };
    $('#confirm').confirm().on({
        confirm: function () {
            for(var aresta in data.edges._data){
                edges.update([{id: data.edges._data[aresta].id, label: " "}]);
                data.edges._data[aresta].label = " ";
            }
            $('#ponderacao').html("<input type=\"checkbox\" id=\"check_ordenado\"> <i class=\"fas fa-sort-numeric-up\"></i> Ponderado");
            $("#ponderacao").attr("onclick","HabilitarPonderado()");
            ponderado = false;
        },
        dismiss: function () {
        }
    })
    $.fn.confirm.defaults = {
      title: 'Confirmação de laço',
      message: 'Deseja conectar o vértice a ele mesmo?',
      confirm: 'Sim',
      dismiss: 'Não'
    };
}



/*SALVAR E ABRIR ARQUIVOS DE GRAFOS*/

window.exportNetwork = function() {

    var exportar = {
        data: data,
        options: options,
        ponderado: ponderado,
        ordenado: ordenado
    };

    var exportValue = JSON.stringify(exportar);

    var a = document.createElement("a");

    document.body.appendChild(a);

    a.style = "display: none";

    var json = exportValue,
        blob = new Blob([json], {type: "octet/stream"}),
        url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "Grafo.json";
    a.click();
    window.URL.revokeObjectURL(url);

}

window.abrirModalImportacao = function(){
    $('#filegrafo').val('');
    $('#ModalImportacao').modal('show');
}

window.abreNovoGrafo = function(newdata, newoptions, newordenado, newponderado){
    var novosnodes = new vis.DataSet([]);
    var novosedges = new vis.DataSet([]);
    for(var k in newdata.nodes._data){
        novosnodes.add([newdata.nodes._data[k]]);
        id = newdata.nodes._data[k].id;
    }
    id++;
    for(var k in newdata.edges._data){
        novosedges.add([newdata.edges._data[k]]);
        edgeid = newdata.edges._data[k].id;
    }
    edgeid++;
    nodes = novosnodes;
    edges = novosedges
    data = {
        nodes: nodes,
        edges: edges
    };
    network = new vis.Network(container, data);
    network.setOptions(newoptions);
    if(newordenado == true){
        HabilitarOrdenado();
    }
    if(newponderado == true){
        HabilitarPonderado();
    }
}

/*LIMPEZA DO GRAFO*/
window.ShowLimparGrafo = function(){
    $('#ModalLimpeza').modal('show');
}

window.Limpar = function(){
    nodes = new vis.DataSet([]);
    edges = new vis.DataSet([]);
    network.setData({nodes, edges});
    id = 1;
    edgeid = 1;
    $('#ModalLimpeza').modal('hide');
}

/*PROPRIEDADES DO GRAFO*/

window.habilitarPropriedades = function(){
    if(GraphContext){
        disableGraphContext();    
    }
    $('#accordionSidebar').addClass("toggled");
    Propriedades = true;
    var tipo = tipoDoGrafo();
    $('#conteudo').removeClass('mynetwork');
    $('#conteudo').addClass('mynetwork2');
    GrafoCompleto = $('#mynetwork');
    $('#conteudo').html("<div class=\"row\">"+
        "<div class=\"col-md-6\" id=\"minigrafo\"></div>"+
        "<div class=\"col-md-6\" id=\"propriedades1\">"+
        "<p><button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Se simples: Não possui laços nem arestas múltiplas;\nSe multígrafo: não possui laços mas possui arestas múltiplas;\nSe pseudografo: possui laço e pode possuir arestas múltiplas.\">(?)</button> <b>Tipo do grafo:</b> "+tipo+"<br>"+
        "<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Quantidade de vértices.\">(?)</button> <b>Número de vértices (Ordem - |V|):</b> "+nodes.length+"<br>"+
        "<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Quantidade de arestas.\">(?)</button> <b>Número de arestas (Tamanho - |A|):</b> "+edges.length+"</br>"+
        "<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Quantas arestas ou arcos existem entre cada par ordenado de vértices.\">(?)</button>"+
        "<b> Multiplicidade de arestas:</b> "+
        "<button id='btnMultAresta' value=0 class='btn btn-sm' onclick='TabelaMultiplicidadeArestas()'>Mostrar Tabela</button> "+
        "<div id='multiplicidadeTable' style='display: none; padding-top: 5px; margin-bottom: 5px;'>"+multiplicidadeGeral()+
        "</div></div>"+
        "<div class='col-md-6' id='propriedades2'>"+
        "</div>"+
        "<div class='col-md-6' id='propriedades3'>"+
        "</div>"
        +"</div>");
    $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra se o grafo é orientado (direcionado) ou não.\">(?)</button> <b>Orientação:</b> ");
    if(ordenado){
        if(tipo == "Simples"){
            $('#propriedades2').append("Dígrafo simples<br>");
        }else if(tipo == "Pseudografo"){
            $('#propriedades2').append("Pseudografo direcionado<br>");
        }else{
            $('#propriedades2').append("Multidígrafo direcionado<br>");
        }

    }else{
        $('#propriedades2').append("Não direcionado<br>");
    }
    if(ponderado){
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra se um grafo é ponderado ou não.\">(?)</button> <b>Ponderação:</b> Ponderado<br>");
    }else{
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra se um grafo é ponderado ou não.\">(?)</button> <b>Ponderação:</b> Não ponderado<br>");
    }


    if ((tipo == "Simples" || tipo == "Pseudografo" || tipo == "Multigrafo") && !ordenado){
        var grado = grausSimples();
        $('#propriedades3').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra quais vértices são vizinhos de quais vértices.\">(?)</button> <b>Vizinhança <i>&tau;</i>(<i>v</i>): </b> ");
        $('#propriedades3').append("<button id='TabViz' class='btn btn-sm' onClick='TabVizSH()'>Mostrar Tabela</button><br>")
        $('#propriedades3').append("<div id='vizinhancasimples' style='display:none; padding-top: 5px; margin-bottom: 5px;'></div>");
        $('#vizinhancasimples').append(vizinhacaSimples());
        $('#vizinhancasimples').addClass('table-responsive');
        $('#propriedades3').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra quantas conexões incidem em cada vértice.\">(?)</button> <b>Graus dos vértices:</b> ");
        $('#propriedades3').append("<button class='btn btn-sm' id='btnTabGS' value='0' onClick='TabGSSH()'>Mostrar Tabela</button>");
        $('#propriedades3').append("<div id='grausSimples' style='display:none; padding-top: 5px; margin-bottom: 5px;'></div><br>");
        $('#grausSimples').append(grado[0]);
        $('#grausSimples').addClass("table-responsive");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Maior quantidade de arestas que incidem em um vértice.\">(?)</button> <b>Maior Grau: </b>"+grado[1]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Menor quantidade de arestas que incidem em um vértice.\">(?)</button> <b>Menor Grau: </b>"+grado[2]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Matriz de Adjacência do grafo.\">(?)</button> <b>Matriz de Adjacência M = [m<sub>i,j</sub>]:</b> ");
        $('#propriedades2').append("<button class='btn btn-sm' id='TabMA' onClick='TabMASH()' value='0'>Mostrar Tabela</button></br>")
        $('#propriedades2').append('<div id="MatrizAdjacenciaSimples" class="table-responsive" style=\"display:none; padding-top: 5px; margin-bottom:5px\"></div>');
        $('#MatrizAdjacenciaSimples').append(MatrizAdjacenciaSimples());
        $('#propriedades3').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Matriz de Incidência do grafo.\">(?)</button> <b>Matriz de Incidência B = [b<sub>i,j</sub>]:</b>");
        $('#propriedades3').append("<button class='btn btn-sm' id='TabMI' onClick='TabMISH()' value='0'>Mostrar Tabela</button>")
        $('#propriedades3').append('<div id="MatrizIncidenciaSimples" class="table-responsive" style="display:none; padding-top: 5px; margin-bottom: 5px;"></div>');
        $('#MatrizIncidenciaSimples').append(MatrizIncidenciaSimples());
    }
    if ((tipo=="Simples" || tipo == "Multigrafo" || tipo == "Pseudografo") && ordenado){
        var grado = grausOrientados();
        $('#propriedades3').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra em quais vértices incidem as arestas que saem do vértice em destaque.\">(?)</button> <b>Vizinhança Direta <i>&tau;</i><SUP>+</SUP>(<i>v</i>):</b>");
        $('#propriedades3').append("<button id='TabVizD' class='btn btn-sm' onClick='TabVizSD()'>Mostrar Tabela</button><br>");
        $('#propriedades3').append("<div id='vizinhancadireta' style='display: none'></div>");
        $('#vizinhancadireta').append(vizinhacaDireta());
        $('#vizinhancadireta').addClass('table-responsive');
        $('#propriedades3').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra os vértices nos quais existem arcos que incidam sobre o vértice em destaque.\">(?)</button> <b>Vizinhança Inversa <i>&tau;</i><SUP>-</SUP>(<i>v</i>):</b> ");
        $('#propriedades3').append("<button id='TabVizI' class='btn btn-sm' onClick='TabVizSI()'>Mostrar Tabela</button><br>");
        $('#propriedades3').append("<div id='vizinhancainversa' style='display:none;'></div>");
        $('#vizinhancainversa').append(vizinhacaInversa());
        $('#vizinhancainversa').addClass("table-responsive");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Maior quantidade de arcos que chegam a um vértice.\">(?)</button> <b>Maior Grau de Entrada: </b>"+grado[1]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Menor quantidade de arcos que chegam a um vértice.\">(?)</button> <b>Menor Grau de Entrada: </b>"+grado[2]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Maior quantidade de arcos que saem de um vértice.\">(?)</button> <b>Maior Grau de Saída: </b>"+grado[3]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Menor quantidade de arcos que saem de um vértice.\">(?)</button> <b>Menor Grau de Saída: </b>"+grado[4]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra a quantidade de arcos incidentes em cada vértice.\">(?)</button> <b>Graus dos vértices:</b>");
        $('#propriedades2').append("<button class='btn btn-sm' id='btnTabGS' value='0' onClick='TabGSO()'>Mostrar Tabela</button><br/>");
        $('#propriedades2').append("<div id='grausOrientados' class='table-responsive' style='display: none;'></div>");
        $('#grausOrientados').append(grado[0]);
        $('#propriedades3').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Matriz de Adjacência do grafo.\">(?)</button> <b>Matriz de Adjacência M = [m<sub>i,j</sub>]:</b>");
        $('#propriedades3').append("<button class='btn btn-sm' id='TabMA' onClick='TabMAO()' value='0'>Mostrar Tabela</button></br>")
        $('#propriedades3').append('<div id="MatrizAdjacenciaOrientado" class="table-responsive" style="display:none;"></div>');
        $('#MatrizAdjacenciaOrientado').append(MatrizAdjacenciaOrientado());
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Matriz de Incidência do grafo.\">(?)</button> <b>Matriz de Incidência B = [b<sub>i,j</sub>]:</b>");
        $('#propriedades2').append("<button class='btn btn-sm' id='TabMI' onClick='TabMIO()' value='0'>Mostrar Tabela</button></br>")
        $('#propriedades2').append('<div id="MatrizIncidenciaOrientado" class="table-responsive" style="display:none;"></div>');
        $('#MatrizIncidenciaOrientado').append(MatrizIncidenciaOrientado());
    }
    
    $('#minigrafo').html(GrafoCompleto);
    $('#mynetwork').removeClass('mynetwork');
    $('#mynetwork').addClass('propriedades');
    $('#mynetwork').removeAttr('style');
    if($('#collapseTwo').hasClass('show')){
        $('#collapseTwo').removeClass('show');
    }

    
    $(".show-tt").on('click', function(){
        $(this).tooltip("show");
    });
    $(".show-tt").on('mouseout', function(){
        $(this).tooltip("hide");
    });
}

window.desabilitarPropriedades = function(){
    Propriedades = false;
    $('#conteudo').removeClass('mynetwork2');
    $('#conteudo').addClass('mynetwork');
    $('#conteudo').html(GrafoCompleto);
    $('#mynetwork').removeClass('propriedades');
    $('#mynetwork').addClass('mynetwork');
}

/*TIPO DO GRAFO*/

window.tipoDoGrafo = function(){
    var laco = false;
    var idaevolta = false;
    for(var k in edges._data){
        if(edges._data[k].from == edges._data[k].to){
            laco = true;
        }
        for (var l in edges._data){
            if(k != l && edges._data[k].from == edges._data[l].from){
                if(edges._data[k].to == edges._data[l].to){
                    idaevolta = true;
                }
            }
            if(k != l && edges._data[k].from == edges._data[l].to){
                if(edges._data[k].to == edges._data[l].from){
                    idaevolta = true;
                }
            }
        }
    }

    if(laco && idaevolta || idaevolta){
        return "Multigrafo";
    }else if(laco){
        return "Pseudografo";
    }else{
        return "Simples";
    }
}

/*MULTIPLICIDADE DE ARESTAS*/

window.multiplicidade = function(id1, id2){
    var mul = 0;
    for(var k in edges._data){
        if(edges._data[k].from == id1 && edges._data[k].to == id2){
            mul++;
        }
        if(edges._data[k].from == id2 && edges._data[k].to == id1){
            mul++;
        }
    }
    return mul;
}

window.multiplicidadeOr = function(id1, id2){
    var mul = 0;
    for(var k in edges._data){
        if(edges._data[k].from == id1 && edges._data[k].to == id2){
            mul++;
        }
    }
    return mul;
}

window.multStartNOrientado = function() {
    var multi = [];
    var i = 1;
    var string = "";
    for(var k in nodes._data){
        if(nodes._data[k].label == undefined || nodes._data[k].label == '' || nodes._data[k].label == ' '){
            nodes.update([{id: nodes._data[k].id, label: ""+nodes._data[k].id}]);
        }
    }
    for(var k in nodes._data){
        for(var l in nodes._data){
            if(nodes._data[k].id<=nodes._data[l].id){
                if(k==l){
                    multi[i] = [nodes._data[k].id, nodes._data[l].id, multiplicidade(nodes._data[k].id, nodes._data[l].id)/2];
                }else{
                    multi[i] = [nodes._data[k].id, nodes._data[l].id, multiplicidade(nodes._data[k].id, nodes._data[l].id)];
                }
            }
            i++;
        }
    }
    string += "<table class='table table-responsive'>";
    string += "<thead><tr>";
    string += "<td>Arestas</td>";
    for(var k in multi){
        string += "<td>";
        string += "{"+nodes._data[multi[k][0]].label+","+nodes._data[multi[k][1]].label+"}";
        string += "</td>";
    }
    string += "</tr></thead>";
    string += "<tr>";
    string += "<td>Multiplicidade</td>";
    for(var k in multi){
        string += "<td class='text-center'>";
        string += multi[k][2];
        string += "</td>";
    }
    string += "</tr>";
    string += "</table>";
    return string;
}

window.multStartOrientado = function() {
    var multi = [];
    var i = 1;
    var string = "";
    for(var k in nodes._data){
        if(nodes._data[k].label == undefined || nodes._data[k].label == '' || nodes._data[k].label == ' '){
            nodes.update([{id: nodes._data[k].id, label: ""+nodes._data[k].id}]);
        }
    }
    for(var k in nodes._data){
        for(var l in nodes._data){
            multi[i] = [nodes._data[k].id, nodes._data[l].id, multiplicidadeOr(nodes._data[k].id, nodes._data[l].id)];
            i++;
        }
    }
    string += "<table class='table table-responsive'>";
    string += "<thead><tr>";
    string += "<td>Arestas</td>";
    for(var k in multi){
        string += "<td>";
        string += "{"+nodes._data[multi[k][0]].label+","+nodes._data[multi[k][1]].label+"}";
        string += "</td>";
    }
    string += "</tr></thead>";
    string += "<tr>";
    string += "<td>Multiplicidade</td>";
    for(var k in multi){
        string += "<td class='text-center'>";
        string += multi[k][2];
        string += "</td>";
    }
    string += "</tr>";
    string += "</table>";
    return string;
}

window.multiplicidadeGeral = function () {
    if(ordenado){
        return multStartOrientado();
    }else{
        return multStartNOrientado();
    }
}

/*VIZINHANÇA DIRETA E INVERSA PARA GRAFOS SIMPLES E MULTIGRAFOS*/
window.vizinhacaSimples = function (){
    var vectorVizinhos = [];
    for(var n in nodes._data){
        vectorVizinhos[nodes._data[n].id] = [];
    }
    for(var e in edges._data){
        for(var k in vectorVizinhos){
            if(edges._data[e].from == k){
                vectorVizinhos[k].push(edges._data[e].to);
            }
            if(edges._data[e].to == k){
                vectorVizinhos[k].push(edges._data[e].from);
            }
        }
    }
    var string = '';
    string += "<table class='table'>";
    string += "<thead class='text-center'>";
    string += "<tr>";
    string += "<td>Vértice</td>";
    for(var k in vectorVizinhos){
        string += "<td>"+nodes._data[k].label+"</td>"
        vectorVizinhos[k].sort();
    }
    string += "</tr>";
    string += "</thead>"
    string += "<tbody class='text-center'>";
    string += "<tr>"
    string += "<td>Vizinhos</td>";
    for(var k in vectorVizinhos){
        string += "<td>";
        for(var m in vectorVizinhos[k]){
            string += nodes._data[vectorVizinhos[k][m]].label+",";
        }
        string = string.substring(0,(string.length - 1));
        string += "</td>";
    }
    string += "</tr>"
    string += "</tbody>";
    string += "</table>";
    return string;
};

window.vizinhacaDireta = function (){
    var vectorVizinhos = [];
    for(var n in nodes._data){
        vectorVizinhos[nodes._data[n].id] = [];
    }
    for(var e in edges._data){
        for(var k in vectorVizinhos){
            if(edges._data[e].from == k){
                vectorVizinhos[k].push(edges._data[e].to);
            }
        }
    }
    var string = '';
    string += "<table class='table'>";
    string += "<thead class='text-center'>";
    string += "<tr>";
    string += "<td>Vértice</td>";
    for(var k in vectorVizinhos){
        string += "<td>"+nodes._data[k].label+"</td>"
        vectorVizinhos[k].sort();
    }
    string += "</tr>";
    string += "</thead>"
    string += "<tbody class='text-center'>";
    string += "<tr>"
    string += "<td>Vizinhos</td>";
    var change = false;
    for(var k in vectorVizinhos){
        change = false;
        string += "<td>";
        for(var m in vectorVizinhos[k]){
            string += nodes._data[vectorVizinhos[k][m]].label+',';
            change = true;
        }
        if (change){
            string = string.substring(0,(string.length - 1));
        }
        string += "</td>";
    }
    string += "</tr>"
    string += "</tbody>";
    string += "</table>";
    return string;
};

window.vizinhacaInversa =function(){
    var vectorVizinhos = [];
    for(var n in nodes._data){
        vectorVizinhos[nodes._data[n].id] = [];
    }
    for(var e in edges._data){
        for(var k in vectorVizinhos){
            if(edges._data[e].to == k){
                vectorVizinhos[k].push(edges._data[e].from);
            }
        }
    }
    var string = '';
    string += "<table class='table'>";
    string += "<thead class='text-center'>";
    string += "<tr>";
    string += "<td>Vértice</td>";
    for(var k in vectorVizinhos){
        string += "<td>"+nodes._data[k].label+"</td>"
        vectorVizinhos[k].sort();
    }
    string += "</tr>";
    string += "</thead>"
    string += "<tbody class='text-center'>";
    string += "<tr>"
    string += "<td>Vizinhos</td>";
    var change  = false;
    for(var k in vectorVizinhos){
        change = false
        string += "<td>";
        for(var m in vectorVizinhos[k]){
            string += nodes._data[vectorVizinhos[k][m]].label+",";
            change = true;
        }
        if(change){
            string = string.substring(0,(string.length - 1));
        }
        string += "</td>";
    }
    string += "</tr>"
    string += "</tbody>";
    string += "</table>";
    return string;
};

/*GRAUS DOS VÉRTICES*/
window.grausSimples = function (){
    var graus = [];
    for(var n in nodes._data){
        graus[nodes._data[n].id] = 0;
        for(var e in edges._data){
            if(edges._data[e].from == nodes._data[n].id || edges._data[e].to == nodes._data[n].id){
                graus[nodes._data[n].id]++;
            }
            if(edges._data[e].from == nodes._data[n].id && edges._data[e].to == nodes._data[n].id){
                graus[nodes._data[n].id]++;
            }
        }
    }
    var string = '';
    string += "<table class='table'>";
    string += "<thead class='text-center'>";
    string += "<tr>";
    string += "<td>Vértice</td>";
    var maiorgrau = graus[1], menorgrau = graus[1];
    for(var k in graus){
        string += "<td>"+nodes._data[k].label+"</td>"
        if(graus[k] >= maiorgrau){
            maiorgrau = graus[k];
        }
        if(graus[k] <= menorgrau){
            menorgrau = graus[k];
        }
    }
    string += "</tr>";
    string += "</thead>"
    string += "<tbody class='text-center'>";
    string += "<tr>"
    string += "<td>Grau</td>"
    for(var k in graus){
        string += "<td>"+graus[k]+"</td>";
    }
    string += "</tr>"
    string += "</tbody>";
    string += "</table>";
    return [string, maiorgrau, menorgrau];
}

window.grausOrientados = function (){
    var graus = [];
    for(var n in nodes._data){
        graus[nodes._data[n].id] = [];
        graus[nodes._data[n].id][0] = 0;
        graus[nodes._data[n].id][1] = 0;
        for(var e in edges._data){
            if(edges._data[e].to == nodes._data[n].id){
                graus[nodes._data[n].id][0]++;
            }
            if(edges._data[e].from == nodes._data[n].id){
                graus[nodes._data[n].id][1]++;
            }
        }
    }
    var string = '';
    string += "<table class='table'>";
    string += "<thead class='text-center'>";
    string += "<tr>";
    string += "<td>Vértice</td>";
    var maiorgrauentrada = graus[1][0], menorgrauentrada = graus[1][0], maiorgrausaida = graus[1][1], menorgrausaida = graus[1][1];
    for(var k in graus){
        string += "<td>"+nodes._data[k].label+"</td>"
        if(graus[k][0] >= maiorgrauentrada){
            maiorgrauentrada = graus[k][0];
        }
        if(graus[k][0] <= menorgrauentrada){
            menorgrauentrada = graus[k][0];
        }
        if(graus[k][1] >= maiorgrausaida){
            maiorgrausaida = graus[k][1];
        }
        if(graus[k][1] <= menorgrausaida){
            menorgrausaida = graus[k][1];
        }
    }
    string += "</tr>";
    string += "</thead>"
    string += "<tbody class='text-center'>";
    string += "<tr>"
    string += "<td>Grau Entrada</td>"
    for(var k in graus){
        string += "<td>"+graus[k][0]+"</td>";
    }
    string += "</tr><tr>";
    string += "<td>Grau Saída</td>"
    for(var k in graus){
        string += "<td>"+graus[k][1]+"</td>";
    }
    string += "</tr>";
    string += "</tbody>";
    string += "</table>";
    return [string, maiorgrauentrada, menorgrauentrada, maiorgrausaida, menorgrausaida];
}

/*-----------------------------------------------------------*/
/*      MATRIZ DE ADJACÊNCIA PARA GRAFOS NÃO ORIENTADOS      */
/*-----------------------------------------------------------*/

window.MatrizAdjacenciaSimples = function (){
    var matriz = '<table class="table">';
    matriz += '<tr>';
    matriz += '<td><b>*</b></td>'
    for(var i in nodes._data){
        matriz += '<td><b>'+nodes._data[i].label+'</b></td>';
    }
    matriz += '</tr>';
    for(var i in nodes._data){
        matriz += '<tr><td><b>'+nodes._data[i].label+'</b></td>';
        for(var j in nodes._data){
            if(i != j){
                matriz += '<td>'+multiplicidade(i,j)+'</td>';
            }else{
                matriz += '<td>'+multiplicidade(i,j)/2+'</td>';
            }
            
        }
        matriz += '</tr>';
    }
    matriz += '</table>'
    return matriz;
}

/*-----------------------------------------------------------*/
/*      MATRIZ DE INCIDÊNCIA PARA GRAFOS NÃO ORIENTADOS      */
/*-----------------------------------------------------------*/

window.MatrizIncidenciaSimples = function (){
    var matriz = '<table class="table">';
    matriz += '<tr>';
    matriz += '<td><b>*</b></td>'
    for(var i in edges._data){
        matriz += '<td><b>{'+nodes._data[edges._data[i].from].label+','+nodes._data[edges._data[i].to].label+'}</b></td>';
    }
    matriz += '</tr>';
    for(var i in nodes._data){
        matriz += '<tr><td><b>'+nodes._data[i].label+'</b></td>';
        for(var j in edges._data){
            var soma = 0;
            if(edges._data[j].from == i){
                soma++;
            }
            if(edges._data[j].to == i){
                soma++;
            }
            if(edges._data[j].from == edges._data[j].to && i == edges._data[j].from){
                soma--;
            }
            matriz += '<td>'+soma+'</td>';  
        }
        matriz += '</tr>';
    }
    matriz += '</table>'
    return matriz;
}

/*-----------------------------------------------------------*/
/*      MATRIZ DE Adjacencia PARA GRAFOS ORIENTADOS          */
/*-----------------------------------------------------------*/

window.MatrizAdjacenciaOrientado = function (){
    var matriz = '<table class="table">';
    matriz += '<tr>';
    matriz += '<td><b>*</b></td>'
    for(var i in nodes._data){
        matriz += '<td><b>'+nodes._data[i].label+'</b></td>';
    }
    matriz += '</tr>';
    for(var i in nodes._data){
        matriz += '<tr><td><b>'+nodes._data[i].label+'</b></td>';
        for(var j in nodes._data){
            if(i != j){
                matriz += '<td>'+multiplicidadeOr(i,j)+'</td>';
            }else{
                matriz += '<td>'+multiplicidadeOr(i,j)+'</td>';
            }
            
        }
        matriz += '</tr>';
    }
    matriz += '</table>'
    return matriz;
}

/*-----------------------------------------------------------*/
/*      MATRIZ DE INCIDÊNCIA PARA GRAFOS ORIENTADOS          */
/*-----------------------------------------------------------*/

window.MatrizIncidenciaOrientado = function (){
    var matriz = '<table class="table">';
    matriz += '<tr>';
    matriz += '<td><b>*</b></td>'
    for(var i in edges._data){
        matriz += '<td><b>{'+nodes._data[edges._data[i].from].label+','+nodes._data[edges._data[i].to].label+'}</b></td>';
    }
    matriz += '</tr>';
    for(var i in nodes._data){
        matriz += '<tr><td><b>'+nodes._data[i].label+'</b></td>';
        for(var j in edges._data){
            var soma = 0;
            if(edges._data[j].from == i){
                soma--;
            }
            if(edges._data[j].to == i){
                soma++;
            }
            if(edges._data[j].from == edges._data[j].to && i == edges._data[j].from){
                soma++;
            }
            matriz += '<td>'+soma+'</td>';  
        }
        matriz += '</tr>';
    }
    matriz += '</table>'
    return matriz;
}

/*-----------------------------------------------------------*/
/*      BOTÃO DE SHOW/HIDE DA MULTIPLICIDADE DE ARESTAS      */
/*-----------------------------------------------------------*/


window.TabelaMultiplicidadeArestas = function (){
    if($('#btnMultAresta').val() == 0){
        $('#multiplicidadeTable').css('display', 'block');
        $('#btnMultAresta').val('1');
        $('#btnMultAresta').html('Esconder Tabela');
    }else{
        $('#multiplicidadeTable').css('display', 'none');
        $('#btnMultAresta').val('0');
        $('#btnMultAresta').html('Mostrar Tabela');
    }
}

/*------------------------------------------------------------------------*/
/*      BOTÃO DE SHOW/HIDE DOS GRAUS DOS VÉRTICES PARA GRAFOS SIMPLES     */
/*------------------------------------------------------------------------*/


window.TabGSSH = function (){
    if($('#btnTabGS').val() == 0){
        $('#grausSimples').css('display', 'block');
        $('#btnTabGS').val('1');
        $('#btnTabGS').html('Esconder Tabela');
    }else{
        $('#grausSimples').css('display', 'none');
        $('#btnTabGS').val('0');
        $('#btnTabGS').html('Mostrar Tabela');
    }
}

/*------------------------------------------------------------------------*/
/*      BOTÃO DE SHOW/HIDE DOS GRAUS DOS VÉRTICES PARA GRAFOS ORIENTADOS  */
/*------------------------------------------------------------------------*/


window.TabGSO = function (){
    if($('#btnTabGS').val() == 0){
        $('#grausOrientados').css('display', 'block');
        $('#btnTabGS').val('1');
        $('#btnTabGS').html('Esconder Tabela');
    }else{
        $('#grausOrientados').css('display', 'none');
        $('#btnTabGS').val('0');
        $('#btnTabGS').html('Mostrar Tabela');
    }
}

/*------------------------------------------------------------------------*/
/*   BOTÃO DE SHOW/HIDE DOS VIZINHOS DOS VÉRTICES PARA GRAFOS SIMPLES     */
/*------------------------------------------------------------------------*/


window.TabVizSH = function (){
    if($('#TabViz').val() == 0){
        $('#vizinhancasimples').css('display', 'block');
        $('#TabViz').val('1');
        $('#TabViz').html('Esconder Tabela');
    }else{
        $('#vizinhancasimples').css('display', 'none');
        $('#TabViz').val('0');
        $('#TabViz').html('Mostrar Tabela');
    }
}

/*------------------------------------------------------------------------*/
/*   BOTÃO DE SHOW/HIDE DOS VIZINHOS DIRETOS DOS GRAFOS ORIENTADOS        */
/*------------------------------------------------------------------------*/


window.TabVizSD = function (){
    if($('#TabVizD').val() == 0){
        $('#vizinhancadireta').css('display', 'block');
        $('#TabVizD').val('1');
        $('#TabVizD').html('Esconder Tabela');
    }else{
        $('#vizinhancadireta').css('display', 'none');
        $('#TabVizD').val('0');
        $('#TabVizD').html('Mostrar Tabela');
    }
}

/*------------------------------------------------------------------------*/
/*   BOTÃO DE SHOW/HIDE DOS VIZINHOS INVERSOS DOS GRAFOS ORIENTADOS       */
/*------------------------------------------------------------------------*/


window.TabVizSI = function (){
    if($('#TabVizI').val() == 0){
        $('#vizinhancainversa').css('display', 'block');
        $('#TabVizI').val('1');
        $('#TabVizI').html('Esconder Tabela');
    }else{
        $('#vizinhancainversa').css('display', 'none');
        $('#TabVizI').val('0');
        $('#TabVizI').html('Mostrar Tabela');
    }
}

/*------------------------------------------------------------------------*/
/*   BOTÃO DE SHOW/HIDE MATRIZ DE ADJACÊNCIA      PARA GRAFOS SIMPLES     */
/*------------------------------------------------------------------------*/


window.TabMASH = function (){
    if($('#TabMA').val() == 0){
        $('#MatrizAdjacenciaSimples').css('display', 'block');
        $('#TabMA').val('1');
        $('#TabMA').html('Esconder Tabela');
    }else{
        $('#MatrizAdjacenciaSimples').css('display', 'none');
        $('#TabMA').val('0');
        $('#TabMA').html('Mostrar Tabela');
    }
}

/*------------------------------------------------------------------------*/
/*   BOTÃO DE SHOW/HIDE MATRIZ DE ADJACÊNCIA      PARA GRAFOS ORIENTADOS  */
/*------------------------------------------------------------------------*/


window.TabMAO = function (){
    if($('#TabMA').val() == 0){
        $('#MatrizAdjacenciaOrientado').css('display', 'block');
        $('#TabMA').val('1');
        $('#TabMA').html('Esconder Tabela');
    }else{
        $('#MatrizAdjacenciaOrientado').css('display', 'none');
        $('#TabMA').val('0');
        $('#TabMA').html('Mostrar Tabela');
    }
}

/*------------------------------------------------------------------------*/
/*   BOTÃO DE SHOW/HIDE MATRIZ DE INCIDÊNCIA      PARA GRAFOS SIMPLES     */
/*------------------------------------------------------------------------*/


window.TabMISH = function (){
    if($('#TabMI').val() == 0){
        $('#MatrizIncidenciaSimples').css('display', 'block');
        $('#TabMI').val('1');
        $('#TabMI').html('Esconder Tabela');
    }else{
        $('#MatrizIncidenciaSimples').css('display', 'none');
        $('#TabMI').val('0');
        $('#TabMI').html('Mostrar Tabela');
    }
}

/*------------------------------------------------------------------------*/
/*   BOTÃO DE SHOW/HIDE MATRIZ DE INCIDÊNCIA      PARA GRAFOS ORIENTADOS     */
/*------------------------------------------------------------------------*/


window.TabMIO = function (){
    if($('#TabMI').val() == 0){
        $('#MatrizIncidenciaOrientado').css('display', 'block');
        $('#TabMI').val('1');
        $('#TabMI').html('Esconder Tabela');
    }else{
        $('#MatrizIncidenciaOrientado').css('display', 'none');
        $('#TabMI').val('0');
        $('#TabMI').html('Mostrar Tabela');
    }
}

/*------------------------------------------------------------------------*/
/*   NUMERO DE WIENER                                                     */
/*------------------------------------------------------------------------*/
window.Wiener = function(){
    
}

/*GRAFO SUBJACENTE*/
window.grafoSubjacente = function  (){
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
window.subIndVertice = function (){
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

window.subIndAresta = function (){
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

window.RemoveItem = function (item){
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

window.RetornaListaNodesPasseio = function (escolha){
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

window.DerivarPasseio = function (){
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

window.getRandomColor = function () {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

window.max = function (vector){
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

window.howMany2 = function (vector){
    var number = 0;
    for(let i =0; i<vector.length; i++){
        if(vector[i] == 2){
            number ++;
        }
    }
    return number;
}

window.colorePasseio = function (list_nodes, p_network, p_data){
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

window.DerivaDistancia = function (node_inicial, node_final){
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
            for(let k in adjacentes){
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
            for(let k in adjacentes){
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
            for(let k in adjacentes){
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
            for(let k in adjacentes){
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

window.GeraDerivaDistancia = function (inicial, final){
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
    for(let k in newnodes._data){
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
                for(let k in newedges._data){
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
                for(let k in newedges._data){
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
            for(let k in newedges._data){
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
            for(let k in newedges._data){
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
                for(let k in newedges._data){
                    if(newedges._data[k].from == valor.target.node1 && newedges._data[k].to == valor.target.node2 || 
                        newedges._data[k].to == valor.target.node1 && newedges._data[k].from == valor.target.node2){
                            newedges.update([{id: newedges._data[k].id, color: {color: 'black'}}]);
                    }
                }
            }else{
                for(let k in newedges._data){
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

window.NormalizaDesenho = function (newnodes, newedges){
    for( let k in newnodes._data){
        if(newnodes._data[k].color != 'blue'){
            newnodes.update([{id: newnodes._data[k].id, color: '#458B74'}]);
        }
    }
    for(let k in newedges._data){
        newedges.update([{id: newedges._data[k].id, color: {color: '#458B74'}}]);
    }
}

window.NormalizaCompleto = function (newnodes, newedges){
    for( let k in newnodes._data){
        newnodes.update([{id: newnodes._data[k].id, color: '#458B74'}]);
    }
    for(let k in newedges._data){
        newedges.update([{id: newedges._data[k].id, color: {color: '#458B74'}}]);
    }
}

window.limpaTudo = function (){
    $('#fila').html('');
    var lista_pais = '';
    var lista_distancia = '';
    for(let k in nodes._data){
        lista_pais += '<li class="list-inline-item" id="pai'+nodes._data[k].id+'">'+nodes._data[k].label+' | Ind</li>';
        lista_distancia += '<li class="list-inline-item" id="dists'+nodes._data[k].id+'">'+nodes._data[k].label+' | Inf</li>';
    }
    $('#pai').html(lista_pais);
    $('#dists').html(lista_distancia);
}

window.PlayAnimation = function (sentinel){
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

window.GetVerticesAdjacentes = function (vertice){
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

window.NormalizeAlgorithm = function (){
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

