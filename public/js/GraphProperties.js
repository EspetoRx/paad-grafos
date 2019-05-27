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
        "<p><button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Se simples: Não possui laços nem arestas múltiplas;\nSe multígrafo: não possui laços mas possui arestas múltiplas;\nSe pseudografo: possui laço e pode possuir arestas múltiplas.\">(?)</button> <b>Tipo do grafo:</b> "+tipo+"<br>"+
        "<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Quantidade de vértices.\">(?)</button> <b>Número de vértices (Ordem - |V|):</b> "+nodes.length+"<br>"+
        "<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Quantidade de arestas.\">(?)</button> <b>Número de arestas (Tamanho - |A|):</b> "+edges.length+"</br>"+
        "<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Quantas arestas ou arcos existem entre cada par ordenado de vértices.\">(?)</button> <b>Multiplicidade de arestas:</b> <br>"+multiplicidadeGeral()+
        "</div>"+
        "<div class='col-md-6' id='propriedades2'>"+
        "</div>"+
        "<div class='col-md-6' id='propriedades3'>"+
        "</div>"
        +"</div>");
    $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra se o grafo é orientado (direcionado) ou não.\">(?)</button> <b>Orientação:</b> ");
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
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra se um grafo é ponderado ou não.\">(?)</button> <b>Ponderação:</b> Ponderado<br>");
    }else{
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra se um grafo é ponderado ou não.\">(?)</button> <b>Ponderação:</b> Não ponderado<br>");
    }
    if ((tipo == "Simples" || tipo == "Pseudografo") && !ordenado){
        var grado = grausSimples();
        $('#propriedades3').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra quais vértices são vizinhos de quais vértices.\">(?)</button> <b>Vizinhança <i>&tau;</i>(<i>v</i>): </b><br/>");
        $('#propriedades3').append("<div id='vizinhancasimples'></div>");
        $('#vizinhancasimples').append(vizinhacaSimples());
        $('#vizinhancasimples').addClass('table-responsive');
        $('#propriedades3').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra quantas conexões incidem em cada vértice.\">(?)</button> <b>Graus dos vértices:</b><br/>");
        $('#propriedades3').append("<div id='grausSimples'></div>");
        $('#grausSimples').append(grado[0]);
        $('#grausSimples').addClass("table-responsive");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Maior quantidade de arestas que incidem em um vértice.\">(?)</button> <b>Maior Grau: </b>"+grado[1]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Menor quantidade de arestas que incidem em um vértice.\">(?)</button> <b>Menor Grau: </b>"+grado[2]+"<br/>");
    }
    if ((tipo=="Simples" || tipo == "Multigrafo" || tipo == "Pseudografo") && ordenado){
        var grado = grausOrientados();
        $('#propriedades3').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra quantos arcos incidem diretamente em cada vértice.\">(?)</button> <b>Vizinhança Direta <i>&tau;</i><SUP>+</SUP>(<i>v</i>):</b><br/>");
        $('#propriedades3').append("<div id='vizinhancadireta'></div>");
        $('#vizinhancadireta').append(vizinhacaDireta());
        $('#vizinhancadireta').addClass('table-responsive');
        $('#propriedades3').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra quantos arcos saem de cada vértice.\">(?)</button> <b>Vizinhança Inversa <i>&tau;</i><SUP>-</SUP>(<i>v</i>):</b><br/>");
        $('#propriedades3').append("<div id='vizinhancainversa'></div>");
        $('#vizinhancainversa').append(vizinhacaInversa());
        $('#vizinhancainversa').addClass("table-responsive");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Maior quantidade de arcos que chegam a um vértice.\">(?)</button> <b>Maior Grau de Entrada: </b>"+grado[1]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Menor quantidade de arcos que chegam a um vértice.\">(?)</button> <b>Menor Grau de Entrada: </b>"+grado[2]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Maior quantidade de arcos que saem de um vértice.\">(?)</button> <b>Maior Grau de Saída: </b>"+grado[3]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Menor quantidade de arcos que saem de um vértice.\">(?)</button> <b>Menor Grau de Saída: </b>"+grado[4]+"<br/>");
        $('#propriedades2').append("<button class=\"btn btn-secondary btn-sm padding-0 show-tt\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"Mostra a quantidade de arcos incidentes em cada vértice.\">(?)</button> <b>Graus dos vértices:</b><br/>");
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

    
    $(".show-tt").on('click', function(){
        $(this).tooltip("show");
    });
    $(".show-tt").on('mouseout', function(){
        $(this).tooltip("hide");
    });
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
    for(var k in graus){
        string += "<td>"+k+"</td>"
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