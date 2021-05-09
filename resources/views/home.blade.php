@extends('layouts.app')

@section('content')

    <body ng-controller="BackEndCtl" id="page-top">

    <!-- Page Wrapper -->
    <div id="wrapper">

        <style>

            .select2-container--default .select2-selection--single {
                border-radius: 0px !important;
                color: #83B2DF !important;

            }

            .select2-container .select2-selection--single {
                box-sizing: border-box;
                cursor: pointer;
                display: block;
                height: 40px !important;
                border-radius: 5px!important;
                user-select: none;
                -webkit-user-select: none;
            }

            .select2-container--default .select2-selection--single .select2-selection__arrow {
                height: 26px;
                position: absolute;
                top: 6px !important;
                right: 1px;
                width: 20px;
            }

            .select2-container--default .select2-selection--single .select2-selection__rendered {
                line-height: 35px;
                top: 5px !important;
            }

        </style>

        @include('layouts.partials.menu_bar')

        <div id="content-wrapper" class="d-flex flex-column">

            <!-- Main Content -->
            <div id="content">
                @include('layouts.partials.nav_bar')

                <div class="container-fluid" ng-view>
                </div>

                <footer class="fixed-footer bg-white fixed-bottom">
                    <div class="container my-auto">
                        <div class="copyright text-center my-auto">
                          <span>Copyright &copy; Khazim Ndiaye Développeur  2021</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </div>
    </body>


    {{--    les modals ici--}}

    <div class="modal fade" id="modal_addplan" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog modal-lg" role="document"  style="max-width: 94%">
            <div class="modal-content">
                <div class="modal-header bg-gradient-dark text-white">
                    <h5 class="modal-title" id="exampleModalLongTitle">Ajouter Un Nouveau Plan</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body m-3">
                    <form id="form_addplan" class="form" enctype="multipart/form-data" accept-charset="UTF-8">
                        @csrf
                        <input type="hidden" id="id_plan" name="id">
                        <input type="hidden" name="tab_plan" id="tab_plan" value="@{{produitsInTable}}">

                        <div class="row">
                            <div class="col-lg-3">
                                <div class="form-group">
                                    <label for="superficie_plan">Superficie</label>
                                    <input type="number" id="superficie_plan" name="superficie" class="form-control">
                                </div>
                            </div>
                            <div class="col-lg-3">
                                <div class="form-group">
                                    <label for="longeur_plan">Longeur</label>
                                    <input type="number" id="longeur_plan" name="longeur" class="form-control">
                                </div>
                            </div>
                            <div class="col-lg-3">
                                <div class="form-group">
                                    <label for="largeur_plan">Largeur</label>
                                    <input type="number" id="largeur_plan" name="largeur" class="form-control">
                                </div>
                            </div>
                            <div class="col-lg-3">
                                <div class="form-group">
                                    <label for="unite_mesure_plan">Unité de mesure</label>
                                    <select class="form-control" id="unite_mesure_plan" name="unite_mesure">
                                        <option value="1">Mettre carré</option>
                                        <option value="2">Hectare</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                         <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="piscine_plan">Piscine</label>
                                    <select class="form-control" id="piscine_plan" name="piscine">
                                        <option value="0">NON</option>
                                        <option value="1">OUI</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group">
                                    <label for="garage_plan">Garage</label>
                                    <select class="form-control" id="garage_plan" name="garage">
                                        <option value="1">OUI</option>
                                        <option value="0">NON</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">

                            <div class="col-lg-12">
                                <div class="form-group">
                                    <label for="fichier_plan">Fichier</label>
                                    <input type="file" class="form-control" id="fichier_plan" name="fichier">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-3">
                                <label class="checkbox-inline">
                                    <input type="checkbox" id="residence_location_plan" value="true" name="residence_location"> 
                                    Résidence pour location
                                </label>
                            </div>
                            <div class="col-lg-3">
                                <label class="checkbox-inline">
                                    <input type="checkbox" id="residence_personnel_plan" value="true" name="residence_personnel">
                                     Résidence personnelle
                                </label>
                            </div>
                             <div class="col-lg-3">
                                <label class="checkbox-inline">
                                    <input type="checkbox" id="zone_assainie_plan" value="true" name="zone_assainie">
                                    Zone assainie
                                </label>
                            </div>
                             <div class="col-lg-3">
                                <label class="checkbox-inline">
                                    <input type="checkbox" id="zone_electrifie_plan" value="true" name="zone_electrifie"> 
                                    Zone éléctrifiée
                                </label>
                            </div>
                        </div>

                       {{-- <hr>--}}
                        <h4 class="form-section animated fadeInDown mb-3 mt-5 border-bottom border-alternate">
                            <i class="fa fa-shopping-cart"></i>
                            NIVEAUX
                        </h4>
                        <div class="row">
                            <div class="card col-lg-12">
                               
                                <div class="card-body">
                                    <div class="row">
                                        <!-- <div class="col-lg-3">
                                            <div class="form-group">
                                                <label for="niveau_plan">Designation</label>
                                                <input type="text" name="niveau" id="niveau_plan" class="form-control" >
                                            </div>
                                        </div>
                                        <div class="col-lg-3">
                                            <div class="form-group">
                                                <label for="piece_plan">Pièces</label>
                                                <input type="number" name="piece" id="piece_plan" class="form-control" >
                                            </div>
                                        </div> -->
                                        <div class="col-lg-4">
                                            <div class="form-group">
                                                <label for="chambre_plan">Chambres simples</label>
                                                <input type="number" name="chambre" id="chambre_plan" class="form-control" >
                                            </div>
                                        </div>
                                        <div class="col-lg-4">
                                            <div class="form-group">
                                                <label for="chambre_sdb_plan" title="Chambre avec salle de bain">Chambres SDB</label>
                                                <input type="number" name="sdb" id="chambre_sdb_plan" class="form-control" >
                                            </div>
                                        </div>
                                        <div class="col-lg-4">
                                            <div class="form-group">
                                                <label for="bureau_plan">Bureau</label>
                                                <input type="number" id="bureau_plan" class="form-control" >
                                            </div>
                                        </div>
                                        <div class="col-lg-4">
                                            <div class="form-group">
                                                <label for="salon_plan">Salon</label>
                                                <input type="number" name="salon" id="salon_plan" class="form-control" >
                                            </div>
                                        </div>
                                        <div class="col-lg-2">
                                            <div class="form-group">
                                                <label for="cuisine_plan">Cuisine</label>
                                                <input type="number" name="cuisine" id="cuisine_plan" class="form-control" >
                                            </div>
                                        </div>
                                        <div class="col-lg-2">
                                            <div class="form-group">
                                                <label for="toillette_plan">Toillette</label>
                                                <input type="number" name="toillette" class="form-control" id="toillette_plan">
                                            </div>
                                        </div>
                                        <div class="col-lg-4">
                                            <div class="form-group mt-4 text-lg-right">
                                                <button class="btn btn-success mt-2" ng-click="actionSurPlan('add')" title="Ajouter un niveau" >
                                                    <i class="fa fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row mt-5">
                            <div class="col-md-12 animated fadeIn text-center" ng-if="produitsInTable.length==0">
                                    <h3> Ajouter un Niveau pour ce plan</h3>
                            </div>
                            <div class="col-md-12" ng-if="produitsInTable.length !=0">
                                <div class="table-responsive">
                                    <table class="table table-responsive-sm table-bordered mb-0 text-center dataTable dtr-inline" id="tabNiveau" role="grid">
                                        <thead>
                                        <th class="text-center">N°</th>
                                        <th class="text-center">Niveau</th>
                                        <!-- <th class="text-center">Pièce</th> -->
                                        <th class="text-center">Chambre Simple</th>
                                        <th class="text-center">Chambre SDB</th>
                                        <th class="text-center">Bureau</th>
                                        <th class="text-center">Salon</th>
                                        <th class="text-center">Cuisine</th>
                                        <th class="text-center">Toillettes</th>
                                        <th class="text-center">Actions</th>
                                        </thead>
                                        <tbody>
                                        <tr class="animated fadeIn" ng-repeat="item in produitsInTable">
                                            <td class="text-center">
                                                1
                                            </td>
                                            <td class="text-center">
                                                @{{ item.niveau }}
                                            </td>
                                            <!-- <td class="text-center">
                                                @{{ item.piece }}
                                            </td> -->
                                            <td class="text-center">
                                                @{{ item.chambre }}
                                            </td>
                                            <td class="text-center">
                                                @{{ item.sdb }}
                                            </td>
                                            <td class="text-center">
                                                @{{ item.bureau }}
                                            </td>
                                            <td class="text-center">
                                                @{{ item.salon }}
                                            </td>
                                            <td class="text-center">
                                                @{{ item.cuisine }}
                                            </td>
                                            <td class="text-center">
                                                @{{ item.toillette }}
                                            </td>
                                            <td>
                                                <button class="btn btn-danger" ng-click="actionSurPlan('delete',item)" title="Supprimer du tableau">
                                                    <span class="fa fa-trash"></span>
                                                </button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>


                        <div class="modal-footer">
                            <button type="reset" class="btn btn-danger" data-dismiss="modal">Fermer</button>
                            <button type="submit" class="btn btn-primary" ng-click="addElement($event,'plan')">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </div>


    <div class="modal fade" id="modal_addlier_plan" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header bg-gradient-dark text-white">
                    <h5 class="modal-title" id="exampleModalLongTitle">Lier Plan</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body m-3">
                    <form id="form_addlier_plan" class="form" enctype="multipart/form-data" accept-charset="UTF-8">
                        @csrf
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <label for="client_lier_plan">Client</label>
                                    <select class="form-control select2" id="client_lier_plan" name="client" ng-model="client_lier_plan"  ng-click="choisirMode('client')" ng-change="choisirMode('client')">
                                        <option ng-repeat="item in users" value="@{{item.id}}">@{{item.prenom}} @{{ item.nom}} </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-lg-12">
                                <div class="form-group">
                                    <label for="projet_lier_plan">Projets</label>
                                    <select class="form-control" id="projet_lier_plan" name="projet_id">
                                        <option ng-repeat="item in projets" value="@{{item.id}}">@{{item.name}} </option>
                                    </select>
                                </div>
                            </div>
                        
                        </div>

                    {{--    <div class="row mt-5">
                            <div class="col-md-12 animated fadeIn text-center" ng-if="produitsInTable.length==0">
                                    <h3> Ajouter un Niveau pour ce plan</h3>
                            </div>
                            <div class="col-md-12" ng-if="produitsInTable.length !=0">
                                <div class="table-responsive">
                                    <table class="table table-responsive-sm table-bordered mb-0 text-center dataTable dtr-inline" id="tabNiveau" role="grid">
                                        <thead>
                                        <th class="text-center">N°</th>
                                        <th class="text-center">Niveau</th>
                                        <th class="text-center">Pièce</th>
                                        <th class="text-center">Chambre</th>
                                        <th class="text-center">Bureau</th>
                                        <th class="text-center">Salon</th>
                                        <th class="text-center">Cuisine</th>
                                        <th class="text-center">Toillettes</th>
                                        <th class="text-center">Actions</th>
                                        </thead>
                                        <tbody>
                                        <tr class="animated fadeIn" ng-repeat="item in produitsInTable">
                                            <td class="text-center">
                                                1
                                            </td>
                                            <td class="text-center">
                                                @{{ item.niveau }}
                                            </td>
                                            <td class="text-center">
                                                @{{ item.piece }}
                                            </td>
                                            <td class="text-center">
                                                @{{ item.chambre }}
                                            </td>
                                            <td class="text-center">
                                                @{{ item.bureau }}
                                            </td>
                                            <td class="text-center">
                                                @{{ item.salon }}
                                            </td>
                                            <td class="text-center">
                                                @{{ item.cuisine }}
                                            </td>
                                            <td class="text-center">
                                                @{{ item.toillette }}
                                            </td>
                                            <td>
                                                <button class="btn btn-danger" ng-click="actionSurPlan('delete',item)" title="Supprimer du tableau">
                                                    <span class="fa fa-trash"></span>
                                                </button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>--}}


                        <div class="modal-footer">
                            <button type="reset" class="btn btn-danger" data-dismiss="modal">Fermer</button>
                            <button type="submit" class="btn btn-primary" ng-click="addElement($event,'lier_plan')">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </div>


  

