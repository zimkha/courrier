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
                          <span>Copyright &copy; by 3S 2021 </span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </div>
    </body>


    {{--    les modals ici--}}

    <div class="modal fade" id="modal_changeStatus" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header bg-gradient-dark text-white">
                    <h5 class="modal-title" align="center" id="exampleModalLongTitle">@{{ ChangerStatusCourrier.title }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body m-3">
                <form id="form_addchstat" ng-submit="ChangerStatusCourrier($event,ChangerStatusCourrier.id)" class="form" enctype="multipart/form-data" accept-charset="UTF-8">
                          @csrf
                          <div class="modal-footer">
                              <button type="reset" class="btn btn-danger" data-dismiss="modal">Non</button>
                              <button type="submit" class="btn btn-primary" >Oui</button>
                          </div>
                      </form>
                </div>
            </div>

        </div>
    </div>
   



  

{{--    modal demande --}}


<div class="modal fade" id="modal_addcourrierdepart" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog modal-lg" role="document"  style="max-width: 80%"> 
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Courrier de Départ</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
        <div class="modal-body m-3">
          <form id="form_addcourrierdepart" class="form" enctype="multilpart/form-data" accept-charset="UTF-8">
            <input type="hidden" id="id" name="id"> 
            <input type="hidden" id="courrier_depart" name="courrier_depart">  
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                    <label>Destinataire</label>
                    <input type="text" class="form-control" id="destinataire">
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label>Numero</label>
                    <input type="number" class="form-control" id="numero">
                </div>
            </div>
            <div class="col-md-6">
                <div class="form-group">
                    <label>Date de depart</label>
                    <input type="date" class="form-control" id="date_depart">
                </div>
            </div>
           
          <div class="col-md-6">
            <div class="form-group">
                <label>Référence</label>
                <input type="text" class="form-control" id="reference">
              </div>
        </div>
           
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
              <button type="button" class="btn btn-primary" ng-click="addElement($event,'courrierdepart')">Enregistrer</button>
          </div>
          </form>
        </div>

    </div>

  </div>
</div>

<div class="modal fade" id="modal_addcourrier" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog modal-lg" role="document"  style="max-width: 94%"> 
    <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Courrier Arrive</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body m-3">

                   <form id="form_addcourrier" class="form" enctype="multilpart/form-data" accept-charset="UTF-8">
                   <input type="hidden" id="id" name="id">   
                  
                      <!-- <div class="card p-4 mt-20 animated fadeIn">
                      <div class="form-row mt-4">
                        <div class="col-md-12 col-sm-12 mb-3 uk-margin-sma
                        ll-top text-center text-md-center" id="etat">
                            <span class="uk-text-bold fsize-14 uk-text-uppercase uk-margin-small-right">Type de Courrier : </span>
                            <input type="radio" checked value="1" ng-click="DiseableEnableinput($event)"  name="radioBtnComposition"  id="arrive"  class="uk-radio true"> <span class="fsize-12 uk-margin-small-right">Arrivée</span>
                            <input type="radio" value="0"  ng-click="DiseableEnableinput($event)"  name="radioBtnComposition" id="depart" class="uk-radio"> <span class="fsize-12 uk-margin-small-right">Départ</span>
                        </div>
                    </div> -->

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
                                  <input type="text" class="form-control" id="reference_arrive">
                                </div>
                          </div>
                              <div class="col-md-6">
                                  <div class="form-group">
                                      <label>Numero arrivée</label>
                                      <input type="number" class="form-control"  name="numero_arrive" id="numero_arrive">
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
                        
                          <div class="col-lg-12 ">
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
