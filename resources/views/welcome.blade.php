<!doctype html>
<html lang="pt_BR">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta content="paad grafos graphs grafo graph teory apoio docencia" name="keywords">
    <meta content="Projeto de Aplicação de Apoio à Docência - Teoria de grafos" name="description">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="{{asset("css/app.css")}}">
    <link rel="manifest" href="{{asset('manifest.json')}}">
    <!-- FAVICON -->
    <link rel="shortcut icon" href="{{asset("images/paad_logo.ico")}}" type="image/x-icon"/>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    
    @csrf

    <title>PAAD - Grafos</title>
  </head>
  <body>
        
    <!-- Page Wrapper -->
    <div id="wrapper">

        <!-- Sidebar -->
        <ul class="navbar-nav sidebar sidebar-tog accordion" id="accordionSidebar">

        <!-- Sidebar - Brand -->
        <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/">
            <div class="sidebar-brand-icon">
                <img src="images/paad_logo.png" class="logo_img">
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
            <a class="nav-link" onClick="habilitarPropriedades()">
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
                <span>Grafos especiais</span>
                </a>
                <div id="collapseThree" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <a class="collapse-item" onClick="konigsberg(); $('#collapseThree').removeClass('show');">Grafo de Königsberg</a>
                        <a class="collapse-item" onClick="heawood(); $('#collapseThree').removeClass('show');">Grafo de Heawood</a>
                    </div>
                </div>
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
    
    <script src="{{asset("js/app.js")}}"></script>
    <script>
        /*------------------------------------------------------------------------*/
        /*   ABERTURA DO ARQUIVO                                                  */
        /*------------------------------------------------------------------------*/
        $(document).ready(function(){
            $(function () {
                $('[data-toggle="tooltip"]').tooltip();
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
                            console.log(data);
                        }
                    });
            });
            let window.mobilecheck = function() {
              var check = false;
              (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
                return check;
              };
            });  
            if(mobilecheck){
              document.documentElement.requestFullscreen();
            }
    </script>
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

  </body>
</html>
