var app=angular.module('BackEnd',[ 'ngRoute' , 'ngSanitize' , 'ngLoadScript', 'ui.bootstrap' , 'angular.filter']);

// var BASE_URL = 'http://samakeur.sn/back/';
// en ligne
// var BASE_URL='//'+location.host+'/admin/';
var BASE_URL = 'http://localhost/samakeurback/public/';

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

$("#formulaire").submit(function(e){
   var form = $(this);
   var url = form.attr('action');
    $.ajax({
        url: BASE_URL+ 'medoc/test/',
        method: "POST",
        data:{
        date_donne:date_donne,
        },
        success: function(data)
        {
            console.log(data);
        }, error: function (data ) {
            console.log(data)
        }
    });
});
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
            getResultats:function()
            {
                var deferred=$q.defer();
                $http({
                    method: 'GET',
                    url: BASE_URL + 'getResultat'
                }).then(function successCallback(response) {
                    factory.data=response.data;
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            validateProjet:function(idPr)
            {
                var deferred=$q.defer();
                $http({
                    method: 'GET',
                    url: BASE_URL + 'payeprojet/' + idPr
                }).then(function successCallback(response) {
                    factory.data=response.data;
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
            // facturerVente:function (data) {
            //     var deferred=$q.defer();
            //     $.ajax
            //     (
            //         {
            //             url: BASE_URL + '/vente/facture',
            //             type:'POST',
            //             contentType:false,
            //             processData:false,
            //             DataType:'text',
            //             data:data,
            //             headers: {
            //                 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            //             },
            //             beforeSend: function()
            //             {
            //                 $('#modal_addfactureGeneree').blockUI_start();
            //             },success:function(response)
            //             {
            //                 $('#modal_addfactureGeneree').blockUI_stop();
            //                 factory.data=response;
            //                 deferred.resolve(factory.data);
            //             },
            //             error:function (error)
            //             {
            //                 $('#modal_addfactureGeneree').blockUI_stop();
            //                 console.log('erreur serveur', error);
            //                 deferred.reject(msg_erreur);
            //             }
            //         }
            //     );
            //     //console.log(deferred.promise);
            //     return deferred.promise;
            // },
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
            // fusionner:function (element,data) {
            //     var deferred=$q.defer();
            //     $.ajax
            //     (
            //         {
            //             url: BASE_URL + '/' + element+'/fusionner',
            //             type:'POST',
            //             contentType:false,
            //             processData:false,
            //             DataType:'text',
            //             data:data,
            //             headers: {
            //                 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            //             },
            //             beforeSend: function()
            //             {
            //                 $('#modal_addfusion'+element).blockUI_start();
            //             },success:function(response)
            //             {
            //                 $('#modal_addfusion'+element).blockUI_stop();
            //                 factory.data=response;
            //                 deferred.resolve(factory.data);
            //             },
            //             error:function (error)
            //             {
            //                 $('#modal_addfusion'+element).blockUI_stop();
            //                 console.log('erreur serveur', error);
            //                 deferred.reject(msg_erreur);
            //             }
            //         }
            //     );
            //     return deferred.promise;
            // },
            addDetail:function (element,data) {
                var deferred=$q.defer();
                $.ajax
                (
                    {
                        url: BASE_URL + '/' + element,
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
                            $('#modal_adddetailler'+element).blockUI_start();
                        },success:function(response)
                        {
                            $('#modal_adddetailler'+element).blockUI_stop();
                            factory.data=response;
                            deferred.resolve(factory.data);
                        },
                        error:function (error)
                        {
                            $('#modal_adddetailler'+element).blockUI_stop();
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
            },
            getSommeDaye:function()
            {
              $.ajax({
                url: BASE_URL+ 'vente/getSommeDay',
                method: "GET",
                success: function(data)
                {
                   $('#mnt_day').text(parseInt(data) + ' FCFA');
                }, error: function (data ) {
                    console.log(data)
                }
              });
            },
            getSommeMonth:function()
            {
                $.ajax({
                    url: BASE_URL+ 'vente/getSommeMonth',
                    method: "GET",
                    success: function(data)
                    {
                        $('#mnt_mont').text(data + ' FCFA');
                    }, error: function (data) {
                        console.log(data)
                    }
                  });
            },
            getResulta:function()
            {
                $.ajax({
                    url: BASE_URL+ 'projets/get',
                    method: "GET",
                    success: function(data)
                    {
                        $('#mnt_anne').text(data + ' FCFA');
                    }, error: function (data) {
                        console.log(data)
                    }
                  });
            },

        };
    return factory;
});


// Configuration du routage au niveau de l'app
app.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "page/dashboard",
        })
        .when("/list-client", {
            templateUrl : "page/list-client",
        })
        .when("/detail-client/:itemId", {
            templateUrl : "page/detail-client",
        })
        .when("/list-a-confirme", {
            templateUrl : "page/list-a-confirme",
        })
        .when("/list-projet", {
            templateUrl : "page/list-projet",
        })
        .when("/detail-projet/:itemId", {
            templateUrl : "page/detail-projet",
        })
        .when("/list-projet-encour", {
            templateUrl : "page/list-projet-encour",
        })
        .when("/list-plan", {
            templateUrl : "page/list-plan",
        })
        .when("/detail-plan/:itemId", {
            templateUrl : "page/detail-plan",
        })
        .when("/contact", {
            templateUrl : "page/contact",
        })
        .when("/detail-contact/:idtemId", {
            templateUrl : "page/detail-contact",
        })
        .when("/pub", {
            templateUrl : "page/pub",
        })

});



// Spécification fonctionnelle du controller
app.controller('BackEndCtl',function (Init,$location,$scope,$filter, $log,$q,$route, $routeParams,$http, $timeout)
{

    /*window.Echo.channel('chan-demo')
        .listen('ClientEvent', (e) => {
            console.log('arrive sur le client');
            iziToast.info({
                progressBar: false,
                title: "Notification",
                message: "Depuis angularjs",
                position: 'topRight'
            });
        });*/

    var listofrequests_assoc =
        {
           // unite_mesure_id,unite_mesure{id,name}
            "plans"                         : [
                                                            "id,code,piscine,garage,created_at_fr,superficie,longeur,largeur,nb_pieces,nb_salon,nb_chambre,nb_cuisine,nb_toillette,nb_etage,unite_mesure_id,unite_mesure{id,name},fichier,joineds{id,fichier,description,active}",
                                                            ",niveau_plans{id,piece,niveau,bureau,toillette,chambre,salon,cuisine},plan_projets{id,projet_id}"]
                                                            ,

            "planprojets"                   : ["id,plan_id,projet_id,etat_active,message,etat,plan{id}",""],

            "niveauplans"                   : ["id,sdb,piece,bureau,toillette,chambre,salon,cuisine,niveau",""],

            "niveauprojets"                 :  ["id,sdb,piece,bureau,toillette,chambre,salon,cuisine,niveau_name",""],

            "projets"                       :  [
                "id,adresse_terrain,name,etat,active,a_valider,psc,grg,text_projet,created_at_fr,created_at,superficie,longeur,largeur,nb_pieces,nb_salon,nb_chambre,nb_sdb,nb_cuisine,nb_toillette,nb_etage,user_id,user{name,email,nom,prenom,telephone,adresse_complet,code_postal}",
                ",niveau_projets{id,piece,bureau,toillette,chambre,sdb,niveau_name,salon,cuisine},positions{id,position,nom_position,projet_id},remarques{id,demande_text,projet_id},plan_projets{id,plan_id,plan{id,code,created_at_fr,superficie,longeur,largeur,nb_pieces,nb_salon,nb_chambre,nb_cuisine,nb_toillette,nb_etage,unite_mesure_id,unite_mesure{id,name},fichier,niveau_plans{id,piece,niveau,bureau,toillette,chambre,salon,cuisine},joineds{id,fichier,description}}}"
            ],

            "clients"                       :  ["id",""],

            "typeremarques"                 : ["id",""],

             "niveauprojets"                 : ["id,name,piece,bureau,toillette,chambre,salon,cuisine",""],

            "remarques"                     : [
            "id,demande_text,projet_id",""],

            'permissions'                   : ['id,name,display_name,guard_name', ""],

            "roles"                         : ["id,name,guard_name,permissions{id,name,display_name,guard_name}", ""],

            "users"                         : [
            "id,nci,nom,prenom,adresse_complet,pays,code_postal,is_client,telephone,name,email,active,password,image,roles{id,name,guard_name,permissions{id,name,display_name,guard_name}}", ",last_login,last_login_ip,created_at_fr"
        , ""],

            "dashboards"                    : ["projets,encours,finalise"],

            "positions" : ["id,position,nom_postion,projet_id",""],

            "joineds" : ["id,fichier,description,active",""],

            "messagesends"  : ["id,objet,message,telephone,email,nom",""],


            "posts"  : ["id,description,fichier",""],

            "chantiers" : ["id,fichier,created_at_fr,user{id,nom,prenom,email},devisefinance{id}",""]


        };

    $scope.link = BASE_URL;

    //--DEBUT => Donne la qté  par rapport à la quantité total--//
    $scope.donneClient = function () {
        var retour = 0;
        var qte = 0;
        idclient = $(".select2.search_client").val();

        if (idclient)
        {
            console.log("ID PRODUIT ==> " + idclient);
            var typeAvecS = "clients";
            var rewriteReq = typeAvecS
                + "(id:" + idclient
                + ")";
                $add_to_req =  (listofrequests_assoc[type].length > 1 && !nullableAddToReq) ? listofrequests_assoc[type][1] : null;

            Init.getElement(rewriteReq, "assurance_id,matricule,pourcentage,souscripteur,affiles{id,nomcomplet}").then(function (data) {

                if (data) {
                    items = data[0];

                    console.log(items);
                    $('#assurance_vente').val(items.assurance_id);
                    $('#matriculepatient_vente').val(items.matricule);
                    $('#tauxpriseencharge_vente').val(items.pourcentage);
                    $('#souscripteur_vente').val(items.souscripteur);
                    $scope.affiles = items.affiles
                    $('#affile_vente').val(items.affiles[0].id);
                }

            }, function (msg) {
                toastr.error(msg);
            });
        }
        return retour;
    };
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
    $scope.plans = [];
    $scope.planprojets = [];
    $scope.niveauplans = [];
    $scope.niveauprojets = [];
    $scope.projets = [];
    $scope.typeremarques = [];
    $scope.remarques = [];
    $scope.users = [];

    $scope.posts = [];
    $scope.messagesends = [];

    $scope.client_id = null;

    $scope.produitsInTable = [];


    $scope.tot_day = 0;
    $scope.tot_month = 0;
    $scope.tot_year = 0;

    // for pagination

    $scope.paginationplan = {
        currentPage: 1,
        maxSize: 10,
        entryLimit: 10,
        totalItems: 0
    };

    $scope.paginationdepense = {
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

    $scope.paginationmessagesend = {
        currentPage: 1,
        maxSize: 10,
        entryLimit: 10,
        totalItems: 0
    };
$scope.get_Somme_daye = function ()
{
    $.ajax({
        url: BASE_URL+ 'vente/getSommeDay',
        method: "GET",
        success: function(data)
        {
            console.log(data);
        }, error: function (data) {
            console.log(data)
        }
      });
};
$scope.getResultat = function()
{
    $.ajax({
        url: BASE_URL+ 'projet/gerResultat',
        method: "GET",
        success: function(data)
        {
            console.log("fini");
        }, error: function (data) {
            console.log(data)
        }
      });
};
  $scope.getCaisse = function (data)
  {
      var dta1 = data.date_donne
      console.log(dta1);
      Init.journalCaisseDate(dta1);
  };
    $scope.filtreChambreByTypeChambre = function(e, type_chambre_id)
    {
        $scope.occupationByTypeChambre = type_chambre_id;
        console.log('arrive sur le filtre', type_chambre_id);

        $scope.getelements("infoaffiliations");

        var data_id = type_chambre_id==null ? 0: type_chambre_id;
        $('.type_chambre').each(function(key, value)
        {
            $(this).removeClass('bg-dark text-white');
            if (Number($(this).attr('data-id'))== Number(data_id))
            {
                $(this).addClass('bg-dark text-white');
            }
        });

    };

    // Pour réecrire l'url pour les filtres fichiers à télécharger
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

    $scope.addNiveauPanier = function(object)
    {

        console.log("je suis la");
    };
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
            if (type.indexOf("typeclients")!==-1)
            {
                $scope.typeclients = data;
            }
            else if (type.indexOf("plans")!==-1)
            {
                $scope.plans = data;
            }
            else if (type.indexOf("planprojets")!==-1)
            {
                $scope.planprojets = data;
            }
            else if (type.indexOf("niveauplans")!==-1)
            {
                $scope.niveauplans = data;
            }
            else if (type.indexOf("niveauprojets")!==-1)
            {
                $scope.niveauprojets = data;
            }
            else if (type.indexOf("projets")!==-1)
            {
                $scope.projets = data;
            }
            else if (type.indexOf("typeremarques")!==-1)
            {
                $scope.typeremarques = data;
            }
            else if (type.indexOf("remarques")!==-1)
            {
                $scope.remarques = data;
            }
            else if (type.indexOf("permissions")!==-1)
            {
                $scope.permissions = data;
            }
            else if (type.indexOf("roles")!==-1)
            {
                if (forModal)
                {
                    $scope.roles_modal = data;
                }
                else
                {
                    $scope.roles = data;
                }
            }
            else if (type.indexOf("users")!==-1)
            {
                $scope.users = data;
            }
            else if (type.indexOf("messagesends")!==-1)
            {
                $scope.messagesends = data;
            }
            else if (type.indexOf("posts")!==-1)
            {
                $scope.posts = data;
            }
            else if (type.indexOf("dashboards")!==-1)
            {

                console.log('infos du dashboards');
                data = $scope.getResultat();
                console.log(data);

            }
            else if (type.indexOf("detailsinventaires")!==-1)
            {
                $scope.detailsinventaires = data;
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
    $scope.searchtexte_client = "";
    $scope.pageChanged = function(currentpage)
    {

        if ( currentpage.indexOf('plan')!==-1 )
        {
            rewriteelement = 'planspaginated(page:'+ $scope.paginationplan.currentPage +',count:'+ $scope.paginationplan.entryLimit
                + ($scope.planview ? ',plan_id:' + $scope.planview.id : "" )
              //  + ($('#plan_piece').val() ? ',nb_piece:' + $('#plan_piece').val() : "" )
                + ($('#client_plan_filtre').val() ? ',user:' + '"' + $('#client_plan_filtre').val() + '"' : "")
                + ($('#date_plan_filtre').val() ? ',date:' + $('#date_plan_filtre').val() : "" )
                + ($('#code_plan_filtre').val() ? ',code:' + $('#code_plan_filtre').val() : "" )
                + ($('#superficie_plan_filtre').val() ? ',superficie:' + $('#superficie_plan_filtre').val() : "" )
                + ($('#chambre_plan_filtre').val() ? ',nb_chambre:' + $('#chambre_plan_filtre').val() : "" )
                + ($('#longeur_plan_filtre').val() ? ',longeur:' + $('#longeur_plan_filtre').val() : "" )
                + ($('#largeur_plan_filtre').val() ? ',largeur:' + $('#largeur_plan_filtre').val() : "" )
                + ($('#salon_plan_filtre').val() ? ',nb_salon:' + $('#salon_plan_filtre').val() : "" )
                + ($('#toillette_plan_filtre').val() ? ',nb_toillette:' + $('#toillette_plan_filtre').val() : "" )
                + ($('#cuisine_plan_filtre').val() ? ',nb_cuisine:' + $('#cuisine_plan_filtre').val() : "" )
                +')';
            $scope.requetePlan = ""

            // blockUI_start_all('#section_listeclients');

            Init.getElementPaginated(rewriteelement, listofrequests_assoc["plans"]).then(function (data)
            {
                // blockUI_stop_all('#section_listeclients');
                console.log(data, "je suis la");
                // pagination controls
                $scope.paginationplan = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationplan.entryLimit,
                    totalItems: data.metadata.total
                };
                // $scope.noOfPages_produit = data.metadata.last_page;
                $scope.plans = data.data;
            },function (msg)
            {
                // blockUI_stop_all('#section_listeclients');
                toastr.error(msg);
            });
        }
        else if(currentpage.indexOf('messagesends')!==-1)
        {

            rewriteelement = 'messagesendspaginated(page:'+ $scope.paginationmessagesend.currentPage +',count:'+ $scope.paginationmessagesend.entryLimit

                + ($('#searchtexte_client').val() ? (',' + $('#searchoption_client').val() + ':"' + $('#searchtexte_client').val() + '"') : "" )
                + ($('#typeclient_listclient').val() ? ',type_client_id:' + $('#typeclient_listclient').val() : "" )
                + ($('#zone_listclient').val() ? ',zone_livraison_id:' + $('#zone_listclient').val() : "" )
                +')';

                Init.getElementPaginated(rewriteelement, listofrequests_assoc["messagesends"]).then(function (data)
                {
                    // blockUI_stop_all('#section_listeclients');
                    console.log(data);
                    // pagination controls
                    $scope.paginationmessagesend = {
                        currentPage: data.metadata.current_page,
                        maxSize: 10,
                        entryLimit: $scope.paginationmessagesend.entryLimit,
                        totalItems: data.metadata.total
                    };

                    $scope.messagesends = data.data;
                },function (msg)
                {

                    toastr.error(msg);
                });
        }
        else if ( currentpage.indexOf('client')!==-1 )
        {
            rewriteelement = 'userspaginated(page:'+ $scope.paginationuser.currentPage +',count:'+ $scope.paginationuser.entryLimit

                + ($('#searchtexte_client').val() ? (',' + $('#searchoption_client').val() + ':"' + $('#searchtexte_client').val() + '"') : "" )
                + ($('#typeclient_listclient').val() ? ',type_client_id:' + $('#typeclient_listclient').val() : "" )
                + ($('#zone_listclient').val() ? ',zone_livraison_id:' + $('#zone_listclient').val() : "" )
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
        else if ( currentpage.indexOf('projet')!==-1 )
        {
            console.log("icic search $('#searchoption_projet').val() => ", $('#searchoption_projet').val())
            rewriteelement = 'projetspaginated(page:'+ $scope.paginationprojet.currentPage +',count:'+ $scope.paginationprojet.entryLimit
            + ($scope.projetview ? ',projet_id:' + $scope.projetview.id : "" )
          //  + ($scope.planview ? ',plan_id:' + $scope.planview.id : "" )
            + ($scope.clientview ? ',user_id:' + $scope.clientview.id : "" )
           // + ($scope.client_id != 0 ? (',' + 'user_id:' + $scope.client_id + '') : "")
            + ($scope.radioBtnComposition ? ',etat:' + $scope.radioBtnComposition : "")
            + ($('#searchtexte_projet').val() ? (',' + $('#searchoption_projet').val() + ':"' + $('#searchtexte_projet').val() + '"') : "" )
            + ($('#projet_user').val() ? ',user_id:' + $('#projet_user').val() : "" )
            + ($('#created_at_start_listprojet').val() ? ',created_at_start:' + '"' + $('#created_at_start_listprojet').val() + '"' : "" )
            + ($('#created_at_end_listprojet').val() ? ',created_at_end:' + '"' + $('#created_at_end_listprojet').val() + '"' : "" )
            + ($scope.onlyEnCours ? ',tout:true' : "" )
                +')';
            Init.getElementPaginated(rewriteelement, listofrequests_assoc["projets"][0]).then(function (data)
            {
                $scope.paginationprojet = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationprojet.entryLimit,
                    totalItems: data.metadata.total
                };

                $scope.projets = data.data;
            },function (msg)
            {

                toastr.error(msg);
            });
        }
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

   $scope.elementsProjets = [];

   $scope.elementProjets = [];
    $scope.getElementsProjets = function(idUser)
    {
        console.log("get eleme")
        $.ajax({
            url: BASE_URL+ 'getelementsByUser/' + idUser,
            method: "GET",
            success: function(data)
            {
               $scope.elementProjets = data;
               console.log("Les elements recuperes",$scope.elementProjets)
            }, error: function (data) {
                console.log(data)
            }
          });
    }

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
        $scope.projetview = null;


        $scope.pageUpload = false;
        $scope.pageDashboard = false;
        $scope.pageCurrent = null;
        $scope.clientview = null;
        $scope.userview = null;
      $scope.messagesendview = null;


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


        $scope.linknav = $location.path();
        $scope.getelements("roles");
        $scope.getelements("permissions");
        //console.log("angular je suis la ",(angular.lowercase(current.templateUrl)));

         if(angular.lowercase(current.templateUrl).indexOf('plan')!==-1)
         {
               // $scope.pageChanged("plan");
                console.log("angular je suis la ",(angular.lowercase(current.templateUrl)));

               $scope.planview = null;
               if(current.params.itemId)
               {
                   var idElmtplan = current.params.itemId;
                  /* setTimeout(function ()
                   {
                       Init.getStatElement('plan', idElmtplan);
                   },1000);*/


                   $scope.pageChanged('projet');

                   var req = "plans";
                   $scope.planview = {};
                   rewriteReq = req + "(id:" + current.params.itemId + ")";
                   Init.getElement(rewriteReq, listofrequests_assoc[req]).then(function (data)
                   {
                       $scope.planview = data[0];
                      $scope.getelements('users');
                       $scope.pageChanged('projet');
                       $scope.getelements('joineds');

                       console.log("$scope.planview 1 =>",$scope.planview)
                   },function (msg)
                   {
                       toastr.error(msg);
                   });
               }
               else
               {
                   $scope.pageChanged('plan');
               }
         }
         else if(angular.lowercase(current.templateUrl).indexOf('list-a-confirme')!==-1)
         {
             $scope.pageChanged('user');
         }
         else if(angular.lowercase(current.templateUrl).indexOf('contact')!==-1)
         {
           //console.log("angular je suis la ",(angular.lowercase(current.templateUrl)));
           $scope.messagesendview = null;
           if(current.params.itemId)
           {
               var req = "messagesends";
               $scope.messagesendview = {};
               rewriteReq = req + "(id:" + current.params.itemId + ")";
               Init.getElement(rewriteReq, listofrequests_assoc[req]).then(function (data)
               {
                   $scope.messagesendview = data[0];
                   console.log("$scope.messagesendview 1 =>",$scope.messagesendview)
               },function (msg)
               {
                   toastr.error(msg);
               });
           }
           else {
              $scope.pageChanged('messagesends');
           }

         }
         else if(angular.lowercase(current.templateUrl).indexOf('pub')!==-1)
         {
             $scope.getelements('posts');
         }
         else if(angular.lowercase(current.templateUrl).indexOf('list-projet')!==-1)
         {
             $scope.pageChanged('projet');
             $scope.getelements('remarques');
             $scope.pageChanged('user');
         }
         else if(angular.lowercase(current.templateUrl).indexOf('projet')!==-1)
         {
            $scope.projetview = null;
               if(current.params.itemId)
               {
                  /* var idElmtprojet = current.params.itemId;
                   setTimeout(function ()
                   {
                       Init.getStatElement('projet', idElmtprojet);
                   },1000);*/
                  // $scope.getelements('projets');
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
            $scope.pageChanged('projet');
            $scope.mydata = [];
              $http({
                method: 'GET',
                url: BASE_URL + 'getResultat'
            }).then(function successCallback(response) {
                console.log("je suis la factory",response.data)
                data = response.data;
                document.getElementById("encour").innerHTML = data[0].encours;
                document.getElementById("total").innerHTML = data[0].total;
                 document.getElementById("en_attente").innerHTML = data[0].en_attente;
                document.getElementById("final").innerHTML = data[0].finalise;
            }, function errorCallback(error) {
                console.log('erreur serveur', error);
                deferred.reject(msg_erreur);
            });
            // console.log(, mydata);

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
        // else if(angular.lowercase(current.templateUrl).indexOf('list-profil')!==-1)
        // {
        //     $scope.getelements('permissions');
        //     $scope.getelements('roles');
        //     //$scope.pageChanged('role');
        // }
        // else if(angular.lowercase(current.templateUrl).indexOf('user')!==-1)
        // {
        //     $scope.userview = null;
        //     if(current.params.itemId)
        //     {
        //         var req = "users";
        //         $scope.userview = {};
        //         rewriteReq = req + "(id:" + current.params.itemId + ")";
        //         Init.getElement(rewriteReq, listofrequests_assoc[req]).then(function (data)
        //         {
        //             $scope.userview = data[0];
        //             changeStatusForm('detailuser',true);

        //             console.log($scope.userview );
        //             console.log('userId', current.params.itemId);

        //             $scope.pageChanged('users');
        //         },function (msg)
        //         {
        //             toastr.error(msg);
        //         });
        //     }
        //     else
        //     {
        //         $scope.getelements('roles');
        //
        //     }
         //}
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
    $scope.checkAllOruncheckAll = function ()
    {
        var cocherOuNon = $scope.cocherTout;
        if (cocherOuNon == true)
        {
            //Tout doit etre coché
            $("#labelCocherTout").html('Tout décocher');
        }
        else
        {
            //Tout doit etre décoché
            $("#labelCocherTout").html('Tout cocher');
        }
        $('.mycheckbox').prop('checked', cocherOuNon);
        $scope.addToRole();
        console.log("Je suis dans check all ===>" + cocherOuNon);
    };

    // to randomly generate the password
    $scope.genererPasse = function(type)
    {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            passe = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            passe += charset.charAt(Math.floor(Math.random() * n));
        }
        console.log('random password', passe);
        $('#password_' + type).val(passe);
        $('#confirmpassword_' + type).val(passe);
    };


    $scope.eraseFile = function (idInput)
    {
        $('#' + idInput).val("");
        $('#erase_'+ idInput).val("yes");
        $('#aff' + idInput).attr('src',imgupload);
    };

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
    function changeStatusForm(type, status, disabled=false)
    {
        var doIt = false;
        // Pour mettre tous les chamnps en lecture seule
        $("input[id$=_" + type + "], textarea[id$=_" + type + "], select[id$=_" + type + "], button[id$=_" + type + "]").each(function ()
        {
            doIt = ($(this).attr('id').indexOf('detailnumCH')===-1);
            if (doIt)
            {
                console.log($(this).hasClass('btn'));

                $(this).attr($(this).hasClass('btn') || disabled ? 'disabled' : 'readonly', status);

                if ($scope.reservationview && $(this).hasClass('staydisabled'))
                {
                    $(this).attr('readonly', true);
                }

            }
            else
            {
                if (type.indexOf('paiement')!==-1)
                {
                    $(this).attr($(this).hasClass('btn') || disabled ? 'disabled' : 'readonly', !$scope.reservationview.can_updated_numch);
                }
                else
                {
                    $(this).attr('readonly', !$scope.reservationview.can_updated_numch);
                }
            }
        });
    }


    $scope.localize_panier = null;

    //voir un détail de médicament

    $scope.detail = {'id':'', 'designation':'', 'prixP':'','stock':''};
    $scope.voirDetail = function (medicamentdetaille) {
        console.log('detail', medicamentdetaille);

        $scope.detail.id = medicamentdetaille.id;
        $scope.detail.designation = medicamentdetaille.designation;
        $scope.detail.prixP = medicamentdetaille.prix_public;
        $scope.detail.stock = medicamentdetaille.current_quantity;

        $("#modal_addvoirDetailProduit").modal('show');
    };

    // Permet d'afficher le formulaire
    $scope.showModalAdd = function (type, fromUpdate=false, assistedListe=false, ObjPassed = null)
    {
        // $scope.panier = [];
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


    $scope.reInitAtForLigne = function(type="appro")
    {
        if (type.indexOf('inventaire')!==-1)
        {
            setTimeout(function ()
            {
                // Pour désactiver tous les events sur le select
                //$(".select2.produit_appro").off('change');

                $(".select2.produit_inventaire").on("change", function (e)
                {
                    var produit_id = $(this).val();
                    var position = $(this).attr('data-ligne');

                    var doChange = true;
                    if ($scope.ligne_inventaires[position].medicament_id!=null && $scope.ligne_inventaires[position].medicament_id==produit_id)
                    {
                        doChange = false;
                    }
                    $scope.ligne_inventaires[position].medicament_id = produit_id;
                    var found = false;
                    $.each($scope.medicaments, function (keyItem, valueItem)
                    {
                        if (valueItem.id==produit_id)
                        {
                            if (doChange)
                            {
                                $scope.ligne_inventaires[position].qte_app = valueItem.current_quantity;
                            }
                            found = true;
                        }
                        return !found;
                    });
                    $scope.$apply();

                    console.log('ligne_inventaires', $scope.ligne_inventaires);
                });

            }, 500);
        }
        else if (type.indexOf('regularisation')!==-1)
        {
            setTimeout(function ()
            {
                console.log("dans la regularisation");
                $(".select2.ligneinventaire_regularisation").on("change", function (e)
                {
                    console.log('ligneinventaire click detecté');
                    var item_id = $(this).val();
                    var data_ligne = $(this).attr('data-ligne');
                    $scope.ligne_regularisations[data_ligne].ligne_inventaire_id = item_id;

                    var found = false;
                    $.each($scope.ligneinventaires, function (keyItem, valueItem)
                    {
                        if (valueItem.id==item_id)
                        {
                            $scope.ligne_regularisations[data_ligne].actual_quantity = valueItem.actual_quantity;
                            $scope.ligne_regularisations[data_ligne].current_quantity = valueItem.current_quantity;
                            found = true;
                        }
                        return !found;
                    });

                    $scope.$apply();

                    console.log('$scope.ligne_regularisations', $scope.ligne_regularisations);
                });
            }, 500);
        }


    };

    $scope.chstat = {'id':'', 'statut':'', 'type':'', 'title':''};

    // $scope.showModalStatut = function(event,type, statut, obj= null, title = null)
    // {
    //     var id = 0;
    //     id = obj.id;
    //     $scope.chstat.id             = id;
    //     $scope.chstat.statut         = statut;
    //     $scope.chstat.type           = type;
    //     $scope.chstat.title          = title;
    //     emptyform('chstat');
    //     $("#modal_addchstat").modal('show');
    // };

    $scope.showModalStatut = function(event,type, statut, obj= null, title = null)
    {
        console.log(obj);
        var id = 0;
        id = obj.id;
        $scope.chstat.id = id;
        $scope.chstat.statut = statut;
        $scope.chstat.type = type;
        $scope.chstat.title = title;
        $scope.emptyForm('chstat');
        $("#modal_changeStattus").modal('show');
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
        // var id = 0;
        // id = obj.id;
        // $scope.chstat.id = id;
        // $scope.chstat.statut = statut;
        // $scope.chstat.type = type;
        $scope.chstat.title = title;

        $scope.emptyForm('chstat');
        $("#modal_addchstat").modal('show');
    };


    //TODO: définir l\'etat d'une reservation
    // implémenter toutes les variations du formulaire

    $scope.changeStatut = function(e, type)
    {
        alert("nieuwal fii");
        var form = $('#form_addchstat');

        var send_data = {id: $scope.chstat.id, etat:$scope.chstat.statut};
        console.log("dadtdtadta ici", send_data)
       // form.parent().parent().blockUI_start();
        Init.changeStatut(type, send_data).then(function(data)
        {
         //   form.parent().parent().blockUI_stop();
            if (data.data!=null && !data.errors_debug)
            {
                if (type.indexOf('user')!==-1)
                {
                    var found = false;
                    $.each($scope.users, function (keyItem, valueItem)
                    {
                        if (valueItem.id==send_data.id)
                        {
                            $scope.users[keyItem].active = $scope.chstat.statut==0 ? false : true;
                            found = true;
                        }
                        return !found;
                    });
                }
                if (type.indexOf('retour')!==-1)
                {
                    var found = false;
                    $.each($scope.retours, function (keyItem, valueItem)
                    {
                        if (valueItem.id==send_data.id)
                        {
                            $scope.retours[keyItem].status = $scope.chstat.statut==0 ? false : true;
                            found = true;
                        }
                        return !found;
                    });
                }

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



    $scope.donneesReservation = {'message':'', 'clientId':null, 'planningId':'', 'type':''};

    // automatically open the ticket page
    $scope.openTicket = function(idItem)
    {
        var urlTicket = BASE_URL+ '/vente-ticket/'+idItem+'';
        var ticket = window.open(urlTicket, '_blank');
        ticket.focus();
    };

    $scope.electricite = 0;
    $scope.acces_voirie = 0;
    $scope.assainissement = 0;
    $scope.geometre = 0;
    $scope.courant_faible = 0;
    $scope.eaux_pluviable = 0;
    $scope.bornes_visible = 0;
    $scope.necessite_bornage = 0;

    $scope.positions = []

    $scope.actionSurPosition = function () {

        $scope.positions = [
            {position : 'Nord',ref:  parseInt($('#choix_nord_projet').val())},
            {position : 'Sud',ref: parseInt($('#choix_sud_projet').val())},
            {position : 'Ouest',ref: parseInt($('#choix_ouest_projet').val())},
            {position : 'Est',ref: parseInt($('#choix_est_projet').val())},
        ];

        console.log("ici le tabs positions", $scope.positions)

    }

    // Add element in database and in scope
    $scope.addElement = function(e,type,from='modal')
    {

        console.log('arrive ici');
        e.preventDefault();

        var form = $('#form_add' + type);

        var formdata=(window.FormData) ? ( new FormData(form[0])): null;
        var send_data=(formdata!==null) ? formdata : form.serialize();
        //console.log($scope.panierAffile, "je sui pas la mais la");

        // A ne pas supprimer
        send_dataObj = form.serializeObject();
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
        else if (type == 'ticket' || type == 'tickets') {
            if ($scope.produitsInTable.length > 0) {
                send_data.append('tab_plan', JSON.stringify($scope.produitsInTable));
                continuer = true;
            } else {
                iziToast.error({
                    message: "Veuillez ajouter au moins un niveau dans le tableau",
                    position: 'topRight'
                });
                continuer = false;
            }
        }
        else if (type == 'lier_plan' || type == 'lierplan') {
            console.log("bonjour $scope.planview", $scope.planview)
           // send_data.append('projet_id', JSON.stringify($scope.projet_id));
            send_data.append('plan_id', $scope.planview.id);
            continuer = true;
            iziToast.success({
                message: "Liaison bien effectué",
                position: 'topRight'
            });
            $("#modal_addlier_plan").modal('hide');
            setTimeout(function () {
            //    $scope.pageChanged("plan");
            },1500);
        }
        else if (type == 'joined' || type == 'joined') {
            console.log("bonjour $scope.planview",parseInt($scope.planview.id))
            send_data.append('plan', JSON.stringify(parseInt($scope.planview.id)));
           // send_data.append('projet_id', JSON.stringify($scope.projet_id));
            continuer = true;
            $("#modal_addjoined").modal('hide');
            setTimeout(function () {
                $scope.pageChanged("plan");
            },1500);
        }
        else if (type == 'projet' || type == 'projets') {


            if ($scope.produitsInTable.length > 0) {

                if($('#electricte_projet').prop('checked') == true){
                    $scope.electricite = 1;
                }
                else
                {
                    $scope.electricite = 0;
                }
                if($('#accesvoirie_projet').prop('checked') == true){
                    $scope.acces_voirie = 1;
                }
                else
                {
                    $scope.acces_voirie = 0;
                }
                if($('#ass_projet').prop('checked') == true){
                    $scope.assainissement = 1;
                }
                else
                {
                    $scope.assainissement = 0;
                }
                if($('#cadastre_projet').prop('checked') == true){
                    $scope.geometre = 1;
                }
                else
                {
                    $scope.geometre = 0;
                }
                if($('#courant_faible_projet').prop('checked') == true){
                    $scope.courant_faible = 1;
                }
                else
                {
                    $scope.courant_faible = 0;
                }
                if($('#eaux_pluviable_projet').prop('checked') == true){
                    $scope.eaux_pluviable = 1;
                }
                else
                {
                    $scope.eaux_pluviable = 0;
                }
                if($('#bornes_visible_projet').prop('checked') == true){
                    $scope.bornes_visible = 1;
                }
                else
                {
                    $scope.bornes_visible = 0;
                }
                if($('#necessite_bornage_projet').prop('checked') == true){
                    $scope.necessite_bornage = 1;
                }
                else
                {
                    $scope.necessite_bornage = 0;
                }

                console.log("ici les senddatas ",$scope.positions, JSON.stringify($scope.positions))

                send_data.append('positions', JSON.stringify($scope.positions));
                send_data.append('tab_projet', JSON.stringify($scope.produitsInTable));
                //send_data.append('positions', [{position : 'Nord',ref:  parseInt($('#choix_nord_projet').val())}, {position : 'Sud',ref: parseInt($('#choix_sud_projet').val())}, {position : 'Ouest',ref: parseInt($('#choix_ouest_projet').val())}, {position : 'Est',ref: parseInt($('#choix_ouest_projet').val())}]);
                send_data.append('electricite', $scope.electricite);
                send_data.append('acces_voirie', $scope.acces_voirie);
                send_data.append('assainissement', $scope.assainissement);
                send_data.append('geometre', $scope.geometre);
                send_data.append('courant_faible', $scope.courant_faible);
                send_data.append('eaux_pluviable', $scope.eaux_pluviable);
                send_data.append('bornes_visible', $scope.bornes_visible);
                send_data.append('necessite_bornage', $scope.necessite_bornage);
                continuer = true;
            } else {
                iziToast.error({
                    message: "Veuillez ajouter au moins un niveau dans le tableau",
                    position: 'topRight'
                });
                continuer = false;
            }
        }

        // if (form.validate() && continuer)
        // {

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
                    else if (type.indexOf('plan')!==-1)
                    {

                       // getObj = data['data'][type + 's'][0];
                        if (!send_dataObj.id)
                        {
                            $scope.plans.push(getObj);
                            $scope.pageChanged('plan');
                            $scope.produitsInTable = [];
                        }
                        else
                        {
                            $scope.pageChanged("plan");
                            $.each($scope.plans, function (keyItem, oneItem)
                            {
                                if (oneItem.id===getObj.id)
                                {
                                    $scope.plans[keyItem] = getObj;
                                    return false;
                                }
                            });
                            $scope.produitsInTable = [];
                        }

                    }
                    else if (type.indexOf('projet')!==-1)
                    {

                        if (!send_dataObj.id)
                        {
                            $scope.projets.push(getObj);
                            $scope.pageChanged('projet');
                            $scope.produitsInTable = [];
                            $("#modal_adddemande").modal('hide');
                        }
                        else
                        {
                            $scope.pageChanged("projet");
                            $.each($scope.projets, function (keyItem, oneItem)
                            {
                                if (oneItem.id===getObj.id)
                                {
                                    $scope.projets[keyItem] = getObj;
                                    return false;
                                }
                            });
                            $scope.produitsInTable = [];
                            $("#modal_adddemande").modal('hide');
                        }

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
                        $("#modal_add" + type).modal('hide');
                    }


                    // Dans tous les cas, on réinitiliase
                    $scope.localize_panier = null;

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
      //  }
    };

    $scope.viderTab = function () {
        $scope.produitsInTable = [];
        console.log("$scope.produitsInTable", $scope.produitsInTable);
    };

    $("#modal_addplan").on('hidden.bs.modal', ()=>{
        console.log('hide hide')
        $scope.produitsInTable = [];
        console.log("$scope.produitsInTable", $scope.produitsInTable);
    });
$scope.index_plan = 0;
$scope.index_niveau = "";
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

               if($scope.produitsInTable.length > 1)
               {
                $scope.index_niveau = "R +"+$scope.index_plan
               }
               else if($scope.produitsInTable.length === 0 || $scope.produitsInTable.length === 1)
               {
                $scope.index_niveau = "Rez de chaussez"
               }
            $scope.produitsInTable.unshift({
                "niveau":   $scope.index_niveau,
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
    $scope.index_niveau = "";
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

             if($scope.produitsInTable.length > 1)
             {
              $scope.index_niveau = "R +"+$scope.Ele
             }
             else if($scope.produitsInTable.length === 0 || $scope.produitsInTable.length === 1)
             {
              $scope.index_niveau = "Rez de chaussez"
             }

            $scope.produitsInTable.unshift({
                "niveau":$scope.index_niveau,
                "chambre": chambre_projet,
                "sdb": chambre_sdb_projet,
                "bureau": bureau_projet,
                "salon": salon_projet,
                "cuisine": cuisine_projet,
                "toillette": toillette_projet,
            });

            console.log("this.produitsInTable",$scope.produitsInTable)

            $("#niveau_projet").val('');
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
    $scope.projet_a_Valide = {'id':'', 'title':''};
    $scope.showModalValidated = function(event, idPrj,title = null)
    {
        $scope.projet_a_Valide.id = idPrj;
        $scope.projet_a_Valide.title = title;
        $scope.emptyForm('projte_a_valider');
        $("#modal_projet_valider").modal('show');
    };
    $scope.projet_a_Valide = function (e, idItem)
    {
        var form = $('#modal_projet_valider');
        var send_data = {'id':idItem};
        console.log("Ok les donnees" , send_data);

                $http({
                    method: 'GET',
                    url: BASE_URL + 'payeprojet/' + idItem,
                    headers: {
                        'Content-Type': 'application/json'
                    },

                }).then(function successCallback(response) {
                    iziToast.success({
                        title: ('PROJET VALIDER'),
                        message: "succès",
                        position: 'topRight'
                    });
                    $("#modal_projet_valider").modal('hide');
                }, function errorCallback(error) {
                    iziToast.error({
                        title: "",
                        message: '<span class="h4">' + error + '</span>',
                        position: 'topRight'
                    });
                });
    }
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

            $scope.testModal = function(id)
            {
                console.log("id : ", id);
            }
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
            else if (type.indexOf("projet")!==1)
            {
                $scope.idProjetUpdate = itemId;
                $('#superficie_' + type).val(item.superficie);
                $('#longeur_' + type).val(item.longeur);
                $('#largeur_' + type).val(item.largeur);
                $('#garage_' + type).val(item.garage);
                $('#adresse_terrain_' + type).val(item.adresse_terrain);
                $('#description_' + type).val(item.text_projet);

                var liste_ligneniveau = [];
                $.each(item.niveau_projets, function (keyItem, valueItem) {
                    console.log("le projet en question",valueItem)
                    liste_ligneniveau.push({"id":valueItem.id, "niveau":valueItem.niveau_name,"piece":valueItem.piece,"sdb": valueItem.sdb, "chambre" : valueItem.chambre, "bureau" : valueItem.bureau, "salon" : valueItem.salon, "cuisine" : valueItem.cuisine, "toillette" : valueItem.toillette});
                });
                $scope.produitsInTable = [];
                $scope.produitsInTable = liste_ligneniveau;
            }
            else if (type.indexOf("client")!==-1)
            {
                $('#nomcomplet_' + type).val(item.nomcomplet);
                $('#matricule_' + type).val(item.matricule);
                $('#telephone_' + type).val(item.telephone);
                $('#type_client_' + type).val(item.type_client.id);
                $('#zone_livraison_' + type).val(item.zone_livraison_id);
                $('#email_' + type).val(item.email);
                $('#adresse_' + type).val(item.adresse);
                $('#pourcentage_' + type).val(item.pourcentage);
                $('#assurance_' + type).val(item.assurance_id);
                $('#souscripteur_' + type).val(item.souscripteur);

                var liste_affile = [];
                $.each(item.affiles, function (keyItem, valueItem) {
                    liste_affile.push({"id":valueItem.id,"nomcomplet":valueItem.nomcomplet});
                });
                console.log(liste_affile)
                $scope.panierAffile = [];
                $scope.panierAffile = liste_affile;
            }
            else if (type.indexOf("role")!==-1)
            {
                $('#name_' + type).val(item.name);
                $scope.roleview = item;

                $scope.role_permissions = [];
                $.each($scope.roleview.permissions, function (key, value) {
                    $scope.role_permissions.push(value.id);
                });
                console.log('lancer', $scope.role_permissions);
            }
            else if (type.indexOf("user")!==-1)
            {
                $('#name_' + type).val(item.name);
                $('#role_' + type).val(item.roles[0].id).attr('disabled', forceChangeForm);
                $('#email_' + type).val(item.email).attr('readonly', forceChangeForm);
                $('#password_' + type).val("");
                $('#confirmpassword_' + type).val("");
                $('#img' + type)
                    .val("")
                    .attr('required',false).removeClass('required');
                $('#affimg' + type).attr('src',(item.image ? item.image : imgupload));
                $scope.userview = item;
            }

        }, function (msg) {
            iziToast.error({
                message: "Erreur depuis le serveur, veuillez contactez l'administrateur",
                position: 'topRight'
            });
            console.log('Erreur serveur ici = ' + msg);
        });
    };


    $scope.showModalClonage=function (type,itemId)
    {
        reqwrite = type + "s" + "(id:"+ itemId + ")";

        Init.getElement(reqwrite, listofrequests_assoc[type + "s"]).then(function(data)
        {
            var item = data[0];

            console.log('item ', type, item);

            $scope.updatetype = type;
            $scope.updateelement = item;

            $scope.showModalAdd(type);

            // Pour le clonage, on vide l'id pour permettre l'insertion
            //$('#id_' + type).val(item.id);
            if (type.indexOf("menu")!==-1)
            {
                $('#libelle_' + type).val(item.libelle);
                $('#dateprevue_' + type).val(item.date_prevue);
                $('#tempsjournee_' + type).val(item.temps_journee.id);
                $scope.menuview = item;

                $scope.menu_consommations = [];
                $.each($scope.menuview.menu_consommations, function (key, value) {
                    $scope.menu_consommations.push(value.consommation_id);
                });
                console.log('lancer', $scope.menu_consommations);
            }

        }, function (msg) {
            iziToast.error({
                message: "Erreur depuis le serveur, veuillez contactez l'administrateur",
                position: 'topRight'
            });
            console.log('Erreur serveur ici = ' + msg);
        });
    };


    // Permet de vérifier si un id est dans un tableau
    $scope.isInArrayData = function(e,idItem,data, typeItem="menu") {
        response = false;
        $.each(data, function (key, value) {
            if (typeItem.indexOf('menu')!==-1)
            {
                if (value.consommation_id == idItem)
                {
                    response = true;
                }
            }
            else if (typeItem.indexOf('role')!==-1)
            {
                if (value.id == idItem)
                {
                    response = true ;
                }
            }
            //return response;
        });
        //console.log('ici', response);

        return response;
    };
    $scope.addInCommande = function(event, from='plan', item, action=1)
    {
        console.log('from', from);
        var add = true;
        $.each($scope.panier, function (key, value)
        {
            console.log('ici panier', from);
            if (Number(value.produit_id) === Number(item.id))
            {
                console.log('value', value);
                if (action==0)
                {
                    $scope.panier.splice(key,1);
                }
                else
                {
                    if (from.indexOf('commande')!==-1)
                    {
                        $scope.panier[key].qte_commande+=action;
                        if ($scope.panier[key].qte_commande===0)
                        {
                            $scope.panier.splice(key,1);
                        }
                    }
                    else if (from.indexOf('menu')!==-1)
                    {
                        $scope.panier[key].qte_produit+=action;
                        if ($scope.panier[key].qte_produit===0)
                        {
                            $scope.panier.splice(key,1);
                        }
                    }
                    else if (from.indexOf('plan')!==-1)
                    {
                        console.log($scope.panier);
                        $scope.panier[key].nb_click+=action;
                        if ($scope.panier[key].nb_click===0)
                        {
                            $scope.panier.splice(key,1);
                        }
                    }
                    else if (from.indexOf('projet')!==-1)
                    {
                        $scope.panier[key].nb_click+=action;
                        if ($scope.panier[key].nb_click===0)
                        {
                            $scope.panier.splice(key,1);
                        }
                    }
                    else if (from.indexOf('inventaire')!==-1)
                    {
                        $scope.panier[key].qte_inventaire+=action;
                        if ($scope.panier[key].qte_inventaire===0)
                        {
                            $scope.panier.splice(key,1);
                        }
                    }
                    else if (from.indexOf('livreur')!==-1)
                    {
                        $scope.panier[key].quantity+=action;
                        if ($scope.panier[key].quantity===0)
                        {
                            $scope.panier.splice(key,1);
                        }
                    }
                    else if (from.indexOf('minuterie')!==-1)
                    {
                        $scope.panier[key].qte+=action;
                        if ($scope.panier[key].qte===0)
                        {
                            $scope.panier.splice(key,1);
                        }
                    }
                    else if (from.indexOf('vente')!==-1)
                    {
                        $scope.panier[key].qte_vendue+=action;
                        if ($scope.panier[key].qte_vendue===0)
                        {
                            $scope.panier.splice(key,1);
                        }
                    }
                }
                add = false;
                //}
            }
            return add;
        });
        if (add)
        {
            if (from.indexOf('plan')!==-1)
            {
                console.log(panier);
                $scope.panier.push({"id":item.id, "produit_id":item.id, "name":item.name, "qte_commande" : 1, "offert" : 0,"options" :"", "prix":item.prix});

            }
            else if (from.indexOf('projet')!==-1)
            {
                $scope.panier.push({"id":item.id,"produit_id":item.id, "name":item.name, "prix":item.prix});
            }
            else if (from.indexOf('menu')!==-1)
            {
                $scope.panier.push({"id":item.id, "produit_id":item.id, "qte_produit" : 1, "name":item.name});
            }
            else if (from.indexOf('inventaire')!==-1)
            {
                $scope.panier.push({"id":item.id, "produit_id":item.id, "designation":item.designation, "current_quantity":item.current_quantity, "qte_inventaire" : item.current_quantity});
            }
            else if (from.indexOf('livreur')!==-1)
            {
                $scope.panier.push({"id":item.id, "produit_id":item.id, "designation":item.designation, "tva":item.with_tva, "quantity" : 1, "prix_cession":item.prix_cession});
            }
            else if (from.indexOf('fusion')!==-1)
            {
                $scope.panier.push({"id":item.id, "produit_id":item.id, "designation":item.designation, "prix_cession":item.prix_cession});
                console.log($scope.panier);
            }
            else if (from.indexOf('minuterie')!==-1)
            {
                $scope.panier.push({"id":item.id,"produit_id":item.id, "designation":item.designation, "qte" : 1});
            }
            else if (from.indexOf('vente')!==-1)
            {
                $scope.panier.push({"id":item.id,"produit_id":item.id, "designation":item.designation, "qte_vendue" : 1, "tva" : item.with_tva, "prix_unitaire":item.prix_public});
            }
        }
        if (from.indexOf('teste')!==-1)
            {
                $scope.panier.push({"id":item.id, "produit_id":item.id, "name":item.name, "qte_commande" : 1, "offert" : 0,"options" :"", "prix":item.prix});
                $scope.calculateTotal('commande');

            }
        if (from.indexOf('commande')!==-1)
        {
            $scope.calculateTotal('commande');
            $scope.setAdresseAndZone('commande');
        }
        else if (from.indexOf('vente')!==-1)
        {
            $scope.calculateTotal('vente');
        }
        else if (from.indexOf('livreur')!==-1)
        {
            $scope.calculateTotal('livreur');
        }
    };
    $scope.getEtatStock = function()
    {

       var form = $("#formulaire");
       var formdata=(window.FormData) ? ( new FormData(form[0])): null;
       var send_data=(formdata!==null) ? formdata : form.serialize();
       send_dataObj = form.serializeObject();
       var deferred=$q.defer();
       $.ajax
       (
           {
               url: BASE_URL + 'medoc/test/',
               type:'POST',
               contentType:false,
               processData:false,
               DataType:'text',
               data:send_dataObj,
               headers: {
                   'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
               },
               beforeSend: function()
               {
                   $('#modal_etatstock').blockUI_start();
               },success:function(response)
               {
                   $('#modal_etatstock').blockUI_stop();
                   factory.data=response;
                   deferred.resolve(factory.data);
               },
               error:function (error)
               {
                   $('#modal_etatstock').blockUI_stop();
                   console.log('erreur serveur', error);
                   deferred.reject(msg_erreur);

               }
           }
       );
       return deferred.promise;
    };


    // Permet soit d'ajouter ou de supprimer une ligne au niveau de la reservation
    $scope.forligne = function(e,type,action,idItem=0,parent=0)
    {
        e.preventDefault();

        if (type.indexOf("ligne_inventaire")!==-1)
        {
            if (angular.isNumber(action) && action > 0)
            {
                $scope.ligne_inventaires.push({'medicament_id':0, 'qte_app':0, 'qte_inventorie':0, 'ligne_regularisation':null});
                console.log('voir = ', $scope.ligne_inventaires);
                $scope.reInitAtForLigne('inventaire');
            }
            else
            {
                console.log('action', action, 'idItem', idItem, "parent", parent);

                $scope.ligne_inventaires.splice(idItem,1);

                $timeout(function(){
                    console.log('attend---------------');

                    $.each($scope.ligne_inventaires, function (keyItem, oneItem) {
                        var interval_refresh_ligneinv = setInterval(function ()
                        {
                            console.log('intervall inv', oneItem);
                            if ($('.ligne_inventaire[data-ligne='+(keyItem)+']').length)
                            {
                                $scope.actualquantity_ligneinventaire[keyItem] = oneItem.qte_inventorie;
                                $('.ligne_inventaire[data-ligne='+(keyItem)+']')
                                    .find('[name^="quantity"]').val(oneItem.qte_inventorie).trigger('change');

                                $scope.produit_ligneinventaire[keyItem] = oneItem.medicament_id;
                                $('.ligne_inventaire[data-ligne='+(keyItem)+']')
                                    .find('[name^="produit"]').val(oneItem.medicament_id).trigger('change');

                                $scope.regularisation_ligneinventaire[keyItem] = oneItem.ligne_regularisation_id;
                                $('.ligne_inventaire[data-ligne='+(keyItem)+']')
                                    .find('[name^="regularisation"]').val(oneItem.ligne_regularisation_id).trigger('change');


                                if (!oneItem.can_updated)
                                {
                                    $('.ligne_inventaire[data-ligne='+(keyItem)+']')
                                        .find('[id^="remove"]').addClass('d-none');
                                }
                                else
                                {
                                    $('.ligne_inventaire[data-ligne='+(keyItem)+']')
                                        .find('[id^="remove"]').removeClass('d-none');
                                }

                                /*
                                                                    $('.ligne_inventaire[data-ligne='+(keyItem)+']')
                                                                        .find('[name^="regularisation"]').attr('readonly', !oneItem.can_updated);
                                                                    $('.ligne_inventaire[data-ligne='+(keyItem)+']')
                                                                        .find('[name^="quantity"]').attr('readonly', !oneItem.can_updated);
                                                                    $('.ligne_inventaire[data-ligne='+(keyItem)+']')
                                                                        .find('[name^="produit"]').attr('disabled', !oneItem.can_updated);

                                */
                                setTimeout(function ()
                                {
                                    clearInterval(interval_refresh_ligneinv);
                                },500);
                            }
                        },500);
                    });

                });
            }
            $scope.reInit();
        }

    };

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

    $scope.calculateTotal = function(type)
    {
        if (type.indexOf('bonlivraison')!==-1)
        {
            $scope.total_ttc_livraison = 0;
            $scope.tvaBL = 0;
            $scope.total_ht_livraison = 0;

            if ($scope.panier.length > 0)
            {
                $.each($scope.panier, function (key, value)
                {
                    $scope.total_ht_livraison = $scope.total_ht_livraison + (value.prix_cession * value.qte_livre);

                    if ( value.tva == 1 )
                    {
                        $scope.tvaBL = $scope.tvaBL + (value.prix_cession * value.qte_livre * 0.18);
                    }

                });
                $scope.total_ttc_livraison = ($scope.total_ht_livraison + $scope.tvaBL) ;
                console.log('totals_livraison',$scope.total_ht_livraison, $scope.total_ttc_livraison, $scope.tvaBL);
            }
        }
        else if (type.indexOf('retour')!==-1)
        {
            $scope.total_remboursement = 0;

            if ($scope.panier.length > 0)
            {
                $.each($scope.panier, function (key, value)
                {
                    $scope.total_remboursement = $scope.total_remboursement + (value.prix_cession * value.quantity);

                });
                console.log('totals_retour',$scope.total_remboursement);
            }
        }
        else if (type.indexOf('recouvrement')!==-1)
        {
            $scope.total_recouvre = 0;

            if ($scope.selectionVente.length > 0)
            {
                $.each($scope.selectionVente, function (key, value)
                {
                    $scope.total_recouvre = $scope.total_recouvre + value.somme;

                });
                $scope.total_recouvre = ($scope.total_recouvre - Number($('#remise_recouvrement').val()) );
                console.log('total_recouvre',$scope.total_recouvre);
            }
        }
        else if (type.indexOf('vente')!==-1)
        {
            $scope.total_ttc_vente = 0;
            $scope.tvaVt = 0;
            $scope.remiseVt = 0 ;
            $scope.partPayeur = 0 ;
            $scope.total_ht_vente = 0;
            $scope.total_verse = 0;
            $scope.net_Apaye = 0;
            $scope.monnaie = 0;

            if ($scope.panier.length > 0)
            {
                $.each($scope.panier, function (key, value)
                {
                    $scope.total_ttc_vente = $scope.total_ttc_vente + (value.prix_unitaire * value.qte_vendue);

                    if ( value.tva == 1 )
                    {
                        $scope.tvaVt = $scope.tvaVt + (value.prix_unitaire * value.qte_vendue * 0.18);
                    }

                });
                $scope.total_ht_vente = ($scope.total_ttc_vente - $scope.tvaVt);
                $scope.remiseVt = ((Number($('#remise_vente').val()) * $scope.total_ttc_vente)/100) + Number($('#remisevaleur_vente').val());
                $scope.net_Apaye = ($scope.total_ttc_vente - $scope.remiseVt);
                $scope.partPayeur = (Number($('#tauxpriseencharge_vente').val()) * $scope.net_Apaye)/100;
                $scope.total_verse = ($scope.net_Apaye - $scope.partPayeur);
                $scope.monnaie = ( Number($('#encaisse_vente').val()) - $scope.total_verse);
                console.log('totals_vente',$scope.total_ht_vente, $scope.total_ttc_vente, $scope.tvaVt, $scope.net_Apaye, $scope.partPayeur,$scope.total_verse  );
            }
        }

    };


    $scope.searchsurfacecategorie="";
    $scope.trierElement=function (type,element,propriete="")
    {
        console.log('trierElement');

        if (type.indexOf('client')!==-1)
        {
            if (propriete.match('recouvrement'))
            {
                $.each($scope.clients, function (key, value) {
                    if (value.id == element)
                    {
                        console.log('trierElement');
                        $scope.clientSelected=element;
                        console.log('clientSelected', $scope.clientSelected);
                        return false;
                    }
                });
            }
        }
        else if (type.indexOf('assurance')!==-1)
        {
            if (propriete.match('recouvrement'))
            {
                $.each($scope.assurances, function (key, value) {
                    if (value.id == element)
                    {
                        $scope.assuranceSelected=element;
                        console.log('assuranceSelected', $scope.assuranceSelected);
                        return false;
                    }
                });
            }
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
                            else if (type.indexOf('projet')!==-1)
                            {
                                $.each($scope.projets, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.projets.splice(keyItem, 1);
                                        return false;
                                    }
                                });

                                $scope.paginationprojet.totalItems--;
                                if($scope.projets.length < $scope.paginationprojet.entryLimit)
                                {
                                    $scope.pageChanged('projet');
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
                            else if (type.indexOf('contact')!==-1)
                            {
                                $.each($scope.messagesends, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.messagesends.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                // $scope.getelements("messagesends");
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
