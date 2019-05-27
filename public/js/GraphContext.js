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