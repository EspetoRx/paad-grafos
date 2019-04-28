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
    }
};

// initialize your network!
var network = new vis.Network(container, data, options);

/*CONTEXTO DO GRAFO*/
function enableGraphContext(){
    if(Propriedades){
        desabilitarPropriedades();
    }
    $('#context').html("<div class=\"dropdown\">" + 
                    "<button class=\"btn btn-primary btn-sm dropdown-toggle\" type=\"button\" id=\"dropdownMenuButtonVertice\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">"+
                        "<i class=\"fas fa-circle\"></i>"+
                    "</button>"+
                    "<div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"dropdownMenuButtonVertice\">"+
                        "<button class=\"dropdown-item\" onClick=\"enableCreateNode()\"><i class=\"fas fa-circle\"></i> <i class=\"far fa-plus-square\"></i> Adicionar</button>"+
                        "<button class=\"dropdown-item\" onClick=\"removeNode()\"><i class=\"fas fa-circle\"></i> <i class=\"far fa-minus-square\"></i> Remover</button>"+
                        "<button class=\"dropdown-item\" onClick=\"editNode()\"><i class=\"fas fa-circle\"></i> <i class=\"fas fa-edit\"></i> Editar</button>"+
                    "</div>"+
                "</div>&nbsp;"+
                "<div class=\"dropdown\">"+
                    "<button class=\"btn btn-primary btn-sm dropdown-toggle\" type=\"button\" id=\"dropdownMenuButtonAresta\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">"+
                        "<i class=\"fas fa-code-branch\"></i>"+
                    "</button>"+
                    "<div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"dropdownMenuButtonAresta\">"+
                        "<button class=\"dropdown-item\" onClick=\"adicionarAresta()\"><i class=\"fas fa-code-branch\"></i> <i class=\"far fa-plus-square\"></i> Adicionar</button>"+
                        "<button class=\"dropdown-item\" onClick=\"removeEdge()\"><i class=\"fas fa-code-branch\"></i> <i class=\"far fa-minus-square\"></i> Remover</button>"+
                        "<button class=\"dropdown-item\" onClick=\"editAresta()\"><i class=\"fas fa-code-branch\"></i> <i class=\"fas fa-edit\"></i> Editar</button>"+
                    "</div>"+
                "</div>&nbsp;"+
                "<div class=\"dropdown\">"+
                    "<button class=\"btn btn-primary btn-sm dropdown-toggle\" type=\"button\" id=\"dropdownMenuButtonAresta\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">"+
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
        $('#check_ordenado').attr('checked', 'checked');
    }
    if(ponderado){
        $('#check_ponderado').attr('checked', 'checked');
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
        "<button class=\"btn btn-primary btn-sm\" type=\"button\" onClick=\"removeN()\">"+
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
        "<button class=\"btn btn-primary btn-sm\" type=\"button\" onClick=\"removeAresta()\">"+
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
                $('#editEdgeBody').html('<label>Label (Peso da aresta):</label><input type=\"number\" class=\"form-control\" id=\"labelEdge\" placeholder=\"Não definido\"/>');
                $('#editEdgeFooter').html('<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Fechar</button><button type=\"button\" class=\"btn btn-primary\" onClick=\"editEdgeLabel(\''+ selecionados[0] +'\')\">Salvar</button>');
            }else{
                $('#editEdgeBody').html('<label>Label (Peso da aresta):</label><input type=\"number\" class=\"form-control\" id=\"labelEdge\" placeholder=\"'+label+'\"/>');
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
    $('#ordenacao').html("<input type=\"checkbox\" checked=\"checked\" id=\"check_ordenado\"> <i class=\"fas fa-slash\"></i> Não ordenado");
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
    $('#ordenacao').html("<input type=\"checkbox\" id=\"check_ordenado\"> <i class=\"fas fa-arrow-up\"></i> Ordenado");
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

    var r = confirm("Tem certeza que quer excluir os pesos de todos os vértices?");
    if (r === true) {
        for(var aresta in data.edges._data){
            edges.update([{id: data.edges._data[aresta].id, label: " "}]);
            data.edges._data[aresta].label = " ";
        }
        $('#ponderacao').html("<input type=\"checkbox\" id=\"check_ordenado\"> <i class=\"fas fa-sort-numeric-up\"></i> Ponderado");
        $("#ponderacao").attr("onclick","HabilitarPonderado()");
        ponderado = false;
    }
    
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
    console.log(exportValue);
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
        "<p><b>Tipo do grafo:</b> "+tipo+"<br>"+
        "<b>Número de vértices (Ordem - |V|):</b> "+nodes.length+"<br>"+
        "<b>Número de arestas (Tamanho - |A|):</b> "+edges.length+"</br>"+
        "<b>Multiplicidade de arestas:</b> <br>"+multiplicidadeGeral()+
        "</div>"+
        "<div class='col-md-12' id='propriedades2'>"+
        "</div>"
        +"</div>");
    $('#propriedades2').append("<b>Orientação:</b> ");
    if(ordenado){
        if(tipo == "Simples"){
            $('#propriedades2').append("Dígrafo simples<br>");
        }else{
            $('#propriedades2').append("Multigrafo orientado<br>");
        }

    }else{
        $('#propriedades2').append("Não orientado<br>");
    }
    if(ponderado){
        $('#propriedades2').append("<b>Ponderação:</b> Ponderado<br>");
    }else{
        $('#propriedades2').append("<b>Ponderação:</b> Não ponderado<br>");
    }
    $('#minigrafo').html(GrafoCompleto);
    $('#mynetwork').removeClass('mynetwork');
    $('#mynetwork').addClass('propriedades');
    $('#mynetwork').removeAttr('style');
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

    if(laco){
        return "Pseudografo";
    }else if(idaevolta){
        return "Multigrafo";
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
    for(var k in multi){
        string += "<td>";
        string += "{"+nodes._data[multi[k][0]].label+","+nodes._data[multi[k][1]].label+"}";
        string += "</td>";
    }
    string += "</tr></thead>";
    string += "<tr>";
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
    for(var k in multi){
        string += "<td>";
        string += "{"+nodes._data[multi[k][0]].label+","+nodes._data[multi[k][1]].label+"}";
        string += "</td>";
    }
    string += "</tr></thead>";
    string += "<tr>";
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
    console.log(newedges);
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
    console.log(newedges);
    for(var k in nodes._data){
        newnodes.add(nodes._data[k]);
    }
    console.log(newedges);
    var newcontainer = document.getElementById('networkGrafoSubjacente');
    var newdata = {
        nodes: newnodes,
        edges: newedges
    };
    var width = $('#networkGrafoSubjacente').width();
    var height = $('#networkGrafoSubjacente').height();
    var newoptions = {};
    var newnetwork = new vis.Network(newcontainer, newdata, newoptions);
    
}

$(document).on('shown.bs.modal','#GrafoSubjacenteModal', function () {
  grafoSubjacente();
  $('#collapseTwo').removeClass('show');
})