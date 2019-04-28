<!doctype html>
<html lang="pt_BR">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="{{asset("css/app.css")}}">

    <!-- MEU CSS -->
    <link rel="stylesheet" href="{{asset("css/main.css")}}">

    <!-- FAVICON -->
    <link rel="shortcut icon" href="{{asset("images/paad_logo.ico")}}" type="image/x-icon"/>

    @csrf

    <title>PAAD - Grafos</title>
  </head>
  <body>
    <!-- Page Wrapper -->
    <div id="wrapper">

        <!-- Sidebar -->
        <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

        <!-- Sidebar - Brand -->
        <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/">
            <div class="sidebar-brand-icon rotate-n-15">
                <img src="images/paad_logo.png" class="logo_img">
            </div>
            <div class="sidebar-brand-text mx-3">PAAD Grafos<sup></div>
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
            <i class="far fa-circle"></i>
            <span>Derivações</span>
            </a>
            <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                <div class="bg-white py-2 collapse-inner rounded">
                    <a class="collapse-item" data-toggle="modal" data-target="#GrafoSubjacenteModal">Grafo subjacente</a>
                    {{--<a class="collapse-item" href="#" onclick="">Desativar edição</a>--}}
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
                <i class="fa fa-bars"></i>
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
    <!-- End of Page Wrapper -->

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="{{asset("js/app.js")}}"></script>

    <!-- SB Admin Panel -->
    <script src="{{asset("js/sb-admin-2.min.js")}}"></script>

    <!-- VIS.JS -->
    <script src="{{asset("js/vis.min.js")}}"></script>

    <!-- MEU JAVASCRIPT -->
    <script src="{{asset("js/main.js")}}"></script>

    <script type="text/javascript">
        $(window).load(function() {
            $("html, body").animate({ scrollTop: $(document).height() }, 1000);
        });
        $(document).ready(function(){
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
    });
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
                <button type="button" class="btn btn-default dismiss" data-dismiss="modal"></button>
                <button type="button" class="btn btn-primary confirm" data-dismiss="modal"></button>
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
                    <button type="button" class="btn btn-primary">Salvar</button>
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
                    <button type="button" class="btn btn-primary">Salvar</button>
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
                        <input type="file" class="form-control-file" id="filegrafo" name="filegrafo" accept=".json">    
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
                </div>
                <div class="modal-body">
                    <div id="networkGrafoSubjacente" class="networkGS">
                        
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>
  </body>
</html>