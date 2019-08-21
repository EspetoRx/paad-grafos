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
                callback(data);
                network.addEdgeMode();
            }
            // after each adding you will be back to addEdge mode
            
        },
        addNode: function (data, callback){
            data.label = '';
            data.id = id++;
            data.color = '';
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
