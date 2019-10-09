<!doctype html>
<html lang="pt_BR">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta content="paad grafos graphs grafo graph teory apoio docencia" name="keywords">
    <meta content="Projeto de Aplicação de Apoio à Docência - Teoria de grafos" name="description">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="{{asset("css/app.css")}}">
    <link rel="manifest" href="{{asset('manifest.json')}}">
    <!-- FAVICON -->
    <link rel="shortcut icon" href="{{asset("images/paad_logo.png")}}" type="image/x-icon"/>
    <meta name="theme-color" content="white">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="PAAD Grafos">

    <meta name="apple-mobile-web-app-status-bar-style" content="white">

    <link rel="apple-touch-icon" sizes="152x152" href="{{asset('images/icons/152.png')}}" type="image/png">
    <link rel="apple-touch-icon" sizes="167x167" href="{{asset('images/icons/167.png')}}" type="image/png">
    <link rel="apple-touch-icon" sizes="180x180" href="{{asset('images/icons/180.png')}}" type="image/png">
    
    <meta name="msapplication-TileImage" content="{{asset('images/icons/144.png')}}">
    <meta name="msapplication-TileColor" content="white">

    @csrf

    <title>PAAD - Grafos</title>
  </head>
  <body>
    <!-- início do preloader -->
    <div id="preloader">
            
        <div class="inner">
            <!-- HTML DA ANIMAÇÃO MUITO LOUCA DO SEU PRELOADER! -->  
            <div class="text-center">
                <img src="{{asset('images/paad_logo.png')}}" class="logo_img">
                <p>Carregando</p>
            </div>
            <br>
            <div class="text-center">
                <div class="spinner-border text-dark" role="status">
                </div>
                <div class="spinner-border text-warning" role="status">
                </div>
                <div class="spinner-border text-danger" role="status">
                </div>
            </div>
            <div class="text-center">
                <div class="spinner-border text-secondary" role="status">
                </div>
                <div class="spinner-border text-success" role="status">
                </div>
            </div>
        </div>
    </div>
    <!-- fim do preloader --> 
    <!-- Page Wrapper -->
    <div id="wrapper">

        <!-- Sidebar -->
        <ul class="navbar-nav sidebar sidebar-tog accordion" id="accordionSidebar">

        <!-- Sidebar - Brand -->
        <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/">
            <div class="sidebar-brand-icon">
                <img src="{{asset('images/paad_logo.png')}}" class="logo_img" alt="Logo">
            </div>
            <div class="sidebar-brand-text">PAAD Grafos</div>
        </a>

        {{-- <!- Divider ->
        <hr class="sidebar-divider my-0">

        <!- Nav Item - Dashboard ->
        <li class="nav-item active">
            <a class="nav-link" href="index.html">
            <i class="fas fa-home"></i>
            <span>Início</span></a>
        </li>

        <!- Divider ->
        <hr class="sidebar-divider"> --}}

        <!-- Heading -->
        <hr class="sidebar-divider">
        <div class="sidebar-heading">
            Grafo
        </div>

        <!-- Nav Item - Pages Collapse Menu -->
        <li class="nav-item">
            <a class="nav-link" onClick="enableGraphContext()" id="graphMenu">
            <i class="far fa-circle"></i>
            <span>Grafo</span>
            </a>
            <a class="nav-link" onClick="habilitarPropriedades();" id="proprerties">
            <i class="fas fa-ellipsis-v"></i>
            <span>Propriedades</span>
            </a>
            <a class="nav-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
            <i class="fab fa-creative-commons-nd"></i>
            <span>Derivações</span>
            </a>
            <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                <div class="bg-white py-2 collapse-inner rounded">
                    <a class="collapse-item" data-toggle="modal" data-target="#GrafoSubjacenteModal">Grafo subjacente</a>
                    <a class="collapse-item" data-toggle="modal" data-target="#SubgrafoEspalhamento">Subgrafo / Subdígrafo <br> de espalhamento</a>
                    <a class="collapse-item" data-toggle="modal" data-target="#SubgrafoInducaoVertice">Subgrafo por indução<br> de vértice</a>
                    <a class="collapse-item" data-toggle="modal" data-target="#SubgrafoInducaoAresta">Subgrafo por indução<br> de aresta</a>
                    <a class="collapse-item" data-toggle="modal" data-target="#DerivacaoDePasseio">Derivar Passeio</a>
                    <a class="collapse-item" data-toggle="modal" data-target="#DerivarDistancias">Derivar Distância</a>
                </div>
            </div>
            <a class="nav-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="true" aria-controls="collapseTwo">
            <i class="fas fa-cookie-bite"></i>
            <span>Grafos notáveis</span>
            </a>
            <div id="collapseThree" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                <div class="bg-white py-2 collapse-inner rounded">
                    <button class="btn collapse-item" onClick="konigsberg(); $('#collapseThree').removeClass('show');">Grafo de Königsberg</button>
                    <button class=" btn collapse-item" onClick="heawood(); $('#collapseThree').removeClass('show');">Grafo de Heawood</button>
                </div>
            </div>
            {{-- <a class="nav-link" style="color: white">
            <i class="fas fa-home"></i>
            <span>Instalar</span>
            </a> --}}
        </li>

        <!-- Divider -->
        <hr class="sidebar-divider d-none d-md-block">

        <!-- Sidebar Toggler (Sidebar) -->
        <div class="text-center d-none d-md-inline">
            <button class="rounded-circle border-0" id="sidebarToggle"></button>
        </div>

        </ul>
        <!-- End of Sidebar -->

        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">

        <!-- Main Content -->
        <div id="content">

            <!-- Topbar -->
            <nav class="navbar navbar-expand navbar-light bg-white topbar static-top shadow">

            <!-- Sidebar Toggle (Topbar) -->
            <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                <i class="fa fa-bars" style="color: #458B74;"></i>
            </button>

            <!-- Topbar Navbar -->
            <ul class="navbar-nav ml-auto" id="context">
                
            </ul>

            </nav>
            <!-- End of Topbar -->

            <!-- Begin Page Content -->
            <div class="container-fluid mynetwork" id="conteudo">
                <div class="mynetwork" id="mynetwork">

                </div>
            </div>
            <!-- /.container-fluid -->

        </div>
        <!-- End of Main Content -->

        <!-- Footer -->
        <footer class="sticky-footer bg-white">
            <div class="container my-auto">
            <div class="copyright text-center my-auto" id="footer">
                <span>Copyright &copy; Lucas Carvalho 2019</span>
            </div>
            <div id="contents" style="display: none;">
            </div>
            </div>
        </footer>
        <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->

    </div>


    <div class="modal fade" id="confirm" tabindex="-1" role="dialog" aria-labelledby="confirm-label" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title" id="confirm-label"></h4>
              </div>
              <div class="modal-body">
                <p class="message"></p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger dismiss" data-dismiss="modal"></button>
                <button type="button" class="btn btn-success confirm" data-dismiss="modal"></button>
              </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="editNodeModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Vértice</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="editNodeBody">
                </div>
                <div class="modal-footer" id="editNodeFooter">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-success">Salvar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="editArestaModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Aresta</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="editEdgeBody">
                </div>
                <div class="modal-footer" id="editEdgeFooter">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-success">Salvar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="ModalImportacao" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Abrir grafo </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form method="post" id="abraArquivo" enctype="multipart/form-data">
                        @csrf
                        <label for="filegrafo" class="btn btn-success">Abrir grafo JSON</label>
                        <input type="file" id="filegrafo" name="filegrafo" accept=".json" style="display: none">    
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="ModalLimpeza" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Tem certeza que deseja limpar o grafo?</h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                    <button type="button" class="btn btn-danger" onclick="Limpar()">Limpar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="GrafoSubjacenteModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Grafo Subjacente</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="networkGrafoSubjacente" class="networkGS">
                        
                    </div>
                    <p class="text-justify">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Se retirarmos os laços e todas as múltiplas arestas entre cada par de vértices, mantendo apenas uma, trasformaresmos um pseudografo ou multigrafo (aplica-se a dígrafos) em um grafo simples.
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="SubgrafoEspalhamento" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Subgrafo / Subdígrafo de espalhamento</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="text-center">
                        Também chamados de <strong>Subgrafo Gerador</strong> ou <strong>Fator do Dígrafo</strong>
                    </p>
                    <div id="networkSubgrafoEspalhamento" class="networkGS">
                        
                    </div>
                    <p class="text-justify">
                        &emsp;Se G<SUB>1</SUB> é subgrafo de G<SUB>2</SUB>, então G<SUB>2</SUB> é supergrafo de G<SUB>1</SUB>. Quando G<SUB>1</SUB> &ne; G<SUB>2</SUB>, então G<SUB>1</SUB> é um subgrafo próprio de G<SUB>2</SUB> . <br>&emsp;Quando V(G<SUB>1</SUB>) = V(G<SUB>2</SUB>), então G<SUB>1</SUB> é <strong>chamado subgrafo gerador ou subgrafo de espalhamento</strong> de G<SUB>2</SUB>. Para um dı́grafo D<SUB>1</SUB>, um subdı́grafo D<SUB>2</SUB> que contém um conjunto de vértices igual ao conjunto de vértices do dı́grafo original é chamado de <strong>subdı́grafo de espalhamento ou fator do dı́grafo</strong>.<br>&emsp;Estre grafo em exibição foi derivado com base no Grafo Subjacente dada 50% de chance de remoção de uma aresta pertencente ao conjunto A(G<SUB>S</SUB>).
                    </p>
                    <p class="text-center">
                        <button class="btn btn-success btn-sm" id="NovoGrafoEspalhamento">Gerar novo subgrafo de espalhamento</button>
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="SubgrafoInducaoVertice" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Subgrafo por indução de vértices</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="text-center" id="textindver">
                        Escolha os vértices para ficar
                    </p>
                    <div class="row" id="verticesAInduzir">
                        
                    </div>
                    <p class="text-center" id="btnindver">
                        <button class="btn btn-success btn-sm" id="induzirVertices">Induzir Grafo</button>
                    </p>
                    <div id="networkSubIndVer" class="networkGS">
                        
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="SubgrafoInducaoAresta" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Subgrafo por indução de arestas</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p class="text-center" id="textindar">
                        Escolha as arestas para ficar
                    </p>
                    <div class="row" id="arestasAInduzir">
                        
                    </div>
                    <p class="text-center" id="btnindar">
                        <button class="btn btn-success btn-sm" id="induzirArestas">Induzir Grafo</button>
                    </p>
                    <div id="networkSubIndAre" class="networkGS">
                        
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="DerivacaoDePasseio" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Derivar Passeio</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="modal-passeio">
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="DerivarDistancias" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Derivar Distância</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="modal-distancia"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>

    <script src="{{asset("js/app.js")}}"></script>
    <script>
        /*------------------------------------------------------------------------*/
        /*   ABERTURA DO ARQUIVO                                                  */
        /*------------------------------------------------------------------------*/
        $(document).ready(function(){
            $(function () {
                $('[data-toggle="tooltip"]').tooltip({
                    container: 'body',
                    delay: { "show": 500, "hide": 100 },
                    placement: 'right',
                    trigger: 'click',
                    boundary: 'viewport',
                    offset: 10,
                    template: "'<div class=\"tooltip\" style=\"background-color: white; color: black\" role=\"tooltip\"><div class=\"arrow\" style=\"background-color: white; color: black\"></div><div class=\"tooltip-inner\"></div></div>'"
                });
            });
            $("#filegrafo").change(function(event){
                event.preventDefault();
                    var formData = new FormData($("#abraArquivo")[0]);    
                    $.ajax({
                        headers: {
                            'X-CSRF-Token': $('input[name="_token"]').val()
                        },
                        type: 'post',
                        url: "{{url('/abreArquivo')}}",
                        data: formData,
                        dataType: 'json',
                        contentType : false,
                        processData : false,
                        success: function(data){
                            $('#ModalImportacao').modal('hide');
                            var obj = JSON.parse(data.data);
                            abreNovoGrafo(obj.data, obj.options, obj.ordenado, obj.ponderado);
                        },
                        error: function(data){
                        }
                    });
            });
        });
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js')
            .then(function(reg){
            }).catch(function(err) {
            });
        }
    </script>
  </body>
</html>
