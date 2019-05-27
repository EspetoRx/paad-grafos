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
    {id: 1, label: ''},
    {id: 2, label: ''},
    {id: 3, label: ''},
    {id: 4, label: ''},
    {id: 5, label: ''}
]);

// create an array with edges
var edges = new vis.DataSet([
    {from: 1, to: 3, id: 1},
    {from: 1, to: 2, id: 2},
    {from: 2, to: 4, id: 3},
    {from: 2, to: 5, id: 4}
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
                        data.id = edgeid++;
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
                callback(data);
                network.addEdgeMode();
            }
            // after each adding you will be back to addEdge mode
            
        },
        addNode: function (data, callback){
            data.label = '';
            data.id = id++;
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
    },
};

// initialize your network!
var network = new vis.Network(container, data, options);

/*CONTEXTO DO GRAFO*/
function enableGraphContext(){
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

function disableGraphContext(){
    normalizeGraph();
    $('#context').html("");
    $('#graphMenu').attr('onClick', 'enableGraphContext()');
    $('#footer').html("<span>Copyright &copy; Lucas Carvalho 2019</span>");
    GraphContext = false;
}

function normalizeGraph(){
    network.disableEditMode();
    EditarVertice = false;
    EditarAresta = false;
}

function setGraphStatus(){
    $('#footer').html("<spam>Use <i class=\"fas fa-circle\"></i> para os vértices e <i class=\"fas fa-code-branch\"></i> para as arestas.</spam>");
    $('#mynetwork').css('height', '76vh');
}

/*NODE MAKING*/
function enableCreateNode(){
    normalizeGraph();

    $('#footer').html("<span>Clique ou toque no canvas para criar um Vértice. "+
        "<button class=\"btn btn-danger btn-sm\" type=\"button\" onClick=\"disableCreateNode()\">"+
            "<i class=\"fas fa-times\"></i>"+
        "</button></span>");
    $('#mynetwork').css('height', '74vh');

    network.addNodeMode();
}

function disableCreateNode(){
    normalizeGraph();
    setGraphStatus();
}

/*REMOVE NODES*/
function removeNode(){
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

function cancelRemove(){
    normalizeGraph();
    setGraphStatus();
}

function removeN(){
    network.deleteSelected();
}

/*NODE EDITING*/
function editNode(){
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

function cancelEdit(){
    normalizeGraph();
    setGraphStatus();
}

function showEditModal(){

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

function editNodeLabel(id){

    nodes.update([{id: id, label:$('#labelNode').val()}]);
    $('#editNodeModal').modal('hide');
}


/*ARESTAS*/
function adicionarAresta(){
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

function cancelaAdicionarAresta(){
    normalizeGraph();
    setGraphStatus();
}

function removeEdge(){
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

function removeAresta(){
    network.deleteSelected();
}

function cancelRemoveAresta(){
    normalizeGraph();
    setGraphStatus();
}

function editAresta(){
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

function showEditArestaModal(){

    $('#editArestaModal').on('shown.bs.modal', function(){
        var selecionados = network.getSelectedEdges();
        if(selecionados.length == 0){
            $('#editEdgeBody').html('<p>Você não selecionou nenhuma aresta.</p>');
            $('#editEdgeFooter').html('<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Fechar</button>');
        }else{
            var label = data.edges._data[selecionados[0]].label;
            if(label == '' || label === undefined || label == ' '){
                $('#editEdgeBody').html('<label>Label (Peso da aresta):</label><input type=\"number\" class=\"form-control\" id=\"labelEdge\" placeholder=\"Não definido\"/><br><button type=\"button\" class=\"btn btn-primary\" onClick=\"InverterAresta(\'' + selecionados[0] + '\')\">Inverter ordem de conexão</button>');
                $('#editEdgeFooter').html('<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Fechar</button><button type=\"button\" class=\"btn btn-primary\" onClick=\"editEdgeLabel(\''+ selecionados[0] +'\')\">Salvar</button>');
            }else{
                $('#editEdgeBody').html('<label>Label (Peso da aresta):</label><input type=\"number\" class=\"form-control\" id=\"labelEdge\" placeholder=\"'+label+'\"/><br><button type=\"button\" class=\"btn btn-primary\" onClick=\"InverterAresta()\">Inverter ordem de conexão</button>');
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

function editEdgeLabel(id){

    edges.update([{id: id, label:$('#labelEdge').val()}]);
    $('#editArestaModal').modal('hide');
    ponderado = true;

}

function InverterAresta(id){
    var aux;
    aux = edges._data[id].from;
    edges.update([{id:id, from: edges._data[id].to, to: aux}]);
    $('#editArestaModal').modal('hide');
}

function cancelEditAresta(){
    normalizeGraph();
    setGraphStatus();
}


/*CONFIGURAÇÕES DO GRAFO*/


/*ORDENADO*/
function HabilitarOrdenado(){
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
function DesabilitarOrdenado(){
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
function HabilitarPonderado(){
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
function DesabilitarPonderado(){
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

function exportNetwork() {

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

function abrirModalImportacao(){
    $('#filegrafo').val('');
    $('#ModalImportacao').modal('show');
}

function abreNovoGrafo(newdata, newoptions, newordenado, newponderado){
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
function ShowLimparGrafo(){
    $('#ModalLimpeza').modal('show');
}

function Limpar(){
    nodes = new vis.DataSet([]);
    edges = new vis.DataSet([]);
    network.setData({nodes, edges});
    id = 1;
    edgeid = 1;
    $('#ModalLimpeza').modal('hide');
}

/*PROPRIEDADES DO GRAFO*/

function habilitarPropriedades(){
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
        "<p><button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Se simples: Não possui laços nem arestas múltiplas;\nSe multígrafo: não possui laços mas possui arestas múltiplas;\nSe pseudografo: possui laço e pode possuir arestas múltiplas.\">(?)</button> <b>Tipo do grafo:</b> "+tipo+"<br>"+
        "<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Quantidade de vértices.\">(?)</button> <b>Número de vértices (Ordem - |V|):</b> "+nodes.length+"<br>"+
        "<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Quantidade de arestas.\">(?)</button> <b>Número de arestas (Tamanho - |A|):</b> "+edges.length+"</br>"+
        "<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Quantas arestas ou arcos existem entre cada par ordenado de vértices.\">(?)</button> <b>Multiplicidade de arestas:</b> <br>"+multiplicidadeGeral()+
        "</div>"+
        "<div class='col-md-6' id='propriedades2'>"+
        "</div>"+
        "<div class='col-md-6' id='propriedades3'>"+
        "</div>"
        +"</div>");
    $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra se o grafo é orientado (direcionado) ou não.\">(?)</button> <b>Orientação:</b> ");
    if(ordenado){
        if(tipo == "Simples"){
            $('#propriedades2').append("Dígrafo simples<br>");
        }else{
            $('#propriedades2').append("Multigrafo direcionado<br>");
        }

    }else{
        $('#propriedades2').append("Não direcionado<br>");
    }
    if(ponderado){
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra se um grafo é ponderado ou não.\">(?)</button> <b>Ponderação:</b> Ponderado<br>");
    }else{
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra se um grafo é ponderado ou não.\">(?)</button> <b>Ponderação:</b> Não ponderado<br>");
    }
    if ((tipo == "Simples" || tipo == "Pseudografo") && !ordenado){
        var grado = grausSimples();
        $('#propriedades3').append("<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra quais vértices são vizinhos de quais vértices.\">(?)</button> <b>Vizinhança <i>&tau;</i>(<i>v</i>): </b><br/>");
        $('#propriedades3').append("<div id='vizinhancasimples'></div>");
        $('#vizinhancasimples').append(vizinhacaSimples());
        $('#vizinhancasimples').addClass('table-responsive');
        $('#propriedades3').append("<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra quantas conexões incidem em cada vértice.\">(?)</button> <b>Graus dos vértices:</b><br/>");
        $('#propriedades3').append("<div id='grausSimples'></div>");
        $('#grausSimples').append(grado[0]);
        $('#grausSimples').addClass("table-responsive");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Maior quantidade de arestas que incidem em um vértice.\">(?)</button> <b>Maior Grau: </b>"+grado[1]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Menor quantidade de arestas que incidem em um vértice.\">(?)</button> <b>Menor Grau: </b>"+grado[2]+"<br/>");
    }
    if ((tipo=="Simples" || tipo == "Multigrafo" || tipo == "Pseudografo") && ordenado){
        var grado = grausOrientados();
        $('#propriedades3').append("<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra quantos arcos incidem diretamente em cada vértice.\">(?)</button> <b>Vizinhança Direta <i>&tau;</i><SUP>+</SUP>(<i>v</i>):</b><br/>");
        $('#propriedades3').append("<div id='vizinhancadireta'></div>");
        $('#vizinhancadireta').append(vizinhacaDireta());
        $('#vizinhancadireta').addClass('table-responsive');
        $('#propriedades3').append("<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra quantos arcos saem de cada vértice.\">(?)</button> <b>Vizinhança Inversa <i>&tau;</i><SUP>-</SUP>(<i>v</i>):</b><br/>");
        $('#propriedades3').append("<div id='vizinhancainversa'></div>");
        $('#vizinhancainversa').append(vizinhacaInversa());
        $('#vizinhancainversa').addClass("table-responsive");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Maior quantidade de arcos que chegam a um vértice.\">(?)</button> <b>Maior Grau de Entrada: </b>"+grado[1]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Menor quantidade de arcos que chegam a um vértice.\">(?)</button> <b>Menor Grau de Entrada: </b>"+grado[2]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Maior quantidade de arcos que saem de um vértice.\">(?)</button> <b>Maior Grau de Saída: </b>"+grado[3]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Menor quantidade de arcos que saem de um vértice.\">(?)</button> <b>Menor Grau de Saída: </b>"+grado[4]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra a quantidade de arcos incidentes em cada vértice.\">(?)</button> <b>Graus dos vértices:</b><br/>");
        $('#propriedades2').append("<div id='grausOrientados'></div>");
        $('#grausOrientados').append(grado[0]);
    }
    
    $('#minigrafo').html(GrafoCompleto);
    $('#mynetwork').removeClass('mynetwork');
    $('#mynetwork').addClass('propriedades');
    $('#mynetwork').removeAttr('style');
    if($('#collapseTwo').hasClass('show')){
        $('#collapseTwo').removeClass('show');
    }
}

function desabilitarPropriedades(){
    Propriedades = false;
    $('#conteudo').removeClass('mynetwork2');
    $('#conteudo').addClass('mynetwork');
    $('#conteudo').html(GrafoCompleto);
    $('#mynetwork').removeClass('propriedades');
    $('#mynetwork').addClass('mynetwork');
}

/*TIPO DO GRAFO*/

function tipoDoGrafo(){
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

function multiplicidade(id1, id2){
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

function multiplicidadeOr(id1, id2){
    var mul = 0;
    for(var k in edges._data){
        if(edges._data[k].from == id1 && edges._data[k].to == id2){
            mul++;
        }
    }
    return mul;
}

function multStartNOrientado() {
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

function multStartOrientado() {
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

function multiplicidadeGeral() {
    if(ordenado){
        return multStartOrientado();
    }else{
        return multStartNOrientado();
    }
}

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


/*VIZINHANÇA DIRETA E INVERSA PARA GRAFOS SIMPLES E MULTIGRAFOS*/
function vizinhacaSimples(){
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
        string += "<td>"+k+"</td>"
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
            string += vectorVizinhos[k][m]+",";
        }
        string = string.substring(0,(string.length - 1));
        string += "</td>";
    }
    string += "</tr>"
    string += "</tbody>";
    string += "</table>";
    return string;
};

function vizinhacaDireta(){
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
        string += "<td>"+k+"</td>"
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
            string += vectorVizinhos[k][m]+',';
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

function vizinhacaInversa(){
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
        string += "<td>"+k+"</td>"
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
            string += vectorVizinhos[k][m]+",";
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
function grausSimples(){
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
    console.log(maiorgrau, menorgrau);
    for(var k in graus){
        string += "<td>"+k+"</td>"
        if(graus[k] >= maiorgrau){
            maiorgrau = graus[k];
        }
        if(graus[k] <= menorgrau){
            menorgrau = graus[k];
        }
    }
    console.log(maiorgrau, menorgrau);
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

function grausOrientados(){
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
    console.log(graus);
    var string = '';
    string += "<table class='table'>";
    string += "<thead class='text-center'>";
    string += "<tr>";
    string += "<td>Vértice</td>";
    var maiorgrauentrada = graus[1][0], menorgrauentrada = graus[1][0], maiorgrausaida = graus[1][1], menorgrausaida = graus[1][1];
    for(var k in graus){
        string += "<td>"+k+"</td>"
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
