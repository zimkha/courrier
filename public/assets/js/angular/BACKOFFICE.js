var app=angular.module('BackEnd',[ 'ngRoute' , 'ngSanitize' , 'ngLoadScript', 'ui.bootstrap' , 'angular.filter']);

var BASE_URL = 'http://localhost/courrier/public/'
var imgupload = BASE_URL + '/assets/images/upload.jpg';
var msg_erreur = 'Veuillez contacter le support technique';

app.filter('range', function()
{
    return function(input, total)
    {
        total = parseInt(total);
        for (var i=0; i<total; i++)
            input.push(i);
        return input;
    };
});

// Pour mettre les espaces sur les montants
app.filter('convertMontant', [
    function() { // should be altered to suit your needs
        return function(input) {
            input = input + "";
            return input.replace(/,/g," ");
        };
    }]);


app.filter('changeDatePart', [
    function () { // should be altered to suit your needs
        return function (input) {
            input = input + "";

            var find = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            var replace = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

            return input.replaceArray(find, replace);

        };
    }]);

    

app.factory('Init',function ($http, $q)
{
    var factory=
        {
            data:false,
            getElement:function (element,listeattributs, is_graphQL=true, dataget=null)
            {
                var deferred=$q.defer();
                console.log(dataget);
                $http({
                    method: 'GET',
                    url: BASE_URL + (is_graphQL ? 'graphql?query= {'+element+' {'+listeattributs+'} }' : element),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:dataget
                }).then(function successCallback(response)
                {
                    /*lorsque la requete contient des paramètres, il faut decouper pour recupérer le tableau*/
                    if (is_graphQL)
                    {
                        factory.data = response['data']['data'][!element.indexOf('(')!=-1 ? element.split('(')[0] : element];
                    }
                    else
                    {
                        factory.data = response['data'];
                    }
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
          
            getElementPaginated:function (element,listeattributs)
            {
                var deferred=$q.defer();
                $http({
                    method: 'GET',
                    url: BASE_URL + 'graphql?query= {'+element+'{metadata{total,per_page,current_page,last_page},data{'+listeattributs+'}}}'
                }).then(function successCallback(response) {
                    factory.data=response['data']['data'][!element.indexOf('(')!=-1 ? element.split('(')[0] : element];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },

            saveElement:function (element,data) {
                var deferred=$q.defer();
                $http({
                    method: 'POST',
                    url: BASE_URL + '/'+element,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:data
                }).then(function successCallback(response) {
                    factory.data=response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            changeStatut:function (element,data) {
                var deferred=$q.defer();
                $http({
                    method: 'POST',
                    url: BASE_URL + '/' + element+'/statut',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:data
                }).then(function successCallback(response) {
                    factory.data=response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
          
            importerExcel:function (element,data) {
                var deferred=$q.defer();
                $.ajax
                (
                    {
                        url: BASE_URL + '/' + element+'/import',
                        type:'POST',
                        contentType:false,
                        processData:false,
                        DataType:'text',
                        data:data,
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                        },
                        beforeSend: function()
                        {
                            $('#modal_addliste'+element).blockUI_start();
                        },success:function(response)
                        {
                            $('#modal_addliste'+element).blockUI_stop();
                            factory.data=response;
                            deferred.resolve(factory.data);
                        },
                        error:function (error)
                        {
                            $('#modal_addliste'+element).blockUI_stop();
                            console.log('erreur serveur', error);
                            deferred.reject(msg_erreur);
                        }
                    }
                );
                return deferred.promise;
            },
          
            saveElementAjax:function (element,data) {
                var deferred=$q.defer();
                $.ajax
                (
                    {
                        url: BASE_URL + element,
                        type:'POST',
                        contentType:false,
                        processData:false,
                        DataType:'text',
                        data:data,
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                        },
                        beforeSend: function()
                        {
                            $('#modal_add'+element).blockUI_start();
                        },success:function(response)
                        {
                            $('#modal_add'+element).blockUI_stop();
                            factory.data=response;
                            deferred.resolve(factory.data);
                        },
                        error:function (error)
                        {
                            $('#modal_add' + element).blockUI_stop();
                            console.log('erreur serveur', error);
                            deferred.reject(msg_erreur);

                        }
                    }
                );
                return deferred.promise;
            },
            removeElement:function (element,id) {
                var deferred=$q.defer();
                $http({
                    method: 'DELETE',
                    url: BASE_URL +  element + '/' + id,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function successCallback(response) {
                    factory.data=response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            ChangerStatusCourrier:function(data)
            {
                var deferred=$q.defer();
                $http({
                    method: 'POST',
                    url: BASE_URL + 'change-status',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:data
                }).then(function successCallback(response) {
                    factory.data=response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },

            ajaxGet: function()
            {
                $.ajax({
                    url: BASE_URL+ 'medoc/test/',
                    method: "POST",
                    data:{
                     date_donne:date_donne,
                    },
                    success: function(data)
                    {
                        // Traiter les donnee
                      console.log(data);
                    }, error: function (data ) {
                        console.log(data)
                    }
                  });
            }
           

        };
    return factory;
});


// Configuration du routage au niveau de l'app
app.config(function($routeProvider) {
    $routeProvider
        .when("/courriers", {
            templateUrl : "page/list-courrier",
        })
        .when("/", {
          templateUrl : "page/dashboard",
      })
      
        .when("/pub", {
            templateUrl : "page/pub",
        })

});



// Spécification fonctionnelle du controller
app.controller('BackEndCtl',function (Init,$location,$scope,$filter, $log,$q,$route, $routeParams,$http, $timeout)
{

  

    var listofrequests_assoc =
        {
           
            "servicegauches"  : ["id,name",""],

            "dashboards"  : ["total,depart,arrive,encour",""],

            "servicedroites"  : ["id,name",""],

            'permissions'                   : ['id,name,display_name,guard_name', ""],

            "roles"                         : ["id,name,guard_name,permissions{id,name,display_name,guard_name}", ""],

            "courriers" : ["id,numero,reference,type,expediteur,autre_instruction,date_courrier,objet,date_arrive,status_title,status,services{service_gauche_id,service_droite_id,service,service_gauche{id,name},service_droite{id,name}}", ""]

        };

    $scope.link = BASE_URL;

    //--DEBUT => Donne la qté  par rapport à la quantité total--//
   
    setTimeout(function () {
        $('select.select2').select2(
            {
                width: 'resolve',
                tags: true
            }
        )
            .on('change', function (e) {
                //console.log("icicic", $("#designation_produitclient").val())
                var getId = $(this).attr("id");
                console.log("Id", getId)
                if (getId.indexOf('vente') !== -1 ) {
                    setTimeout(function () {
                        $scope.donneClient();

                    },300);
                }
            });
    }, 500);


    //
    $scope.imgupload_location = imgupload;

    // Pharmacie
    

    $scope.courriers = [];
    $scope.users = [];

    $scope.servicedroites = [];
    $scope.servicedroites = [];

   
    $scope.produitsInTable = [];


    $scope.tot_day = 0;
    $scope.tot_month = 0;
    $scope.tot_year = 0;

    // for pagination

  
    $scope.paginationcourrier = {
        currentPage: 1,
        maxSize: 10,
        entryLimit: 10,
        totalItems: 0
    };



    $scope.urlWrite = "";

    $scope.radioBtn = null;
    $scope.radioBtnComposition = null;
    $scope.onRadioClick = function ($event, param) {
        $scope.radioBtn = parseInt(param);
        console.log($scope.radioBtn);
    };
    $scope.onRadioCompositionClick = function ($event, param) {
        $scope.radioBtnComposition = parseInt(param);
        console.log($scope.radioBtnComposition);
    };
    $scope.writeUrl = function (type, addData=null)
    {
        var urlWrite = "";
        $("input[id$=" + type + "], textarea[id$=" + type + "], select[id$=" + type + "]").each(function ()
        {
            var attr = $(this).attr("id").substr(0, $(this).attr("id").length - (type.length + 1 ));
            urlWrite = urlWrite + ($(this).val() && $(this).val()!=="" ? (urlWrite ? "&" : "") + attr + '=' + $(this).val() : "" );
        });

        $scope.urlWrite = urlWrite ? "?" + urlWrite : urlWrite;
    };


    $scope.ChartMonth = function() {
      $.ajax({
        url:  BASE_URL + "data",
        methode: "GET",
        success: function (data) {
          let months = {
            0 : 'Janvier',
            1: 'Fevrier',
            2: 'Mars',
            3: 'Avril',
            4: 'Mai',
            5: 'Juin',  6: 'Juillet',  7: 'Aout',  8: 'Septembre',
            9: 'Octobre',  10: 'Nomvembre',  11: 'Decembre',
          }
           console.log("les donnees 1",data)
            var mois = [];
            var val = [];           
            for (var i  in data)
            {
              let element = data[i];
                mois.push(months[i]); 
                val.push(element[0])            
            }
            var chartMonth = {
              labels: mois,
              datasets : [
                  {
                      label : 'Statistiques par Mois ',
                      backgroundColor: ['#f7464a', '#46bfbd', '#fdb45c', '#985f0d',  '#985f0d'],
                      borderColor:'rgba(200,200,200,0.75)',
                      hoverBackgroundColor: 'rgba(200,200,200,1)',
                      hoverBorderColor: 'rgba(200,200,200,1)',
                      data:val
                  }
              ]
          };
          var ctx1 = $("#chartMonth");
          console.log(ctx1,"yeeeeeeee");
          var graph = new Chart(ctx1, {
              type: 'bar',
              data: chartMonth
          });  
        }
     });
    }

    $scope.chartTypeData = function() {
    $.ajax({
        url: BASE_URL + 'getdata-type/',
        method: "GET",
        success: function (data) {
           let tab = {
              1: "Arrive",
              0: "Départ"
           };
            var type = [];
            var itemVal = [];

            console.log(data)
            for (var i in data)
            {
              type.push(tab[i]);
              let element = data[i];
              itemVal.push(element[0])
            }
            var chartType = {
                labels: type,
                datasets : [
                    {
                        label : 'Statistiques par Type° ',
                        backgroundColor: ['#f7464a', '#46bfbd', '#fdb45c', '#985f0d',  '#985f0d'],
                        borderColor:'rgba(200,200,200,0.75)',
                        hoverBackgroundColor: 'rgba(200,200,200,1)',
                        hoverBorderColor: 'rgba(200,200,200,1)',
                        data:itemVal
                    }
                ]
            };
            var ctx = $("#chartType");
            var graph = new Chart(ctx, {
                type: 'bar',
                data: chartType
            });
        }, error: function (data) {
            console.log("erreur de server" +data)
        }
    });
 }


    $scope.getelements = function (type, addData=null, forModal = false, nullableAddToReq = false)
    {
        rewriteType = type;

        if ($scope.pageCurrent!=null)
        {
            if($scope.pageCurrent.indexOf("reservation")!==-1)
            {
                /*if (type.indexOf('plannings')!==-1)
                {
                    rewriteType = rewriteType + "(etat:1)";
                }*/
            }
            else if ($scope.pageCurrent.indexOf("tarif")!==-1)
            {
                if (type.indexOf('tarifs')!==-1)
                {
                    rewriteType = rewriteType + "(default:true"
                        + ($('#typetarif_listtarif').val() ? ',type_tarif_id:' + $('#typetarif_listtarif').val() : "" )
                        + ")";
                }
            }
            else if ($scope.pageCurrent.indexOf("salle")!==-1)
            {
                if (type.indexOf('salles')!==-1)
                {
                    rewriteType = rewriteType + "(default:true"
                        + ($('#zone_listsalle').val() ? ',zone_id:' + $('#zone_listsalle').val() : "" )
                        + ")";
                }
            }
        }

        $add_to_req =  (listofrequests_assoc[type].length > 1 && !nullableAddToReq) ? listofrequests_assoc[type][1] : null;
        Init.getElement(rewriteType, listofrequests_assoc[type] + $add_to_req).then(function(data)
        {
       if (type.indexOf("servicegauches")!==-1)
            {
                $scope.servicegauches = data;
            }
            else if (type.indexOf("servicedroites")!==-1)
            {
                $scope.servicedroites = data;
            }
            else if (type.indexOf("courriers")!==-1)
            {
                $scope.courriers = data;
            }
            else if (type.indexOf("dashboards")!==-1)
            {
                $scope.dashboards = data;
            }
           
        }, function (msg) {
            iziToast.error({
                title: "ERREUR",
                message: msg_erreur,
                position: 'topRight'
            });
            console.log('Erreur serveur ici = ' + msg);
        });

    };
    $scope.dataDashboard = [];
    $scope.DiseableEnableinput = function($event) {
     
        if($("#depart").prop('checkec', true)) {
          // On cache les champs 
        }
        else if($("#arrive").prop('checked', true)) {
          // On afficher certains champs et on cache d'autre
        }
    }
$scope.getAllDashboard = function()
{
    $.ajax({
        url: BASE_URL+ 'getResultat',
        method: "GET",
        success: function(data)
        {
           $scope.dataDashboard = data;
           console.log($scope.dataDashboard)
        }, error: function (data) {
            console.log(data)
        }
      });
};
    $scope.searchtexte_courrier = "";

    $scope.pageChanged = function(currentpage)
    {

        if ( currentpage.indexOf('courrier')!==-1  ||  currentpage.indexOf('/')!==-1 )
        {
            rewriteelement = 'courrierspaginated(page:'+ $scope.paginationcourrier.currentPage +',count:'+ $scope.paginationcourrier.entryLimit
                + ($scope.courrierview ? ',courrier_id:' + $scope.courrierview_id : "" )
                + ($('#searchoption_courrier').val() ? (',' + $('#searchoption_courrier').val() + ':"' + $('#searchoption_courrier').val() + '"') : "" )
                + ($('#numero_courrier').val() ? ',numero:' + $('#numero_courrier').val() : "" )
                + ($('#reference_courrier').val() ? ',reference:' + '"' + $('#reference_courrier').val() + '"' : "" )
                + ($('#expediteur_courrier').val() ? ',expediteur:' + '"' + $('#expediteur_courrier').val() + '"' : "" )
                + ($('#created_at_start_listcourrier').val() ? ',created_at_start:' + '"' + $('#created_at_start_listcourrier').val() + '"' : "" )
                + ($('#created_at_end_listcourrier').val() ? ',created_at_end:' + '"' + $('#created_at_end_listcourrier').val() + '"' : "" )
                +')';
            $scope.requeteCourrier = ""

            // blockUI_start_all('#section_listeclients');

            Init.getElementPaginated(rewriteelement, listofrequests_assoc["courriers"][0]).then(function (data)
            {
                $scope.paginationcourrier = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationcourrier.entryLimit,
                    totalItems: data.metadata.total
                };
                // $scope.noOfPages_produit = data.metadata.last_page;
                $scope.courriers = data.data;
            },function (msg)
            {
                // blockUI_stop_all('#section_listeclients');
                toastr.error(msg);
            });
        }

        // else if ( currentpage.indexOf('projet')!==-1 )
        // {
        //     rewriteelement = 'projetspaginated(page:'+ $scope.paginationprojet.currentPage +',count:'+ $scope.paginationprojet.entryLimit
        //     + ($scope.projetview ? ',projet_id:' + $scope.projetview.id : "" )
        //     + ($scope.client_id != null ? ',user_id:' + $scope.client_id : "")
        //     + ($scope.clientview ? ',user_id:' + $scope.clientview.id : "" )
        //     + ($scope.radioBtnComposition ? ',etat:' + $scope.radioBtnComposition : "")
        //     + ($('#searchtexte_projet').val() ? (',' + $('#searchoption_projet').val() + ':"' + $('#searchtexte_projet').val() + '"') : "" )
        //     + ($('#projet_user').val() ? ',user_id:' + $('#projet_user').val() : "" )
        //     + ($('#created_at_start_listprojet').val() ? ',created_at_start:' + '"' + $('#created_at_start_listprojet').val() + '"' : "" )
        //     + ($('#created_at_end_listprojet').val() ? ',created_at_end:' + '"' + $('#created_at_end_listprojet').val() + '"' : "" )
        //     + ($scope.onlyEnCours ? ',tout:true' : "" )
        //         +')';
        //     Init.getElementPaginated(rewriteelement, listofrequests_assoc["projets"][0]).then(function (data)
        //     {

        //         $scope.paginationprojet = {
        //             currentPage: data.metadata.current_page,
        //             maxSize: 10,
        //             entryLimit: $scope.paginationprojet.entryLimit,
        //             totalItems: data.metadata.total
        //         };

        //         $scope.projets = data.data;

        //          console.log("$scope.client_id ",data.data)
        //     },function (msg)
        //     {

        //         toastr.error(msg);
        //     });
        // }
        else if (currentpage.indexOf('role') !== -1)
        {
            rewriteelement = (currentpage + 's') + 'paginated(page:' + $scope.paginationrole.currentPage + ',count:' + $scope.paginationrole.entryLimit
                + ($('#search_listrole').val() ? (',search:"' + $('#search_listrole').val() + '"') : "")
                + ')';

            Init.getElementPaginated(rewriteelement, listofrequests_assoc[(currentpage + 's')]).then(function (data) {

                // console.log(data);
                // pagination controls
                $scope.paginationrole = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationrole.entryLimit,
                    totalItems: data.metadata.total
                };

                $scope.roles = data.data;

            }, function (msg) {

                toastr.error(msg);
            });

        }
        else if ( currentpage.indexOf('user')!==-1 )
        {
            rewriteelement = 'userspaginated(page:'+ $scope.paginationuser.currentPage +',count:'+ $scope.paginationuser.entryLimit
              //  + ($('#searchrole_user').val() ? ',role_id:' + $('#searchrole_user').val() : "" )
              //  + ($('#searchtexte_user').val() ? (',' + $('#searchoption_user').val() + ':"' + $('#searchtexte_user').val() + '"') : "" )
                + ($('#nom_user_filtre').val() ? ',name:' + '"' + $('#nom_user_filtre').val() + '"' : "")
                + ($('#email_user_filtre').val() ? ',email:' + '"' + $('#email_user_filtre').val() + '"' : "")
                + ($('#adresse_user_filtre').val() ? ',adresse_complet:' + '"' + $('#adresse_user_filtre').val() + '"' : "")
                + ($('#telephone_user_filtre').val() ? ',telephone:' + '"' + $('#telephone_user_filtre').val() + '"' : "")

                +')';
            // blockUI_start_all('#section_listeclients');
            Init.getElementPaginated(rewriteelement, listofrequests_assoc["users"]).then(function (data)
            {
                // blockUI_stop_all('#section_listeclients');
                console.log(data);
                // pagination controls
                $scope.paginationuser = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationuser.entryLimit,
                    totalItems: data.metadata.total
                };
                // $scope.noOfPages_produit = data.metadata.last_page;
                $scope.users = data.data;
            },function (msg)
            {
                // blockUI_stop_all('#section_listeclients');
                toastr.error(msg);
            });
        }
    };

    $scope.client_id = null;
    $scope.choisirMode = function (type) {
        $scope.pageChanged('projet')
        if (type == "client")
        {
            $('#projet_lier_plan').attr("disabled", false);
            $scope.client_id = parseInt($('#client_lier_plan').val()) ;

        setTimeout(function () {

            $scope.pageChanged('projet')

            console.log("ici pour voir  client id", $scope.client_id)
        },700);


        }
    }


    $scope.OneBuffetAlReadySelected = true;
    // Permet d'ajouter une reservation à la liste des reservation d'une facture
    $scope.list_niveau_plan = [];
    $scope.menu_consommations = [];
    $scope.addToPlan = function($event, item)
    {
        let add = true;
        console.log(item);
        $scope.panier.push(item);
    };
    $scope.addToMenu = function (event, itemId)
    {
        $scope.OneBuffetAlReadySelected = true;
        $scope.consommation_buffet_id = null;
        $scope.menu_consommations = [];
        $("[id^=consommation_menu]").each(function (key,value)
        {
            if ($(this).prop('checked'))
            {
                var consommation_id = Number($(this).attr('data-consommation-id'));
                $.each($scope.consommations, function (key, value) {
                    if (consommation_id==value.id && value.is_buffet)
                    {
                        $scope.OneBuffetAlReadySelected = false;
                        $scope.consommation_buffet_id = consommation_id;
                        /*$("[id^=consommation_menu]").each(function (keyUn,valueUn)
                        {
                            if(consommation_id!=Number($(this).attr('data-consommation-id')))
                            {
                                console.log('checked', $(this).prop('checked'));
                                $(this).prop('checked', false);
                                console.log('checked', $(this).prop('checked'));

                            }
                        })*/;
                        $scope.menu_consommations.push(consommation_id);
                    }
                });
                if ($scope.OneBuffetAlReadySelected)
                {
                    console.log($scope.OneBuffetAlReadySelected);
                    $scope.menu_consommations.push(consommation_id);
                }
            }
        });

        console.log('arrive menu', $scope.menu_consommations);
    };



    // Permet d'ajouter une permission à la liste des permissions d'un role
    $scope.role_permissions = [];
    $scope.addToRole = function (event, itemId)
    {
        var all_checked = true;
        $scope.role_permissions = [];
        $("[id^=permission_role]").each(function (key,value)
        {
            if ($(this).prop('checked'))
            {
                var permission_id = $(this).attr('data-permission-id');
                $scope.role_permissions.push(permission_id);
            }
            else
            {
                all_checked = false;
            }
        });
        $('#permission_all_role').prop('checked', all_checked);
        console.log('arrive', all_checked, $scope.role_permissions);
    };



    $scope.reInit = function(type="select2")
    {
        setTimeout(function () {

            if (type.indexOf("select2")!==-1)
            {
                $('.select2').select2({
                    width: 'resolve',
                    tags: true
                });
            }
            else if (type.indexOf("datedropper")!==-1)
            {
                $('.datedropper').pickadate({
                    format: 'dd/mm/yyyy',
                    formatSubmit: 'dd/mm/yyyy',
                    monthsFull: [ 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ],
                    monthsShort: [ 'Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec' ],
                    weekdaysShort: [ 'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam' ],
                    today: 'aujourd\'hui',
                    clear: 'clair',
                    close: 'Fermer'
                });
            }
        },100);
    };

    $scope.panier = [];
    $scope.details_monnaie = [];
    $scope.panierAffile = [];

    $scope.ChangerStatusCourrier = {'id':'', 'statut':'', 'type':'', 'title':''};
   $scope.showModalPassToOne = function(event , obj= null, title = null)
   {
    
        let id = 0;
        id = obj.id;
        $scope.ChangerStatusCourrier.id = obj       
        $scope.ChangerStatusCourrier.title = title;
        $scope.emptyForm('chstat');
        console.log("les donners",  $scope.ChangerStatusCourrier.title,  $scope.ChangerStatusCourrier.id)
        $("#modal_changeStatus").modal('show');
   };
   $scope.ChangerStatusCourrier = {'id':'', 'statut':'', 'type':'', 'title':''};
   $scope.showModalPassToTwo = function(event,type, statut, obj= null, title = null)
   {
    let id = 0;
    id = obj.id;
    $scope.ChangerStatusCourrier.id = obj       
    $scope.ChangerStatusCourrier.title = title;
    $scope.emptyForm('chstat');
    console.log("les donners",  $scope.ChangerStatusCourrier.title,  $scope.ChangerStatusCourrier.id)
    $("#modal_changeStatus").modal('show');
   };
   $scope.ChangerStatusCourrier = function(e, idItem)
   {
       var form = $('#modal_changeStatus');
       var send_data = {'id':idItem};
       form.parent().parent().blockUI_start();
       Init.ChangerStatusCourrier(send_data).then(function(data)
       {
           console.log(data, 'donnes');
           getCommande = data;
           console.log(getCommande);
           form.parent().parent().blockUI_stop();
           if (data.data!=null && !data.errors)
           {
               if ($scope.courrierview )
               {
                   $scope.commandeview = getCommande;
               }
               $scope.pageChanged('courrier');
               iziToast.success({
                   title: ('Status Modifier'),
                   message: "succès",
                   position: 'topRight'
               });
               $("#modal_changeStatus").modal('hide');
           }
           else
           {
               iziToast.error({
                   title: "",
                   message: '<span class="h4">' + data.errors + '</span>',
                   position: 'topRight'
               });
           }
       }, function (msg)
       {
           form.parent().parent().blockUI_stop();
           iziToast.error({
               message: '<span class="h4">' + msg + '</span>',
               position: 'topRight'
           });
       });
       console.log('current courrier id', send_data);
   };

    $scope.refreshSelect2 = function()
    {
        setTimeout(function ()
        {
            $('.select2').select2();
        },100);
    };

    // Pour detecter le changement des routes avec Angular
    $scope.linknav="/";
    $scope.currenttemplateurl = "";
    $scope.$on('$routeChangeStart', function(next, current)
    {
        $scope.currenttemplateurl = current.templateUrl;
        /******* Réintialisation de certaines valeurs *******/
        $scope.planview = null;
        $scope.courrierview = null;
        $scope.messagesendview = null;
        $scope.projetview = null;


        $scope.pageUpload = false;
        $scope.pageDashboard = false;
        $scope.pageCurrent = null;
        $scope.clientview = null;
        $scope.userview = null;


        // for pagination
        $scope.paginationcli = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };

        $scope.paginationuser = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationcourrier = {
          currentPage: 1,
          maxSize: 10,
          entryLimit: 10,
          totalItems: 0
      };

    $scope.AllProjet = [];

        $scope.paginationrole = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationplan = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationprojet = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };

          $scope.paginationmessagesend = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.linknav = $location.path();
        $scope.getelements("roles");
        $scope.getelements("permissions");

         if(angular.lowercase(current.templateUrl).indexOf('courrier')!==-1)
         {
               // $scope.pageChanged("plan");

               $scope.courrierview = null;
               if(current.params.itemId)
               {
                   var idElmtplan = current.params.itemId;
                   var req = "courriers";
                   $scope.courrierview = {};
                   rewriteReq = req + "(id:" + current.params.itemId + ")";
                   Init.getElement(rewriteReq, listofrequests_assoc[req]).then(function (data)
                   {
                       $scope.courrierview = data[0];
                      //  $scope.pageChanged('projet');
                      //  $scope.getelements('joineds');

                       console.log("$scope.courrierview 1 =>",$scope.courrierview)
                   },function (msg)
                   {
                       toastr.error(msg);
                   });
               }
               else
               {
                   $scope.pageChanged('courrier');
                   $scope.getelements('servicegauches');
                   $scope.getelements('servicedroites');
               }
         }
         else if(angular.lowercase(current.templateUrl).indexOf('list-courrier')!==-1)
         {
          $scope.getelements('servicegauches');
          $scope.getelements('servicedroites');
            
         }

         else if(angular.lowercase(current.templateUrl).indexOf('projet')!==-1)
         {
            $scope.projetview = null;
               if(current.params.itemId)
               {
                 
                   var req = "projets";
                   $scope.projetview = {};
                   rewriteReq = req + "(id:" + current.params.itemId + ")";
                   Init.getElement(rewriteReq, listofrequests_assoc[req]).then(function (data)
                   {
                       $scope.projetview = data[0];
                      // $scope.getelement("projets");
                       console.log("ici le $scope.projetview" ,$scope.projetview)
                   },function (msg)
                   {
                       toastr.error(msg);
                   });
               }
               else
               {
                   $scope.pageChanged('projet');
               }
        }
         else if(angular.lowercase(current.templateUrl).indexOf('dashboards')!==-1 || angular.lowercase(current.templateUrl).indexOf('')!==-1)
         {
           
            $scope.data = [];
              $http({
                method: 'GET',
                url: BASE_URL + 'data-get'
            }).then(function successCallback(response) {
                console.log("je suis la factory",response.data)
                $scope.data = response.data;
                console.log($scope.data, "les donnes")
            }, function errorCallback(error) {
                console.log('erreur serveur', error);
               
            });
            setTimeout($scope.ChartMonth(), 1500)
            setTimeout( $scope.chartTypeData(), 1500);

         }



         else if(angular.lowercase(current.templateUrl).indexOf('client')!==-1)
         {


            $scope.clientview = null;
            if(current.params.itemId)
            {

               /* var idElmtclient = current.params.itemId;
                setTimeout(function ()
                {
                    Init.getStatElement('user', idElmtclient);
                },1000);*/

                var req = "users";
                $scope.clientview = {};
                rewriteReq = req + "(id:" + current.params.itemId + ")";
                Init.getElement(rewriteReq, listofrequests_assoc[req]).then(function (data)
                {
                    $scope.clientview = data[0];
                    $scope.pageChanged("projet");


                },function (msg)
                {
                    toastr.error(msg);
                });
            }
            else
            {
                $scope.pageChanged('user');
            }
        }
      
    });
      $scope.deleteMessage = function(itemId)
    {

        $.ajax({
            url: BASE_URL + 'contact/' + itemId ,
            method : 'DELETE',
            success: function(data)
            {
                iziToast.success({
                    title: "Element supprimer",
                    message: 'succés',
                    position: 'topRight'
                });
                 $scope.getelements('messagesends');
            }, error: function (data) {
                iziToast.error({
                    title: "",
                    message: '<span class="h4">' + data.errors_debug + '</span>',
                    position: 'topRight'
                });
            }
          });
    }

  $scope.deteleLiaison = function(plan_id, projet_id)
  {
    console.log("je suis la mes gars", plan_id, projet_id);
    $.ajax({
        url: BASE_URL + 'rompre_liaison/' + projet_id + '/' + plan_id,
        method : 'GET',
        success: function(data)
        {

            iziToast.success({
                title: "Liaison supprimer",
                message: 'succés',
                position: 'topRight'
            });

             $scope.pageChanged('projet');
        }, error: function (data) {
            iziToast.error({
                title: "",
                message: '<span class="h4">' + data.errors_debug + '</span>',
                position: 'topRight'
            });
        }
      });

  };
    $scope.infosDahboardBy = null;
    $scope.getInfosDahboard = function(byType)
    {
        $scope.infosDahboardBy = byType;
        $scope.getelements('dashboards');
    };

    $scope.getRecettes = function(forType)
    {
        $scope.getelements('recettes');
        $scope.getelements(forType);
    };


    $scope.formatDate = function(str)
    {
        date = str.split('/');
        return date[2]+"-"+date[1]+"-"+date[0] ;
    };


    $scope.$on('$routeChangeSuccess', function(next, current)
    {
        setTimeout(function ()
        {
            $('.select2').select2(
                {
                    width: 'resolve',
                    tags: true
                }
            );


        },1000);


    });


    $scope.datatoggle=function (href,addclass)
    {
        $(href).attr('class').match(addclass) ? $(href).removeClass(addclass) : $(href).addClass(addclass);
    };

    // Cocher tous les checkbox / Décocher tous les checkbox
  
    // to randomly generate the password
 


    $scope.emptyForm = function (type) {

        $scope.produitsInTable = [];
        let dfd = $.Deferred();
        $('.ws-number').val("");
        $("input[id$=" + type + "], textarea[id$=" + type + "], select[id$=" + type + "], button[id$=" + type + "]").each(function () {
            $(this).val("");
            if ($(this).is("select")) {
                $(this).val("").trigger('change');
            }
            $(this).attr($(this).hasClass('btn') ? 'disabled' : 'readonly', false);

            if ($(this).attr('type') === 'checkbox') {
                $(this).prop('checked', false);
            }
        });


        $('#img' + type)
            .val("");
        $('#affimg' + type).attr('src', imgupload);

        return dfd.promise();
    };

    // Permet de changer le statut du formulaire a editable ou non
  

    $scope.localize_panier = null;

    //voir un détail de médicament

    $scope.livreCommande = {'id':'', 'title':''};
    $scope.showModalStat = function(event, idCommande,title = null)
    {
        $scope.livreCommande.id = idCommande;
        $scope.livreCommande.title = title;
        emptyform('livreCommande');
        $("#modal_addlivreCommande").modal('show');
    };

    // Permet d'afficher le formulaire
    $scope.showModalAdd = function (type, fromUpdate=false, assistedListe=false, ObjPassed = null)
    {
        // $scope.panier = [];
        $scope.dataInTableService = [];
        $scope.tableName = [];
        $scope.fromUpdate = false;
        $scope.selectionlisteproduits = $scope.medicaments;

        $scope.addcommandeview = false;
        setTimeout(function ()
        {
            // On fait d'abord un destroy
            if (!$('select').data('select2')) {
                $('.select').select2('destroy');
            }
            // Souscription
            $('.select2').select2();
        },500);


        // Détecter le changement du select entreprise
        setTimeout(function () {
            $('select.select2').select2(
                {
                    width: 'resolve',
                    tags: true
                }
            ).on('change', function (e) {

                var getId = $(this).attr("id");
                console.log('getId', getId, 'value', $(this).val());

                    if ($(this).val()) {
                        $scope.client_id = $(this).val();
                        $scope.pageChanged("projet");

                    }
            });

        }, 500);

        if(type == 'courrier') {
          $('#objet' ).val('')
          $('#numero' ).val('')
          $('#date_arrive' ).val('')
          $('#date_courrier' ).val('')
          $('#expediteur' ).val('')
          $('#reference' ).val('')
          $('#autre_instruction' ).val('')
          $("#arrive").prop('checked', true);
        }
      
      
        $scope.emptyForm(type);
        if (type.indexOf('role')!==-1)
        {
            $scope.roleview = null;
            $("[id^=permission_role]").each(function (key,value)
            {
                $(this).prop('checked', false);
            });
            $('#permission_all_role').prop('checked', false);
        }
        else if (type.indexOf('user')!==-1)
        {
            $scope.getelements('roles', null, true);
        }

        $("#modal_add"+type).modal('show');
    };


    $scope.chstat = {'id':'', 'statut':'', 'type':'', 'title':''};

  

    $scope.showModalStatus = function(event,type, statut, obj= null, title = null)
    {
        console.log(obj);
        let id = 0;
        id = obj.id;
        $scope.chstat.id = id;
        $scope.chstat.statut = statut;
        $scope.chstat.type = type;
        $scope.chstat.title = title;
        $scope.emptyForm('chstat');
        $("#modal_changeStatus").modal('show');
    };
    $scope.showModalChangeStatut  = function(event,type, statut, obj= null, title = null)
    {
        console.log(obj);
        var id = 0;
        id = obj.id;
        $scope.chstat.id = id;
        $scope.chstat.statut = statut;
        $scope.chstat.type = type;
        $scope.chstat.title = title;
        $scope.emptyForm('changestatut');
        $("#modal_addchangestatut").modal('show');
    };
    $scope.showModalconfirme = function(event, title = null)
    {
        $scope.chstat.title = title;
        $scope.emptyForm('chstat');
        $("#modal_addchstat").modal('show');
    };



    $scope.changeStatut = function(e, type)
    {
        alert("nieuwal fii");
        var form = $('#form_addchstat');

        var send_data = {id: $scope.chstat.id, status:$scope.chstat.statut};
        console.log("dadtdtadta ici", send_data)
       // form.parent().parent().blockUI_start();
        Init.changeStatut(type, send_data).then(function(data)
        {
         //   form.parent().parent().blockUI_stop();
            if (data.data!=null && !data.errors_debug)
            {
               
                if (type.indexOf('courrier')!==-1 || type.indexOf('/')!==-1 ) 
                {
                  console.log( "ok ");
                  $.each($scope.courriers, function (keyItem, valueItem)
                  {
                      if (valueItem.id==send_data.id)
                      {
                          $scope.courriers[keyItem].status = $scope.chstat.statut==0 ? 1 : 2;
                          found = true;
                      }
                      return !found;
                  });
                }
                // if (type.indexOf('retour')!==-1)
                // {
                //     var found = false;
                //     $.each($scope.retours, function (keyItem, valueItem)
                //     {
                //         if (valueItem.id==send_data.id)
                //         {
                //             $scope.retours[keyItem].status = $scope.chstat.statut==0 ? false : true;
                //             found = true;
                //         }
                //         return !found;
                //     });
                // }

                iziToast.success({
                    title: (!send_data.id ? 'AJOUT' : 'MODIFICATION'),
                    message: "succès",
                    position: 'topRight'
                });
                $("#modal_addchstat").modal('hide');
            }
            else
            {
                iziToast.error({
                    title: "",
                    message: '<span class="h4">' + data.errors_debug + '</span>',
                    position: 'topRight'
                });
            }
        }, function (msg)
        {
         //   form.parent().parent().blockUI_stop();
            iziToast.error({
                message: '<span class="h4">' + msg + '</span>',
                position: 'topRight'
            });
        });
        console.log(type,'current status', $scope.chstat);
    };



 ;

    $scope.positions = []

 

    // Add element in database and in scope
    $scope.addElement = function(e,type,from='modal')
    {

        console.log(type, "le typee");
        e.preventDefault();

        var form = $('#form_add' + type);

        var formdata=(window.FormData) ? ( new FormData(form[0])): null;
        var send_data=(formdata!==null) ? formdata : form.serialize();
      
        // A ne pas supprimer
        send_dataObj = form.serializeObject();
        console.log($('#id_' + type).val(), "Le name du formulaire")
        console.log('send_dataObj', $('#id_' + type).val(), send_dataObj, send_data);

        continuer = true;

        if (type.indexOf('role')!==-1)
        {
            send_data.append("permissions", $scope.role_permissions);
            if ($scope.role_permissions.length==0)
            {
                iziToast.error({
                    title: "",
                    message: "Vous devez ajouter au moins une permission au présent role",
                    position: 'topRight'
                });
                continuer = false;
            }
        }
     
      
        else if( type == 'courrier' || type == 'courriers') {
         if($("#courrier_depart")) {
          if($("#date_depart").val() == '') {
            iziToast.error({
              title: "",
              message: "Veuillez renseigner la date départ du courrier",
              position: 'topRight'
          });
          }
          if($("#reference").val() == '') {
            iziToast.error({
              title: "",
              message: "Veuillez renseigner la référence du courrier",
              position: 'topRight'
          });
          } 
          if($("#destinataire").val() == '') {
            iziToast.error({
              title: "",
              message: "Veuillez renseigner le destinataire du courrier",
              position: 'topRight'
          });
          }   if($("#numero").val() == '') {
            iziToast.error({
              title: "",
              message: "Veuillez renseigner le numéro du courrier ",
              position: 'topRight'
          });
          }
          let depart_date = null;
          let date_depart = $("#date_depart").val();
          if(date_depart != null) {
            date_depart = new Date(date_depart);
            let month =  date_depart.getMonth() + 1 ;
            let jr  = date_depart.getDate();
            if(jr < 10) {
                jr = "0"+ jr;
            }
            if(month < 10) {
                month = "0"+month;
            }
            depart_date = date_depart.getFullYear() + '-' + month +'-' + jr;
          }
          send_data.append('reference', $("#reference").val());
          send_data.append('destinataire',     $("#destinataire").val());
          send_data.append('numero',    $("#numero").val()); 
          send_data.append('courrier_depart', true); 
          send_data.append('date_depart', depart_date);

         }
         else {
          if($("#date_courrier").val() == '') {
            iziToast.error({
              title: "",
              message: "Veuillez renseigner la date du courrier",
              position: 'topRight'
          });
          }
          if($("#date_arrive").val() == '') {
            iziToast.error({
              title: "",
              message: "Veuillez renseigner la date d'arrivée du courrier",
              position: 'topRight'
          });
          }
        
         
          let arrive_date = null;
          let courrier_date = null;
          let date_arrive = $("#date_arrive").val();
             if(date_arrive != null) {
                
                date_arrive = new Date(date_arrive);
                let month_arr =  date_arrive.getMonth() + 1 ;
                if(month_arr < 10 ) month_arr = "0" + month_arr;
                let jr_ar = date_arrive.getDate();
                if(jr_ar < 10 ) jr_ar = "0" + jr_ar;
                 arrive_date = date_arrive.getFullYear() + '-' + month_arr +'-' +jr_ar;
             }

          let date_courrier = $("#date_courrier").val();
          if(date_courrier != null) {
            date_courrier = new Date(date_courrier);
            let month =  date_courrier.getMonth() + 1 ;
            let jr  = date_courrier.getDate();
            if(jr < 10) {
                jr = "0"+ jr;
            }
            if(month < 10) {
                month = "0"+month;
            }
             courrier_date = date_courrier.getFullYear() + '-' + month +'-' + jr;
          }
         
          console.log($('#depart'), $('#arrive'), "voirr")
          send_data.append('reference', $("#reference").val());
          send_data.append('objet',     $("#objet").val());
          send_data.append('expediteur', $("#expediteur").val());
          send_data.append('numero',    $("#numero").val());
          send_data.append('date_arrive', arrive_date);
          send_data.append('date_courrier',courrier_date);
          send_data.append('autre_instruction', $("#autre_instruction").val());

          console.log("data", send_data); 
          if($scope.dataInTableService.length > 0) {
          send_data.append('services', JSON.stringify($scope.dataInTableService));
            console.log("je suis la")
          continuer = true;
          }
         
         else{
           
          iziToast.error({
            title: "",
            message: "Vous devez ajouter au moins une ligne d'instructions pour le courrier",
            position: 'topRight'
        });
        continuer = false;
         }
  
         }
         
        
        }
     
       
        if (continuer)
        {

           // form.parent().parent().blockUI_start();
            Init.saveElementAjax(type, send_data).then(function(data)
            {
                console.log('data retour', data);
                //form.parent().parent().blockUI_stop();
                if (data.data!=null && !data.errors_debug)
                {
                    $scope.emptyForm(type);
                    if (type == "pub")
                    {
                        console.log('ici datass',data)
                        getObj = data['data']['posts'][0];
                    }
                    else
                    {
                        getObj = data['data'][type + 's'][0];
                    }

                    if (type.indexOf('typeclient')!==-1)
                    {
                        if (!send_dataObj.id)
                        {
                            $scope.typeclients.push(getObj);
                            console.log($scope.typeclients);
                        }
                        else
                        {
                            $.each($scope.typeclients, function (keyItem, oneItem)
                            {
                                if (oneItem.id===getObj.id)
                                {
                                    $scope.typeclients[keyItem] = getObj;
                                    return false;
                                }
                            });
                        }
                    }
                    else if (type.indexOf('pub')!==-1)
                    {
                        if (!send_dataObj.id)
                        {
                            $scope.posts.push(getObj);
                            console.log($scope.posts);
                        }
                        else
                        {
                            $.each($scope.posts, function (keyItem, oneItem)
                            {
                                if (oneItem.id===getObj.id)
                                {
                                    $scope.posts[keyItem] = getObj;
                                    return false;
                                }
                            });
                        }
                    }
                    else if (type.indexOf('client')!==-1)
                    {
                        console.log('from', from);
                        if (from.indexOf('modal')===-1)
                        {

                            $location.path('list-client');
                        }
                        else
                        {
                            if (!send_dataObj.id)
                            {

                                $scope.clients.push(getObj);
                                $scope.paginationcli.totalItems++;
                                if($scope.clients.length > $scope.paginationcli.entryLimit)
                                {
                                    $scope.getelements('typeclients');
                                    $scope.pageChanged('client');
                                }
                            }
                            else
                            {
                                if ($scope.clientview && $scope.clientview.id===getObj.id)
                                {
                                    $scope.clientview = getObj;
                                }

                                $.each($scope.clients, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.clients[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                    }
                    else if (type.indexOf('lier_plan')!==-1)
                    {
                        $scope.pageChanged("plan");
                    }
                    else if (type.indexOf('joined')!==-1)
                    {
                        console.log("ok");
                        $scope.pageChanged("plan");
                    }
                
                    else if (type.indexOf('courrier')!==-1)
                    {

                        if (!send_dataObj.id)
                        {
                            $scope.courriers.push(getObj);
                            $scope.pageChanged('courrier');
                            $scope.produitsInTable = [];
                            $("#modal_addcourrier").modal('hide');
                        }
                        else
                        {
                            $scope.pageChanged("courrier");
                            $.each($scope.courriers, function (keyItem, oneItem)
                            {
                                if (oneItem.id===getObj.id)
                                {
                                    $scope.courriers[keyItem] = getObj;
                                    return false;
                                }
                            });
                            $scope.produitsInTable = [];
                            $("#modal_addcourrier").modal('hide');
                        }
                        $scope.emptyForm('courrier');

                    }
                    else if (type.indexOf('role')!==-1)
                    {
                        if (!send_dataObj.id)
                        {
                            $scope.roles.push(getObj);
                        }
                        else
                        {
                            $.each($scope.roles, function (keyItem, oneItem)
                            {
                                if (oneItem.id===getObj.id)
                                {
                                    $scope.roles[keyItem] = getObj;
                                    return false;
                                }
                            });
                        }
                    }
                    else if (type.indexOf('user')!==-1)
                    {
                        if (!send_dataObj.id)
                        {
                            $scope.users.push(getObj);
                            $scope.paginationuser.totalItems++;
                            if($scope.users.length > $scope.paginationuser.entryLimit)
                            {
                                $scope.pageChanged('user');
                            }
                        }
                        else
                        {
                            location.reload();
                            $.each($scope.users, function (keyItem, oneItem)
                            {
                                if (oneItem.id===getObj.id)
                                {
                                    $scope.users[keyItem] = getObj;
                                    return false;
                                }
                            });
                        }
                    }

                    iziToast.success({
                        title: (!send_dataObj.id ? 'AJOUT' : 'MODIFICATION'),
                        message: "succès",
                        position: 'topRight'
                    });
                    if (type == "pub")
                    {
                        $("#modal_addpub").modal('hide');
                    }
                    else
                    {
                        $("#modal_addcourrierdepart").modal('hide');
                        $("#modal_addcourrier").modal('hide');
                        $scope.emptyForm('courrier')
                        $("#reference").val('')
                        $("#destinataire").val('')
                        $("#date_depart").val('')
                        $("#numero").val('')
                    }


                  

                }
                else
                {
                    iziToast.error({
                        title: "",
                        message: '<span class="h4">' + data.errors_debug + '</span>',
                        position: 'topRight'
                    });
                }
            }, function (msg)
            {
               // form.parent().parent().blockUI_stop();
                iziToast.error({
                    title: (!send_data.id ? 'AJOUT' : 'MODIFICATION'),
                    message: '<span class="h4">Erreur depuis le serveur, veuillez contactez l\'administrateur</span>',
                    position: 'topRight'
                });
                console.log('Erreur serveur ici = ' + msg);
            });
        }
        else {
          iziToast.error({
            message: "Formulaire Invalide",
            position: 'topRight'
        }); 
      }
    };

    $scope.viderTab = function () {
        $scope.dataInTableService = [];
        console.log("$scope.produitsInTable", $scope.produitsInTable);
    };

    $("#modal_addplan").on('hidden.bs.modal', ()=>{
        $scope.produitsInTable = [];
        console.log("$scope.produitsInTable", $scope.produitsInTable);
    });

  $scope.index_plan = 0;
  $scope.dataInTableService = [];
  $scope.indexService = 0;
  $scope.tableName = [];
  $scope.actionSurTab = function (action, selectedItem = null) {
    if (action == 'add') {
      
        var service_gauche = $("#select1").val();
        var service_droite = $("#select2").val();
        let service = $("#service").val();
        let g = '';
        let d = '';
        let champs = '';
        $scope.servicedroites.forEach(el => {
            if(service_droite ==  el.id) {
                console.log("les elements de droites", el.id, service_droite, el.name)
              d = el.name;
            }
        });
        $scope.servicegauches.forEach(el => {
          if(service_gauche ==  el.id) {
            console.log("les elements de gauche", el.id, service_gauche, el.name)
            g = el.name;
          }
      });
      $scope.tableName.push({
        "gauche": g,
        "droite": d,
        "champ" : service
      });
        console.log(service_gauche, "ce qui a ete selectionner")

        $scope.dataInTableService.push({
            "service_gauche": service_gauche,
            "service_droite": service_droite,
            "service": service
        });
        $("#service_input").value = service;

        $("#select1").val('');
        $("#select2").val('');
        $("#service").val('');
        console.log("le tablea =>",  $scope.dataInTableService)

    } else if (action == 'delete') {
        $.each($scope.tableName, function (keyItem, oneItem) {
          console.log(keyItem, oneItem)
            if (oneItem.id == selectedItem.id) {
                $scope.tableName.splice(keyItem, 1);
                return false;
            }
        });
        $.each($scope.dataInTableService, function (keyItem, oneItem) {
            console.log(keyItem, oneItem)
              if (oneItem.id == selectedItem.id) {
                  $scope.dataInTableService.splice(keyItem, 1);
                  return false;
              }
          });
        console.log("Un element delete =>",  $scope.dataInTableService)

    }
};
  $scope.actionSurCourrier = function(action, selectedItem = null ) {
    if(action = 'add') {
       
    }
    if( action = 'delete') {

    }
  }
    $scope.actionSurPlan = function (action, selectedItem = null) {
        if (action == 'add')
        {
            $scope.index_plan = $scope.index_plan + 1;
            //Ajouter un élément dans le tableau

           // var niveau =  $scope.index_plan;
            //var piece_plan = $("#piece_plan").val();
            var chambre_plan = $("#chambre_plan").val();
            var chambre_sdb_plan = $("#chambre_sdb_plan").val();
            var bureau_plan = $("#bureau_plan").val();
            var salon_plan = $("#salon_plan").val();
            var cuisine_plan = $("#cuisine_plan").val();
            var toillette_plan = $("#toillette_plan").val();

            console.log("ici le value de ", $("#chambre_plan").val())
            if($("#chambre_plan").val() == '' || parseInt($("#chambre_plan").val()) < 0)
            {
                iziToast.error({
                    message: "Preciser le nombre de chambres simple",
                    position: 'topRight'
                });
                return false;
            }

            if($("#chambre_sdb_plan").val() == '' || parseInt($("#chambre_sdb_plan").val()) < 0)
            {
                iziToast.error({
                    message: "Preciser le nombre de Chambre Salle de Bain",
                    position: 'topRight'
                });
                return false;
            }
            if($("#salon_plan").val() == '' || parseInt($("#salon_plan").val()) < 0)
            {
                iziToast.error({
                    message: "Preciser le nombre de salon",
                    position: 'topRight'
                });
                return false;
            }
            if($("#bureau_plan").val() == '' || parseInt($("#bureau_plan").val()) < 0)
            {
                iziToast.error({
                    message: "Preciser le nombre de bureau",
                    position: 'topRight'
                });
                return false;
            }

            if($("#cuisine_plan").val() == '' || parseInt($("#cuisine_plan").val()) < 0)
            {
                iziToast.error({
                    message: "Preciser le nombre de cuisine",
                    position: 'topRight'
                });
                return false;
            }

            if($("#toillette_plan").val() == '' || parseInt($("#toillette_plan").val()) < 0)
            {
                iziToast.error({
                    message: "Precise le nombre de Toillettes",
                    position: 'topRight'
                });
                return false;
            }

            $scope.produitsInTable.unshift({
               // "niveau": "R +" + niveau,
                "niveau":  "R +" + $scope.index_plan,
              //  "piece": piece_plan,
                "chambre": chambre_plan,
                "sdb": chambre_sdb_plan,
                "bureau": bureau_plan,
                "salon": salon_plan,
                "cuisine": cuisine_plan,
                "toillette": toillette_plan,
            });

            console.log("this.produitsInTable",$scope.produitsInTable)

            $("#niveau_plan").val('');
            // $("#piece_plan").val('');
            $("#chambre_plan").val('');
            $("#chambre_sdb_plan").val('');
            $("#salon_plan").val('');
            $("#cuisine_plan").val('');
            $("#bureau_plan").val('');
            $("#toillette_plan").val('');

        }
        else if (action == 'delete') {
            //Supprimer un élément du tableau
            $.each($scope.produitsInTable, function (keyItem, oneItem) {
                if (oneItem.id == selectedItem.id) {
                    $scope.produitsInTable.splice(keyItem, 1);
                    return false;
                }
            });
        }
        else {
            //Vider le tableau
            $scope.produitsInTable = [];
        }
    };
    // fin plan
    $scope.Ele = 0;
    $scope.actionSurProjet = function (action, selectedItem = null) {
        if (action == 'add')
        {
            //Ajouter un élément dans le tableau
            $scope.Ele = $scope.Ele + 1;
            var niveau =  $scope.Ele;
           // var piece_projet = $("#piece_projet").val();
            var chambre_projet = $("#chambre_projet").val();
            var chambre_sdb_projet = $("#chambre_sdb_projet").val();
            var bureau_projet = $("#bureau_projet").val();
            var salon_projet = $("#salon_projet").val();
            var cuisine_projet = $("#cuisine_projet").val();
            var toillette_projet = $("#toillette_projet").val();

            console.log("ici le value", $("#chambre_projet").val())

            if($("#chambre_projet").val() == '' || parseInt($("#chambre_projet").val()) < 0)
            {
                iziToast.error({
                    message: "Preciser le nombre de chambres simple",
                    position: 'topRight'
                });
                return false;
            }
            if($("#chambre_sdb_projet").val() == '' || parseInt($("#chambre_sdb_projet").val()) < 0)
            {
                iziToast.error({
                    message: "Preciserle nombre de Chambre Salle de Bain",
                    position: 'topRight'
                });
                return false;
            }
            if($("#bureau_projet").val() == '' || parseInt($("#bureau_projet").val()) < 0)
            {
                iziToast.error({
                    message: "Preciser le nombre de bureau",
                    position: 'topRight'
                });
                return false;
            }
            if($("#salon_projet").val() == '' || parseInt($("#salon_projet").val()) < 0)
            {
                iziToast.error({
                    message: "Preciser le nombre de salon",
                    position: 'topRight'
                });
                return false;
            }
            if($("#cuisine_projet").val() == '' || parseInt($("#cuisine_projet").val()) < 0)
            {
                iziToast.error({
                    message: "Preciserle nombre de cuisine",
                    position: 'topRight'
                });
                return false;
            }
            if($("#toillette_projet").val() == '' || parseInt($("#toillette_projet").val()) < 0)
            {
                iziToast.error({
                    message: "Preciser le nombre de Toillettes",
                    position: 'topRight'
                });
                return false;
            }
            else if ($scope.testSiUnElementEstDansTableau($scope.produitsInTable, niveau) == true) {
                iziToast.error({
                   message: "Le niveau est déja dans le tableau",
                     position: 'topRight'
                 });
                 return false;
             }

            $scope.produitsInTable.unshift({
                "niveau": "R +" + niveau,
             //   "piece": piece_projet,
                "chambre": chambre_projet,
                "sdb": chambre_sdb_projet,
                "bureau": bureau_projet,
                "salon": salon_projet,
                "cuisine": cuisine_projet,
                "toillette": toillette_projet,
            });

            console.log("this.produitsInTable",$scope.produitsInTable)

            $("#niveau_projet").val('');
          //  $("#piece_projet").val('');
            $("#chambre_projet").val('');
            $("#chambre_sdb_projet").val('');
            $("#salon_projet").val('');
            $("#cuisine_projet").val('');
            $("#bureau_projet").val('');
            $("#toillette_projet").val('');

        }
        else if (action == 'delete') {
            //Supprimer un élément du tableau
            $scope.Ele = $scope.Ele - 1;
            $.each($scope.produitsInTable, function (keyItem, oneItem) {
                if (oneItem.id == selectedItem.id) {
                    $scope.produitsInTable.splice(keyItem, 1);
                    return false;
                }
            });
        }
        else {
            //Vider le tableau
            $scope.produitsInTable = [];
        }
    };
    // fin projet


    $scope.estEntier = function (val, superieur = true, peutEtreEgaleAzero = false) {
        //tags: isInt, tester entier
        var retour = false;
        if (val == undefined || val == null) {
            retour = false;
        } else if (val === '') {
            retour = false;
        } else if (isNaN(val) == true) {
            retour = false;
        } else if (parseInt(val) != parseFloat(val)) {
            retour = false;
        } else {
            if (superieur == false) {
                //entier inférieur
                if (parseInt(val) < 0 && peutEtreEgaleAzero == true) {
                    //]-inf; 0]
                    retour = true;
                } else if (parseInt(val) < 0 && peutEtreEgaleAzero == false) {
                    //]-inf; 0[
                    retour = true;
                } else {
                    retour = false;
                }
            } else {
                //entier supérieur
                if (parseInt(val) > 0 && peutEtreEgaleAzero == true) {
                    //[0; +inf[
                    retour = true;
                } else if (parseInt(val) > 0 && peutEtreEgaleAzero == false) {
                    //]0; +inf[
                    retour = true;
                } else {
                    retour = false;
                }
            }
        }
        return retour;
    };
    //---FIN => Tester si la valeur est un entier ou pas---//



    $scope.activerProjet  = function()
    {
        var data = {
            'projet': $scope.idProjetUpdate,
            'montant' : $('#montant_projet').val()
        };
        console.log(data)

       /* var deferred=$q.defer();
        $.ajax
        (
            {
                url: BASE_URL + 'activer-projet/',
                type:'POST',
               // type:'GET',
                contentType:false,
                processData:false,
                DataType:'text',
                data:data,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                },
                beforeSend: function()
                {
                   // $('#modal_etatstock').blockUI_start();
                },success:function(response)
                {
                  //  $('#modal_etatstock').blockUI_stop();
                   // factory.data=response;
                    //deferred.resolve(factory.data);
                    iziToast.success({
                        title: 'VALIDATION',
                        message: "Succès",
                        position: 'topRight'
                    });
                    $scope.pageChanged('projet')
                },
                error:function (error)
                {
                    iziToast.error({
                        title: 'VALIDATION',
                        message: "Error",
                        position: 'topRight'
                    });
                 //   $('#modal_etatstock').blockUI_stop();
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);

                }
            }
        );
        return deferred.promise;*/
        $http({
            url: BASE_URL + 'activer-projet',
            method: 'POST',
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (data) {
            console.log(data)
            // $('body').blockUI_stop();
            if (data.data.errors) {
                iziToast.error({
                    title: '',
                    message: 'Erreur de validation !',
                    position: 'topRight'
                });
            }else{
                // $('body').blockUI_stop();
                iziToast.success({
                    title: '',
                  //  message: data.data.success,
                    message: 'Votre demande a bien été valide avec success',
                    position: 'topRight'
                });


                $scope.emptyForm('projet');

                $("#modal_addprojet").modal('hide');
                $scope.pageChanged('projet');

            }
        })
    };

    $scope.testSiUnElementEstDansTableau = function (tableau, idElement)
    {
        var retour = false;
        try
        {
            idElement = parseInt(idElement);
            $.each(tableau, function (keyItem, oneItem) {
                if (oneItem.id == idElement) {
                    retour = true;
                }
                return !retour;
            });
        }
        catch(error)
        {
            console.log('testSiUnElementEstDansTableau error =', error);
        }

        return retour;
    };

    $scope.addTabElements = function(e,type,from='modal')
    {
        console.log('arrive ici');
        e.preventDefault();

        var form = $('#form_addliste' + type);

        var formdata=(window.FormData) ? ( new FormData(form[0])): null;
        var send_data=(formdata!==null) ? formdata : form.serialize();

        // A ne pas supprimer
        send_dataObj = form.serializeObject();
        console.log('est tu la fichier????',send_dataObj, send_data);
        continuer = true;


        if (form.validate() && continuer)
        {
           // form.parent().parent().blockUI_start();
            Init.importerExcel(type, send_data).then(function(data)
            {
                console.log('retour', data);
               // form.parent().parent().blockUI_stop();
                if (data.data!=null && !data.errors_debug)
                {

                    iziToast.success({
                        title: (!send_dataObj.id ? 'AJOUT' : 'MODIFICATION'),
                        message: "succès",
                        position: 'topRight'
                    });
                    $("#modal_addliste" + type).modal('hide');

                    if (type.indexOf("medicament")!==-1){
                        window.location.href = '#!/list-medicament';
                        window.location.reload();
                    }
                }
                else
                {
                    iziToast.error({
                        title: "",
                        message: '<span class="h4">' + data.errors_debug + '</span>',
                        position: 'topRight'
                    });
                }
            }, function (msg)
            {
              //  form.parent().parent().blockUI_stop();
                iziToast.error({
                    title: (!send_data.id ? 'AJOUT' : 'MODIFICATION'),
                    message: '<span class="h4">Erreur depuis le serveur, veuillez contactez l\'administrateur</span>',
                    position: 'topRight'
                });
                console.log('Erreur serveur ici = ' + msg);
            });

        }
    };

    $scope.fusion = function(e,type,from='modal')
    {
        console.log('arrive ici');
        e.preventDefault();

        var form = $('#form_addfusion' + type);

        var formdata=(window.FormData) ? ( new FormData(form[0])): null;
        var send_data=(formdata!==null) ? formdata : form.serialize();

        // A ne pas supprimer
        send_dataObj = form.serializeObject();
        console.log('est tu la fichier????',send_dataObj, send_data);
        continuer = true;

        if (type.indexOf('medicament')!==-1)
        {
            send_data.append("ligne_medicaments", JSON.stringify($scope.panier));
            if ($scope.panier.length < 2)
            {
                iziToast.error({
                    title: "",
                    message: "Il faut au moins deux medicaments",
                    position: 'topRight'
                });
                continuer = false;
            }
        }

        if (form.validate() && continuer)
        {
            Init.fusionner(type, send_data).then(function(data)
            {
                console.log('retour', data);
                if (data.data!=null && !data.errors_debug)
                {

                    iziToast.success({
                        title: (!send_dataObj.id ? 'AJOUT' : 'FUSION'),
                        message: "succès",
                        position: 'topRight'
                    });
                    $("#modal_addfusion" + type).modal('hide');

                    if (type.indexOf("medicament")!==-1){
                        window.location.href = '#!/list-medicament';
                        window.location.reload();
                    }
                }
                else
                {
                    iziToast.error({
                        title: "",
                        message: '<span class="h4">' + data.errors_debug + '</span>',
                        position: 'topRight'
                    });
                }
            }, function (msg)
            {
                iziToast.error({
                    title: (!send_data.id ? 'AJOUT' : 'FUSION'),
                    message: '<span class="h4">Erreur depuis le serveur, veuillez contactez l\'administrateur</span>',
                    position: 'topRight'
                });
                console.log('Erreur serveur ici = ' + msg);
            });

        }
    };

    $scope.detailler = function(e,type,from='modal')
    {
        console.log('arrive ici');
        e.preventDefault();

        var form = $('#form_adddetailler' + type);

        var formdata=(window.FormData) ? ( new FormData(form[0])): null;
        var send_data=(formdata!==null) ? formdata : form.serialize();

        // A ne pas supprimer
        send_dataObj = form.serializeObject();
        console.log('est tu la fichier????',send_dataObj, send_data);
        continuer = true;

        if (form.validate() && continuer)
        {
          //  form.parent().parent().blockUI_start();
            Init.addDetail(type, send_data).then(function(data)
            {
                console.log('detail', data);
           //     form.parent().parent().blockUI_stop();
                if (data.data!=null && !data.errors_debug)
                {

                    iziToast.success({
                        title: (!send_dataObj.id ? 'DETAILLER' : 'DETAILLER'),
                        message: "succès",
                        position: 'topRight'
                    });
                    $("#modal_adddetailler" + type).modal('hide');

                    if (type.indexOf("medicament")!==-1){
                        window.location.href = '#!/list-medicament';
                        window.location.reload();
                    }
                }
                else
                {
                    iziToast.error({
                        title: "",
                        message: '<span class="h4">' + data.errors_debug + '</span>',
                        position: 'topRight'
                    });
                }
            }, function (msg)
            {
           //     form.parent().parent().blockUI_stop();
                iziToast.error({
                    title: (!send_data.id ? 'AJOUT' : 'FUSION'),
                    message: '<span class="h4">Erreur depuis le serveur, veuillez contactez l\'administrateur</span>',
                    position: 'topRight'
                });
                console.log('Erreur serveur ici = ' + msg);
            });

        }
    };

    $scope.redirectToAbonnement=function (){
        window.location.href = '#!/list-abonnement';
        window.location.reload();
    };

    $scope.idProjetUpdate = null;

    $scope.assistedListe = false;
    $scope.showModalUpdate=function (type,itemId, forceChangeForm=false)
    {
        reqwrite = type + "s" + "(id:"+ itemId + ")";

        Init.getElement(reqwrite, listofrequests_assoc[type + "s"]).then(function(data)
        {
            var item = data[0];
            console.log("item item", item);
            $scope.itemUpdated = data[0];
            $scope.typeUpdated = type;

            // console.log('item ', type, item);


            $scope.updatetype = type;
            $scope.updateelement = item;


            $scope.showModalAdd(type, true);

            $scope.fromUpdate = true;

            $('#id_' + type).val(item.id);

            if (type.indexOf("plan")!==-1)
            {
                $('#superficie_' + type).val(item.superficie);
                $('#longeur_' + type).val(item.longeur);
                $('#largeur_' + type).val(item.largeur);
                $('#garage_' + type).val(item.garage);
                //   $('#fichier_' + type).val(item.fichier);
                $('#unite_mesure_' + type).val(item.unite_mesure_id);
                var liste_ligneniveau = [];
                $.each(item.niveau_plans, function (keyItem, valueItem) {
                    console.log("les ligne de niveau du plan ",valueItem)
                    liste_ligneniveau.push({"id":valueItem.id, "niveau":valueItem.niveau,"sdb":valueItem.sdb, "chambre" : valueItem.chambre, "bureau" : valueItem.bureau, "salon" : valueItem.salon, "cuisine" : valueItem.cuisine, "toillette" : valueItem.toillette});
                });
                $scope.produitsInTable = [];
                $scope.produitsInTable = liste_ligneniveau;

            }
            else if(type.indexOf('courrier'!==-1 || type.indexOf('/')!==-1)) {
              $("#id").val(item.id);
              $('#objet' ).val(item.objet)
              $('#numero' ).val(item.numero)
              $('#date_arrive' ).val(item.date_arrive)
              $('#date_courrier' ).val(item.date_courrier)
              $('#expediteur' ).val(item.expediteur)
              $('#reference' ).val(item.reference)
              $('#autre_instruction').val(item.autre_instruction)
             console.log(item.type, "les donnees")
              if(item.type == 1 || item.type == '1') {
                $('#arrive').prop('checked', true);
              }
              else {
                $("#depart").prop('checked', true);
              }
              $scope.dataInTableService = [];
              $scope.tableName = [];
              var table_name = [];
               $.each(item.services, function(keyItem, valueItem) {
                $scope.dataInTableService.push(
                   {
                    "service_gauche": valueItem.service_gauche_id,
                    "service_droite": valueItem.service_droite_id,
                    "service": valueItem.service
                   }
                 )
                 console.log("Le Item Value", valueItem);
                 let data_lef = ''
                 let date_rigth = '';

                 if( valueItem.service_gauche) {
                   data_lef =  valueItem.service_gauche.name;
                 }
                 if( valueItem.service_droite) {
                  date_rigth =  valueItem.service_droite.name;
                }
                  table_name.push({
                    "gauche": data_lef,
                    "droite": date_rigth,
                    "champ" : valueItem.service
                  });
               })
             
               $scope.tableName = table_name;
               console.log("les donnes yepppppp", $scope.dataInTableService)
            }
          
           
      

        }, function (msg) {
            iziToast.error({
                message: "Erreur depuis le serveur, veuillez contactez l'administrateur",
                position: 'topRight'
            });
            console.log('Erreur serveur ici = ' + msg);
        });
    };


  




    // Permet soit d'ajouter ou de supprimer une ligne au niveau de la reservation
  

    $scope.itemChange_detailingredient = function(parent,forItem, child=0)
    {
        if (forItem.indexOf('typeingredient')!==-1)
        {
            $('[name^="typeingredient_detail"]').each(function (keyNum, valueNum) {
                var verif_occurence = 0;
                that = $(this);
                $('[name^="typeingredient_detail"]').each(function (keyNumOc, valueNumOc) {
                    if (Number($(this).val())==Number(that.val()))
                    {
                        verif_occurence++;
                    }
                    return !(verif_occurence>1);
                });
                if (verif_occurence>1)
                {
                    iziToast.error({
                        title: "",
                        message: "Vous ne pouvez pas selectionner le même type d'ingredients deux fois<br><br>",
                        position: 'topRight'
                    });
                    setTimeout(function () {
                        that.val('');
                    },500);
                }
                return !(verif_occurence>1);
            });
        }
    };


    $scope.deleteElement=function (type,itemId)
    {
        var msg = 'Voulez-vous vraiment effectué cette suppression ?';
        var title = 'SUPPRESSION';
        iziToast.question({
            timeout: 0,
            close: false,
            overlay: true,
            displayMode: 'once',
            id: 'question',
            zindex: 999,
            title: title,
            message: msg,
            position: 'center',
            buttons: [
                ['<button class="font-bold">OUI</button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                    Init.removeElement(type, itemId).then(function (data) {

                        console.log('deleted', data);
                        if (data.data && !data.errors_debug)
                        {

                            if (type.indexOf('typeclient')!==-1)
                            {
                                $.each($scope.typeclients, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.typeclients.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                            }
                            else if (type.indexOf('pub')!==-1)
                            {
                                $.each($scope.posts, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.posts.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                            }
                            else if (type.indexOf('plan')!==-1)
                            {
                                if ($scope.clientview && $scope.clientview.id)
                                {
                                    $location.path('list-client');
                                }

                                $.each($scope.plans, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.plans.splice(keyItem, 1);
                                        return false;
                                    }
                                });

                                $scope.paginationplan.totalItems--;
                                if($scope.plans.length < $scope.paginationplan.entryLimit)
                                {
                                    $scope.pageChanged('plan');
                                }
                            }
                            else if (type.indexOf('courrier')!==-1 || type.indexOf('/')!==-1)
                            {
                                $.each($scope.courriers, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.courriers.splice(keyItem, 1);
                                        return false;
                                    }
                                });

                                $scope.paginationcourrier.totalItems--;
                                if($scope.courriers.length < $scope.paginationcourrier.entryLimit)
                                {
                                    $scope.pageChanged('courriers');
                                }
                            }
                            else if (type.indexOf('client')!==-1)
                            {
                                if ($scope.clientview && $scope.clientview.id)
                                {
                                    $location.path('list-client');
                                }

                                $.each($scope.clients, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.clients.splice(keyItem, 1);
                                        return false;
                                    }
                                });

                                $scope.paginationcli.totalItems--;
                                if($scope.clients.length < $scope.paginationcli.entryLimit)
                                {
                                    $scope.pageChanged('client');
                                }
                            }
                            else if (type.indexOf('role')!==-1)
                            {
                                $.each($scope.roles, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.roles.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                            }
                            else if (type.indexOf('user')!==-1)
                            {
                                $.each($scope.users, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.users.splice(keyItem, 1);
                                        return false;
                                    }
                                });

                                $scope.paginationuser.totalItems--;
                                if($scope.users.length < $scope.paginationuser.entryLimit)
                                {
                                    $scope.pageChanged('user');
                                }
                            }

                            iziToast.success({
                                title: title,
                                message: "succès",
                                position: 'topRight'
                            });
                        }
                        else
                        {
                            iziToast.error({
                                title: title,
                                message: data.errors_debug,
                                position: 'topRight'
                            });
                        }

                    }, function (msg) {
                        iziToast.error({
                            title: title,
                            message: "Erreur depuis le serveur, veuillez contactez l'administrateur",
                            position: 'topRight'
                        });
                    });

                }, true],
                ['<button>NON</button>', function (instance, toast) {

                    instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

                }],
            ],
            onClosing: function(instance, toast, closedBy){
                console.log('Closing | closedBy: ' + closedBy);
            },
            onClosed: function(instance, toast, closedBy){
                console.log('Closed | closedBy: ' + closedBy);
            }
        });
    };

});


// Vérification de l'extension des elements uploadés
function isValide(fichier)
{
    var Allowedextensionsimg=new Array("jpg","JPG","jpeg","JPEG","gif","GIF","png","PNG");
    var Allowedextensionsvideo=new Array("mp4");
    for (var i = 0; i < Allowedextensionsimg.length; i++)
        if( ( fichier.lastIndexOf(Allowedextensionsimg[i]) ) != -1)
        {
            return 1;
        }
    for (var j = 0; j < Allowedextensionsvideo.length; j++)
        if( ( fichier.lastIndexOf(Allowedextensionsvideo[j]) ) != -1)
        {
            return 2;
        }
    return 0;
}

// FileReader pour la photo
function Chargerphoto(idform)
{
    var fichier = document.getElementById("img"+idform);
    (isValide(fichier.value)!=0) ?
        (
            fileReader=new FileReader(),
                (isValide(fichier.value)==1) ?
                    (
                        fileReader.onload = function (event) { $("#affimg"+idform).attr("src",event.target.result);},
                            fileReader.readAsDataURL(fichier.files[0]),
                            (idform=='produit') ? $("#imgproduit_recup").val("") : ""
                    ):null
        ):(
            alert("L'extension du fichier choisi ne correspond pas aux règles sur les fichiers pouvant être uploader"),
                $('#img'+idform).val(""),
                $('#affimg'+idform).attr("src",""),
                $('.input-modal').val("")
        );
}

function reCompile(element)
{
    var el = angular.element(element);
    $scope = el.scope();
    $injector = el.injector();
    $injector.invoke(function($compile)
    {
        $compile(el)($scope)
    });
    console.log('arrive dans la liaison');
}
