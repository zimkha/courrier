var app=angular.module('BackEnd',[ 'ngRoute' , 'ngSanitize' , 'ngLoadScript', 'ui.bootstrap' , 'angular.filter','ngCookies']);
var BASE_URL='//'+location.host+'/';
var imgupload = BASE_URL + '/assets/images/upload.jpg';
var msg_erreur = 'Veuillez contacter le support technique';
function unauthenticated(error)
{
    if (error.status===401)
    {
        iziToast.error({
            title: "",
            message: "Votre session utilisateur a expiré...",
            position: 'topRight'
        });

        setTimeout(function()
        {
            window.location.reload();
        }, 2000);
    }
}
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
//Pour les chronos
app.filter('counter', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
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
                    url: BASE_URL + (is_graphQL ? '/graphql?query= {'+element+' {'+listeattributs+'} }' : element),
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
                    unauthenticated(error);
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            getAuthenticated_user:function ()
            {
                var deferred=$q.defer();
                $http({
                    method: 'GET',
                    url: BASE_URL + '/authenticated_user',
                }).then(function successCallback(response)
                {
                    factory.data = response['data']['this_user'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    unauthenticated(error);
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
                    url: BASE_URL + '/graphql?query= {'+element+'{metadata{total,per_page,current_page,last_page},data{'+listeattributs+'}}}'
                }).then(function successCallback(response) {
                    factory.data=response['data']['data'][!element.indexOf('(')!=-1 ? element.split('(')[0] : element];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    unauthenticated(error);
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
                    unauthenticated(error);
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
                    unauthenticated(error);
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            debuterPreparation:function (data) {
                var deferred=$q.defer();
                $http({
                    method: 'POST',
                    url: BASE_URL + 'commande/declencher-minuterie-chef',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:data
                }).then(function successCallback(response) {
                    factory.data=response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    unauthenticated(error);
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            finirPreparation:function (data) {
                var deferred=$q.defer();
                $http({
                    method: 'POST',
                    url: BASE_URL + 'commande/terminer-minuterie_chef',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:data
                }).then(function successCallback(response) {
                    factory.data=response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    unauthenticated(error);
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            getExcelCaisse: function(idItem)
            {
                var deferred=$q.defer();
                console.log(dataget);
                $http({
                    method: 'GET',
                    url: BASE_URL + 'caisse/clotureExcel/'+ idItem,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:dataget
                }).then(function successCallback(response)
                {
                    /*lorsque la requete contient des paramètres, il faut decouper pour recupérer le tableau*/

                        factory.data = response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    unauthenticated(error);
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            getPdfCaisse: function(idItem)
            {
                var deferred=$q.defer();
                console.log(dataget);
                $http({
                    method: 'GET',
                    url: BASE_URL + 'caisse/cloturePdf/'+ idItem,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:dataget
                }).then(function successCallback(response)
                {
                    /*lorsque la requete contient des paramètres, il faut decouper pour recupérer le tableau*/

                    factory.data = response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    unauthenticated(error);
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            finirCommande:function (data) {
                var deferred=$q.defer();
                $http({
                    method: 'POST',
                    url: BASE_URL + 'commande/terminer-minuterie_commande',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:data
                }).then(function successCallback(response) {
                    factory.data=response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    unauthenticated(error);
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            annulerCommande:function(data)
            {
                var deferred=$q.defer();
                $http({
                    method: 'POST',
                    url: BASE_URL + 'commande/annuler',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:data
                }).then(function successCallback(response) {
                    factory.data=response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    unauthenticated(error);
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            livreCommande:function(data)
            {
                var deferred=$q.defer();
                $http({
                    method: 'POST',
                    url: BASE_URL + 'commande/livre',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:data
                }).then(function successCallback(response) {
                    factory.data=response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    unauthenticated(error);
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            annulerCommandeDS: function(data)
            {
                var deferred=$q.defer();
                $http({
                    method: 'POST',
                    url: BASE_URL + 'commande/desannuler',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:data
                }).then(function successCallback(response) {
                    factory.data=response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    unauthenticated(error);
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            offertCommande:function(data)
            {
                var deferred=$q.defer();
                $http({
                    method: 'POST',
                    url: BASE_URL + 'commande/offert',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:data
                }).then(function successCallback(response) {
                    factory.data=response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    unauthenticated(error);
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                         });
                return deferred.promise;
            },
            clotureCaisseOne:function(data)
            {
                var deferred=$q.defer();
                $http({
                    method: 'POST',
                    url: BASE_URL + 'caisse/clotureTarget',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:data
                }).then(function successCallback(response) {
                    factory.data=response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    unauthenticated(error);
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            clotureCaisseTwo:function(data)
            {
                var deferred=$q.defer();
                $http({
                    method: 'POST',
                    url: BASE_URL + 'caisse/clotureTarget',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data:data
                }).then(function successCallback(response) {
                    factory.data=response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error) {
                    unauthenticated(error);
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            facturerVente:function (data) {
                var deferred=$q.defer();
                $.ajax
                (
                    {
                        url: BASE_URL + '/vente/facture',
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
                            $('#modal_addfactureGeneree').blockUI_start();
                        },success:function(response)
                        {
                            $('#modal_addfactureGeneree').blockUI_stop();
                            factory.data=response;
                            deferred.resolve(factory.data);
                        },
                        error:function (error)
                        {
                            unauthenticated(error);
                            $('#modal_addfactureGeneree').blockUI_stop();
                            console.log('erreur serveur', error);
                            deferred.reject(msg_erreur);
                        }
                    }
                );
                //console.log(deferred.promise);
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
                            unauthenticated(error);
                            $('#modal_addliste' + element).blockUI_stop();
                            console.log('erreur serveur', error);
                            deferred.reject(msg_erreur);
                        }
                    }
                );
                return deferred.promise;
            },
            saveElementAjax: function (element, data, is_file_excel = false) {
                var deferred = $q.defer();
                $.ajax
                (
                    {
                        url: BASE_URL + element + (is_file_excel ? '/import' : ''),
                        type: 'POST',
                        contentType: false,
                        processData: false,
                        DataType: 'text',
                        data: data,
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                        },
                        beforeSend: function () {
                            $('#modal_add' + element).blockUI_start();
                        }, success: function (response) {
                            $('#modal_add' + element).blockUI_stop();
                            factory.data = response;
                            deferred.resolve(factory.data);
                        },
                        error: function (error) {
                            unauthenticated(error);
                            $('#modal_add' + element).blockUI_stop();
                            console.log('Erreur élément existe déja dans BD = ', error.responseText);
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
                    url: BASE_URL + '/' + element + '/' + id,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(function successCallback(response) {
                    factory.data=response['data'];
                    deferred.resolve(factory.data);
                }, function errorCallback(error)
                {
                    unauthenticated(error);
                    console.log('erreur serveur', error);
                    deferred.reject(msg_erreur);
                });
                return deferred.promise;
            },
            getStatElement:function (element,id) {
                $(function() {
                    $.ajax({
                        url: BASE_URL + '/' + element + '/statistiques/' + id,
                        method: "GET",
                        success : function (data) {
                            console.log(data, 'je suis la');
                            var mois = [];
                            var montant = [];
                            for (var i in data )
                            {
                                if (data[i].montant !=null)
                                {
                                    console.log( data[i].mois);
                                    mois.push('' + data[i].mois);
                                    montant.push(data[i].montant);
                                }
                            }
                            var chardata = {
                                labels: mois,
                                datasets : [
                                    {
                                        label: 'Statistiques Pour: ' + element,
                                        backgroundColor: [
                                            'rgba(255, 99, 132, 0.2)',
                                            'rgba(54, 162, 235, 0.2)',
                                            'rgba(255, 206, 86, 0.2)',
                                            'rgba(75, 192, 192, 0.2)',
                                            'rgba(153, 102, 255, 0.2)',
                                            'rgba(255, 159, 64, 0.2)',
                                            'rgba(153, 102, 255, 0.2)',
                                            'rgba(153, 152, 255, 0.2)',
                                            'rgba(255, 139, 64, 0.2)',
                                            'rgba(153, 152, 255, 0.75)',
                                            'rgba(255, 159, 44, 0.75)',
                                            'rgba(54, 162, 235, 0.2)',],
                                        borderColor: [
                                            'rgba(255, 99, 132, 1)',
                                            'rgba(54, 162, 235, 1)',
                                            'rgba(255, 206, 86, 1)',
                                            'rgba(75, 192, 192, 1)',
                                            'rgba(153, 102, 255, 1)',
                                            'rgba(255, 159, 64, 1)',
                                            'rgba(255, 99, 13, 1)',
                                            'rgba(54, 100, 25, 1)',
                                            'rgba(255, 26, 86, 1)',
                                        ],
                                        borderWidth: 4,
                                        barPercentage: 1.,
                                        categoryPercentage:1.,
                                        barThickness: 6,
                                        hoverBackgroundColor: 'rgba(200,200,200,1)',
                                        hoverBorderColor: 'rgba(200,200,200,1)',
                                        borderSkipped: 'left',
                                        data: montant
                                    }
                                ]
                            };
                            //var ctx  = $('#stats'+element);
                            this.chart = new Chart('stats'+element, {
                                type: 'bar',
                                data : chardata,
                                options: {
                                    legend: {
                                        display: true,
                                        labels: {
                                            fontColor: 'rgb(255, 50, 100)',
                                            fontFamily: 'Helvetica Neue',
                                            padding: 10,
                                        }
                                    },
                                    tooltips: {
                                        callbacks: {
                                            label: function(tooltipItem, data) {
                                                var label = 'Montant';
                                                if (label) {
                                                    label += ': ';
                                                }
                                                label += Math.round(tooltipItem.yLabel * 100) / 100;
                                                return label;
                                            },
                                            labelColor: function(tooltipItem, chart) {
                                                return {
                                                    borderColor: 'rgb(255, 0, 0)',
                                                    backgroundColor: 'rgb(255, 0, 0)'
                                                };
                                            },
                                            labelTextColor: function(tooltipItem, chart) {
                                                return '#ffffff';
                                            }
                                        }
                                    }
                                }
                            });
                        }, error: function (error) {
                            unauthenticated(error);
                            console.log(data)
                        }
                    });
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
        .when("/gestion_restaurant", {
            templateUrl : "page/gestion_restaurant",
        })
        .when("/gestion_livreur", {
            templateUrl : "page/gestion_livreur",
        })
        .when("/gestion_minuteur", {
            templateUrl : "page/gestion_minuteur",
        })
        .when("/gestion_cadeau", {
            templateUrl : "page/gestion_cadeau",
        })
        .when("/list-typedepense", {
            templateUrl : "page/list-typedepense",
        })
        .when("/list-categoriedepense", {
            templateUrl : "page/list-categoriedepense",
        })
        .when("/list-tier", {
            templateUrl : "page/list-tier",
        })
        .when("/detail-tier/:itemId", {
            templateUrl : "page/detail-tier",
        })
        .when("/gestion_depense", {
            templateUrl : "page/gestion_depense",
        })
        .when("/detail-depense/:itemId", {
            templateUrl : "page/detail-depense",
        })
        .when("/list-entreeca", {
            templateUrl : "page/list-entreeca",
        })
        .when("/list-banque", {
            templateUrl : "page/list-banque",
        })
        .when("/list-versement", {
            templateUrl : "page/list-versement",
        })
        .when("/gestion_carte", {
            templateUrl : "page/gestion_carte",
        })
        .when("/gestion_caisse", {
            templateUrl : "page/gestion_caisse",
        })
        .when("/gestion_menu", {
            templateUrl : "page/gestion_menu",
        })
        .when("/detail-menu/:itemId", {
            templateUrl : "page/detail_menu",
        })
        .when("/detail-livreur/:itemId", {
            templateUrl : "page/detail-livreur",
        })
        .when("/detail-utilisateur/:itemId", {
            templateUrl : "page/detail-utilisateur",
        })
        .when("/list-familleproduit", {
            templateUrl : "page/list-familleproduit",
        })
        .when("/detail-famille/:itemId", {
            templateUrl : "page/detail-famille",
        })
        .when("/list-typeproduit", {
            templateUrl : "page/list-typeproduit",
        })
        .when("/list-typeclient", {
            templateUrl : "page/list-typeclient",
        })
        .when("/detail-typeclient/:itemId", {
            templateUrl : "page/detail-typeclient",
        })
        .when("/list-produit", {
            templateUrl : "page/list-produit",
        })
        .when("/detail-produit/:itemId", {
            templateUrl : "page/detail-produit",
        })
        .when("/list-client", {
            templateUrl : "page/list-client",
        })
        .when("/detail-client/:itemId", {
            templateUrl : "page/detail-client",
        })
        .when("/traitement-commande/:itemId/:date", {
            templateUrl : "page/traitement-commande",
        })
        .when("/list-typecommande", {
            templateUrl : "page/list-typecommande",
        })
        .when("/list-categoriecommande", {
            templateUrl : "page/list-categoriecommande",
        })
        .when("/list-zonelivraison", {
            templateUrl : "page/list-zonelivraison",
        })
        .when("/list-horaireconnexion", {
            templateUrl : "page/list-horaireconnexion",
        })
        .when("/list-crenohoraire", {
            templateUrl : "page/list-crenohoraire",
        })
        .when("/detail-minuteur/:itemId", {
            templateUrl : "page/detail-minuteur",
        })
        .when("/list-commande", {
            templateUrl : "page/list-commande",
        })
        .when("/detail-commande/:itemId", {
            templateUrl : "page/detail-commande",
        })
        .when("/commande_encour", {
            templateUrl : "page/commande_encour",
        })
        .when("/list-produit", {
            templateUrl : "page/list-produit",
        })
        .when("/profilspermissions", {
            templateUrl : "page/profilspermissions",
        })
        .when("/gestions_utilisateurs", {
            templateUrl : "page/gestions_utilisateurs",
        })
        .when("/detail-restaurant/:itemId", {
            templateUrl : "page/detail-restaurant",
        })
        .when("/bilan", {
            templateUrl : "page/bilan",
        })
        .when("/recap-bilan", {
            templateUrl : "page/recap-bilan",
        })
        .when("/detail-page/:itemId", {
            templateUrl : "page/detail-page",
        })
});
// Spécification fonctionnelle du controller
app.controller('BackEndCtl',function (Init,$location,$scope,$filter, $log,$q,$route, $routeParams, $timeout,$cookies)
{
    $scope.changeDashboard = function(restaurant_dashboard)
    {
      console.log("je sui sla ", restaurant_dashboard)

        var typeAvecS = "chiffreaffaires";
        var rewriteReq = typeAvecS + "(restaurant_id:" + restaurant_dashboard +')';
        if (restaurant_dashboard == 0)
        {
            console.log("okkkkkk");
            rewriteReq = typeAvecS;
        }

        Init.getElement(rewriteReq,  listofrequests_assoc[typeAvecS]).then(function (data) {

            if (data) {
                console.log(data);
                $scope.chiffreaffaires = data;
                //$scope.dashboard_data[0].chiffre_affaires = JSON.parse(data[0].chiffre_affaires);
                $scope.chiffreaffaires = JSON.parse(data[0].commandes_total);
                //$scope.dashboard_data[0].restaurants      = JSON.parse(data[0].restaurants);
                $scope.userrestaurant_elements = [];
            }
        }, function (msg) {
            toastr.error(msg);
        });
    };


    $scope.loadingGif = true;
    var channelName = 'laravel_database_notification';
    $scope.showToastRealTime = function (msg, type) {
        if (type.indexOf("success") !== -1) {
            iziToast.success({
                progressBar: true,
                timeout: 5000,
                title: "",
                message: msg,
                position: 'topRight'
            });
        }
        else if (type.indexOf("warning") !== -1) {
            iziToast.warning({
                progressBar: true,
                timeout: 10000,
                title: "",
                message: msg,
                position: 'topRight'
            });
        }
        else if (type.indexOf("error") !== -1) {
            iziToast.error({
                progressBar: true,
                timeout: 1,
                title: "",
                message: msg,
                position: 'topRight'
            });
        }
    };
    var prefixeChannel = 'o_sushi_bar_soft_database_';
    window.Echo.channel(prefixeChannel + 'rt')
        .listen('RtEvent', (e) => {
            console.log('event page dans osushibar', e.data);
            if (e.data.type.indexOf("categoriedepense") !== -1)
            {
                $scope.pageChanged("categoriedepense");
            }
            else if (e.data.type == "tier")
            {
                $scope.pageChanged("tier");
            }
        });

    window.Echo.channel(channelName)
        .listen("ClientEvent", (e) => {
            console.log('laravel_database_notification client event page', e);
            $scope.pageChanged('client');
            $scope.getelements('clients');
        })
        .listen("PaiementEvent", (e) => {
            console.log('laravel_database_notification client event page', e);
            $scope.pageChanged('commande');
        })
        .listen("CommandeEvent", (e) => {
            console.log('laravel_database_notification commande event page',$scope.linknav, e, $('#auth_user_id').val(), e.user_id, Number(e.user_id) !== Number($('#auth_user_id').val()), Number(e.restaurant_id) !== Number($('#this_restaurant_user').val()));
            console.log(e.restaurant_id, 'les donnees du restaurant');

            if (Number(e.user_id) !== Number($('#auth_user_id').val()))
            {
                if (Number(e.restaurant_id) == Number($('#this_restaurant_user').val())) {
                    $scope.showToastRealTime((e.data.add ? "Une nouvelle commande a été ajoutée" : e.data.update ? "Une commande vient d'être modifiée" : e.data.delete ? "Une commande a été supprimée" : ""),
                        (e.data.add ? "success" : e.data.update ? "warning" : e.data.delete ? "error" : "info"));
                    $scope.pageChanged('commande');
                }
                else
                {
                    $scope.showToastRealTime((e.data.add ? "Une nouvelle commande a été ajoutée" : e.data.update ? "Une commande vient d'être modifiée" : e.data.delete ? "Une commande a été supprimée" : ""),
                        (e.data.add ? "success" : e.data.update ? "warning" : e.data.delete ? "error" : "info"));
                    $scope.pageChanged('commande');
                }
            }
        });
    $scope.this_restaurant_user = Number($('#this_restaurant_user').val());
    $scope.this_restaurant_user_carte = 0;
    $scope.auth_user_id  = Number($('#auth_user_id').val());
    console.log('restaurant de l\'utilisateur',$scope.this_restaurant_user, "Utilisateur =>",$scope.auth_user_id);
    var listofrequests_assoc =
        {
            "produits"                    : "id,name,code_pro,restaurant_id,restaurant{id,designation},created_at_fr,code_pro,code,prix,status,image,qte_min,famille_produit_id,famille_produit{id,name},type_produit_id,type_produit{id,name},description,ligne_produit_menus{id,menu_id},produit_restaurants{id,restaurant_id},created_at,ligne_carte_produits{id,carte_id,produit_id},nbr_commande,ca_commande,ca_commande_livre,ca_commande_emporte,ca_commande_surplace,nbr_commande_surplace,nbr_commande_emporte,nbr_commande_livre,nbr_commande_livre,pourcent_livre,pourcent_emporte,pourcent_surplace",

            "ligneproduitmenus"           : "id,produit_id,menu_id",

            "typeproduits"                : "id,name,produits{id,code,name,prix}",

            "familleproduits"             : "id,name,produits{id,code,name,prix},famille_produit_id,famille_produit{id,name},famille_produits{id,name},nb_sous_produit",

            "typecommandes"               : "id,name,commandes{id}",

            "typedepenses"                : "id,name,with_reminder,impact_net_profit,nbre_depense",

            "categoriedepenses"           : "id,name,nbre_depense,type_depense{id,name}",

            "depenses"                    : "id,mode_paiement_id,num_facture,nb_jour_rappel,montant,restant,motif,with_reminder,paid_immediately,commentaires,restaurant{id,designation},type_depense{id,name},categorie_depense{id,name},tier_id,tier{id,nomcomplet,email,telephone,adresse},user_id,user{id,name},date,date_fr,date_echeance,date_echeance_fr",

            "recettes"                    : "total_commande,total_commandepartype,total_entreeca,total_depense,total_livraison,total_livraison_offerte,total_depensepartype,total_bilan,debut,fin",

            "entreecas"                   : "id,montant,motif,commentaires,restaurant{id,designation},user_id,user{id,name},date,date_fr",

            "tiers"                       : [
                "id,nomcomplet,email,telephone",
                ",adresse,observations,nbre_depense",
            ],

            "paiementdepenses"            : "id,montant,restant,date,date_fr,commentaire,fichier,depense_id,depense{id,restaurant_id},mode_paiement_id,mode_paiement{id,name},user_id,user{id,name}",

            "banques"                     : "id,name,nbre_versement",

            "versements"                  : "id,montant,commentaires,restaurant{id,designation},banque{id,name},user_id,user{id,name},created_at_fr,date_debut,date_debut_fr,date_fin,date_fin_fr",

            "typeclients"                 : "id,name,clients{id,nomcomplet,telephone,adresse}",

            "cartes"                      : "id,name,code,status,restaurant_id,restaurant{id,designation},commentaire,ligne_carte_menus{id,menu_id,menu{id,name,prix}},ligne_carte_produits{id,carte_id,produit_id,produit{id,name,prix}}",

            "menus"                       : "id,name,code,restaurant_id,restaurant{id,designation},created_at_fr,prix,status,image,description,ca_menu,tableau_commande,array_restaurant,tableau_restaurant,nb_commande,nb_commande_liv,nb_commande_em,nb_commande_spr,ca_menu,ca_livraison,ca_emporte,ca_surplace,ligne_carte_menus{id,carte_id},ligne_produit_menus{id,qte,produit_id,produit{id,prix,name,type_produit{id,name},famille_produit{id,name}}},ligne_commande_menus{id,commande_id,commande{id,code,remise}},pourcent_commande_surplace,pourcent_commande_emporte,pourcent_commande_livre",

            "categoriecommandes"          : "id,name,commandes{id,code,remise,montant_remise_livreur}",

            "clients"                     : [
                "id,email,remise_client,restaurant_id,restaurant{id,designation},code_client,nomcomplet,adresse,telephone,type_client_id,type_client{id,name},zone_livraison_id,zone_livraison{id,name}",
                ",pourcent_commande,pourcent_emporte,pourcent_surplace,pourcent_livre,created_at,created_at_fr,ca,ca_livre,ca_emporte,ca_surplace,nbr_commande_livre,nbr_commande_emporte,nbr_commande_surplace,nbr_commande,"
            ],

            "commandes"                   : "id,livraison_offerte,etat_livre,numero_ordre,remise_valeur,nb_menus,annulation_commande,returned_user_id,nb_produits,total_commande,restant_payer,restaurant_id,restaurant{id,designation},heure_fin_chef,heure_fin_caisse,heure_demarrage_chef,details_minuteries{id,commande_id,commande{id},user_id,chef_id,creno_horaire_id,creno_horaire{id,duree,type_commande_id,type_commande{id,name},minuterie_id,minuterie{id,name}},user{id,name},chef{id,name}},ligne_commande_produits{id,prix,qte,options,offert,produit_id,produit{id,name,prix,status,image}},ligne_commande_menus{id,prix,qte,options,offert,menu_id,menu{id,name,prix,status,image,ligne_produit_menus{id,produit{id,name}}}},code,status,etat_commande,numero_table,livreur_id,nb_personne,adresse_a_livre,etat_commande,chef_id,chef{id,name,active},user_id,user{id,name},montant_remise_livreur,motif,created_at,created_at_fr,type_commande_id,type_commande{id,name},categorie_commande_id,categorie_commande{id,name},client_id,client{id,code_client,nomcomplet,telephone,adresse},zone_livraison_restaurant_id,zone_livraison_restaurant{id,tarif}",

            "livreurs"                    : "id,nom,status,prenom,adresse,telephone,civilite,nci,created_at_fr,image,nb_commande,restaurant_id,somme_journalier,ca_somme,ca_commande,pourcent",

            "paiements"                   : "id,date,montant,commande_id,mode_paiement_id,mode_paiement{id,name},user_id,user{id,name,image}",

            "restaurants"                 : "id,responsable_id,responsable{id,name},nbr_depense,nb_commande,pourcent_livre,pourcent_emporte,pourcent_surplace,ca_livre,ca_surplace,ca_emporte,designation,created_at_fr,adresse,telephone,description,image,status,users{id,name},cartes{id,name,commentaire,ligne_carte_menus{id,menu_id,menu{id,name,prix}}},produit_restautants{id,produit_id,produit{id,code,name}},ca_depense,ca_commande,ca_commandes_paye,nbr_commande_emporte,nbr_commande_livre,nbr_commande_surplace",

            "zonelivraisons"              : "id,name,nb_commande,zone_livraison_restaurants{id,restaurant_id,restaurant{designation},tarif}",

            "zonelivraisonrestaurants"    : "id,tarif,restaurant{id,designation},nb_commande,zone_livraison{id,name}",

            "minuteries"                  : "id,name,couleur,created_at,updated_at",

            "detailminuteries"            : "id,duree,commande_id,commande{id},user_id,chef_id,creno_horaire_id,creno_horaire{id,type_commande_id,type_commande{id,name},minuterie_id,minuterie{id,name}},user{id,name},chef{id,name}",

            "crenohoraires"               : "id,commentaires,duree,jour_debut,jour_fin,heur_debut,heur_fin,type_commande_id,type_commande{id,name},minuterie_id,minuterie{id,name,couleur},restaurant_id,restaurant{id,designation},created_at",

            "horaireconnexions"           : "id,name,heur_debut,heur_fin,created_at",

            "lignecartemenus"             : "id,menu_id,carte_id",

            "lignecommandemenus"          : "id,commande_id,menu_id,offert,options",

            "lignecommandeproduits"       : "id,commande_id,produit_id,offert,options",

            "ligneproduitmenu"            : "id,qte,produit_id,menu_id",

            "produitrestaurants"          : "id,restaurant_id,produit_id",

            "permissions"                 : "id,name,display_name,guard_name",

            "roles"                       : "id,name,guard_name,permissions{id,name,display_name,guard_name}",

            "user_horaires"               : "id,user_id,horaire_connexion_id,user{id,name,restaurant_id,restaurant{id,name}},horaire_connexion{id,name,heur_debut,heur_fin}",

            "users"                       : "id,active,user_restaurants{id,user_id,restaurant_id,restaurant{id,designation}},name,email,password,image,restaurant_id,restaurant{id,designation,adresse,cartes{id}},user_horaires{id,horaire_connexion_id,horaire_connexion{id,name,heur_debut,heur_fin}},roles{id,name,guard_name,permissions{id,name,display_name,guard_name}},nb_commande_livre,nb_commande_surplace,nb_commande_emporte,pourcent_commande_livre,pourcent_commande_surplace,pourcent_commande_emporte,created_at_fr",

            "caisses"                     : "id,montant_clocture,montant_debut,user_id,restaurant_id,user{id,name},restaurant{id,designation},date,plage_horaire,created_at,updated_at,date,created_at_fr,updated_at_fr,atr",

            //"dashboards"                  : "commandes_total,chiffre_affaires,restaurants",
            "dashboards"                  : "restaurants",

            "chiffreaffaires"             : "commandes_total",

            "modepaiements"               : "id,name,paiements{id}",

            "userrestaurants"             : "id,user_id,restaurant_id,restaurant{id,designation}",
        };
    //
    $scope.imgupload_location = imgupload;
    // o_sushi_bar
    $scope.restaurants = [];
    $scope.typeproduits = [];
    $scope.familleproduits = [];
    $scope.produits = [];
    $scope.typeclients = [];
    $scope.clients = [];
    $scope.typecommandes = [];
    $scope.categoriecommandes = [];
    $scope.commandes = [];
    $scope.categoriedepenses = [];
    $scope.typedepenses = [];
    $scope.depenses = [];
    $scope.zonelivraisons = [];
    $scope.zonelivraisonrestaurants = [];
    $scope.horaireconnexions = [];
    $scope.crenohoraires = [];
    $scope.cartes = [];
    $scope.livreurs = [];
    $scope.cadeaus = [];
    $scope.users = [];
    $scope.menus = [];
    $scope.caisses = [];
    $scope.modepaiements = [];
    $scope.paiements = [];
    $scope.chiffreaffaires = [];
    // for pagination
    $scope.paginationproduit = {
        currentPage: 1,
        maxSize: 10,
        entryLimit: 10,
        totalItems: 0
    };
    $scope.paginationtier = {
        currentPage: 1,
        maxSize: 10,
        entryLimit: 10,
        totalItems: 0
    };
    $scope.paginationclient = {
        currentPage: 1,
        maxSize: 10,
        entryLimit: 10,
        totalItems: 0
    };
    $scope.paginationcommande = {
        currentPage: 1,
        maxSize: 10,
        entryLimit: 10,
        totalItems: 0
    };
    $scope.paginationcarte = {
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

    $scope.paginationcaisse = {
        currentPage: 1,
        maxSize: 10,
        entryLimit: 10,
        totalItems: 0
    };
    $scope.paginationlivreur = {
        currentPage: 1,
        maxSize: 10,
        entryLimit: 10,
        totalItems: 0
    };
    $scope.paginationcadeau = {
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
    $scope.startCountC = 0;
    $scope.startCountP = 0;
    $scope.startChronoC = function() {
        var debutCronoC = $cookies.get('debut_commande');
        var today = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        console.log('tayy', debutCronoC, today);
        $scope.startCountC = (new Date(today).valueOf() - new Date(debutCronoC).valueOf())/1000;
        mytimeoutC = $timeout($scope.startChronoC, 1000);
        console.log('CompteurCommande',typeof today ,$scope.startCountC);
    };
    $scope.startChronoP = function() {
        var debutCronoP = $cookies.get('debut_preparation');
        var todayP = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        console.log('tayy', debutCronoP, todayP);
        $scope.startCountP = (new Date(todayP).valueOf() - new Date(debutCronoP).valueOf())/1000;
        mytimeoutP = $timeout($scope.startChronoP, 1000);
        console.log('CompteurPrepa',typeof todayP ,$scope.startCountP);
    };
    $scope.stopChronoC = function () {
        $timeout.cancel(mytimeoutC);
    };
    $scope.stopChronoP = function () {
        $timeout.cancel(mytimeoutP);
    };
    $scope.setCookiesCommande = function(idItem,date) {
        if (!$cookies.get('commande_id')){
            $cookies.put('commande_id',idItem);
            $cookies.put('debut_commande',date);
        }
        console.log('myCommandeCookie', $cookies.getAll());
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
    $scope.writeUrl = function (type, addData=null, e)
    {
        var urlWrite = "";
        $("input[id$=" + type + "], textarea[id$=" + type + "], select[id$=" + type + "]").each(function ()
        {
            var attr = $(this).attr("id").substr(0, $(this).attr("id").length - (type.length + 1 ));
            if ($(this).hasClass('required') && !$(this).val())
            {
                iziToast.error({
                    title: "CHAMP REQUIS",
                    message: "Le champ " + $(this).attr('field') + " est requis",
                    position: 'topRight'
                });
                e.preventDefault();
            }
            urlWrite = urlWrite + ($(this).val() && $(this).val()!=="" ? (urlWrite ? "&" : "") + attr + '=' + $(this).val() : "" );
        });
        $scope.urlWrite = urlWrite ? "?" + urlWrite : urlWrite;
    };

    $scope.getelements = function (type, addData=null, forModal = false)
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
        if (type.indexOf('dashboards')!==-1)
        {
            // addData = $scope.infosDahboardBy
            rewriteType = rewriteType + "("
                /* = listinfos*/ + ($('#info_' + addData).val() ? ',date_' + addData + ':' + '"' + $('#info_' + addData).val() + '"' : "current_"+(addData)+":true" )
                + ($scope.this_restaurant_user!=0 ? ',restaurant_id:' + $scope.this_restaurant_user : "" )
                + ")";
        }
        if (type.indexOf('horaireconnexions')!==-1 && $scope.this_restaurant_user!=0 )
        {
            /*rewriteType = rewriteType + "("
                + ($scope.this_restaurant_user!=0 ? 'restaurant_id:' + $scope.this_restaurant_user : "" )
                + ")";*/
        }
        if (type.indexOf('crenohoraires')!==-1 && $scope.this_restaurant_user!=0)
        {
            /*rewriteType = rewriteType + "("
                + ($scope.this_restaurant_user!=0 ? 'restaurant_id:' + $scope.this_restaurant_user : "" )
                + ")";*/
        }
        if (type.indexOf('zonelivraisonrestaurants')!==-1)
        {
            if (($("#modal_addcommande").data('bs.modal') || {})._isShown && $('#restaurant_commande').val())
            {
                rewriteType = rewriteType + "("
                    + (($("#modal_addcommande").data('bs.modal') || {})._isShown && $('#restaurant_commande').val() ? ',restaurant_id:' + $('#restaurant_commande').val() : "" )
                    + ")";
            }
        }
        if (type.indexOf('produits')!==-1 )
        {
            console.log('je suis ici');
            if ($scope.pageUpload)
            {
                rewriteType = rewriteType + "("
                    + ($('#searchtexte_listproduit').val() ? (',' + $('#searchoption_listproduit').val() + ':"' + $('#searchtexte_listproduit').val() + '"') : "" )
                    + ($('#designationproduit_listproduit').val() ? ',designation:"' + $('#designationproduit_listproduit').val() + '"' : "" )
                    + ($('#typeproduit_listproduit').val() ? ',type_produit_id:' + $('#typeproduit_listproduit').val() : "" )
                    + ($('#familleproduit_listproduit').val() ? ',famille_produit_id:' + $('#familleproduit_listproduit').val() : "" )
                    + ($('#categorieproduit_listproduit').val() ? ',categorie_id:' + $('#categorieproduit_listproduit').val() : "" )
                    + ($('#lettre_debut_listproduit').val() ? ',letter_start:' + '"' + $('#lettre_debut_listproduit').val() + '"' : "" )
                    + ($('#lettre_fin_listproduit').val() ? ',letter_end:' + '"' + $('#lettre_fin_listproduit').val() + '"' : "" )
                    +')';
            }
            $scope.requetteTabCaCommande = ""
                /* + ($('#cip_fichierproduit').val() ? (',' + $('#searchoption_listproduit').val() + ':"' + $('#cip_fichierproduit').val() + '"') : "" )
                 + ($('#designation_fichierproduit').val() ? ',designation:"' + $('#designation_fichierproduit').val() + '"' : "" )
                 + ($('#type_fichierproduit').val() ? ',type_produit_id:' + $('#type_fichierproduit').val() : "" )
                 + ($('#famille_fichierproduit').val() ? ',famille_produit_id:' + $('#famille_fichierproduit').val() : "" )*/

                + ($('#restaurant_etatgeneral').val() ? ',restaurant_id:' + $('#restaurant_etatgeneral').val() : "" )
                + ($('#start_date_etatgeneral').val() ? ',start_date:' + '"' + $('#start_date_etatgeneral').val() + '"' : "" )
                + ($('#end_date_etatgeneral').val() ? ',end_date:' + '"' + $('#end_date_etatgeneral').val() + '"' : "" );

                $scope.requeCommandeproduit = ""
                + ($('#restaurant_commandeproduit').val() ? ',restaurant_id:' + $('#restaurant_commandeproduit').val() : "" )
                + ($('#prooduit_commandeproduit').val() ? ',restaurant_id:' + $('#prooduit_commandeproduit').val() : "" )
                + ($('#start_date_commandeproduit').val() ? ',start_date:' + '"' + $('#start_date_commandeproduit').val() + '"' : "" )
                + ($('#end_date_commandeproduit').val() ? ',end_date:' + '"' + $('#end_date_commandeproduit').val() + '"' : "" );

                $scope.requetteTypecommande = ""
                    + ($('#restaurant_commandetype').val() ? ',restaurant_id:' + $('#restaurant_commandetype').val() : "" )
                    + ($('#prooduit_commandetype').val() ? ',restaurant_id:' + $('#prooduit_commandetype').val() : "" )
                    + ($('#start_date_commandetype').val() ? ',start_date:' + '"' + $('#start_date_commandetype').val() + '"' : "" )
                    + ($('#end_date_commandetype').val() ? ',end_date:' + '"' + $('#end_date_commandetype').val() + '"' : "" );
            $scope.requettelistproduitFamille = ""
            + ($('#restaurant_listproduitfamille').val() ? ',restaurant:' + $('#restaurant_listproduitfamille').val() : "" )
            + ($('#famille_listproduitfamille').val() ? ',famille:' + $('#famille_listproduitfamille').val() : "" )
            + ($('#created_at_end_listproduitfamille').val() ? ',end_date:' + '"' + $('#created_at_end_listproduitfamille').val() + '"' : "" )
            + ($('#created_at_start_listproduitfamille').val() ? ',start_date:' + '"' + $('#created_at_start_listproduitfamille').val() + '"' : "" );
        }
        if (type.indexOf('recettes')!==-1)
        {
            rewriteType = rewriteType + "("
                /* = listrecette*/ + (!($('#date_start_listrecette').val() && $('#date_start_listrecette').val()) ? "recette_current:true" : "" )
                /* = listrecette*/ + ($('#restaurant_listrecette').val() ? ',restaurant_id:' + $('#restaurant_listrecette').val() : "" )
                /* = listrecette*/ + ($('#date_start_listrecette').val() ? ',date_recette_start:' + '"' + $('#date_start_listrecette').val() + '"' : "" )
                /* = listrecette*/ + ($('#date_end_listrecette').val() ? ',date_recette_end:' + '"' + $('#date_end_listrecette').val() + '"' : "" )
                + ")";
            $scope.saveRequetteCa = "" + (!($('#date_start_listrecette').val() && $('#date_start_listrecette').val()) ? "recette_current:true" : "" )
                /* = listrecette*/ + ($('#restaurant_listrecette').val() ? ',restaurant_id:' + $('#restaurant_listrecette').val() : "" )
                /* = listrecette*/ + ($('#date_start_listrecette').val() ? ',date_recette_start:' + '"' + ($('#date_start_listrecette').val()).split("/").reverse().join("-") + '"' : "" )
                /* = listrecette*/ + ($('#date_end_listrecette').val() ? ',date_recette_end:' + '"' + ($('#date_end_listrecette').val()).split("/").reverse().join("-") + '"' : "" );
        }

        var listAttr = listofrequests_assoc[type];

        // Si je requette pour récupérer les restaurants depuis la gestion des dépenses, j'ajoute le solde actuel à la liste des elements
        if (type.indexOf('restaurants')!==-1 && $scope.linknav.indexOf('gestion_depense')!==-1)
        {
            listAttr = 'id,designation,current_balance';
        }

        Init.getElement(rewriteType, listAttr).then(function(data)
        {
            if (type.indexOf("zonelivraisonrestaurants")!==-1)
            {
                console.log('arrive ici zonelivraisonrestaurants=>');
                $scope.zonelivraisonrestaurants = data;
            }
            else if (type.indexOf("restaurant")!==-1)
            {
                $scope.restaurants = data;
            }
            else if (type.indexOf("dashboards")!==-1)
            {
                $scope.dashboard_data = data;
                //$scope.dashboard_data[0].chiffre_affaires = JSON.parse(data[0].chiffre_affaires);
                //$scope.dashboard_data[0].commandes_total  = JSON.parse(data[0].commandes_total);
                $scope.dashboard_data[0].restaurants      = JSON.parse(data[0].restaurants);

                console.log('infos du dashboards ==> getelements',   $scope.dashboard_data);
            }
            else if (type.indexOf("chiffreaffaires")!==-1)
            {
                $scope.chiffreaffaires = data;
                if (data)
                {
                    $scope.chiffreaffaires = JSON.parse(data[0].commandes_total);
                    console.log('infos du dashboards ==> getelements ==> chiffre affaires', JSON.parse(data[0].commandes_total));
                }
            }
            else if (type.indexOf("familleproduits")!==-1)
            {
                $scope.familleproduits = data;
            }
            else if (type.indexOf("typeproduits")!==-1)
            {
                $scope.typeproduits = data;
            }
            else if (type.indexOf("produits")!==-1)
            {
                $scope.produits = data;
            }
            else if (type.indexOf("typeclients")!==-1)
            {
                $scope.typeclients = data;
            }
            else if (type.indexOf("clients")!==-1)
            {
                $scope.clients = data;
            }
            else if (type.indexOf("typecommandes")!==-1)
            {
                $scope.typecommandes = data;
            }
            else if (type.indexOf("categoriecommandes")!==-1)
            {
                $scope.categoriecommandes = data;

                $scope.categoriecommandesSelection = data[0].id;
                console.log('categoriecommandesSelection', $scope.categoriecommandesSelection)
            }
            else if (type.indexOf("commandes")!==-1)
            {
                $scope.commandes = data;
            }
            else if (type.indexOf("modepaiements")!==-1)
            {
                $scope.modepaiements = data;
            }
            else if (type.indexOf("paiements")!==-1)
            {
                $scope.paiements = data;
            }
            else if (type.indexOf("caisses")!==-1)
            {
                $scope.caisses = data;
            }
            else if (type.indexOf("categoriedepenses")!==-1)
            {
                $scope.categoriedepenses = data;
            }
            else if (type.indexOf("typedepenses")!==-1)
            {
                $scope.typedepenses = data;
            }
            else if (type.indexOf("tiers")!==-1)
            {
                $scope.tiers = data;
            }
            else if (type.indexOf("depenses")!==-1)
            {
                $scope.depenses = data;
            }
            else if (type.indexOf("recettes")!==-1)
            {
                $scope.recettes = data;
            }
            else if (type.indexOf("banques")!==-1)
            {
                $scope.banques = data;
            }
            else if (type.indexOf("zonelivraisons")!==-1)
            {
                $scope.zonelivraisons = data;
            }
            else if (type.indexOf("horaireconnexions")!==-1)
            {
                $scope.horaireconnexions = data;
            }
            else if (type.indexOf("crenohoraires")!==-1)
            {
                $scope.crenohoraires = data;
            }
            else if (type.indexOf("cartes")!==-1)
            {
                $scope.cartes = data;
            }
            else if (type.indexOf("livreurs")!==-1)
            {
                $scope.livreurs = data;
            }
            else if (type.indexOf("minuteries")!==-1)
            {
                $scope.minuteries = data;
            }
            else if (type.indexOf("cadeaus")!==-1)
            {
                $scope.cadeaus = data;
            }
            else if (type.indexOf("menus")!==-1)
            {
                $scope.menus = data;
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
/*             else if (type.indexOf("dashboards")!==-1)
            {
                $scope.dashboard_data = data;
                $scope.dashboard_data[0].commandes = JSON.parse(data[0].commandes);
                console.log('infos du dashboards', data);
            } */
        }, function (msg) {
            iziToast.error({
                title: "ERREUR",
                message: msg_erreur,
                position: 'topRight'
            });
            console.log('Erreur serveur ici = ' + msg);
        });
    };

    $scope.searchtexte_client = "";
    $scope.pageChanged = function(currentpage)
    {
        if ( currentpage.indexOf('produit')!==-1 )
        {
            var typeproduit_modal = null;
            $('.typeproduit_modal.filter').each(function(key, value){
                if ($(this).val())
                {
                    typeproduit_modal = $(this).val();
                }
            });
            var familleproduit_modal = null;
            $('.familleproduit_modal.filter').each(function(key, value){
                if ($(this).val())
                {
                    familleproduit_modal = $(this).val();
                }
            });

            var searchcodeprod_modal = null;
            $('.searchcodeprod_modal.filter').each(function (key, value) {
                if ($(this).val()) {
                    searchcodeprod_modal = $(this).val();
                }
            });

            var searchdesignationprod_modal = null;
            $('.searchdesignationprod_modal.filter').each(function (key, value)
            {
                if ($(this).val())
                {
                    searchdesignationprod_modal = $(this).val();
                }
            });

            rewriteelement = 'produitspaginated(page:'+ $scope.paginationproduit.currentPage +',count:'+ $scope.paginationproduit.entryLimit

                //+ ( (!isNaN($scope.this_restaurant_user_carte) && $scope.this_restaurant_user_carte!=undefined && $scope.this_restaurant_user_carte!=0) ? ',carte_id:' + $scope.this_restaurant_user_carte : "" )

                + ($scope.commandeview ? ',commande_id:' + $scope.commandeview.id : "" )
                + (searchdesignationprod_modal ? (',name:' + '"' + searchdesignationprod_modal + '"') : "" )
                + (searchcodeprod_modal ? (',code_pro:' + '"' + searchcodeprod_modal + '"') : "" )

                // filter search_designation_produitcommande pour les produits
                // +($('#search_designation_produitcommande.filter').val() ? (',designation:' + '"' + $('#search_designation_produitcommande.filter').val() + '"') : "" )

                + (typeproduit_modal ? ',type_produit_id:' + typeproduit_modal : "" )
                + (familleproduit_modal ? ',famille_produit_id:' + familleproduit_modal : "" )
                // + ($scope.this_restaurant_user!=0 ? ',restaurant_id:' + $scope.this_restaurant_user : "" )
                + ($('#searchtexte_listproduit').val() ? (',' + $('#searchoption_listproduit').val() + ':"' + $('#searchtexte_listproduit').val() + '"') : "" )
                // + ($('#designationproduit_listproduit').val() ? ',name:"' + $('#designationproduit_listproduit').val() + '"' : "" )
                + ($('#typeproduitlist_produit').val() ? ',type_produit_id:' + $('#typeproduitlist_produit').val() : "" )
                + ($('#familleproduitlist_produit').val() ? ',famille_produit_id:' + $('#familleproduitlist_produit').val() : "" )
                + ($('#restaurantlist_produit').val() ? ',restaurant_id:' + $('#restaurantlist_produit').val() : "" )

                + (($("#modal_addcommande").data('bs.modal') || {})._isShown && $('#restaurant_commande').val() ? ',restaurant_id:' + $('#restaurant_commande').val() : "" )
                + (($("#modal_addcommande").data('bs.modal') || {})._isShown ? ',fromCarte:true' : "" )

                + ($('#lettre_debutlist_produit').val() ? ',letter_start:' + '"' + $('#lettre_debutlist_produit').val() + '"' : "" )
                + ($('#lettre_finlist_produit').val() ? ',letter_end:' + '"' + $('#lettre_finlist_produit').val() + '"' : "" )
                + ($('#codelist_produit').val() ? ',code_pro:' + '"' + $('#codelist_produit').val() + '"' : "" )
                + ($('#name_listproduit').val() ? ',name:' + '"' + $('#name_listproduit').val() + '"' : "" )
                +')';
            // blockUI_start_all('#section_listeclients');
            Init.getElementPaginated(rewriteelement, listofrequests_assoc["produits"]).then(function (data)
            {
                console.log(data);
                $scope.paginationproduit = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationproduit.entryLimit,
                    totalItems: data.metadata.total
                };
                $scope.produits = data.data;
            },function (msg)
            {
                toastr.error(msg);
            });
        }
        else if ( currentpage.indexOf('caisse')!==-1 )
        {
            rewriteelement = 'caissespaginated(page:'+ $scope.paginationcaisse.currentPage +',count:'+ $scope.paginationcaisse.entryLimit
                /*+ ($scope.restaurantview ? ',restaurant_id:' + $scope.restaurantview.id : "" )*/
                + ($scope.userview ? ',user_id:' + $scope.userview.id : "" )
                /*+ ($scope.this_restaurant_user!=0 ? ',restaurant_id:' + $scope.this_restaurant_user : "" )*/
                + ($('#userlist_caisse').val() ? ',user_id:' + $('#userlist_caisse').val() : "" )
                + ($('#restaurantlist_caisse').val() ? ',restaurant_id:' + $('#restaurantlist_caisse').val() : "" )
                + ($('#created_at_startlist_caisse').val() ? ',created_at_start:' + '"' + $('#created_at_startlist_caisse').val() + '"' : "" )
                + ($('#created_at_listend_caisse').val() ? ',created_at_end:' + '"' + $('#created_at_listend_caisse').val() + '"' : "" )
                + ($('#date_startlist_caisse').val() ? ',date_start:' + '"' + $('#date_startlist_caisse').val() + '"' : "" )
                + ($('#date_endlist_caisse').val() ? ',date_end:' + '"' + $('#date_endlist_caisse').val() + '"' : "" )
                +')';
            // blockUI_start_all('#section_listeclients');
            Init.getElementPaginated(rewriteelement, listofrequests_assoc["caisses"]).then(function (data)
            {
                // blockUI_stop_all('#section_listeclients');
                console.log(data);
                // pagination controls
                $scope.paginationcaisse = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationcaisse.entryLimit,
                    totalItems: data.metadata.total
                };
                // $scope.noOfPages_produit = data.metadata.last_page;
                $scope.caisses = data.data;
            },function (msg)
            {
                // blockUI_stop_all('#section_listeclients');
                toastr.error(msg);
            });
        }
        else if ( currentpage.indexOf('client')!==-1 )
        {
            rewriteelement = 'clientspaginated(page:'+ $scope.paginationclient.currentPage +',count:'+ $scope.paginationclient.entryLimit
                + ($('#searchtexte_client').val() ? (',' + $('#searchoption_client').val() + ':"' + $('#searchtexte_client').val() + '"') : "" )
                + ($('#typeclientlist_client').val() ? ',type_client_id:' + $('#typeclientlist_client').val() : "" )
                + ($('#restaurantlist_client').val() ? ',restaurant_id:' + $('#restaurantlist_client').val() : "" )
                + ($('#zonelivraisonlist_client').val() ? ',zone_livraison_id:' + $('#zonelivraisonlist_client').val() : "" )
                + ($('#emaillist_client').val() ? ',email:' + '"' + $('#emaillist_client').val() + '"' : "")

                /*+ ($scope.this_restaurant_user!=0 ? ',restaurant_id:' + $scope.this_restaurant_user : "" )*/
                +')';
            // blockUI_start_all('#section_listeclients');
            Init.getElementPaginated(rewriteelement, listofrequests_assoc["clients"]).then(function (data)
            {
                // blockUI_stop_all('#section_listeclients');
                console.log(data);
                // pagination controls
                $scope.paginationclient = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationclient.entryLimit,
                    totalItems: data.metadata.total
                };
                // $scope.noOfPages_produit = data.metadata.last_page;
                $scope.clients = data.data;
            },function (msg)
            {
                // blockUI_stop_all('#section_listeclients');
                toastr.error(msg);
            });
        }
        else if ( currentpage.indexOf('menu')!==-1 )
        {
            var searchdesignationmenu_modal = null;
            $('.searchdesignationmenu_modal.filter').each(function(key, value){
                if ($(this).val())
                {
                    searchdesignationmenu_modal = $(this).val();
                }
            });
            var searchcodemenu_modal = null;
            $('.searchcodemenu_modal.filter').each(function(key, value){
                if ($(this).val())
                {
                    searchcodemenu_modal = $(this).val();
                }
            });
            rewriteelement = 'menuspaginated(page:'+ $scope.paginationmenu.currentPage +',count:'+ $scope.paginationmenu.entryLimit

                // + ($scope.this_restaurant_user_carte!=0 ? ',carte_id:' + $scope.this_restaurant_user_carte : "" )

                // + ($scope.this_restaurant_user!=0 ? ',restaurant_id:' + $scope.this_restaurant_user : "" )

                + ($('#restaurantlist_menu').val() ? ',restaurant_id:' + $('#restaurantlist_menu').val() : "" )

                + (($("#modal_addcommande").data('bs.modal') || {})._isShown && $('#restaurant_commande').val() ? ',restaurant_id:' + $('#restaurant_commande').val() : "" )
                + (($("#modal_addcommande").data('bs.modal') || {})._isShown ? ',fromCarte:true' : "" )

                + (searchdesignationmenu_modal ? (',name:' + '"' + searchdesignationmenu_modal + '"') : "" )
                + (searchcodemenu_modal ? (',code:' + '"' + searchcodemenu_modal + '"') : "" )

                // + ($('.search_designation_menu').val() ? (',' + 'name:"' + $('.search_designation_menu').val() + '"') : "")

                //+ ($('.search_code_menu').val() ? (',' + 'code:"' + $('.search_code_menu').val() + '"') : "")

                + ($scope.radioBtnStatus ? ',status:' + '"' + $scope.radioBtnStatus + '"' : "")
                // + ($('[name="statuslist_menu"]:checked').attr('data-value') ? ',status:' + '"' + $('[name="statuslist_menu"]:checked').attr('data-value') + '"' : "" )
                +')';
            // blockUI_start_all('#section_listeclients');
            Init.getElementPaginated(rewriteelement, listofrequests_assoc["menus"]).then(function (data)
            {
                console.log(data);
                // pagination controls
                $scope.paginationmenu = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationmenu.entryLimit,
                    totalItems: data.metadata.total
                };
                // $scope.noOfPages_produit = data.metadata.last_page;
                $scope.menus = data.data;
            },function (msg)
            {
                // blockUI_stop_all('#section_listemenus');
                toastr.error(msg);
            });
        }
        else if ( currentpage.indexOf('commande')!==-1 )
        {
            rewriteelement = 'commandespaginated(page:'+ $scope.paginationcommande.currentPage +',count:'+ $scope.paginationcommande.entryLimit
                /*+ ($scope.this_restaurant_user!=0 ? ',restaurant_id:' + $scope.this_restaurant_user : "" )*/
                + ($scope.userview ? ',user_id:' + $scope.userview.id : "" )
                + ($scope.clientview ? ',client_id:' + $scope.clientview.id : "" )
                + ($scope.livreurview ? ',livreur_id:' + $scope.livreurview.id : "" )
                + ($scope.onlyEnCours ? ',finis:true' : "" )
                + ($scope.restaurantview ? ',restaurant_id:' + $scope.restaurantview.id : "" )
                + ($('#restaurantlist_commande').val() ? ',restaurant_id:' + $('#restaurantlist_commande').val() : "" )
                + ($('#typecommandelist_commande').val() ? ',type_commande_id:' + $('#typecommandelist_commande').val() : "" )
                + ($('#livrelist_commande').val() ? ',etat_livre:' + $('#livrelist_commande').val() : "" )
                + ($('#clientlist_commande').val() ? ',client_id:' + $('#clientlist_commande').val() : "" )
                + ($('#codeclientlist_commande').val() ? ',code_client:' + $('#codeclientlist_commande').val() : "" )
                + ($('#livreurlist_commande').val() ? ',livreur_id:' + $('#livreurlist_commande').val() : "" )
                + ($('#userlist_commande').val() ? ',user_id:' + $('#userlist_commande').val() : "" )
                + ($('#created_at_startlist_commande').val() ? ',created_at_start:' + '"' + $('#created_at_startlist_commande').val() + '"' : "" )
                + ($('#created_at_endlist_commande').val() ? ',created_at_end:' + '"' + $('#created_at_endlist_commande').val() + '"' : "" )
                + ($('#codelist_commande').val() ? ',id:' + $('#codelist_commande').val() : "" )
                +')';
            $scope.requeteEtatProduit = ""
                + ($('#restaurant_listproduit').val() ? ',restaurant:"' + $('#restaurant_listproduit').val() + '"' : "" )
                + ($('#famille_listproduit').val() ? ',famille:"' + $('#famille_listproduit').val() + '"' : "" )
                + ($('#created_at_start_listproduit').val() ? ',date_debut:"' + $('#created_at_start_listproduit').val() + '"' : "" )
                + ($('#created_at_end_listproduit').val() ? ',date_fin:"' + $('#created_at_end_listproduit').val() + '"' : "" )

            $scope.requeteEtatMenu = ""
                + ($('#restaurant_listmenusetat').val() ? ',restaurant:"' + $('#restaurant_listmenusetat').val() + '"' : "" )
                + ($('#created_at_start_listmenusetat').val() ? ',date_debut:"' + $('#created_at_start_listmenusetat').val() + '"' : "" )
                + ($('#created_at_end_listmenusetat').val() ? ',date_fin:"' + $('#created_at_end_listmenusetat').val() + '"' : "" )
                + ($('#menu_listmenusetat').val() ? ',menu:"' + $('#menu_listmenusetat').val() + '"' : "" )

            $scope.requeteEtatCommande = ""
                + ($('#restaurant_listetatcommande').val() ? ',restaurant:"' + $('#restaurant_listetatcommande').val() + '"' : "" )
                + ($('#created_at_start_listetatcommande').val() ? ',date_debut:"' + $('#created_at_start_listetatcommande').val() + '"' : "" )
                + ($('#created_at_end_listetatcommande').val() ? ',date_fin:"' + $('#created_at_end_listetatcommande').val() + '"' : "" )
                + ($('#typecommande_listetatcommande').val() ? ',type_commande_id:' + $('#typecommande_listetatcommande').val() : "" )

            $scope.requeteEtatCaCommande = ""
                + ($('#restaurant_listcacommande').val() ? ',restaurant:"' + $('#restaurant_listcacommande').val() + '"' : "" )
                + ($('#created_at_start_listetatcommande').val() ? ',date_debut:"' + $('#created_at_start_listetatcommande').val() + '"' : "" )
                + ($('#created_at_end_listcacommande').val() ? ',date_fin:"' + $('#created_at_end_listcacommande').val() + '"' : "" )

            // blockUI_start_all('#section_listeclients');
            Init.getElementPaginated(rewriteelement, listofrequests_assoc["commandes"]).then(function (data)
            {
                // blockUI_stop_all('#section_listeclients');
                // pagination controls
                $scope.paginationcommande = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationcommande.entryLimit,
                    totalItems: data.metadata.total
                };
                $scope.commandes = data.data;
            },function (msg)
            {
                // blockUI_stop_all('#section_listeclients');
                toastr.error(msg);
            });
        }
        else if ( currentpage.indexOf('carte')!==-1 )
        {
            rewriteelement = 'cartespaginated(page:'+ $scope.paginationcarte.currentPage +',count:'+ $scope.paginationcarte.entryLimit
                /*+ ($scope.this_restaurant_user!=0 ? ',restaurant_id:' + $scope.this_restaurant_user : "" )*/
                + ($scope.restaurantview ? ',restaurant_id:' + $scope.restaurantview.id : "" )
                +')';
            // blockUI_start_all('#section_listeclients');
            Init.getElementPaginated(rewriteelement, listofrequests_assoc["cartes"]).then(function (data)
            {
                // blockUI_stop_all('#section_listeclients');
                // pagination controls
                $scope.paginationcarte = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationcarte.entryLimit,
                    totalItems: data.metadata.total
                };
                $scope.cartes = data.data;
            },function (msg)
            {
                // blockUI_stop_all('#section_listeclients');
                toastr.error(msg);
            });
        }
        else if ( currentpage.indexOf('cadeau')!==-1 )
        {
            rewriteelement = 'cadeauspaginated(page:'+ $scope.paginationcadeau.currentPage +',count:'+ $scope.paginationcadeau.entryLimit
                + ($scope.userview ? ',user_id:' + $scope.userview.id : "" )
                + ($('#user_listcadeau').val() ? ',user_id:' + $('#user_listcadeau').val() : "" )
                + ($('#created_at_start_listcadeau').val() ? ',created_at_start:' + '"' + $('#created_at_start_listcadeau').val() + '"' : "" )
                + ($('#created_at_end_listcadeau').val() ? ',created_at_end:' + '"' + $('#created_at_end_listcadeau').val() + '"' : "" )
                +')';
            // blockUI_start_all('#section_listeclients');
            Init.getElementPaginated(rewriteelement, listofrequests_assoc["cadeaus"]).then(function (data)
            {
                // blockUI_stop_all('#section_listeclients');
                // pagination controls
                $scope.paginationcadeau = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationcadeau.entryLimit,
                    totalItems: data.metadata.total
                };
                $scope.cadeaus = data.data;
            },function (msg)
            {
                // blockUI_stop_all('#section_listeclients');
                toastr.error(msg);
            });
        }
        else if ( currentpage.indexOf('tier')!==-1 )
        {
            rewriteelement = 'tierspaginated(page:'+ $scope.paginationtier.currentPage +',count:'+ $scope.paginationtier.entryLimit
                + ($('#searchtexte_tier').val() ? (',' + $('#searchoption_tier').val() + ':"' + $('#searchtexte_tier').val() + '"') : "" )
                /*+ ($scope.this_restaurant_user!=0 ? ',restaurant_id:' + $scope.this_restaurant_user : "" )*/
                +')';
            // blockUI_start_all('#section_listeclients');
            Init.getElementPaginated(rewriteelement, listofrequests_assoc["tiers"]).then(function (data)
            {
                // blockUI_stop_all('#section_listeclients');
                console.log(data);
                // pagination controls
                $scope.paginationtier = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationtier.entryLimit,
                    totalItems: data.metadata.total
                };
                // $scope.noOfPages_produit = data.metadata.last_page;
                $scope.tiers = data.data;
            },function (msg)
            {
                // blockUI_stop_all('#section_listeclients');
                toastr.error(msg);
            });
        }
        else if ( currentpage.indexOf('restaurant')!==-1 || currentpage.indexOf('zonelivraison')!==-1 || currentpage.indexOf('paiementdepense')!==-1 || currentpage.indexOf('categoriedepense')!==-1 || currentpage.indexOf('depense')!==-1 || currentpage.indexOf('entreeca')!==-1 || currentpage.indexOf('versement')!==-1 )
        {
            console.log('for page = ', currentpage, ', addfiltres = ',$scope.generateAddFiltres(currentpage));
            rewriteelement = currentpage + 'spaginated(page:'+ $scope.paginations[currentpage].currentPage +',count:'+ $scope.paginations[currentpage].entryLimit
                /*+ ($scope.this_restaurant_user!=0 ? ',restaurant_id:' + $scope.this_restaurant_user : "" )*/
                + ($scope.depenseview!=null ? ',depense_id:' + $scope.depenseview.id : "" )
                + ($scope.restaurantview ? ',restaurant_id:' + $scope.restaurantview.id : "" )
                + ($scope.userview ? ',user_id:' + $scope.userview.id : "" )
                + $scope.generateAddFiltres(currentpage)
                +')';
            // blockUI_start_all('#section_listeclients');
            Init.getElementPaginated(rewriteelement, listofrequests_assoc[currentpage + "s"]).then(function (data)
            {
                // blockUI_stop_all('#section_listeclients');
                // pagination controls
                $scope.paginations[currentpage] = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginations[currentpage].entryLimit,
                    totalItems: data.metadata.total
                };

                if (currentpage.indexOf('paiementdepense')!==-1)
                {
                    $scope.paiementdepenses = data.data;
                }
                else if (currentpage.indexOf('categoriedepense')!==-1)
                {
                    $scope.categoriedepenses = data.data;
                }
                else if (currentpage.indexOf('depense')!==-1)
                {
                    $scope.depenses = data.data;
                }
                else if (currentpage.indexOf('entreeca')!==-1)
                {
                    $scope.entreecas = data.data;
                }
                else if (currentpage.indexOf('versement')!==-1)
                {
                    $scope.versements = data.data;
                }
                else if (currentpage.indexOf('zonelivraison')!==-1)
                {
                    $scope.zonelivraisons = data.data;
                }
                else if (currentpage.indexOf('restaurant')!==-1)
                {
                    $scope.restaurants = data.data;
                }

            },function (msg)
            {
                // blockUI_stop_all('#section_listeclients');
                toastr.error(msg);
            });
        }
        else if ( currentpage.indexOf('livreur')!==-1 )
        {
            rewriteelement = 'livreurspaginated(page:'+ $scope.paginationlivreur.currentPage +',count:'+ $scope.paginationlivreur.entryLimit
                /*+ ($scope.this_restaurant_user!=0 ? ',restaurant_id:' + $scope.this_restaurant_user : "" )*/
                + ($('#searchtexte_livreur').val() ? (',' + $('#searchoption_livreur').val() + ':"' + $('#searchtexte_livreur').val() + '"') : "" )
                + ($('#restaurantlist_livreur').val() ? ',restaurant_id:' + $('#restaurantlist_livreur').val() : "" )
                + ($('[name="etatlist_livreur"]:checked').attr('data-value') ? ',status:' + '"' + $('[name="etatlist_livreur"]:checked').attr('data-value') + '"' : "" )
                +')';
            // blockUI_start_all('#section_listeclients');
            Init.getElementPaginated(rewriteelement, listofrequests_assoc["livreurs"]).then(function (data)
            {
                console.log(data);
                // pagination controls
                $scope.paginationlivreur = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationlivreur.entryLimit,
                    totalItems: data.metadata.total
                };
                // $scope.noOfPages_produit = data.metadata.last_page;
                $scope.livreurs = data.data;
            },function (msg)
            {
                toastr.error(msg);
            });
        }
        else if ( currentpage.indexOf('minuterie')!==-1 )
        {
            rewriteelement = 'minuteriespaginated(page:'+ $scope.paginationminuterie.currentPage +',count:'+ $scope.paginationminuterie.entryLimit
                + ($('#created_at_start_listminuterie').val() ? ',created_at_start:' + '"' + $('#created_at_start_listminuterie').val() + '"' : "" )
                + ($('#created_at_end_listminuterie').val() ? ',created_at_end:' + '"' + $('#created_at_end_listminuterie').val() + '"' : "" )
                +')';
            // blockUI_start_all('#section_listeclients');
            Init.getElementPaginated(rewriteelement, listofrequests_assoc["minuteries"]).then(function (data)
            {
                // blockUI_stop_all('#section_listeclients');
                // console.log('fac', data);
                // pagination controls
                $scope.paginationminuterie = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationminuterie.entryLimit,
                    totalItems: data.metadata.total
                };
                $scope.minuteries = data.data;
                console.log($scope.minuteries)
            },function (msg)
            {
                // blockUI_stop_all('#section_listeclients');
                toastr.error(msg);
            });
        }
        else if ( currentpage.indexOf('paiement')!==-1 )
        {
            rewriteelement = 'paiementspaginated(page:'+ $scope.paginationpaiement.currentPage +',count:'+ $scope.paginationpaiement.entryLimit
                + ($scope.commandeview!=null ? ',commande_id:' + $scope.commandeview.id : "" )
                + ($scope.userview ? ',user_id:' + $scope.userview.id : "" )
                /* = listpaiement*/ + ($('#mode_paiementlist_paiement').val() ? ',mode_paiement:' + '"' + $('#mode_paiementlist_paiement').val() + '"' : "" )
                /* = listpaiement*/ + ($('#commandelist_paiement').val() ? ',commande_id:' + $('#commandelist_paiement').val() : "" )
                /* = listpaiement*/ + ($('#created_at_startlist_paiement').val() ? ',created_at_start:' + '"' + $('#created_at_startlist_paiement').val() + '"' : "" )
                /* = listpaiement*/ + ($('#created_at_endlist_paiement').val() ? ',created_at_end:' + '"' + $('#created_at_endlist_paiement').val() + '"' : "" )
                /* = listpaiement*/ + ($('#date_startlist_paiement').val() ? ',date_start:' + '"' + $('#date_startlist_paiement').val() + '"' : "" )
                /* = listpaiement*/ + ($('#date_endlist_paiement').val() ? ',date_end:' + '"' + $('#date_endlist_paiement').val() + '"' : "" )
                +')';
            // blockUI_start_all('#section_listeclients');
            Init.getElementPaginated(rewriteelement, listofrequests_assoc["paiements"]).then(function (data)
            {
                // blockUI_stop_all('#section_listeclients');
                console.log('paiementspaginated', data);
                // pagination controls
                $scope.paginationpaiement = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationpaiement.entryLimit,
                    totalItems: data.metadata.total
                };
                $scope.paiements = data.data;
            },function (msg)
            {
                // blockUI_stop_all('#section_listeclients');
                toastr.error(msg);
            });
        }
        else if ( currentpage.indexOf('vente')!==-1 )
        {
            var searchclientvente_modal = null;
            $('.searchclientvente_modal.filter').each(function(key, value){
                if ($(this).val())
                {
                    searchclientvente_modal = $(this).val();
                }
            });
            var searchrestaurantvente_modal = null;
            $('.searchrestaurantvente_modal.filter').each(function(key, value){
                if ($(this).val())
                {
                    searchrestaurantvente_modal = $(this).val();
                }
            });
            console.log('searchclientvente_modal =', searchclientvente_modal, 'searchrestaurantvente_modal = ', searchrestaurantvente_modal);
            rewriteelement = 'ventespaginated(page:'+ $scope.paginationvente.currentPage +',count:'+ $scope.paginationvente.entryLimit
                + ($scope.userview ? ',user_id:' + $scope.userview.id : "" )
                + ($scope.caisseview ? ',caisse_id:' + $scope.caisseview.id : "" )
                + ($scope.clientview ? ',client_id:' + $scope.clientview.id : "" )
                + ($scope.a_recouvrer ? ',a_recouvrer:true' : "" )
                + ($scope.restaurantview ? ',restaurant_id:' + $scope.restaurantview.id : "" )
                + ($scope.produitview ? ',produit_id:' + $scope.produitview.id : "" )
                + (searchrestaurantvente_modal ? ',restaurant_id:' + searchrestaurantvente_modal : "" )
                + (searchclientvente_modal ? ',client_id:' + searchclientvente_modal : "" )
                + ($('#searchtexte_vente').val() ? (',' + $('#searchoption_vente').val() + ':"' + $('#searchtexte_vente').val() + '"') : "" )
                + ($('#restaurant_listvente').val() ? ',restaurant_id:' + $('#restaurant_listvente').val() : "" )
                + ($('#client_listvente').val() ? ',client_id:' + $('#client_listvente').val() : "" )
                + ($('#user_listvente').val() ? ',user_id:' + $('#user_listvente').val() : "" )
                + ($('#caisse_listvente').val() ? ',caisse_id:' + $('#caisse_listvente').val() : "" )
                + ($('[name="etat_listvente"]:checked').attr('data-value') ? ',etat_vente:' + '"' + $('[name="etat_listvente"]:checked').attr('data-value') + '"' : "" )
                + ($('#created_at_start_listvente').val() ? ',created_at_start:' + '"' + $('#created_at_start_listvente').val() + '"' : "" )
                + ($('#created_at_end_listvente').val() ? ',created_at_end:' + '"' + $('#created_at_end_listvente').val() + '"' : "" )
                +')';
            // blockUI_start_all('#section_listeclients');
            Init.getElementPaginated(rewriteelement, listofrequests_assoc["ventes"]).then(function (data)
            {
                // blockUI_stop_all('#section_listeclients');
                console.log('ventespaginated', data);
                // pagination controls
                $scope.paginationvente = {
                    currentPage: data.metadata.current_page,
                    maxSize: 10,
                    entryLimit: $scope.paginationvente.entryLimit,
                    totalItems: data.metadata.total
                };
                $scope.ventes = data.data;
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

                /*+ ($scope.this_restaurant_user!=0 ? ',restaurant_id:' + $scope.this_restaurant_user : "" )*/
                + ($('#searchrole_user').val() ? ',role_id:' + $('#searchrole_user').val() : "" )
                + ($('#searchtexte_user').val() ? (',' + $('#searchoption_user').val() + ':"' + $('#searchtexte_user').val() + '"') : "" )
                + ($('#restaurantlist_user').val() ? ',restaurant_id:' + $('#restaurantlist_user').val() : "" )
                + ($('#created_at_startlist_user').val() ? ',created_at_start:' + '"' + $('#created_at_startlist_user').val() + '"' : "" )
                + ($('#created_at_endlist_user').val() ? ',created_at_end:' + '"' + $('#created_at_endlist_user').val() + '"' : "" )
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


    $scope.ngModelChanged = function(ngModelName, currentPage = null)
    {
        $('#type_depense_depense').val("");
        if (ngModelName.indexOf('categorie_depense_depense')!==-1)
        {
            $.each($scope.categoriedepenses, function(keyItem, valueItem)
            {
                if (valueItem.id == $('#' + ngModelName).val() && valueItem.type_depense)
                {
                    $('#type_depense_depense').val(valueItem.type_depense.id);
                }
            });
        }
    };

    $scope.OneBuffetAlReadySelected = true;
    // Permet d'ajouter une reservation à la liste des reservation d'une facture
    $scope.ligne_carte_menus = [];
    $scope.panier = [];
    $scope.addToMenu = function(item)
    {
        console.log(' coucouc  cest moi', item)
        let add = true;
        $.each($scope.panier, function (key, value) {
            if (item = item.produit_id)
                item.id = item.produit_id;
            var test;
            if (!value) {
                test = true;
            }
            else {
                test = Number(value.produit_id) === Number(item.id);
            }
            if (test) {
                console.log();
                if (action == 0) {
                    $scope.panier.splice(key, 1);
                }
                add = false;
            }
            // return add;
        });
        if (add) {
            $scope.panier.push({ });
        }
    };
    /*$scope.addToMenu = function (event, itemId)
    {
        $scope.OneBuffetAlReadySelected = true;
        $scope.produit_ia = null;
        $scope.ligne_carte_menus = [];
        $("[id^=consommation_menu]").each(function (key,value)
        {
            if ($(this).prop('checked'))
            {
                var produit_id = Number($(this).attr('data-consommation-id'));
                $.each($scope.produits, function (key, value) {
                    if (produit_id==value.id && value.is_buffet)
                    {
                        $scope.OneBuffetAlReadySelected = false;
                        $scope.produit_ia = produit_id;
                        /!*$("[id^=consommation_menu]").each(function (keyUn,valueUn)
                        {
                            if(produit_id!=Number($(this).attr('data-consommation-id')))
                            {
                                console.log('checked', $(this).prop('checked'));
                                $(this).prop('checked', false);
                                console.log('checked', $(this).prop('checked'));
                            }
                        })*!/;
                        $scope.ligne_carte_menus.push(produit_id);
                    }
                });
                if ($scope.OneBuffetAlReadySelected)
                {
                    console.log($scope.OneBuffetAlReadySelected);
                    $scope.ligne_carte_menus.push(produit_id);
                }
            }
        });
        console.log('arrive menu', $scope.ligne_carte_menus);
    };
*/

    $scope.radioBtnStatus = null;

    $scope.onRadioClickStatus = function ($event, param) {

        console.log('onRadioClickStatus =>', $event, $($event.target).attr('name'));

        $scope.radioBtnStatus = param;

        console.log('onRadioClickStatus =>', param);
    };

    $scope.open_collapsed = false;
    $scope.collapsedFunction = function() {
        $('.collapse').collapse('toggle');
        //$scope.open_collapsed = !$scope.open_collapsed;
    }

    $scope.eraseCollapsed = function() {
        //$scope.open_collapsed = false;
        $('.collapse').collapse('hide');
    }

    $scope.viderPanier = function()  {

        $scope.panier = [];
        $scope.selectionCarte = [];
        $scope.client_commande = null;

        /*au fermetue du modal */
        $scope.paginationproduit.currentPage = 1;
        $scope.paginationmenu.currentPage = 1;

        setTimeout(function()
        {
            $scope.pageChanged('produit');
            $scope.pageChanged('menu');
        }, 500);
        console.log("le panier est ", $scope.panier)
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


    // to rewrite url of select2 search
    function dataUrlEntity(query, entity)
    {
        console.log('dataUrlEntity=>',entity );
        rewriteelement = entity + 's(count:30'
            + ((query.term) ? ',search:' + '"' + query.term + '"' : "")
            + (($("#modal_addcommande").data('bs.modal') || {})._isShown && $('#restaurant_commande').val() ? ',restaurant_id:' + $('#restaurant_commande').val() : "" )
            + ')';

        rewriteelement = BASE_URL + 'graphql?query={' + rewriteelement + "{" + listofrequests_assoc[entity + 's'][0] + "}}";
        console.log('url', rewriteelement);
        return rewriteelement;
    }

    // To get Data of search select2
    function processResultsForSearchEntity (getData, entity )
    {
        console.log('this context');
        if (entity)
        {
            getData = getData.data[entity + 's'];
            if (entity == "client")
            {
                $scope.clients = getData;
            }
            else if (entity == "tier")
            {
                $scope.tiers = getData;
            }
        }
        else
        {
            getData = [];
        }

        var resultsData = [];
        $.each(getData, function (keyItem, valueItem)
        {
            if (entity)
            {
                console.log('valueItem=>', valueItem, $.isNumeric(valueItem.id));
                contentToPush = { id: valueItem.id, text: valueItem.nomcomplet + ' ' + valueItem.telephone };
            }
            else contentToPush = null;

            if(contentToPush)
            {
                resultsData.push(contentToPush);
            }
        });

        console.log('getData => ', getData, 'results =>', resultsData);

        return {
            results: resultsData
        };
    }

    // to detect all changes of select2
    function OnChangeSelect2(e)
    {
        var getId = $(this).attr("id");
        var getValue = $(this).val();
        console.log('getId', getId, 'value', $(this).val())

        if (getId.indexOf('zone') !== -1)
        {
            $scope.itemChange_detailcommande($(this).val(), 'zone');
        }
        else if (getId.indexOf('client_commande') !== -1)
        {
            $scope.itemChange_detailcommande($(this).val(), 'client');
            //$scope.client_commande = getValue;

            if (!($("#modal_addcommande").data('bs.modal') || {})._isShown)
            {
                $scope.clientSelected = null;
            }
            $.each($scope.clients, function (keyItem, valueItem)
            {
                if (getValue == valueItem.id)
                {
                    $scope.clientSelected = valueItem;

                    return false;
                }
            });
        }
        else if (getId.indexOf('tier_depense') !== -1)
        {
            //$scope.tier_depense = getValue;
            if (!($("#modal_adddepense").data('bs.modal') || {})._isShown)
            {
                $scope.tierSelected = null;
            }
            $.each($scope.tiers, function (keyItem, valueItem)
            {
                if (getValue == valueItem.id)
                {
                    $scope.tierSelected = valueItem;
                    console.log('item détecté ici');
                    return false;
                }
            });
        }
        else if (getId.indexOf('categorie_depense_depense') !== -1)
        {
            var currentTypeDepense = null;
            $.each($scope.categoriedepenses, function (keyItem, valueItem)
            {
                if (getValue == valueItem.id && valueItem.type_depense)
                {
                    currentTypeDepense = valueItem.type_depense.id;
                    return false;
                }
            });

            $('#type_depense_depense').val(currentTypeDepense);

        }


        if(!$scope.$$phase)
        {
            $scope.$apply();
        }
    }


    function setAjaxToSelect2OptionsForSearch(getEntity)
    {
        return {
            url: query => dataUrlEntity(query, getEntity),
            data: null,
            dataType: 'json',
            processResults: function(getData) {
                return processResultsForSearchEntity(getData, getEntity);
            },
            cache: true
        };
    };

    $scope.reInit = function(type="select2")
    {
        if( $scope.sousfamille.reponse == true)
        {
            $scope.sousfamille.reponse = false;
        }
        setTimeout(function () {

            $('.select2').each(function(key, value)
            {
                if ($(this).data('select2'))
                {
                    $(this).select2('destroy');
                }
                var select2Options = {
                    //width: 'resolve',
                };
                if($(this).attr('class').indexOf('modal')!==-1)
                {
                    //console.log('select2 modal *********************');
                    select2Options.dropdownParent = $(this).parent().parent();
                    $(this).css("width", "100%");
                }

                // Pour le initSearchEntity
                var tagSearch = 'search_';
                if($(this).attr('class').indexOf(tagSearch)!==-1)
                {
                    allClassEntity = $(this).attr('class').split(' ').filter(function( cn ) {
                        return cn.indexOf(tagSearch) === 0;
                    });
                    if (allClassEntity.length > 0)
                    {
                        getEntity = allClassEntity[0].substring(tagSearch.length, allClassEntity[0].length);
                        console.log('getEntity********************', allClassEntity, getEntity);
                        select2Options.minimumInputLength = 2;
                        select2Options.placeholder = getEntity.toUpperCase();
                        select2Options.ajax = setAjaxToSelect2OptionsForSearch(getEntity);
                    }
                }
                console.log('select2', select2Options);
                $(this).select2(select2Options);
            }).on('change', OnChangeSelect2);


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

        },1000);
    };
    $scope.panier = [];
    $scope.details_monnaie = [];
    //$scope.lignes_proforma = [];
    //$scope.lignes_livraison = [];
    //$scope.lignes_vente = [];
    $scope.selectionlisteproduits = $scope.produits;
    $scope.addInCommande = function(event, from = 'commande', item, action=1)
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
                    else if (from.indexOf('carte')!==-1)
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
            if (from.indexOf('commande')!==-1)
            {
                $scope.panier.push({"id":item.id, "produit_id":item.id, "name":item.name, "qte_commande" : 1, "offert" : 0,"options" :"", "prix":item.prix});

            }
            else if (from.indexOf('carte')!==-1)
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
    $scope.selectionCarte = [];
    $scope.addCarteIn = function(event, from = 'carte', item, action=1)
    {
        console.log('from', from);
        var add = true;
        $.each($scope.selectionCarte, function (key, value)
        {
            console.log('ici selectionCarte', from);
            if (Number(value.menu_id) === Number(item.id))
            {
                console.log('value', value);
                if (action==0)
                {
                    $scope.selectionCarte.splice(key,1);
                }
                else
                {
                    if (from.indexOf('carte')!==-1)
                    {
                        $scope.selectionCarte[key].nb_click+=action;
                        if ($scope.selectionCarte[key].nb_click===0)
                        {
                            $scope.selectionCarte.splice(key,1);
                        }
                    }
                    else if (from.indexOf('commande')!==-1)
                    {
                        $scope.selectionCarte[key].qte_commande+=action;
                        if ($scope.selectionCarte[key].qte_commande===0)
                        {
                            $scope.selectionCarte.splice(key,1);
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
            if (from.indexOf('carte')!==-1)
            {
                $scope.selectionCarte.push({"id":item.id,"menu_id":item.id, "name":item.name, "prix":item.prix});
            }
            else if (from.indexOf('commande')!==-1)
            {
                $scope.selectionCarte.push({"id":item.id,"menu_id":item.id,"qte_commande":1,"offert":0,"options":item.options, "name":item.name, "prix":item.prix});
            }
        }
        if (from.indexOf('teste')!==-1)
        {
            $scope.selectionCarte.push({"id":item.id,"menu_id":item.id,"qte_commande":1,"offert":0,"options":item.options, "name":item.name, "prix":item.prix});
            $scope.calculateTotal('commande');
        }
        if (from.indexOf('commande')!==-1)
        {
            $scope.calculateTotal('commande');
        }
    };
    $scope.changeIn = function() {
        $scope.getelements('familleproduits');
        $scope.nbfamilleReel = [];
        $scope.nbsousfamilleReel = [];
        $.each($scope.familleproduits, function (keyItem, oneItem) {
            if (oneItem.famille_produit_id === null) {
                $scope.nbfamilleReel.push(oneItem);
            }
            else {
                $scope.nbsousfamilleReel.push(oneItem);
            }
        });
        console.log($scope.familleproduits,$scope.nbfamilleReel, $scope.nbsousfamilleReel);
    };
    $scope.actionStock = function(event, from = 'entree', item)
    {
        if (from.indexOf('entree') !== -1) {
            $('#produit_entreestock').val(item.id);
            $('#nomproduit_entreestock').val(item.designation);
            console.log(item.id, item.designation);
        } else if (from.indexOf('sortie') !== -1) {
            $('#produit_sortiestock').val(item.id);
            $('#nomproduit_sortiestock').val(item.designation);
        }else if (from.indexOf('detail') !== -1) {
            var cip = item.cip; var cip2 = item.cip2; var cip3 = item.cip3; var cip4 = item.cip4;
            var nom = item.designation;
            if (item.produits.length != 0) {
                var id_detail = item.produits[0].id;
                $('#id_detaillerproduit').val(id_detail);
                $('#nombre_tablette_detaillerproduit').val(item.produits[0].nombre_detail).attr("readonly", true);
                $('#prix_tablette_detaillerproduit').val(item.produits[0].prix_public).attr("readonly", true);
            }
            else {
                $('#id_detaillerproduit').val("");
                $('#nombre_tablette_detaillerproduit').val("").attr("readonly", false);
                $('#prix_tablette_detaillerproduit').val("").attr("readonly", false);
            }
            $('#nomproduit_detaillerproduit').val(item.designation);
            $('#designation_detaillerproduit').val(nom+'/DETAIL');
            $('#prix_cession_detaillerproduit').val(0);
            $('#produit_id_detaillerproduit').val(item.id);
            $('#with_tva_detaillerproduit').val(item.with_tva);
            $('#noart_detaillerproduit').val(item.noart);
            $('#famille_produit_detaillerproduit').val(item.famille_produit_id);
            $('#type_produit_detaillerproduit').val(item.type_produit_id);
            $('#categorie_produit_detaillerproduit').val(item.categorie_id);
            if (item.cip != null) {$('#cip_detaillerproduit').val(cip+'/detail')}
            if (item.cip2 != null) {$('#cip2_detaillerproduit').val(cip2+'/detail')}
            if (item.cip3 != null) {$('#cip3_detaillerproduit').val(cip3+'/detail')}
            if (item.cip4 != null) {$('#cip4_detaillerproduit').val(cip4+'/detail')}
        }
    };
    $scope.addInDetailsMonnaie = function(event)
    {
        var valeurMonnaie = 0;
        $.each($scope.monaies, function (keyItem, oneItem) {
            if (oneItem.id == $('#typemonnaie_cloture').val()) {
                valeurMonnaie = oneItem.valeur;
            }
        });
        $scope.details_monnaie.push({"id":$('#typemonnaie_cloture').val(),"monaie_id":$('#typemonnaie_cloture').val(),"nombre":$('#nombremonnaie_cloture').val(),"valeur":valeurMonnaie});
        $('#nombremonnaie_cloture').val("");
        $('#typemonnaie_cloture').val("");
        console.log('details_monnaie', $scope.details_monnaie);
    };

    $scope.addIdCarte = function()
    {
        $scope.this_restaurant_user_carte = Number($('#this_restaurant_user_carte').val());
        console.log('carte id', $scope.this_restaurant_user_carte);

        /*setTimeout(function ()
        {
            $scope.pageChanged("menu");
            $scope.pageChanged("produit");
        },500);*/
    };

    $("#modal_addcommande").on('hidden.bs.modal', ()=>{
        console.log('hide hide')
        $scope.this_restaurant_user_carte = 0;
        console.log('carte id', $scope.this_restaurant_user_carte);
        /*
        setTimeout(function ()
        {
            $scope.pageChanged("menu");
            $scope.pageChanged("produit");
        },500);
         */
    });

    /*$scope.addInProforma = function(event, item)
    {
        $scope.lignes_proforma.push({"id":item.id,"produit_id":item.id, "designation":item.designation,"tva":item.tva, "qte" : 1,"remise" : 0, "prix_achat":item.prix_cession});
        console.log('Nos lignes de facture', $scope.lignes_proforma);
    };*/
    /*$scope.addInVente = function(event, item)
    {
        $scope.lignes_vente.push({"id":item.id,"produit_id":item.id, "designation":item.designation, "qte_vendue" : 1, "prix_unitaire":item.prix_cession});
        console.log('Nos lignes de vente', $scope.lignes_vente);
    };*/
    /*$scope.addInLivraison = function(event, item)
    {
        $scope.lignes_livraison.push({"id":item.id,"produit_id":item.id,"code":item.code, "designation":item.designation, "tva":item.tva, "qte_livre" : 1, "qte_bonus" : 0, "prix_vente":item.prix_cession});
        console.log('Nos lignes de livraison', $scope.lignes_livraison);
    };*/
    /*$scope.deleteFromLivraison = function (selectedItem = null) {
        //  console.log('Je suis dans delete');
        $.each($scope.lignes_livraison, function (keyItem, oneItem) {
            if (oneItem.id == selectedItem.id) {
                $scope.lignes_livraison.splice(keyItem, 1);
                return false;
            }
        });
        console.log('Nos lignes de livraison', $scope.lignes_livraison);
    };*/
    /*$scope.deleteFromVente = function (selectedItem = null) {
        //  console.log('Je suis dans delete');
        $.each($scope.lignes_vente, function (keyItem, oneItem)
        {
            if (oneItem.id == selectedItem.id) {
                $scope.lignes_vente.splice(keyItem, 1);
                return false;
            }
        });
        console.log('Nos lignes de vente', $scope.lignes_vente);
    };*/
    /*$scope.deleteFromCommande = function (selectedItem = null) {
        //  console.log('Je suis dans delete');
        $.each($scope.panier, function (keyItem, oneItem) {
            if (oneItem.id == selectedItem.id) {
                $scope.panier.splice(keyItem, 1);
                return false;
            }
        });
        console.log('Nos lignes de commande', $scope.panier);
    };*/
    $scope.deleteFromDetailsMonnaie = function (selectedItem = null) {
        //  console.log('Je suis dans delete');
        $.each($scope.details_monnaie, function (keyItem, oneItem) {
            if (oneItem.id == selectedItem.id) {
                $scope.details_monnaie.splice(keyItem, 1);
                return false;
            }
        });
        console.log('details_monnaie', $scope.details_monnaie);
    };
    $scope.seeChange = function()
    {
        console.log('categoriereservation_reservation', $scope.categoriereservation_reservation);
    };
    $scope.seeGratuite = function()
    {
        console.log('gratuite_planning', $scope.gratuite_planning);
    };
    $scope.seeDecompte = function()
    {
        console.log('decomptee_reservation', $scope.decomptee_reservation);
    };
    // Pour detecter le changement des routes avec Angular
    $scope.linknav="/";
    $scope.currenttemplateurl = "";
    $scope.$on('$routeChangeStart', function(next, current)
    {
        $scope.open_collapsed = false;
        $scope.currenttemplateurl = current.templateUrl;
        /******* Réintialisation de certaines valeurs *******/
        $scope.nbfamilleReel = [];
        $scope.nbsousfamilleReel = [];
        $scope.pageUpload = false;
        $scope.pageDashboard = false;
        $scope.onlyEnCours = false;
        $scope.requetteTabMedicament = "";
        $scope.requetteTabCaCommande = "";
        $scope.requetteTypecommande = "";
        $scope.requetteTabCaNonsolde = "";
        $scope.requeCommandproduit = "";
        $scope.pageCurrent = null;
        $scope.clientSelected = null;
        $scope.tierSelected = null;
        $scope.clientview = null;
        $scope.tierview = null;
        $scope.menuview = null;
        $scope.userview = null;
        $scope.produitview = null;
        $scope.commandeview = null;
        $scope.minuterieview = null;
        $scope.restaurantview = null;
        $scope.depenseview = null;
        $scope.livreurview = null;
        // for pagination
        $scope.paginationclient = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationmenu = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationminuterie = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationproduit = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationpaiement = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationpaiementdepense = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationcommande = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationcarte = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationinventaire = {
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
        $scope.paginationrole = {
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

        $scope.paginations =
            {
                "depense": {
                    currentPage: 1,
                    maxSize: 10,
                    entryLimit: 10,
                    totalItems: 0
                },
                "categoriedepense": {
                    currentPage: 1,
                    maxSize: 10,
                    entryLimit: 10,
                    totalItems: 0
                },
                "paiementdepense": {
                    currentPage: 1,
                    maxSize: 10,
                    entryLimit: 10,
                    totalItems: 0
                },
                "entreeca": {
                    currentPage: 1,
                    maxSize: 10,
                    entryLimit: 10,
                    totalItems: 0
                },
                "versement": {
                    currentPage: 1,
                    maxSize: 10,
                    entryLimit: 10,
                    totalItems: 0
                },
                "zonelivraison": {
                    currentPage: 1,
                    maxSize: 10,
                    entryLimit: 10,
                    totalItems: 0
                },
                "restaurant": {
                    currentPage: 1,
                    maxSize: 10,
                    entryLimit: 10,
                    totalItems: 0
                }
            };

        $scope.paginationentreeca = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationcaisse = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationsortiestock = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationlivreur = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationcadeau = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        $scope.paginationentreestock = {
            currentPage: 1,
            maxSize: 10,
            entryLimit: 10,
            totalItems: 0
        };
        /******* /Réintialisation de certaines valeurs *******/
        // Pour donner la posssiblité à un utilisateur connecté de modifier son profil



        $scope.pageChanged("produit");
        $scope.getelements("roles");
        $scope.getelements("restaurants");
        $scope.getelements("horaireconnexions");
        $scope.getelements("typecommandes");

        $scope.linknav =$location.path();
        if(angular.lowercase(current.templateUrl).indexOf('dashboard')!==-1)
        {
            $scope.pageDashboard = true;
            $scope.pageChanged("user");
            $scope.getelements('modepaiements');
            $scope.getelements('dashboards', 'month');
            $scope.getelements('chiffreaffaires');
            /*
                        $scope.getelements('dashboards', 'day');
                        $scope.getelements('dashboards', 'month');
                        $scope.getelements('dashboards', 'year');
            */
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-typeclient')!==-1)
        {
            $scope.getelements("typeclients");
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-zonelivraison')!==-1)
        {
            $scope.getelements("restaurants");
            $scope.pageChanged("zonelivraison");
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-horaireconnexion')!==-1)
        {
            //$scope.getelements("horaireconnexions");
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-crenohoraire')!==-1)
        {
            $scope.getelements("minuteries");
            $scope.getelements("typecommandes");
            $scope.getelements("crenohoraires");
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-typeproduit')!==-1)
        {
            $scope.getelements("typeproduits");
        }
        else if(angular.lowercase(current.templateUrl).indexOf('gestion_caisse')!==-1)
        {
            $scope.getelements("users");
            $scope.getelements("restaurant");
            $scope.pageChanged("caisses");
        }
        else if(angular.lowercase(current.templateUrl).indexOf('gestion_menu')!==-1)
        {
            $scope.pageCurrent = "menu";
            $scope.pageChanged("menu");
            $scope.getelements("typeproduits");
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-familleproduit')!==-1)
        {
            $scope.getelements("familleproduits");
            setTimeout(function ()
            {
                $scope.changeIn();
            },500);
        }
        else if(angular.lowercase(current.templateUrl).indexOf('recap-bilan')!==-1)
        {
            $scope.getelements('recettes');
            $scope.getelements('restaurants');
        }
        else if(angular.lowercase(current.templateUrl).indexOf('bilan')!==-1)
        {
            $scope.pageChanged('commandes');
            $scope.getelements('users');
            $scope.getelements('menus');
            $scope.getelements("typedepenses");
            $scope.getelements("categoriedepenses");
            $scope.getelements("familleproduits");
            $scope.getelements("produits");
            //$scope.pageUpload = true;
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-typecommande')!==-1)
        {
            $scope.getelements("typecommandes");
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-categoriecommande')!==-1)
        {
            $scope.getelements("categoriecommandes");
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-categoriedepense')!==-1)
        {
            $scope.pageChanged('categoriedepense');
            $scope.getelements("typedepenses");
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-typedepense')!==-1)
        {
            $scope.getelements("typedepenses");
        }
        else if(angular.lowercase(current.templateUrl).indexOf('tier')!==-1)
        {
            $scope.tierview = null;
            if(current.params.itemId)
            {
                var req = "tiers";
                $scope.tierview = {};
                rewriteReq = req + "(id:" + current.params.itemId + ")";
                Init.getElement(rewriteReq, listofrequests_assoc[req]).then(function (data)
                {
                    $scope.tierview = data[0];
                    $scope.pageChanged("depense");
                },function (msg)
                {
                    toastr.error(msg);
                });
            }
            else
            {
                $scope.pageChanged('tier');
            }
        }
        else if(angular.lowercase(current.templateUrl).indexOf('depense')!==-1)
        {
            $scope.getelements("categoriedepenses");
            $scope.getelements("typedepenses");
            $scope.getelements("modepaiements");
            $scope.getelements("users");

            $scope.depenseview = null;
            var itemId = current.params.itemId;
            if(itemId)
            {
                var req = "depenses";
                $scope.depenseview = {};
                rewriteReq = req + "(id:" + itemId + ")";
                Init.getElement(rewriteReq, listofrequests_assoc[req]).then(function (data)
                {
                    $scope.depenseview = data[0];
                    $scope.pageChanged('paiementdepense');
                    console.log($scope.depenseview);
                    console.log('depenseId', itemId);
                },function (msg)
                {
                    toastr.error(msg);
                });
            }
            else
            {
                $scope.pageChanged('depense');
            }
        }
        else if(angular.lowercase(current.templateUrl).indexOf('entreeca')!==-1)
        {
            $scope.getelements("restaurants");
            $scope.getelements("users");
            $scope.pageChanged('entreeca');
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-banque')!==-1)
        {
            $scope.getelements('banques');
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-versement')!==-1)
        {
            $scope.getelements('banques');
            $scope.getelements('restaurants');
            $scope.getelements('users');
            $scope.pageChanged('versement');
        }
        else if(angular.lowercase(current.templateUrl).indexOf('gestion_carte')!==-1)
        {
            $scope.pageChanged('carte');
            $scope.pageChanged("menu");
        }
        else if(angular.lowercase(current.templateUrl).indexOf('gestion_minuteur')!==-1)
        {
            $scope.getelements("minuteries");
        }
        else if(angular.lowercase(current.templateUrl).indexOf('produit')!==-1)
        {
            $scope.produitview = null;
            var itemId = current.params.itemId;
            if(itemId)
            {
                var idElmtproduit = current.params.itemId;
                var req = "produits";
                $scope.produitview = {};
                rewriteReq = req + "(id:" + itemId + ")";
                Init.getElement(rewriteReq, listofrequests_assoc[req]).then(function (data)
                {
                    $scope.produitview = data[0];
                    $scope.getelements("typeproduits");
                    $scope.getelements("familleproduits");
                    $scope.pageChanged('commande');
                    console.log($scope.produitview);
                    console.log('produitId', itemId);
                },function (msg)
                {
                    toastr.error(msg);
                });
            }
            else
            {
                $scope.getelements("typeproduits");
                $scope.getelements("familleproduits");
                $scope.pageChanged('produit');
            }
        }
        else if(angular.lowercase(current.templateUrl).indexOf('gestion_restaurant')!==-1)
        {
            $scope.pageCurrent = "restaurant";
            $scope.getelements("users");
            $scope.pageChanged('restaurant');
        }
        else if(angular.lowercase(current.templateUrl).indexOf('gestion_cadeau')!==-1)
        {
            $scope.pageChanged('cadeau');
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-entree_sortie_stock')!==-1)
        {
            $scope.getelements('motifs');
            $scope.pageChanged('produit');
            $scope.pageChanged('entreestock');
            $scope.pageChanged('sortiestock');
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-livreur')!==-1)
        {
            $scope.pageCurrent = "livreur";
            $scope.pageChanged('produit');
            $scope.pageChanged('livreur');
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-inventaire')!==-1)
        {
            $scope.pageChanged('produit');
            $scope.pageChanged('inventaire');
        }
        else if(angular.lowercase(current.templateUrl).indexOf('livreur')!==-1)
        {
            $scope.livreurview = null;
            if(current.params.itemId)
            {
                var req = "livreurs";
                $scope.livreurview = {};
                rewriteReq = req + "(id:" + current.params.itemId + ")";
                Init.getElement(rewriteReq, listofrequests_assoc[req]).then(function (data)
                {
                    $scope.livreurview = data[0];
                    $scope.pageChanged('produit');
                    $scope.pageChanged('commande')
                },function (msg)
                {
                    console.log('error', msg)
                });
            }
            else
            {
                $scope.pageChanged("livreur");
            }
        }
        else if(angular.lowercase(current.templateUrl).indexOf('restaurant')!==-1)
        {
            $scope.restaurantview = null;
            if(current.params.itemId)
            {
                var idElmtrestaurant = current.params.itemId;
                var req = "restaurants";
                $scope.restaurantview = {};
                rewriteReq = req + "(id:" + current.params.itemId + ")";
                Init.getElement(rewriteReq, listofrequests_assoc[req]).then(function (data)
                {
                    $scope.restaurantview = data[0];
                    $scope.getelements("users");
                    $scope.pageChanged("commande");
                    $scope.pageChanged("carte");
                    $scope.pageChanged("menu");
                    $scope.pageChanged("depense");
                    //$scope.pageChanged("produit");
                },function (msg)
                {
                    console.log('error', msg)
                });
            }
            else
            {
                $scope.getelements("users");
            }
        }
        else if(angular.lowercase(current.templateUrl).indexOf('menu')!==-1)
        {
            $scope.menuview = null;
            if(current.params.itemId)
            {
                $scope.tablea__commande = {};
                $scope.tableau_commande = {};
                var req = "menus";
                $scope.menuview = {};
                rewriteReq = req + "(id:" + current.params.itemId + ")";
                Init.getElement(rewriteReq, listofrequests_assoc[req]).then(function (data)
                {
                    $scope.menuview = data[0];
                    $scope.tablea__commande = data[0].tableau_commande;
                    $scope.tableau_commande = JSON.parse(data[0].tableau_commande);
                    console.log(data[0].tableau_commande, "bonjour les gars");
                    $scope.getelements("typeproduits");
                    $scope.getelements("familleproduits");
                },function (msg)
                {
                    console.log('error', msg)
                });
            }
            else
            {
                $scope.pageChanged("menu");
                $scope.getelements("typeproduits");
                $scope.getelements("familleproduits");
            }
        }
        else if(angular.lowercase(current.templateUrl).indexOf('client')!==-1)
        {
            $scope.getelements("typeclients");
            $scope.getelements("zonelivraisons");
            $scope.clientview = null;
            if(current.params.itemId)
            {
                var idElmtclient = current.params.itemId;
                var req = "clients";
                $scope.clientview = {};
                rewriteReq = req + "(id:" + current.params.itemId + ")";
                Init.getElement(rewriteReq, listofrequests_assoc[req]).then(function (data)
                {
                    $scope.clientview = data[0];
                    $scope.pageChanged("produit");
                    $scope.pageChanged('commande');
                },function (msg)
                {
                    toastr.error(msg);
                });
            }
            else
            {
                $scope.pageChanged('client');
            }
        }
        // else if(angular.lowercase(current.templateUrl).indexOf('list-commande')!==-1)
        // {


        //     $scope.getelements("users");
        //     $scope.getelements("typeproduits");
        //     $scope.getelements("zonelivraisons");
        //     $scope.getelements("livreurs");
        //     $scope.getelements("typeclients");
        //     $scope.getelements("familleproduits");
        //     $scope.getelements("clients");
        //     $scope.getelements("typecommandes");
        //     $scope.getelements("modepaiements");
        //     $scope.getelements("categoriecommandes");
        //     $scope.pageChanged("menu");
        //     $scope.pageChanged("paiement");

        //     $scope.pageChanged("produit");

        // }
        else if(angular.lowercase(current.templateUrl).indexOf('commande')!==-1)
        {

            $scope.getelements("familleproduits");
            $scope.getelements("typeproduits");
            $scope.getelements("users");
            $scope.getelements("zonelivraisons");
            $scope.getelements("zonelivraisonrestaurants");
            $scope.getelements("livreurs");
            $scope.getelements("typeclients");
            $scope.getelements("typecommandes");
            $scope.getelements("categoriecommandes");
            $scope.pageChanged("menu");


            $scope.commandeview = null;
            $scope.clientSelected = null;
            var itemId = current.params.itemId;
            var dateC = current.params.date;
            if(itemId)
            {
                var req = "commandes";
                $scope.commandeview = {};
                rewriteReq = req + "(id:" + itemId + ")";
                Init.getElement(rewriteReq, listofrequests_assoc[req]).then(function (data)
                {
                    $scope.commandeview = data[0];
                    if (dateC && data[0].status!=3) {
                        $scope.setCookiesCommande(itemId, dateC);
                        $scope.startChronoC();
                    }
                    if ($cookies.get('debut_preparation') && data[0].status!=2) {
                        $scope.startChronoP();
                    }
                    $scope.getelements("modepaiements");
                    $scope.pageChanged("paiement");
                    console.log($scope.commandeview);
                    console.log('commandeId', itemId);
                },function (msg)
                {
                    toastr.error(msg);
                });
            }
            else
            {
                if(angular.lowercase(current.templateUrl).indexOf('encour')!==-1) {
                    $scope.onlyEnCours = true;
                }
                $scope.pageChanged("commande");
            }
        }
        else if(angular.lowercase(current.templateUrl).indexOf('list-paiement')!==-1)
        {
            $scope.pageChanged('paiement');
        }
        else if(angular.lowercase(current.templateUrl).indexOf('profilspermissions')!==-1)
        {
            $scope.getelements('permissions');
            $scope.getelements('roles');
        }
        else if(angular.lowercase(current.templateUrl).indexOf('gestions_utilisateurs')!==-1)
        {
            $scope.pageChanged('user');
        }
        else if(angular.lowercase(current.templateUrl).indexOf('utilisateur')!==-1)
        {
            $scope.userview = null;
            if(current.params.itemId)
            {
                var req = "users";
                $scope.userview = {};
                rewriteReq = req + "(id:" + current.params.itemId + ")";
                Init.getElement(rewriteReq, listofrequests_assoc[req]).then(function (data)
                {
                    $scope.userview = data[0];
                    changeStatusForm('detailuser',true);
                    console.log($scope.userview );
                    console.log('userId', current.params.itemId);
                    $scope.getelements('modepaiements');
                    $scope.pageChanged('commande');
                    $scope.pageChanged('depense');
                    $scope.pageChanged("paiement");
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
    /*
    A SUPP
    $scope.changeTab = function()
    {
        // Demande à angularjs de rafraichir les elements concernés
        $('body').updatePolyfill();
    };*/


    $scope.$on('$routeChangeSuccess', function(next, current)
    {
        $scope.open_collapsed = true;

        setTimeout(function ()
        {
            $scope.reInit();
        },1000);

        // A la fermeture du modal, on raffraichi
        $('.modal[role="dialog"]').on('hide.bs.modal', function (e)
        {
            startTagForm = "modal_add";
            endTagForm = $(this).attr('id').substr(startTagForm.length, $(this).attr('id').length);

            console.log('startTagForm*********', startTagForm, "***********", endTagForm);

            //$scope.emptyform(endTagForm);
            //$(".select2").val("").change();

            console.log("detection fermeture du modal");
            if ($('.select2').find('.select2-selection--single[aria-expanded="true"]').length > 0)
            {
                console.log('attention, jacques bloque le modal');
                e.preventDefault();
            }

        });


        if (angular.lowercase(current.templateUrl).indexOf('commande') !== -1)
        {
            // Pour détecter les changements
            $scope.client_commande = null;
        }
        else if (angular.lowercase(current.templateUrl).indexOf('depense') !== -1)
        {
            $scope.getelements('restaurants');
            // Pour détecter les changements
            $scope.tier_depense = null;
        }

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
        $('#erase_' + idInput).val("yes");
        $('#aff' + idInput).attr('src',imgupload);
    };

    $scope.generateAddFiltres = function(currentpage)
    {
        console.log('generateAddFiltres =>', currentpage);
        currentpage = `_list_${currentpage}`;
        var addfiltres = "";
        var title = "";
        var currentvalue = "";
        var can_add = true;
        $("input[id$=" + currentpage + "], textarea[id$=" + currentpage + "], select[id$=" + currentpage + "]").each(function ()
        {
            title = $(this).attr("id");
            title = title.substring(0, title.length - currentpage.length);
            currentvalue = $(this).val();
            console.log('here =>', currentpage, 'titre filtre',$(this).attr("id"),  title);

            if (currentvalue && title.indexOf('searchtexte')===-1)
            {
                can_add = true;

                if ($(this).is("select"))
                {
                    title = `${title}_id`;
                }
                else if ($(this).is("input") || $(this).is("textarea"))
                {
                    if ($(this).attr('type') === 'radio')
                    {
                        title = $(this).attr('name');
                        currentvalue = $("[name='" + title + "']:checked").attr("data-value");
                        if (addfiltres.indexOf(title)!==-1 || !currentvalue)
                        {
                            can_add = false;
                        }
                        console.log('title =>', title, 'currentvalue =>', currentvalue);
                    }
                    if ($(this).attr('type') === 'checkbox')
                    {
                        // rien pour le moment
                    }
                    if ($(this).attr('type') === 'number')
                    {

                    }
                    if ($(this).attr('type') === 'date' || $(this).attr('type') === 'text' || $(this).is("textarea"))
                    {
                        currentvalue = `"${currentvalue}"`;
                    }
                }

                if (title.indexOf('searchoption')!==-1)
                {
                    //console.log('filtres here jacques');
                    title = currentvalue;
                    currentvalue = $('#searchtexte' + currentpage).val();
                    currentvalue = `"${currentvalue}"`;
                    if (!$('#searchtexte' + currentpage).val())
                    {
                        can_add = false;
                    }
                }

                if (can_add)
                {
                    addfiltres = `${addfiltres},${title}:${currentvalue}`;
                }
            }

        });
        return addfiltres;
    };

    $scope.emptyform = function (type, fromPage = false)
    {
        $scope.radioBtnStatus = null;

        let dfd = $.Deferred();
        $('.ws-number').val("");
        $("input[id$=" + type + "], textarea[id$=" + type + "], select[id$=" + type + "], button[id$=" + type + "]").each(function ()
        {
            if ($(this).is("select"))
            {
                currentSelect = $(this);
                currentSelect.val("").change();
                if ($(this).attr('class').indexOf('search_')!==-1)
                {
                    $(this).find('option').each(function()
                    {
                        $(this).remove();
                    });
                }
            }
            else if ($(this).is(":checkbox"))
            {
                $(this).prop('checked', false);
            }
            else
            {
                $(this).val("");
            }
            $(this).attr($(this).hasClass('btn') ? 'disabled' : 'readonly', false);
        });
        $('#img' + type)
            .val("");
        $('#affimg' + type).attr('src',imgupload);
        console.log('minuterieview before', $scope.minuterieview);
        // Si on clique sur le bouton annuler
        if (type.indexOf('commande')!==-1)
        {
            // Si on se trouve sur la page détails d'une facture proforma, on ne doit pas mettre à null
            if (angular.lowercase($scope.currenttemplateurl).indexOf('listdetail-minuterie')===-1)
            {
                $scope.minuterieview = null;
            }
            console.log('minuterieview after', $scope.minuterieview);
        }
        if (fromPage) {
            //alert("bonjour");
            $scope.pageChanged(type);
        }

        // Pour vider les champs filters au niveau de certains modals
        $('.filter').each(function (key, value)
        {
            $(this).val("");
        });

        return dfd.promise();
    }

    // Annuler filtre
    $scope.annulerFiltre = function (param) {
        console.log('Annulation filtre...');

        if (param == 'menu' || param == 'menu') {

            $scope.radioBtnStatus = '';
            $('#etat input:radio[name=radioBtnStatus].true').prop('checked', true);

        }

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
    $scope.voirDetail = function (produitdetaille) {
        console.log('detail', produitdetaille);
        $scope.detail.id = produitdetaille.id;
        $scope.detail.designation = produitdetaille.designation;
        $scope.detail.prixP = produitdetaille.prix_public;
        $scope.detail.stock = produitdetaille.current_quantity;
        $("#modal_addvoirDetailProduit").modal('show');
    };
    $scope.goBack = function () {
        window.history.back();
    };
    // Permet d'afficher le formulaire
    $scope.sousfamille = {'reponse':false};
    $scope.showModalAdd = function (type, sousfamille=false, fromUpdate=false, assistedListe=false, ObjPassed = null)
    {
        $scope.emptyform(type);

        // $scope.panier = [];
        $scope.fromUpdate = false;
        $scope.selectionlisteproduits = $scope.produits;
        if(sousfamille)
        {
            $scope.sousfamille.reponse = sousfamille;
            console.log('ici sous famille', $scope.sousfamille.reponse);
        }
        $scope.addcommandeview = false;

        if (type.indexOf('commande')!==-1)
        {
            $scope.clients = [];
            $scope.clientSelected = null;

            if ( !($scope.localize_panier && $scope.localize_panier.indexOf('commande')!==-1) )
            {
                $scope.selectionCarte = [];
            }
            $scope.localize_panier = "commande";
            // Pour permettre de ne récupérer que les produits présents dans la facture proforma
            let updateDate = $q((resolve, reject) => {
                resolve([]);
            });

            $scope.zonelivraisonrestaurant_commande = null;
            $("#zonelivraisonrestaurant_commande").val("");

            $scope.getelements('typeproduits');
            $scope.getelements('familleproduits');
            $scope.getelements("zonelivraisonrestaurants");
            if (!fromUpdate)
            {
                if ( !($scope.localize_panier && $scope.localize_panier.indexOf('menu')!==-1) )
                {
                    $scope.panier = [];
                }
                $scope.localize_panier = "menu";
                $scope.clients = [];
                $scope.tiers = [];
            }
        }
        else if (type.indexOf('depense')!==-1)
        {
            $scope.tiers = [];
            $scope.tierSelected = null;

            // On réaffecte le restant au nouveau paiement
            if (type.indexOf('paiementdepense')!==-1)
            {
                $('#montant_' + type).val($scope.depenseview.restant);
            }
        }
        else if (type.indexOf('caisse')!==-1)
        {
            $scope.clotureCaisse = {title:null};
            if (type.indexOf('one')!==-1)
            {
                $scope.clotureCaisse.title = 'Etes-vous sûr de vouloir faire la première clôture de caisse ?';
            }
            else if (type.indexOf('two')!==-1)
            {
                $scope.clotureCaisse.title = 'Etes-vous sûr de vouloir faire la deuxième clôture de caisse ?';
            }
        }
        else if (type.indexOf('entreestock')!==-1)
        {
            $('#nomproduit_entreestock').attr("readonly", true);
        }
        else if (type.indexOf('sortiestock')!==-1)
        {
            $('#nomproduit_sortiestock').attr("readonly", true);
        }
        else if (type.indexOf('role')!==-1)
        {
            $scope.roleview = null;
            $scope.role_permissions = [];
            $scope.getelements('permissions');
            /*$("[id^=permission_role]").each(function (key,value)
            {
                $(this).prop('checked', false);
            });
            $('#permission_all_role').prop('checked', false);*/
        }
        else if (type.indexOf('user')!==-1)
        {
            //$scope.getelements('roles', null, true);
        }
        else if (type.indexOf('zonelivraison')!==-1)
        {
            $scope.zonelivraisonrestaurantsInTable = [];
            if (!fromUpdate)
            {
                $.each($scope.restaurants, function (keyItem, oneItem)
                {
                    $scope.zonelivraisonrestaurantsInTable.push({
                        "restaurant_id": oneItem.id,
                        "restaurant": {designation: oneItem.designation},
                        "tarif": 0
                    });
                });
            }
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
                    if ($scope.ligne_inventaires[position].produit_id!=null && $scope.ligne_inventaires[position].produit_id==produit_id)
                    {
                        doChange = false;
                    }
                    $scope.ligne_inventaires[position].produit_id = produit_id;
                    var found = false;
                    $.each($scope.produits, function (keyItem, valueItem)
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
    $scope.showModalStatut = function(event,type, statut, obj= null, title = null)
    {
        var id = 0;
        id = obj.id;
        $scope.chstat.id = id;
        $scope.chstat.statut = statut;
        $scope.chstat.type = type;
        $scope.chstat.title = title;
        $scope.emptyform('chstat');
        $("#modal_addchstat").modal('show');
    };
    $scope.annulerCommande = {'id':'', 'title':''};
    $scope.showModalAnnulationCommande = function(event, idCommande,title = null)
    {
        $scope.annulerCommande.id = idCommande;
        $scope.annulerCommande.title = title;
        $scope.emptyform('annulerCommande');
        $("#modal_addannulerCommande").modal('show');
    };
    $scope.livreCommande = {'id':'', 'title':''};
    $scope.showModalLivreCommande = function(event, idCommande,title = null)
    {
        $scope.livreCommande.id = idCommande;
        $scope.livreCommande.title = title;
        $scope.emptyform('livreCommande');
        $("#modal_addlivreCommande").modal('show');
    };
    $scope.annulerCommandeDS = {'id':'', 'title':''};
    $scope.showModalAnnulationCommandeDS = function(event, idCommande,title = null)
    {

        $scope.annulerCommandeDS.id = idCommande;
        $scope.annulerCommandeDS.title = title;
        $scope.emptyform('annulerCommandeDS');
        $("#modal_addannulerCommandeDS").modal('show');
    };
    $scope.showModalOffertCommande = function(event, idCommande,title = null)
    {
        $scope.offertCommande.id = idCommande;
        $scope.offertCommande.title = title;
        $scope.emptyform('offertCommande');
        $("#modal_addoffertCommande").modal('show');
    };
    $scope.showModalrecapecaisse = function(event)
    {
        $("#modal_addrecapecaisse").modal('show');
    };
    $scope.clotureCaisseOne = {'title': '', 'target': '', 'restaurant': ''};
    $scope.showModalClotureCaisseOne = function(event, title=null, target,restaurant)
    {
        $scope.clotureCaisseOne.title = title;
        $scope.clotureCaisseOne.target = target;
        $scope.clotureCaisseTwo.restaurant = restaurant;
        $scope.emptyform('cloturecaisseOne');
        $("#modal_addcloturecaisseOne").modal('show');
    };

    $scope.clotureCaisseTwo = {'title': '', 'target': '', 'restaurant': ''};
    $scope.showModalClotureCaisseTwo = function(event, title=null, target, restaurant)
    {
        $scope.clotureCaisseTwo.title = title;
        $scope.clotureCaisseTwo.target = target;
        $scope.clotureCaisseTwo.restaurant = restaurant;
        $scope.emptyform('clotureCaisseTwo');
        $("#modal_addcloturecaisseTwo").modal('show');
    };

    $scope.validationModal = {'id':'', 'title':''};
    $scope.showModalValidation = function(event,idCommande,title = null)
    {
        $scope.validationModal.id = idCommande;
        $scope.validationModal.title = title;
        $scope.emptyform('validerTraitement');
        $("#modal_addvaliderTraitement").modal('show');
    };
    $scope.validationFinPrepa = {'id':'', 'title':''};
    $scope.showModalFinPreparation = function(event,idCommande,title = null)
    {
        $scope.validationFinPrepa.id = idCommande;
        $scope.validationFinPrepa.title = title;
        $scope.emptyform('validerFinTraitement');
        $("#modal_addvaliderFinTraitement").modal('show');
    };
    $scope.validationFinCommande = {'id':'', 'title':''};
    $scope.showModalFinCommande = function(event,idCommande,title = null)
    {
        $scope.validationFinCommande.id = idCommande;
        $scope.validationFinCommande.title = title;
        $scope.emptyform('validerFinCommande');
        $("#modal_addvaliderFinCommande").modal('show');
    };
    $scope.facturegeneree = {'id':''};
    $scope.facture = function(event, obj= null)
    {
        $scope.facturegeneree.id = obj;
        $scope.emptyform('factureGeneree');
        $("#modal_addfactureGeneree").modal('show');
        $('#vente_facturee').val($scope.facturegeneree.id);
    };
    //TODO: définir l\'etat d'une reservation
    // implémenter toutes les variations du formulaire
    $scope.changeStatut = function(e, type)
    {
        var form = $('#form_addchstat');
        var send_data = {id: $scope.chstat.id, status:$scope.chstat.statut, commentaire: $('#commentaire_chstat').val()};
        form.parent().parent().blockUI_start();
        Init.changeStatut(type, send_data).then(function(data)
        {
            form.parent().parent().blockUI_stop();
            if (data.data!=null && !data.errors)
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
                else if (type.indexOf('menu')!==-1)
                {
                    var found = false;
                    $.each($scope.menus, function (keyItem, valueItem)
                    {
                        if (valueItem.id==send_data.id)
                        {
                            $scope.menus[keyItem].status = $scope.chstat.statut==0 ? false : true;
                            found = true;
                        }
                        return !found;
                    });
                }
                else if (type.indexOf('restaurant')!==-1)
                {
                    var found = false;
                    $.each($scope.restaurants, function (keyItem, valueItem)
                    {
                        if (valueItem.id==send_data.id)
                        {
                            $scope.restaurants[keyItem].status = $scope.chstat.statut==0 ? false : true;
                            found = true;
                        }
                        return !found;
                    });
                }
                else if (type.indexOf('livreur')!==-1)
                {
                    var found = false;
                    $.each($scope.livreurs, function (keyItem, valueItem)
                    {
                        if (valueItem.id==send_data.id)
                        {
                            $scope.livreurs[keyItem].status = $scope.chstat.statut==0 ? false : true;
                            found = true;
                        }
                        return !found;
                    });
                }
                else if (type.indexOf('produit')!==-1)
                {
                    var found = false;
                    $.each($scope.produits, function (keyItem, valueItem)
                    {
                        if (valueItem.id==send_data.id)
                        {
                            $scope.produits[keyItem].status = $scope.chstat.statut==0 ? false : true;
                            found = true;
                        }
                        return !found;
                    });
                }
                else if (type.indexOf('carte')!==-1)
                {
                    var found = false;
                    $.each($scope.cartes, function (keyItem, valueItem)
                    {
                        if (valueItem.id==send_data.id)
                        {
                            $scope.cartes[keyItem].status = $scope.chstat.statut==0 ? false : true;
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
        console.log(type,'current status', $scope.chstat);
    };
    $scope.debuterPreparation = function(e, idItem)
    {
        var form = $('#form_addvaliderTraitement');
        var thisDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        $cookies.put('debut_preparation',thisDate);
        console.log('myCommandeCookie', $cookies.getAll());
        var send_data = {'id':idItem,'debut_preparation':thisDate};
        form.parent().parent().blockUI_start();
        Init.debuterPreparation(send_data).then(function(data)
        {
            getCommande = data['data']['commandes'][0];
            console.log(getCommande);
            form.parent().parent().blockUI_stop();
            if (data.data!=null && !data.errors)
            {
                if ($scope.commandeview && $scope.commandeview.id===$scope.validationModal.id)
                {
                    $scope.commandeview = getCommande;
                }
                iziToast.success({
                    title: ('DEBUT PRÉPARATION COMMANDE'),
                    message: "succès",
                    position: 'topRight'
                });
                $("#modal_addvaliderTraitement").modal('hide');
                $scope.startChronoP();
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
        console.log('current commande id', send_data);
    };
    $scope.annulerCommande = function(e, idItem)
    {
        var form = $('#modal_addannulerCommande');
        var send_data = {'id':idItem};
        form.parent().parent().blockUI_start();
        Init.annulerCommande(send_data).then(function(data)
        {
            console.log(data, 'donnes');
            getCommande = data;
            console.log(getCommande);
            form.parent().parent().blockUI_stop();
            if (data.data!=null && !data.errors)
            {
                if ($scope.commandeview && $scope.commandeview.id===$scope.validationFinCommande.id)
                {
                    $scope.commandeview = getCommande;
                }
                $scope.pageChanged('commande');
                iziToast.success({
                    title: ('COMMANDE ANNULER'),
                    message: "succès",
                    position: 'topRight'
                });
                $("#modal_addannulerCommande").modal('hide');
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
        console.log('current commande id', send_data);
    };
    $scope.livreCommande = function(e, idItem)
    {
        var form = $('#modal_addlivreCommande');
        var send_data = {'id':idItem};
        form.parent().parent().blockUI_start();
        Init.livreCommande(send_data).then(function(data)
        {
            console.log(data, 'donnes');
            getCommande = data;
            console.log(getCommande);
            form.parent().parent().blockUI_stop();
            if (data.data!=null && !data.errors)
            {
                if ($scope.commandeview && $scope.commandeview.id===$scope.validationFinCommande.id)
                {
                    $scope.commandeview = getCommande;
                }
                $scope.pageChanged('commande');
                iziToast.success({
                    title: ('COMMANDE LIVRE'),
                    message: "succès",
                    position: 'topRight'
                });
                $("#modal_addlivreCommande").modal('hide');
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
        console.log('current commande id', send_data);
    };
    $scope.annulerCommandeDS = function(e, idItem)
    {
        var form = $('#modal_addannulerCommandeDS');
        var send_data = {'id':idItem};
        form.parent().parent().blockUI_start();
        Init.annulerCommandeDS(send_data).then(function(data)
        {
            console.log(data, 'donnes');
            getCommande = data;
            console.log(getCommande);
            form.parent().parent().blockUI_stop();
            if (data.data!=null && !data.errors)
            {
                if ($scope.commandeview && $scope.commandeview.id===$scope.validationFinCommande.id)
                {
                    $scope.commandeview = getCommande;
                }
                $scope.pageChanged('commande');
                iziToast.success({
                    title: ('ANNULATION ANNULER'),
                    message: "succès",
                    position: 'topRight'
                });
                $("#modal_addannulerCommandeDS").modal('hide');
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
        console.log('current commande id', send_data);
    };
    $scope.clotureCaisseTwo = function(e, target, restaurant)
    {
        var form = $('#modal_addcloturecaisseTwo');
        restaurant  =  $('#restaurant').val();
        console.log(restaurant);

        var send_data = {'target':2, 'restaurant':restaurant};
        form.parent().parent().blockUI_start();
        Init.clotureCaisseTwo(send_data).then(function(data)
        {
            console.log(data, 'donnes');
            getCommande = data;
            console.log(getCommande);
            form.parent().parent().blockUI_stop();
            if (data.data!=null && !data.errors)
            {
                iziToast.success({
                    title: ('Cloture Caisse Deuxième Heure Éffectuer'),
                    message: "succès",
                    position: 'topRight'
                });
                $("#modal_addcloturecaisseTwo").modal('hide');
                $scope.pageChanged('caisse');
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
        console.log('current commande id', send_data);
    };


    $scope.clotureCaisseOne = function(e, target, restaurant)
    {
        var form = $('#modal_addcloturecaisseOne');
        var send_data = {'target':1, 'restaurant':restaurant};
        form.parent().parent().blockUI_start();
        Init.clotureCaisseOne(send_data).then(function(data)
        {
            console.log(data, 'donnes');
            getCommande = data;
            console.log(getCommande);
            form.parent().parent().blockUI_stop();
            if (data.data!=null && !data.errors)
            {
                iziToast.success({
                    title: ('Cloture Caisse Premièr Heure Éffectuer'),
                    message: "succès",
                    position: 'topRight'
                });
                $("#modal_addcloturecaisseOne").modal('hide');
                $scope.pageChanged('caisse');
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
        console.log('current commande id', send_data);
    };

    $scope.offertCommande = function(e, idItem)
    {
        var form = $('#modal_addoffertCommande');
        var send_data = {'id':idItem};
        form.parent().parent().blockUI_start();
        Init.offertCommande(send_data).then(function(data)
        {
            console.log(data, 'donnes');
            getCommande = data;
            console.log(getCommande);
            form.parent().parent().blockUI_stop();
            if (data.data!=null && !data.errors)
            {
                if ($scope.commandeview && $scope.commandeview.id===$scope.validationFinCommande.id)
                {
                    $scope.commandeview = getCommande;
                }
                iziToast.success({
                    title: ('COMMANDE OFFERT'),
                    message: "succès",
                    position: 'topRight'
                });
                $("#modal_addoffertCommande").modal('hide');
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
        console.log('current commande id', send_data);
    };
    $scope.finirPreparation = function(e, idItem)
    {
        var form = $('#form_addvaliderFinTraitement');
        var thisDateFin = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        $cookies.put('fin_preparation',thisDateFin);
        console.log('myCommandeCookie', $cookies.getAll());
        var send_data = {'id':idItem,'fin_preparation':thisDateFin};
        form.parent().parent().blockUI_start();
        Init.finirPreparation(send_data).then(function(data)
        {
            getCommande = data['data']['commandes'][0];
            console.log(getCommande);
            form.parent().parent().blockUI_stop();
            if (data.data!=null && !data.errors)
            {
                if ($scope.commandeview && $scope.commandeview.id===$scope.validationFinPrepa.id)
                {
                    $scope.commandeview = getCommande;
                }
                iziToast.success({
                    title: ('FIN PRÉPARATION COMMANDE'),
                    message: "succès",
                    position: 'topRight'
                });
                $("#modal_addvaliderFinTraitement").modal('hide');
                $scope.stopChronoP();
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
        console.log('current commande id', send_data);
    };
    $scope.finirCommande = function(e, idItem)
    {
        var form = $('#form_addvaliderFinCommande');
        var thisDateFinCom = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        $cookies.put('fin_commande',thisDateFinCom);
        console.log('myCommandeCookie', $cookies.getAll());
        var send_data = {'id':idItem,'fin_commande':thisDateFinCom};
        form.parent().parent().blockUI_start();
        Init.finirCommande(send_data).then(function(data)
        {
            getCommande = data['data']['commandes'][0];
            console.log(getCommande);
            form.parent().parent().blockUI_stop();
            if (data.data!=null && !data.errors)
            {
                if ($scope.commandeview && $scope.commandeview.id===$scope.validationFinCommande.id)
                {
                    $scope.commandeview = getCommande;
                }
                iziToast.success({
                    title: ('FIN DE TRAITEMENT COMMANDE'),
                    message: "succès",
                    position: 'topRight'
                });
                $("#modal_addvaliderFinCommande").modal('hide');
                $scope.stopChronoC();
                $cookies.remove( 'commande_id');
                $cookies.remove( 'debut_commande');
                $cookies.remove( 'debut_preparation');
                $cookies.remove( 'fin_preparation');
                $cookies.remove( 'fin_commande');
                console.log('myCookies', $cookies.getAll());
                $scope.openTicket(idItem);
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
        console.log('current commande id', send_data);
    };
    $scope.facturerVente = function(e)
    {
        console.log('arrive ici');
        e.preventDefault();
        var form = $('#form_addfactureGeneree');
        var formdata=(window.FormData) ? ( new FormData(form[0])): null;
        var send_data=(formdata!==null) ? formdata : form.serialize();
        // A ne pas supprimer
        send_dataObj = form.serializeObject();
        console.log('est tu la fichier????',send_dataObj, send_data);
        continuer = true;
        send_data.append("vente", $('#vente_facturee').val());
        send_data.append("nom_client", $('#nom_client_facture').val());
        send_data.append("telephone", $('#telephone_facture').val());
        if (form.validate() && continuer)
        {
            form.parent().parent().blockUI_start();
            Init.facturerVente(send_data).then(function(data)
            {
                form.parent().parent().blockUI_stop();
                if (data!=null)
                {
                    console.log(data);
                    $("#modal_addfactureGeneree").modal('hide');
                    var urlFacture = BASE_URL+ '/vente/redirectFacture/'+data+'';
                    var fact = window.open(urlFacture, '_blank');
                    fact.focus();
                }
            }, function (msg)
            {
                form.parent().parent().blockUI_stop();
                iziToast.error({
                    message: '<span class="h4">' + msg + '</span>',
                    position: 'topRight'
                });
                console.log('Erreur serveur ici = ' + msg);
            });
        }
    };
    $scope.donneesReservation = {'message':'', 'clientId':null, 'planningId':'', 'type':''};
    // automatically open the ticket page
    $scope.openTicket = function(idItem)
    {
        var urlTicket = BASE_URL+ '/commande/ticket/'+idItem+'';
        var ticket = window.open(urlTicket, '_blank');
        ticket.focus();
    };
    // Add element in database and in scope
    $scope.addElement = function(e,type,from='modal', is_file_excel = false, optionals = {closemodal: true})
    {
        modaltype = type;
        console.log('arrive ici', BASE_URL);
        e.preventDefault();
        var thisDateCommande = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        var form = $('#form_add' + type);
        var formdata=(window.FormData) ? ( new FormData(form[0])): null;
        var send_data=(formdata!==null) ? formdata : form.serialize();
        // A ne pas supprimer
        send_dataObj = form.serializeObject();
        console.log('send_dataObj', $('#id_' + type).val(), send_dataObj, send_data);
        continuer = true;
        if (type.indexOf('role')!==-1)
        {
            send_data.append("permissions", $scope.role_permissions);
            console.log('role_permissions', $scope.role_permissions, '...', send_data.get('role_permissions') );
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
        else if (type.indexOf('paiementdepense')!==-1)
        {
            if ($scope.depenseview)
            {
                send_data.append("depense", $scope.depenseview.id);
            }
        }
        else if (type.indexOf('paiement')!==-1)
        {
            if ($scope.commandeview)
            {
                send_data.append("commande", $scope.commandeview.id);
            }
        }
        else if (type.indexOf('menu')!==-1)
        {
            send_data.append("ligne_produit_menus", JSON.stringify($scope.panier));
            if ($scope.panier.length==0)
            {
                iziToast.error({
                    title: "",
                    message: "Il faut au moins un produit",
                    position: 'topRight'
                });
                continuer = false;
            }
        }
        else if (type.indexOf('carte')!==-1)
        {
            if ($scope.restaurantview)
            {
                send_data.set("restaurant", $scope.restaurantview.id);
            }
            send_data.append("ligne_carte_menus", JSON.stringify($scope.selectionCarte));
            send_data.append("ligne_carte_produits", JSON.stringify($scope.panier));
            if ($scope.selectionCarte.length==0 && $scope.panier==0)
            {
                iziToast.error({
                    title: "",
                    message: "Il faut au moins un menu ou un produit",
                    position: 'topRight'
                });
                continuer = false;
            }
        }
        else if (type.indexOf('commande')!==-1)
        {
            let offertmenu_commande = 1;
            let offertproduit_commande = 1;

            /* ajouter les options au niveau du tableau*/
            for (let i = 0; i < $scope.selectionCarte.length; i++) {

                if($('#offertmenu_commande' + i).prop("checked") == true){
                    offertmenu_commande = 1;
                }
                else if($('#offertmenu_commande' + i).prop('checked') == false){
                    offertmenu_commande = 0;
                }
                $scope.selectionCarte[i].options = $('#optionsmenu_commande' + i).val();
                $scope.selectionCarte[i].offert = offertmenu_commande;

            }

            for (let i = 0; i < $scope.panier.length; i++) {

                if($('#offertproduit_commande' + i).prop("checked") == true){
                    offertproduit_commande = 1;
                }
                else if($('#offertproduit_commande' + i).prop('checked') == false){
                    offertproduit_commande = 0;
                }
                $scope.panier[i].options = $('#optionsproduit_commande' + i).val();
                $scope.panier[i].offert = offertproduit_commande;

            }
            for (let j = 0; j< $scope.selectionCarte; j++)
            {
                if ($("#offertmenu_commande",+j).pop("checked") == true){
                    offertmenu_commande = 1;
                }
                else if ($("#offertmenu_commande" +j).pop('checked') == false)
                {
                    offertmenu_commande = 0;
                }
                $scope.selectionCarte[j].offert = offertmenu_commande;
            }

            console.log("test selectionCarte", $scope.selectionCarte);
            console.log("test panier", $scope.panier);

            send_data.set("debut_commande", thisDateCommande);
            send_data.append("ligne_commande_menus", JSON.stringify($scope.selectionCarte));
            send_data.append("ligne_commande_produits", JSON.stringify($scope.panier));

        }
        else if (type.indexOf('inventaire')!==-1)
        {
            send_data.append("details_inventaire", JSON.stringify($scope.panier));
            if ($scope.panier.length==0)
            {
                iziToast.error({
                    title: "",
                    message: "Il faut au moins une ligne d'inventaire",
                    position: 'topRight'
                });
                continuer = false;
            }
        }
        else if(type.indexOf('caisse')!==-1)
        {
            type = 'caisse';
        }
        else if(type.indexOf('zonelivraison')!==-1)
        {
            console.log('zonelivraisonrestaurantsInTable', $scope.zonelivraisonrestaurantsInTable);
            send_data.append('tabZonelivraisonrestaurants', JSON.stringify($scope.zonelivraisonrestaurantsInTable));
        }

        if (form.validate() && continuer)
        {
            form.parent().parent().blockUI_start();
            Init.saveElementAjax( (type.indexOf('liste') !== -1 ? type.substr("liste".length, type.length) : type), send_data, is_file_excel).then(function(data)
            {
                console.log('data', data);
                form.parent().parent().blockUI_stop();
                if (data.data!=null && !data.errors)
                {
                    getRestaurantId = null;
                    if (type == 'depense')
                    {
                        getRestaurantId = $('#restaurant_depense').val();
                    }

                    $scope.emptyform(type);
                    if (is_file_excel)
                    {
                        console.log("nous sommes avec un fichier excel", data);
                        //window.location.reload();
                    }
                    else
                    {
                        getObj = data['data'][type + 's'][0];
                        if (type.indexOf('typecommande')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.typecommandes.push(getObj);
                            }
                            else
                            {
                                $.each($scope.typecommandes, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.typecommandes[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('categoriecommande')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.categoriecommandes.push(getObj);
                            }
                            else
                            {
                                $.each($scope.categoriecommandes, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.categoriecommandes[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('categoriedepense')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.categoriedepenses.push(getObj);
                                $scope.paginations['categoriedepense'].totalItems++;
                                if($scope.categoriedepenses.length > $scope.paginations['categoriedepense'].entryLimit)
                                {
                                    $scope.pageChanged('categoriedepense');
                                }
                            }
                            else
                            {
                                $.each($scope.categoriedepenses, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.categoriedepenses[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('typedepense')!==-1)
                        {
                            console.log(getObj);
                            if (!send_dataObj.id)
                            {
                                $scope.typedepenses.push(getObj);
                            }
                            else
                            {
                                $.each($scope.typedepenses, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.typedepenses[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('tier') !== -1)
                        {
                            console.log('from', from);
                            if (from.indexOf('modal') === -1)
                            {
                                $location.path('list-tier');
                            }
                            else
                            {
                                if (!send_dataObj.id)
                                {
                                    $scope.tiers.push(getObj);
                                    //$scope.reInit();
                                    $scope.paginationtier.totalItems++;
                                    if ($scope.tiers.length > $scope.paginationtier.entryLimit)
                                    {
                                        $scope.pageChanged('tier');
                                    }
                                }
                                else
                                {
                                    if ($scope.tierview && $scope.tierview.id === getObj.id)
                                    {
                                        $scope.tierview = getObj;
                                    }
                                    //$scope.pageChanged('tier');
                                    $.each($scope.tiers, function (keyItem, oneItem)
                                    {
                                        if (oneItem.id === getObj.id)
                                        {
                                            $scope.tiers[keyItem] = getObj;
                                            return false;
                                        }
                                    });
                                }

                                if (($("#modal_adddepense").data('bs.modal') || {})._isShown)
                                {
                                    $scope.tierSelected = getObj;
                                    setTimeout(function()
                                    {
                                        $('#tier_depense').val(parseInt(getObj.id)).change();
                                    }, 1000);
                                }
                            }
                        }
                        else if (type.indexOf('paiementdepense')!==-1)
                        {
                            if ($scope.depenseview)
                            {
                                $scope.depenseview.restant = getObj.restant;
                            }
                            $scope.pageChanged('paiementdepense');
                        }
                        else if (type.indexOf('depense')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.pageChanged('depense');
                            }
                            else
                            {
                                $.each($scope.depenses, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.depenses[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                            $scope.tierSelected = null;
                        }
                        else if (type.indexOf('entreeca')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.entreecas.push(getObj);
                                $scope.paginations['entreeca'].totalItems++;
                                if($scope.entreecas.length > $scope.paginations['entreeca'].entryLimit)
                                {
                                    $scope.pageChanged('entreeca');
                                }
                            }
                            else
                            {
                                $.each($scope.entreecas, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.entreecas[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('banque')!==-1)
                        {
                            console.log(getObj);
                            if (!send_dataObj.id)
                            {
                                $scope.banques.push(getObj);
                            }
                            else
                            {
                                $.each($scope.banques, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.banques[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('versement')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.versements.push(getObj);
                                $scope.paginations["versement"].totalItems++;
                                if($scope.versements.length > $scope.paginations["versement"].entryLimit)
                                {
                                    $scope.pageChanged('versement');
                                }
                            }
                            else
                            {
                                $.each($scope.versements, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.versements[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('typeclient')!==-1)
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
                        else if (type.indexOf('client') !== -1)
                        {
                            console.log('from', from);
                            if (from.indexOf('modal') === -1) {
                                $location.path('list-client');
                            }
                            else
                            {
                                if (!send_dataObj.id)
                                {
                                    $scope.clients.push(getObj);
                                    //$scope.reInit();

                                    $scope.paginationclient.totalItems++;
                                    if ($scope.clients.length > $scope.paginationclient.entryLimit)
                                    {
                                        $scope.pageChanged('client');
                                    }
                                }
                                else
                                {
                                    if ($scope.clientview && $scope.clientview.id === getObj.id)
                                    {
                                        $scope.clientview = getObj;
                                    }
                                    //$scope.pageChanged('client');
                                    $.each($scope.clients, function (keyItem, oneItem)
                                    {
                                        if (oneItem.id === getObj.id)
                                        {
                                            $scope.clients[keyItem] = getObj;
                                            return false;
                                        }
                                    });
                                }

                                if (($("#modal_addcommande").data('bs.modal') || {})._isShown)
                                {
                                    $scope.clientSelected = getObj;
                                    setTimeout(function()
                                    {
                                        $('#client_commande').val(parseInt(getObj.id)).change();
                                    }, 1000);
                                }
                            }
                        }
                        else if (type.indexOf('typeproduit')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.typeproduits.push(getObj);
                            }
                            else
                            {
                                $.each($scope.typeproduits, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.typeproduits[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('motif')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.motifs.push(getObj);
                            }
                            else
                            {
                                $.each($scope.motifs, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.motifs[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('familleproduit')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.familleproduits.push(getObj);
                                if (getObj.famille_produit_id===null)
                                {
                                    $scope.nbfamilleReel.push(getObj);
                                }
                                else{
                                    $scope.nbsousfamilleReel.push(getObj);
                                }
                            }
                            else
                            {
                                $.each($scope.familleproduits, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.familleproduits[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('categorie')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.categories.push(getObj);
                            }
                            else
                            {
                                $.each($scope.categories, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.categories[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('zonelivraison')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.zonelivraisons.push(getObj);
                            }
                            else
                            {
                                $.each($scope.zonelivraisons, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.zonelivraisons[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('horaireconnexion')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.horaireconnexions.push(getObj);
                            }
                            else
                            {
                                $.each($scope.horaireconnexions, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.horaireconnexions[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('crenohoraire')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.crenohoraires.push(getObj);
                            }
                            else
                            {
                                $.each($scope.crenohoraires, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.crenohoraires[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('sortiestock')!==-1)
                        {
                            $scope.pageChanged('sortiestock');
                        }
                        else if (type.indexOf('livreur')!==-1)
                        {
                            $scope.pageChanged('livreur');
                        }
                        else if (type.indexOf('entreestock')!==-1)
                        {
                            $scope.pageChanged('entreestock');
                        }
                        else if (type.indexOf('inventaire')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.inventaires.splice(0,0,getObj);
                                $scope.paginationinventaire.totalItems++;
                                if($scope.inventaires.length > $scope.paginationinventaire.entryLimit)
                                {
                                    $scope.pageChanged('inventaire');
                                }
                            }
                            else
                            {
                                $.each($scope.inventaires, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.inventaires[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('caisse')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.caisses.push(getObj);
                                $scope.paginationcaisse.totalItems++;
                                if($scope.caisses.length > $scope.paginationcaisse.entryLimit)
                                {
                                    $scope.pageChanged('caisse');
                                }
                            }
                            else
                            {
                                $.each($scope.caisses, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.caisses[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('versement')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.versements.push(getObj);
                                $scope.paginationversement.totalItems++;
                                if($scope.versements.length > $scope.paginationversement.entryLimit)
                                {
                                    $scope.pageChanged('versement');
                                    $scope.getelements('modepaiements');
                                    console.log($scope.modepaiements);
                                }
                            }
                            else
                            {
                                $.each($scope.versements, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.versements[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('restaurant')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.restaurants.push(getObj);
                                $scope.paginations['restaurant'].totalItems++;
                                if($scope.restaurants.length > $scope.paginations['restaurant'].entryLimit)
                                {
                                    $scope.pageChanged('restaurant');
                                }
                            }
                            else
                            {
                                if ($scope.restaurantview && $scope.restaurantview.id===getObj.id)
                                {
                                    $scope.restaurantview = getObj;
                                }
                                $.each($scope.restaurants, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.restaurants[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('menu')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.menus.push(getObj);
                                $scope.paginationmenu.totalItems++;
                                if($scope.menus.length > $scope.paginationmenu.entryLimit)
                                {
                                    $scope.pageChanged('menu');
                                }
                            }
                            else
                            {
                                if ($scope.menuview && $scope.menuview.id===getObj.id)
                                {
                                    $scope.menuview = getObj;
                                }
                                $.each($scope.menus, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.menus[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('fournisseur')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.fournisseurs.push(getObj);
                                $scope.paginationfournisseur.totalItems++;
                                if($scope.fournisseurs.length > $scope.paginationfournisseur.entryLimit)
                                {
                                    $scope.pageChanged('fournisseur');
                                }
                            }
                            else
                            {
                                if ($scope.fournisseurview && $scope.fournisseurview.id===getObj.id)
                                {
                                    $scope.fournisseurview = getObj;
                                }
                                $.each($scope.fournisseurs, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.fournisseurs[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('recouvrement')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.recouvrements.push(getObj);
                                $scope.paginationrecouvrement.totalItems++;
                                if($scope.recouvrements.length > $scope.paginationrecouvrement.entryLimit)
                                {
                                    $scope.pageChanged('recouvrement');
                                }
                            }
                            else
                            {
                                if ($scope.recouvrementview && $scope.recouvrementview.id===getObj.id)
                                {
                                    $scope.recouvrementview = getObj;
                                }
                                $.each($scope.recouvrements, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.recouvrements[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('paiement')!==-1)
                        {
                            if ($scope.commandeview)
                            {
                                $scope.commandeview.left_to_pay = getObj.restant;
                            }
                            $scope.pageChanged('paiement');
                        }
                        else if (type.indexOf('produit')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.produits.splice(0,0,getObj);
                                $scope.paginationproduit.totalItems++;
                                if($scope.produits.length > $scope.paginationproduit.entryLimit)
                                {
                                    $scope.pageChanged('produit');
                                }
                            }
                            else
                            {
                                if ($scope.produitview && $scope.produitview.id===getObj.id)
                                {
                                    $scope.produitview = getObj;
                                    //location.reload();
                                }
                                $.each($scope.produits, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.produits[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('vente')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.ventes.push(getObj);
                                $scope.paginationvente.totalItems++;
                                if($scope.ventes.length > $scope.paginationvente.entryLimit)
                                {
                                    $scope.pageChanged('vente');
                                }
                            }
                            else
                            {
                                $.each($scope.ventes, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.ventes[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('commande')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.commandes.splice(0,0,getObj);
                                $scope.paginationcommande.totalItems++;
                                if($scope.commandes.length > $scope.paginationcommande.entryLimit)
                                {
                                    $scope.pageChanged('commande');
                                }
                            }
                            else
                            {
                                if ($scope.commandeview && $scope.commandeview.id===getObj.id)
                                {
                                    $scope.commandeview = getObj;
                                    //location.reload();
                                }
                                $.each($scope.commandes, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.commandes[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('carte')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.cartes.splice(0,0,getObj);
                                $scope.paginationcarte.totalItems++;
                                if($scope.cartes.length > $scope.paginationcarte.entryLimit)
                                {
                                    $scope.pageChanged('carte');
                                }
                            }
                            else
                            {
                                $.each($scope.cartes, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.cartes[keyItem] = getObj;
                                        return false;
                                    }
                                });
                            }
                        }
                        else if (type.indexOf('minuterie')!==-1)
                        {
                            if (!send_dataObj.id)
                            {
                                $scope.minuteries.push(getObj);
                                $scope.paginationminuterie.totalItems++;
                                if($scope.minuteries.length > $scope.paginationminuterie.entryLimit)
                                {
                                    $scope.pageChanged('minuterie');
                                }
                            }
                            else
                            {
                                $.each($scope.minuteries, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===getObj.id)
                                    {
                                        $scope.minuteries[keyItem] = getObj;
                                        return false;
                                    }
                                });
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
                                //location.reload();
                                $scope.pageChanged('user');
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
                    }
                    iziToast.success({
                        title: !data.message ? (!send_dataObj.id ? 'AJOUT' : 'MODIFICATION') : "",
                        message: !data.message ? "" : data.message,
                        position: 'topRight'
                    });

                    console.log('optionals',   optionals);
                    if (optionals && !optionals.closemodal && !send_dataObj.id)
                    {
                        setTimeout(function()
                        {
                            $('#restaurant_depense').val(getRestaurantId);
                        }, 1000);
                    }
                    else
                    {
                        $("#modal_add" + modaltype).modal('hide');
                    }
                    if (type.indexOf('vente')!==-1)
                    {
                        $scope.openTicket(getObj.id);
                    }
                    else if (type.indexOf('commande')!==-1 && type.indexOf('categorie')!==0 && type.indexOf('type')!==0)
                    {
                        if (!send_dataObj.id)
                        {
                            var urlCommande = BASE_URL+ '#!/traitement-commande/'+getObj.id+'/'+thisDateCommande;
                            var traitement = window.open(urlCommande, '_blank');
                            traitement.focus();
                        }
                    }
                    // Soit pour une entrée de stock / sortie de stock
                    if (type.indexOf('stock')!==-1)
                    {
                        $scope.getelements('produits');
                    }
                    // Dans tous les cas, on réinitiliase
                    $scope.localize_panier = null;
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
                    title: (!send_data.id ? 'AJOUT' : 'MODIFICATION'),
                    message: '<span class="h4">Erreur depuis le serveur, veuillez contactez l\'administrateur</span>',
                    position: 'topRight'
                });
                console.log('Erreur serveur ici = ' + msg);
            });
        }
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
            form.parent().parent().blockUI_start();
            Init.importerExcel(type, send_data).then(function(data)
            {
                console.log('livreur', data);
                form.parent().parent().blockUI_stop();
                if (data.data!=null && !data.errors)
                {
                    iziToast.success({
                        title: (!send_dataObj.id ? 'AJOUT' : 'MODIFICATION'),
                        message: "succès",
                        position: 'topRight'
                    });
                    $("#modal_addliste" + type).modal('hide');
                    if (type.indexOf("produit")!==-1){
                        window.location.href = '#!/list-produit';
                        window.location.reload();
                    }
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
        if (type.indexOf('produit')!==-1)
        {
            send_data.append("ligne_produits", JSON.stringify($scope.panier));
            if ($scope.panier.length < 2)
            {
                iziToast.error({
                    title: "",
                    message: "Il faut au moins deux produits",
                    position: 'topRight'
                });
                continuer = false;
            }
        }
        if (form.validate() && continuer)
        {
            form.parent().parent().blockUI_start();
            Init.fusionner(type, send_data).then(function(data)
            {
                console.log('livreur', data);
                form.parent().parent().blockUI_stop();
                if (data.data!=null && !data.errors)
                {
                    iziToast.success({
                        title: (!send_dataObj.id ? 'AJOUT' : 'FUSION'),
                        message: "succès",
                        position: 'topRight'
                    });
                    $("#modal_addfusion" + type).modal('hide');
                    if (type.indexOf("produit")!==-1){
                        window.location.href = '#!/list-produit';
                        window.location.reload();
                    }
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
            form.parent().parent().blockUI_start();
            Init.addDetail(type, send_data).then(function(data)
            {
                console.log('detail', data);
                form.parent().parent().blockUI_stop();
                if (data.data!=null && !data.errors)
                {
                    iziToast.success({
                        title: (!send_dataObj.id ? 'DETAILLER' : 'DETAILLER'),
                        message: "succès",
                        position: 'topRight'
                    });
                    $("#modal_adddetailler" + type).modal('hide');
                    if (type.indexOf("produit")!==-1){
                        window.location.href = '#!/list-produit';
                        window.location.reload();
                    }
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
    $scope.assistedListe = false;
    $scope.showModalUpdate=function (type,itemId, sousfamille=false, forceChangeForm=false)
    {
        reqwrite = type + "s" + "(id:"+ itemId + ")";
        console.log('sousfamille', sousfamille);
        $scope.showModalAdd(type, sousfamille, true);
        Init.getElement(reqwrite, listofrequests_assoc[type + "s"]).then(function(data)
        {
            var item = data[0];
            $scope.itemUpdated = data[0];
            $scope.typeUpdated = type;
            // console.log('item ', type, item);
            $scope.updatetype = type;
            $scope.updateelement = item;
            $scope.fromUpdate = true;
            $('#id_' + type).val(item.id);
            if (type.indexOf("typeclient")!==-1)
            {
                $('#name_' + type).val(item.name);
            }
            else if (type.indexOf("typeproduit")!==-1)
            {
                $('#name_' + type).val(item.name);
            }
            else if (type.indexOf("categoriedepense")!==-1)
            {
                $('#name_' + type).val(item.name);
                setTimeout(function()
                {
                    if (item.type_depense)
                    {
                        $('#type_depense_' + type).val(item.type_depense.id);
                    }
                }, 1000);
            }
            else if (type.indexOf("banque")!==-1)
            {
                $('#name_' + type).val(item.name);
            }
            else if (type.indexOf("typedepense")!==-1)
            {
                $('#name_' + type).val(item.name);
                $('#impact_net_profit_' + type).prop('checked', item.impact_net_profit);
                $('#with_reminder_' + type).prop('checked', item.with_reminder);
            }
            else if (type.indexOf("typecommande")!==-1)
            {
                $('#name_' + type).val(item.name);
            }
            else if (type.indexOf("categoriecommande")!==-1)
            {
                $('#name_' + type).val(item.name);
            }
            else if (type.indexOf("familleproduit")!==-1)
            {
                $('#name_' + type).val(item.name);
                $('#familleproduit_' + type).val(item.famille_produit_id);
            }
            else if (type.indexOf("produit")!==-1)
            {
                $('#nom_' + type).val(item.name);
                $('#code_pro_' + type).val(item.code_pro);
                $('#restaurant_' + type).val(item.restaurant_id);
                $('#prix_' + type).val(item.prix);
                $('#qte_' + type).val(item.qte_min);
                $('#type_produit_' + type).val(item.type_produit_id);
                $('#famille_produit_' + type).val(item.famille_produit_id);
                $('#description_' + type).val(item.description);
                $('#img' + type)
                    .val("")
                    .attr('required',false).removeClass('required');
                $('#affimg' + type).attr('src',(item.image ? item.image : imgupload));
            }
            else if (type.indexOf("stock")!==-1) //Entree de stock et sortie de stock
            {
                console.log('item stock', item);
                //$('#is_buffet_' + type).val('true');
                $('#produit_' + type).val(item.ligne_livraison.ligne_commande.produit_id);
                $('#nomproduit_' + type).val(item.ligne_livraison.ligne_commande.produit.designation);
                $('#motif_' + type).val(item.motif_id);
                $('#quantity_' + type).val(item.quantity);
            }
            else if (type.indexOf("livreur")!==-1) //Retour
            {
                $('#nom_' + type).val(item.nom);
                $('#restaurant_' + type).val(item.restaurant_id);
                $('#prenom_' + type).val(item.prenom);
                $('#nci_' + type).val(item.nci);
                $('#telephone_' + type).val(item.telephone);
                $('#civilite_' + type).val(item.civilite);
                $('#adresse_' + type).val(item.adresse);
                $('#img' + type)
                    .val("")
                    .attr('required',false).removeClass('required');
                $('#affimg' + type).attr('src',(item.image ? item.image : imgupload));
                $scope.userview = item;
            }
            else if (type.indexOf("menu")!==-1)
            {
                $('#designation_' + type).val(item.name);
                $('#code_' + type).val(item.code);
                $('#restaurant_' + type).val(item.restaurant_id);
                $('#prix_' + type).val(item.prix);
                $('#description_' + type).val(item.description);
                $('#img' + type)
                    .val("")
                    .attr('required',false).removeClass('required');
                $('#affimg' + type).attr('src',(item.image ? item.image : imgupload));
                $scope.userview = item;
                // $('#bon_livraison_' + type).val(item.bon_livraison_id).trigger('change');
                var liste_lignemenus = [];
                $.each(item.ligne_produit_menus, function (keyItem, valueItem) {
                    liste_lignemenus.push({"id":valueItem.produit_id,"produit_id":valueItem.produit_id, "name":valueItem.produit.name, "qte_produit" : valueItem.qte});
                });
                $scope.panier = [];
                $scope.panier = liste_lignemenus;
            }
            else if (type.indexOf("caisse")!==-1)
            {
                $('#date_' + type).val(item.date);
                $('#restaurant_' + type).val(item.restaurant_id);
                $('#montant_debut_' + type).val(item.montant_debut);
                $('#montant_clocture_' + type).val(item.montant_clocture);
            }
            else if (type.indexOf("versement")!==-1)
            {
                $('#caisse_' + type).val(item.caisse_id);
                $('#montant_verser_' + type).val(item.montant_verser);
                $('#mode_paiement_ ' + type).val(item.mode_paiement);
                $('#commentaire_' + type).val(item.commetaires);
            }
            else if (type.indexOf("tier")!==-1)
            {
                $('#nomcomplet_' + type).val(item.nomcomplet);
                $('#telephone_' + type).val(item.telephone);
                $('#email_' + type).val(item.email);
                $('#adresse_' + type).val(item.adresse);
                $('#observations_' + type).val(item.observations);
            }
            else if (type.indexOf("paiementdepense")!==-1)
            {
                $('#date_' + type).val(item.date);
                $('#montant_' + type).val(item.montant);
                $('#modepaiement_' + type).val(item.mode_paiement_id);
                $('#date_echeance_' + type).val(item.date_echeance);
                $('#nb_jour_rappel_' + type).val(item.nb_jour_rappel);
                $('#commentaire_' + type).val(item.commentaire);
            }
            else if (type.indexOf("depense")!==-1)
            {
                $('#restaurant_' + type).val(item.restaurant.id);
                $('#type_depense_' + type).val(item.type_depense.id);
                $('#categorie_depense_' + type).val(item.categorie_depense.id);
                $('#montant_' + type).val(item.montant);
                $('#mode_paiement_' + type).val(item.mode_paiement_id);

                $('#motif_' + type).val(item.motif);
                $('#date_' + type).val(item.date);
                $('#date_echeance_' + type).val(item.date_echeance);
                $('#nb_jour_rappel_' + type).val(item.nb_jour_rappel);
                $('#commentaires_' + type).val(item.commentaires);

                if (item.tier)
                {
                    $scope.tierSelected = item.tier;
                    $scope.tiers.push(item.tier);
                    $('#tier_' + type).val(item.tier.id).trigger('change');
                }
            }
            else if (type.indexOf("entreeca")!==-1)
            {
                $('#restaurant_' + type).val(item.restaurant.id);
                $('#montant_' + type).val(item.montant);
                $('#motif_' + type).val(item.motif);
                $('#date_' + type).val(item.date);
                $('#commentaires_' + type).val(item.commentaires);
            }
            else if (type.indexOf("zonelivraison")!==-1)
            {
                $('#name_' + type).val(item.name);
                $('#tarif_' + type).val(item.tarif);
                $('#resto_' + type).val(item.restaurant_id);

                $scope.zonelivraisonrestaurantsInTable = item.zone_livraison_restaurants;
                // Pour reformer le tableau de prix
                $.each($scope.restaurants, function (keyItem, oneItem)
                {

                    var existe = false;
                    $.each($scope.zonelivraisonrestaurantsInTable, function (subKeyItem, subOneItem)
                    {
                        if (oneItem.id === subOneItem.restaurant_id)
                        {
                            existe = true;
                        }
                        return !existe;
                    });

                    if (!existe)
                    {
                        console.log('restaurant info', oneItem.designation);

                        $scope.zonelivraisonrestaurantsInTable.push({
                            "restaurant_id": oneItem.id,
                            "restaurant": {designation: oneItem.designation},
                            "tarif": 0
                        });
                    }
                });
            }
            else if (type.indexOf("horaireconnexion")!==-1)
            {
                $('#name_' + type).val(item.name);
                $('#resto_' + type).val(item.restaurant_id);
                $('#heur_deb_' + type).val(item.heur_debut);
                $('#heur_fin_' + type).val(item.heur_fin);
            }
            else if (type.indexOf("crenohoraire")!==-1)
            {
                $('#duree_' + type).val(item.duree);
                $('#jour_debut_' + type).val(item.jour_debut).trigger('change');
                $('#jour_fin_' + type).val(item.jour_fin).trigger('change');
                $('#heur_debut_' + type).val(item.heur_debut);
                $('#heur_fin_' + type).val(item.heur_fin);
                $('#commentaire_' + type).val(item.commentaires);
                $('#minuterie_' + type).val(item.minuterie_id);
                $('#type_commande_' + type).val(item.type_commande_id);
                $('#restaurant_' + type).val(item.restaurant_id);
            }
            else if (type.indexOf("commande") !== -1)
            {
                if (item.client)
                {
                    $scope.clientSelected = item.client;
                    $scope.clients.push(item.client);
                    $('#client_' + type).val(item.client.id).change();
                }

                $('#restaurant_' + type).val(item.restaurant_id);
                $('#typecommande_' + type).val(item.type_commande_id);
                $('#categoriecommande_' + type).val(item.categorie_commande_id);
                $('#numerotable_' + type).val(item.numero_table);
                $('#nbpersonne_' + type).val(item.nb_personne);
                $('#remise_' + type).val(item.remise_poucentage);
                $('#remisevaleur_' + type).val(item.remise);
                $('#commentaire_' + type).val(item.commentaires);
                $('#adresselivraison_' + type).val(item.adresse_a_livre);

                // Pour juste rappeler la liste des elements
                var timeToSelectZone = 1000;
                if ($('#restaurant_' + type).length !== 0)
                {
                    $scope.getelements("zonelivraisonrestaurants");
                    timeToSelectZone = 3000;
                }

                $timeout(function()
                {
                    $('#zonelivraisonrestaurant_' + type).val(item.zone_livraison_restaurant_id).trigger('change');
                    $scope.calculateTotal('commande');
                }, timeToSelectZone);

                $('#livreur_' + type).val(item.livreur_id).trigger('change');
                $('#montant_remise_livreur').val(item.montant_remise_livreur);
                $("#livraison_offerte_commande").prop('checked', item.livraison_offerte);

                var liste_lignecommande_menus = [];
                var liste_lignecommande_prods = [];
                $.each(item.ligne_commande_menus, function (keyItem, valueItem) {
                    liste_lignecommande_menus.push({"id":valueItem.menu.id,"menu_id":valueItem.menu.id,"qte_commande":valueItem.qte,"options":valueItem.options,"offert":valueItem.offert, "name":valueItem.menu.name, "prix":valueItem.prix});
                });
                $.each(item.ligne_commande_produits, function (keyItem, valueItem) {
                    liste_lignecommande_prods.push({"id":valueItem.produit.id,"produit_id":valueItem.produit.id, "qte_commande":valueItem.qte,"options":valueItem.options,"offert":valueItem.offert, "name":valueItem.produit.name, "prix":valueItem.prix});
                });
                $scope.selectionCarte = [];
                $scope.panier = [];
                $scope.selectionCarte = liste_lignecommande_menus;
                $scope.panier = liste_lignecommande_prods;
                $scope.calculateTotal('commande');
            }
            else if (type.indexOf("carte") !==-1)
            {
                console.log("item restaurant item", item);
                $('#name_' + type).val(item.name);
                $('#code_' + type).val(item.code);
                $('#restaurant_' + type).val(item.restaurant_id);
                $('#commentaire_' + type).val(item.commentaire);
                var liste_lignecarte_menus = [];
                var liste_lignecarte_prods = [];
                $.each(item.ligne_carte_menus, function (keyItem, valueItem) {
                    if (valueItem.menu)
                    {
                        liste_lignecarte_menus.push({"id":valueItem.menu.id,"menu_id":valueItem.menu.id, "name":valueItem.menu.name, "prix":valueItem.menu.prix});
                    }
                });
                $.each(item.ligne_carte_produits, function (keyItem, valueItem) {
                    if (valueItem.produit)
                    {
                        liste_lignecarte_prods.push({"id":valueItem.produit.id,"produit_id":valueItem.produit.id, "name":valueItem.produit.name, "prix":valueItem.produit.prix});
                    }
                });
                $scope.selectionCarte = [];
                $scope.panier = [];
                $scope.selectionCarte = liste_lignecarte_menus;
                $scope.panier = liste_lignecarte_prods;

                console.log('donnees reconstruites', $scope.panier, $scope.selectionCarte);
            }
            else if (type.indexOf("minuterie") !== -1)
            {
                $('#name_' + type).val(item.name);
                $('#couleur_' + type).val(item.couleur);
            }
            else if (type.indexOf("bonlivraison") !== -1)
            {
                $('#fournisseur_' + type).val(item.bon_commande.fournisseur_id);
                $('#numerofournisseur_' + type).val(item.numero_bl_fournisseur);
                $('#datefournisseur_' + type).val(item.date_bl_fournisseur);
                var liste_lignelivraisons = [];
                $.each(item.lignelivraisons, function (keyItem, valueItem) {
                    liste_lignelivraisons.push({"id":valueItem.ligne_commande.produit.id,"produit_id":valueItem.ligne_commande.produit.id,"code":valueItem.ligne_commande.produit.code, "designation":valueItem.ligne_commande.produit.designation,"tva":valueItem.ligne_commande.produit.with_tva, "qte_livre" : valueItem.qte_livre, "qte_bonus" : valueItem.qte_bonus, "prix_cession":valueItem.prix_cession, "prix_public":valueItem.prix_public});
                });
                $scope.panier = [];
                $scope.panier = liste_lignelivraisons;
                $scope.calculateTotal('bonlivraison');
            }
            else if (type.indexOf("vente") !== -1)
            {
                $('#client_' + type).val(item.client_id);
                $('#restaurant_' + type).val(item.restaurant_id);
                $('#tauxpriseencharge_' + type).val(item.pourcentage_payeur);
                $('#matriculepatient_' + type).val(item.matricule_patient);
                $('#mode_paiement_' + type).val(item.mode_paiement_id);
                $('#remise_' + type).val(item.pourcentage_remise);
                $('#remisevaleur_' + type).val(item.remise_valeur);
                $('#encaisse_' + type).val(item.somme_encaisse);
                $('#caisse_' + type).val(item.caisse_id);
                $scope.client_lambda_vente = '';
                if (item.client_id==null)
                {
                    $scope.client_lambda_vente = 'on';
                    $("#client_lambda_vente").prop('checked', true);
                }
                var liste_ligneventes = [];
                $.each(item.details_ventes, function (keyItem, valueItem) {
                    liste_ligneventes.push({"id":valueItem.ligne_livraison.ligne_commande.produit.id,"produit_id":valueItem.ligne_livraison.ligne_commande.produit.id,"code":valueItem.ligne_livraison.ligne_commande.produit.code, "designation":valueItem.ligne_livraison.ligne_commande.produit.designation,"tva":valueItem.ligne_livraison.ligne_commande.produit.tva, "qte_vendue" : valueItem.qte_vendu, "prix_unitaire":valueItem.prix_unitaire});
                });
                $scope.panier = [];
                $scope.panier = liste_ligneventes;
                $scope.calculateTotal('vente');
            }
            else if (type.indexOf("client")!==-1)
            {
                console.log(item);
                $('#nomcomplet_' + type).val(item.nomcomplet);
                $('#telephone_' + type).val(item.telephone);
                $('#email_' + type).val(item.email);
                $('#type_client_' + type).val(item.type_client_id);
                $('#adresse_' + type).val(item.adresse);
                $('#restaurant_' + type).val(item.restaurant_id);
                $('#remise_' + type).val(item.remise_client);
                $('#zone_livraison_' + type).val(item.zone_livraison_id);
            }
            else if (type.indexOf("restaurant")!==-1)
            {
                $('#adresse_' + type).val(item.adresse);
                $('#responsable_' + type).val(item.responsable_id).trigger('change');
                $('#designation_' + type).val(item.designation);
                $('#telephone_' + type).val(item.telephone);
                $('#description_' + type).val(item.description);
                $('#img' + type)
                    .val("")
                    .attr('required',false).removeClass('required');
                $('#affimg' + type).attr('src',(item.image ? item.image : imgupload));
            }
            else if (type.indexOf("fournisseur")!==-1)
            {
                $('#nom_' + type).val(item.nom);
                $('#adresse_' + type).val(item.adresse);
                $('#telephone_' + type).val(item.telephone);
                $('#email_' + type).val(item.email);
            }
            else if (type.indexOf("paiement")!==-1)
            {
                $('#date_' + type).val(item.date);
                $('#montant_' + type).val(item.montant);
                $('#mode_paiement_' + type).val(item.mode_paiement);
            }
            else if (type.indexOf("typeproduit")!==-1)
            {
                $('#designation_' + type).val(item.designation);
            }
            else if (type.indexOf("inventaire")!==-1)
            {
                $('#code_' + type).val(item.code_inventaire);
                var liste_ligneinventaires = [];
                $.each(item.details_inventaires, function (keyItem, valueItem) {
                    liste_ligneinventaires.push({"id":valueItem.produit_id,"produit_id":valueItem.produit_id, "designation":valueItem.produit.designation, "current_quantity" : valueItem.qte_app, "qté_inventaire":valueItem.qté_inventorie});
                });
                $scope.panier = [];
                $scope.panier = liste_ligneinventaires;
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
                $('#resto_' + type).val(item.restaurant_id).attr('disabled', forceChangeForm);
                $('#role_' + type).val(item.roles[0].id).attr('disabled', forceChangeForm);
                $('#email_' + type).val(item.email).attr('readonly', forceChangeForm);
                $('#password_' + type).val("");
                $('#confirmpassword_' + type).val("");
                var liste_horaires = [];
                $.each(item.user_horaires, function (keyItem, valueItem) {
                    liste_horaires.push(valueItem.horaire_connexion.id);
                });
                $('#user_horaires_' + type).val(liste_horaires).trigger("change").attr('disabled', forceChangeForm);
                $('#img' + type)
                    .val("")
                    .attr('required',false).removeClass('required');
                $('#affimg' + type).attr('src', (item.image ? item.image : imgupload));
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
                $scope.ligne_carte_menus = [];
                $.each($scope.menuview.ligne_carte_menus, function (key, value) {
                    $scope.ligne_carte_menus.push(value.produit_id);
                });
                console.log('menu', $scope.ligne_carte_menus);
            }
            else if (type.indexOf("carte")!==-1)
            {
                $('#name_' + type).val(item.name);
                $('#commentaire_' + type).val(item.commentaire);
                $scope.carteview = item;
                $scope.ligne_carte_menus = [];
                $.each($scope.carteview.ligne_carte_menus, function (key, value) {
                    $scope.ligne_carte_menus.push({"id":value.menu.id,"menu_id":value.menu.id, "name":value.menu.name, "prix":value.menu.prix});
                });
                $scope.ligne_carte_produits = [];
                $.each($scope.carteview.ligne_carte_produits, function (key, value) {
                    $scope.ligne_carte_produits.push({"id":value.produit.id,"produit_id":value.produit.id, "name":value.produit.name, "prix":value.produit.prix});
                });
                $scope.selectionCarte = [];
                $scope.panier = [];
                $scope.selectionCarte = $scope.ligne_carte_menus;
                $scope.panier = $scope.ligne_carte_produits;
                console.log('menu', $scope.ligne_carte_menus, 'produit', $scope.ligne_carte_produits);
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
                if (value.produit_id == idItem)
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
    // Permet soit d'ajouter ou de supprimer une ligne au niveau de la reservation
    $scope.forligne = function(e,type,action,idItem=0,parent=0)
    {
        e.preventDefault();
        if (type.indexOf("ligne_inventaire")!==-1)
        {
            if (angular.isNumber(action) && action > 0)
            {
                $scope.ligne_inventaires.push({'produit_id':0, 'qte_app':0, 'qte_inventorie':0, 'ligne_regularisation':null});
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
                                $scope.produit_ligneinventaire[keyItem] = oneItem.produit_id;
                                $('.ligne_inventaire[data-ligne='+(keyItem)+']')
                                    .find('[name^="produit"]').val(oneItem.produit_id).trigger('change');
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
    $scope.itemChange_detailcommande = function (parent, forItem, child = 0) {
        console.log('change detect');
        if (forItem.indexOf('client') !== -1) {
        }
        if (forItem.indexOf('zone') !== -1) {
        }
        console.log('Je suis dans le itemChange');
        // Que le calcul se fasse après que les elements ont été display sur la vue
        $timeout(function () {
            $scope.calculateTotal('commande');
            $scope.setAdresseAndZone('commande');
            // $('#amount_paid_reservation').attr('max',$('#total_amount_reservation').val());
        });
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

    $scope.setAdresseAndZone = function(type)
    {
        if (type.indexOf('commande')!==-1)
        {
            if ($('#client_commande').val() != "") {
                $.each($scope.clients, function (key, value) {
                    if (value.id === Number($('#client_commande').val()))
                    {
                       $("#adresselivraison_commande").val(value.adresse);

                        if (!$("#id_commande").val() && value.zone_livraison_id)
                        {
                            $.each($scope.zonelivraisonrestaurants, function(keyItem, valueItem){
                                console.log('voyons voir =>',  valueItem.zone_livraison.id, value.zone_livraison_id);

                                if (valueItem.zone_livraison.id === value.zone_livraison_id && ( $("restaurant_commande").length == 0 || ($("restaurant_commande").length > 0 && $("restaurant_commande").val() && valueItem.restaurant.id === $("restaurant_commande").val()) ))
                                {
                                    $("#zonelivraisonrestaurant_commande").val(valueItem.id);
                                    $scope.calculateTotal('commande');
                                    return false;
                                }
                           });
                        }
                    }
                });
            }
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
        else if (type.indexOf('commande')!==-1)
        {
            $scope.total_amountss_commande = 0;
            $scope.total_amount_commande = 0;
            $scope.calculatedremisepourcent = 0;
            $scope.tariflivraison_commande = 0;
            $scope.net_commande = 0;
            $scope.monnaielivreur_commande = 0;
            $scope.remisevaleur_commande = Number($('#remisevaleur_commande').val()) ;
            $scope.remisepourcent_commande = Number($('#remise_commande').val());

            if ($scope.selectionCarte.length > 0 || $scope.panier.length > 0)
            {
                $scope.offre = 0;
                if ($scope.selectionCarte.length > 0) {
                    $.each($scope.selectionCarte, function (key, value)
                    {
                         //   if(value.offert == false)
                         //   {
                         //       $scope.total_amountss_commande = $scope.total_amountss_commande + (value.qte_commande * value.prix);
                         //   }
                         // else  if (value.offert == true &&   $scope.total_amountss_commande > 0)
                         //   {
                         //       $scope.total_amountss_commande = $scope.total_amountss_commande - (value.qte_commande * value.prix);
                         //
                         //   }
                        if (value.offert == false)
                        {
                            $scope.total_amountss_commande = $scope.total_amountss_commande + (value.qte_commande * value.prix);
                        }
                        else if (value.offert == true)
                        {
                            $scope.offre =    $scope.offre + (value.qte_commande * value.prix);
                            console.log("new valeur a diminuer cote menu", value.qte_commande * value.prix, "offre total" , $scope.offre);
                            //$scope.total_amountss_commande = $scope.total_amountss_commande - ((value1.qte_commande * value1.prix));
                        }
                    });
                    console.log('bonjour scope menu', $scope.selectionCarte);
                }
                if ($scope.panier.length > 0) {
                    ii = 1;

                    $.each($scope.panier, function (key1, value1)
                    {

                        console.log("valeur", value1);
                        if (value1.offert == false)
                        {
                            $scope.total_amountss_commande = $scope.total_amountss_commande + (value1.qte_commande * value1.prix);
                        }
                        else if (value1.offert == true)
                        {
                             $scope.offre =    $scope.offre + (value1.qte_commande * value1.prix);
                             console.log("new valeur a diminuer", value1.qte_commande * value1.prix, "offre total" , $scope.offre);
                            //$scope.total_amountss_commande = $scope.total_amountss_commande - ((value1.qte_commande * value1.prix));
                        }
                    });

                    console.log('bonjour scope panier', $scope.panier);

                }
              //  $scope.total_amountss_commande = $scope.total_amountss_commande - $scope.offre;
                $scope.calculatedremisepourcent = ($scope.remisepourcent_commande * $scope.total_amountss_commande)/100;
                $scope.remisetotale_commande = Number($('#remisevaleur_commande').val())+$scope.calculatedremisepourcent ;
                if ( ($scope.total_amountss_commande - ($scope.remisevaleur_commande + $scope.calculatedremisepourcent) ) <= 0)
                {
                    iziToast.warning({
                        title: "",
                        message: "Le total des remises ne peut être superieur ou égal au total à régler",
                        position: 'topRight'
                    });
                    $('#remisevaleur_commande').val(0);
                    $('#remise_commande').val(0);
                    $scope.remisevaleur_commande = 0;
                    $scope.remisepourcent_commande = 0;
                }
                if ($('#zonelivraisonrestaurant_commande').val() != "") {
                    $.each($scope.zonelivraisonrestaurants, function (key, value) {
                        if (value.id === Number($('#zonelivraisonrestaurant_commande').val())) {
                            $scope.tariflivraison_commande = value.tarif;
                        }
                    });
                }
                $scope.total_amount_commande = $scope.total_amountss_commande - ($scope.remisevaleur_commande + $scope.calculatedremisepourcent);
                $scope.net_commande = $scope.total_amount_commande + $scope.tariflivraison_commande;
                var net_in_string = $scope.net_commande.toString();
                var last_four = Number(net_in_string.substring(net_in_string.length - 4, net_in_string.length));
                console.log(last_four);
                if (last_four != 0) {
                    $scope.monnaielivreur_commande = (10000 - last_four);
                }

                console.log('total_amountss_commande',$scope.total_amount_commande, 'tarif liv',$scope.tariflivraison_commande, $('#remisevaleur_commande').val(), $('#remise_commande').val());
            }
        }
    };
    $scope.trierElement=function (type,element,propriete="")
    {
        console.log(type.indexOf);
        if (type.indexOf('client')!==-1)
        {
            console.log('trierElement');
            if (propriete.match('commande')) {
                $.each($scope.clients, function (key, value) {
                    if (value.id === element) {
                        $scope.clientSelected = element;
                        console.log('clientSelected', $scope.clientSelected);
                        return false;
                    }
                });
            }
        }
        else if (type.indexOf('restaurant')!==-1)
        {
            if (propriete.match('recouvrement'))
            {
                $.each($scope.restaurants, function (key, value) {
                    if (value.id == element)
                    {
                        $scope.restaurantSelected=element;
                        console.log('restaurantSelected', $scope.restaurantSelected);
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
                        if (data.data && !data.errors)
                        {
                            if (type.indexOf('caisse')!==-1)
                            {
                                $.each($scope.caisses, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.caisses.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                            }
                            else if (type.indexOf('typeclient')!==-1)
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
                            else if (type.indexOf('typecommande')!==-1)
                            {
                                $.each($scope.typecommandes, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.typecommandes.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                            }
                            else if (type.indexOf('categoriecommande')!==-1)
                            {
                                $.each($scope.categoriecommandes, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.categoriecommandes.splice(keyItem, 1);
                                        return false;
                                    }
                                });
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
                                $scope.paginationclient.totalItems--;
                                if($scope.clients.length < $scope.paginationclient.entryLimit)
                                {
                                    $scope.pageChanged('client');
                                }
                            }
                            else if (type.indexOf('typeproduit')!==-1)
                            {
                                $.each($scope.typeproduits, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.typeproduits.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                            }
                            else if (type.indexOf('categoriedepense')!==-1)
                            {
                                $.each($scope.categoriedepenses, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.categoriedepenses.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginations['categoriedepense'].totalItems--;
                                if($scope.categoriedepenses.length < $scope.paginations['categoriedepense'].entryLimit)
                                {
                                    $scope.pageChanged('categoriedepense');
                                }
                            }
                            else if (type.indexOf('typedepense')!==-1)
                            {
                                $.each($scope.typedepenses, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.typedepenses.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                            }
                            else if (type.indexOf('tier')!==-1)
                            {
                                if ($scope.tierview && $scope.tierview.id)
                                {
                                    $location.path('list-tier');
                                }
                                $.each($scope.tiers, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.tiers.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginationtier.totalItems--;
                                if($scope.tiers.length < $scope.paginationtier.entryLimit)
                                {
                                    $scope.pageChanged('tier');
                                }
                            }
                            else if (type.indexOf('paiementdepense')!==-1)
                            {
                                $scope.pageChanged('paiementdepense');
                            }
                            else if (type.indexOf('depense')!==-1)
                            {
                                $.each($scope.depenses, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.depenses.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginations['depense'].totalItems--;
                                if($scope.depenses.length < $scope.paginations['depense'].entryLimit)
                                {
                                    $scope.pageChanged('depense');
                                    $scope.getelements('modepaiements');
                                }
                            }
                            else if (type.indexOf('entreeca')!==-1)
                            {
                                $.each($scope.entreecas, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.entreecas.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginations['entreeca'].totalItems--;
                                if($scope.entreecas.length < $scope.paginations['entreeca'].entryLimit)
                                {
                                    $scope.pageChanged('entreeca');
                                }
                            }
                            else if (type.indexOf('banque')!==-1)
                            {
                                $.each($scope.banques, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.banques.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                            }
                            else if (type.indexOf('versement')!==-1)
                            {
                                $.each($scope.versements, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.depenses.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginations['versement'].totalItems--;
                                if($scope.versements.length < $scope.paginations['versement'].entryLimit)
                                {
                                    $scope.pageChanged('versement');
                                }
                            }
                            else if (type.indexOf('motif')!==-1)
                            {
                                $.each($scope.motifs, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.motifs.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                            }
                            else if (type.indexOf('familleproduit')!==-1)
                            {
                                $.each($scope.familleproduits, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.familleproduits.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $.each($scope.nbfamilleReel, function (keyItem1, oneItem1)
                                {
                                    if (oneItem1.id===itemId)
                                    {
                                        $scope.nbfamilleReel.splice(keyItem1, 1);
                                        return false;
                                    }
                                });
                                $.each($scope.nbsousfamilleReel, function (keyItem2, oneItem2)
                                {
                                    if (oneItem2.id===itemId)
                                    {
                                        $scope.nbsousfamilleReel.splice(keyItem2, 1);
                                        return false;
                                    }
                                });
                            }
                            else if (type.indexOf('produit')!==-1)
                            {
                                if ($scope.produitview && $scope.produitview.id)
                                {
                                    $location.path('list-produit');
                                }
                                $.each($scope.produits, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.produits.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginationproduit.totalItems--;
                                if($scope.produits.length < $scope.paginationproduit.entryLimit)
                                {
                                    $scope.pageChanged('produit');
                                }
                            }
                            else if (type.indexOf('entreestock')!==-1)
                            {
                                $.each($scope.entreestocks, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.entreestocks.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginationentreestock.totalItems--;
                                if($scope.entreestocks.length < $scope.paginationentreestock.entryLimit)
                                {
                                    $scope.pageChanged('entreestock');
                                }
                            }
                            else if (type.indexOf('sortiestock')!==-1)
                            {
                                $.each($scope.sortiestocks, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.sortiestocks.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginationsortiestock.totalItems--;
                                if($scope.sortiestocks.length < $scope.paginationsortiestock.entryLimit)
                                {
                                    $scope.pageChanged('sortiestock');
                                }
                            }
                            else if (type.indexOf('livreur')!==-1)
                            {
                                $.each($scope.livreurs, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.livreurs.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginationlivreur.totalItems--;
                                if($scope.livreurs.length < $scope.paginationlivreur.entryLimit)
                                {
                                    $scope.pageChanged('livreur');
                                }
                            }
                            else if (type.indexOf('vente')!==-1)
                            {
                                $.each($scope.ventes, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.ventes.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginationvente.totalItems--;
                                if($scope.ventes.length < $scope.paginationvente.entryLimit)
                                {
                                    $scope.pageChanged('vente');
                                }
                            }
                            else if (type.indexOf('caisse')!==-1)
                            {
                                $.each($scope.caisses, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.caisses.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginationcaisse.totalItems--;
                                if($scope.caisses.length < $scope.paginationcaisse.entryLimit)
                                {
                                    $scope.pageChanged('caisse');
                                }
                            }
                            else if (type.indexOf('versement')!==-1)
                            {
                                $.each($scope.versements, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.versements.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginationversement.totalItems--;
                                if($scope.clotures.length < $scope.paginationversement.entryLimit)
                                {
                                    $scope.pageChanged('versement');
                                    $scope.getelements('modepaiements');
                                }
                            }
                            else if (type.indexOf('horaireconnexion')!==-1)
                            {
                                $.each($scope.horaireconnexions, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.horaireconnexions.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                            }
                            else if (type.indexOf('crenohoraire')!==-1)
                            {
                                $.each($scope.crenohoraires, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.crenohoraires.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                            }
                            else if (type.indexOf('zonelivraison')!==-1)
                            {
                                $.each($scope.zonelivraisons, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.zonelivraisons.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                            }
                            else if (type.indexOf('inventaire')!==-1)
                            {
                                $.each($scope.inventaires, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.inventaires.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginationinventaire.totalItems--;
                                if($scope.inventaires.length < $scope.paginationinventaire.entryLimit)
                                {
                                    $scope.pageChanged('inventaire');
                                }
                            }
                            else if (type.indexOf('restaurant')!==-1)
                            {
                                if ($scope.restaurantview && $scope.restaurantview.id)
                                {
                                    $location.path('list-restaurants');
                                }
                                $.each($scope.restaurants, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.restaurants.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginations['restaurant'].totalItems--;
                                if($scope.restaurants.length < $scope.paginations['restaurant'].entryLimit)
                                {
                                    $scope.pageChanged('restaurant');
                                }
                            }
                            else if (type.indexOf('menu')!==-1)
                            {
                                if ($scope.menuview && $scope.menuview.id)
                                {
                                    $location.path('list-restaurants');
                                }
                                $.each($scope.menus, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.menus.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginationmenu.totalItems--;
                                if($scope.menus.length < $scope.paginationmenu.entryLimit)
                                {
                                    $scope.pageChanged('menu');
                                }
                            }
                            else if (type.indexOf('recouvrement')!==-1)
                            {
                                if ($scope.recouvrementview && $scope.recouvrementview.id)
                                {
                                    $location.path('list-recouvrement');
                                }
                                $.each($scope.recouvrements, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.recouvrements.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginationrecouvrement.totalItems--;
                                if($scope.recouvrements.length < $scope.paginationrecouvrement.entryLimit)
                                {
                                    $scope.pageChanged('recouvrement');
                                }
                            }
                            else if (type.indexOf('commande')!==-1)
                            {
                                if ($scope.commandeview && $scope.commandeview.id)
                                {
                                    $location.path('list-commande');
                                }
                                $.each($scope.commandes, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.commandes.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginationcommande.totalItems--;
                                if($scope.commandes.length < $scope.paginationcommande.entryLimit)
                                {
                                    $scope.pageChanged('commande');
                                }
                            }
                            else if (type.indexOf('carte')!==-1)
                            {
                                $.each($scope.cartes, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.cartes.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginationcarte.totalItems--;
                                if($scope.cartes.length < $scope.paginationcarte.entryLimit)
                                {
                                    $scope.pageChanged('carte');
                                }
                            }
                            else if (type.indexOf('fournisseur')!==-1)
                            {
                                if ($scope.fournisseurview && $scope.fournisseurview.id)
                                {
                                    $location.path('list-fournisseur');
                                }
                                $.each($scope.fournisseurs, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.fournisseurs.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginationfournisseur.totalItems--;
                                if($scope.fournisseurs.length < $scope.paginationfournisseur.entryLimit)
                                {
                                    $scope.pageChanged('fournisseur');
                                }
                            }
                            else if (type.indexOf('minuterie')!==-1)
                            {
                                $.each($scope.minuteries, function (keyItem, oneItem)
                                {
                                    if (oneItem.id===itemId)
                                    {
                                        $scope.minuteries.splice(keyItem, 1);
                                        return false;
                                    }
                                });
                                $scope.paginationminuterie.totalItems--;
                                if($scope.minuteries.length < $scope.paginationminuterie.entryLimit)
                                {
                                    $scope.pageChanged('minuterie');
                                }
                            }
                            else if (type.indexOf('paiement')!==-1)
                            {
                                $scope.pageChanged('paiement');
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
                                message: data.errors,
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