{{--    modal demande --}}

<div class="modal fade" id="modal_addcourrier" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog modal-lg" role="document"  style="max-width: 94%"> 
    <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Nouveau Courrier</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body m-3">
                   <form id="form_addcourrier" class="form" enctype="multilpart/form-data" accept-charset="UTF-8">
                    
                      <div class="card p-4 mt-20 animated fadeIn">
                          <div class="row">
                              <div class="col-md-6">
                                  <div class="form-group">
                                      <label>Objet</label>
                                      <input type="text" class="form-control" id="objet">
                                  </div>
                              </div>
                              <div class="col-md-6">
                                  <div class="form-group">
                                      <label>Expediteur</label>
                                      <input type="text" class="form-control" id="expediteur">
                                  </div>
                              </div>
                              <div class="col-md-6">
                                  <div class="form-group">
                                      <label>date arrivée</label>
                                      <input type="date" class="form-control" id="date_arrive">
                                  </div>
                              </div>
                              <div class="col-md-6">
                                <div class="form-group">
                                    <label>date courrier</label>
                                    <input type="date" class="form-control" id="date_courrier">
                                </div>
                            </div>
                            <div class="col-md-6">
                              <div class="form-group">
                                  <label>Référence</label>
                                  <input type="text" class="form-control" id="reference">
                                </div>
                          </div>
                              <div class="col-md-6">
                                  <div class="form-group">
                                      <label>Numero arrivée</label>
                                      <input type="number" class="form-control"  id="numero">
                                  </div>
                              </div>
                              
                          </div>
                          <hr>
                          <div class="row">
                              <div class="col-md-4">
                                  <div class="form-group">
                                      <label> Exécutent Gauche</label>
                                      <select id="select1" class="form-control wd-100 ">
                                          <option value="">Sélectionnez 1</option>
                                          <option ng-repeat="item in servicegauches" value="@{{item.id}}">@{{item.name}}</option>

                                      </select>
                                  </div>
                              </div>
                              <div class="col-md-3">
                                  <div class="form-group">
                                      <label>Instructions</label>
                                      <input type="tetx"  id="service" class="form-control">
                                  </div>
                              </div>
                              <div class="col-md-4">
                                  <div class="form-group">
                                      <label>Exécutent Droite</label>
                                      <select id="select2" class="form-control wd-100 ">
                                          <option value="">Sélectionnez 2</option>
                                          <option ng-repeat="item in servicedroites" value="@{{item.id}}">@{{item.name}}</option>
                                      </select>
                                  </div>
                              </div>
                              <div class="col-md-1 align-self-center">
                                  <div class="mt-2">
                                      <button type="button" class="btn btn-outline-dark" ng-click="actionSurTab('add')" title="Ajouter au tableau">
                                          <i class="fa fa-plus"></i>
                                      </button>
                                  </div>
                              </div>
                          </div>
                          <div class="table-responsive mt-10">
                              <table class="table table-bordered text-center">
                                  <thead class="table-dark">
                                      <tr>
                                          <th>Exécutent Gauche</th>
                                          <th>Instructions</th>
                                          <th>Exécutent Droite</th>
                                          <th>Actions</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr class="animated fadeIn" ng-repeat="item in tableName">
                                          <td>
                                            @{{item.gauche}}</td>
                                          <td>
                                              <input class="form-control form-control-sm d-inline-block text-center w-50" disabled id="service_input" type='text' value="@{{ item.champ }}" />
                                          </td>
                                          <td>@{{item.droite}}</td>
                                          <td>
                                              <button class="btn btn-sm bg-danger btn-social-icon btn-round pl-2 pr-2" ng-click="actionSurTab('delete',item)" title="Supprimer">
                                                  <span class="fa fa-trash text-white"></span>
                                              </button>
                                          </td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                      <div class="row">
                          <div class="col-lg-12">
                            <div class="form-group">
                              <label> Autre Instructions</label>
                              <textarea class="form-control form-control-xm d-inline-block" id="autre_instruction"> </textarea>
                              </div>
                          </div>
                      </div>
                      <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                            <button type="button" class="btn btn-primary" ng-click="addElement($event,'courrier')">Enregistrer</button>
                        </div>
                   </form>
                </div>
       </div>
    </div>           
</div>

   



@endsection
