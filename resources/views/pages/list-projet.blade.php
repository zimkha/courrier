
<div class="" ng-init="actionSurPosition()">
    <div class="float-right pt-0">
        <button class="btn btn-primary"  ng-click="viderTab();showModalAdd('demande')" title="ajouter une demande"><i class="fa fa-plus"></i></button>
    </div>
    <h1 class="h3 mb-4 text-gray-800">Liste des projets</h1>

    <!-- Page Heading -->
    <div class="card shadow mb-4">
        <!-- Card Header - Accordion -->

        <!-- Card Content - Collapse -->
        <div class="collapse show" id="collapseCardExample">
            <div class="card-body">
                <form>
                    <div class="form-row mt-4">
                        <div class="col-md-12 col-sm-12 mb-3 uk-margin-sma
                        ll-top text-center text-md-center" id="etat">
                            <span class="uk-text-bold fsize-14 uk-text-uppercase uk-margin-small-right">Etat : </span>
                            <input type="radio" value="1" name="radioBtnComposition" ng-click="onRadioCompositionClick($event, '0')" class="uk-radio"> <span class="fsize-12 uk-margin-small-right">en cours</span>
                            <input type="radio" value="2" name="radioBtnComposition" ng-click="onRadioCompositionClick($event, '1')" class="uk-radio"> <span class="fsize-12 uk-margin-small-right">validé</span>
                            <input type="radio" checked  name="radioBtnComposition" ng-click="onRadioCompositionClick($event, '')" class="uk-radio true"> <span class="fsize-12 uk-margin-small-right">Tout</span>
                        </div>
                        <div class="col-md-6">
                            <select class="form-control" id="searchoption_projet" ng-model="searchoption_projet" name="searchoption">
                                <option value="">Rechercher dans </option>
                                <option value="name">Code projet</option>
                                <option value="telephone">Téléphone</option>
                               {{-- <option value="email">E-mail</option>--}}
                                <option value="adresse_terrain">Adresse Terrain</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <input type="text" class="form-control" id="searchtexte_projet" ng-model="searchtexte_projet" placeholder="Texte de la recherche" ng-readonly="!searchoption_projet" autocomplete="off">
                            </div>
                        </div>
                       {{-- <div class="col-md-6">
                            <div class="form-group">
                                <label>Entre le </label>
                                <input type="date" id="created_at_start_listprojet" name="created_at_start" class="form-control">
                            </div>
                        </div>--}}
                        <div class="col-md-12 text-right">
                            <button class="mt-2 btn btn-primary pull-right" ng-click="pageChanged('projet')">
                                Filtrer <i class="fa fa-search"></i>
                            </button>
                        </div>

                    </div>
                </form>

                <div class="mt-3">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                            <thead>
                                <tr align="center">
                                <th>Code Projet</th>
                                <th>Nom Complet</th>
                                <th>Date creation</th>
                                <th>A valider dans</th>
                                <th>Etat</th>
                                <th>Adresse</th>

                                <th>N° telephone</th>

                                <th class="text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr align="center" ng-repeat="item in projets">
                                <td>@{{ item.name}}</td>
                                <td>@{{ item.user.name}}</td>
                                <td>@{{ item.created_at_fr }}</td>
                                <td>
                                    <span ng-if="item.a_valider==0" class="badge badge-danger">Epuisé</span>
                                    <span ng-if="item.a_valider!=0" class="badge badge-success">@{{ item.a_valider }} jour</span>

                                </td>
                                <td>
                                    <span ng-if="item.active == 0"  class="badge badge-danger">En cour</span>
                                    <span ng-if="item.etat == 1" class="badge badge-warning">En validation</span>
                                    <span ng-if="item.etat == 2" class="badge badge-success">Validé</span>
                                </td>
                                <td>@{{item.adresse_terrain}}</td>

                                 <td>@{{item.user.telephone}}</td>

                                <td class="text-center">
                                <nav class="menu-leftToRight uk-flex uk-position-center ">
                                    <input type="checkbox" href="#" class="menu-open" name="menu-open"  id="menu-open_i_@{{item.id}}">
                                    <label class="menu-open-button back-dark-50" for="menu-open_i_@{{item.id}}">
                                        <span class="hamburger bg-template-1 hamburger-1"></span>
                                        <span class="hamburger bg-template-1 hamburger-2"></span>
                                        <span class="hamburger bg-template-1 hamburger-3"></span>
                                    </label>
                                    <a  class=" menu-item uk-icon-button  border-0x btn btn-sm btn-success btn-circle text-white" ng-if="item.etat == 0"  ng-click="showModalUpdate('projet',item.id)">
                                        <i class="fa fa-check" title="Valider"></i>
                                    </a>
                                    <a href="#!/detail-projet/@{{ item.id }} " class="menu-item uk-icon-button text-white  border-0 btn btn-sm btn-primary btn-circle">
                                        <i class="fas fa-info"></i>
                                    </a>

                                    <button ng-click="deleteElement('projet',item.id)" class="menu-item btn btn-sm btn-danger btn-circle">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                    <button title="valider le paiement"  ng-click="showModalValidated($event,item.id, 'êtes-vous sûr de vouloir confirmé le paiement du projet ?')" class="menu-item btn btn-sm btn-warning btn-circle">
                                        <i class="fas fa-server"></i>
                                    </button>
                       </nav>
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </div>

                </div>


                <!-- PAGINATION -->
                <div class="row mt-10">
                    <div class="col-md-4">
                        <span>Affichage par</span>
                        <select class="form-control-sm" ng-model="paginationprojet.entryLimit" ng-change="pageChanged('projet')">
                            <option value="10" selected>10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div class="col-md-8 float-right">
                        <nav aria-label="Page navigation">
                            <ul class="uk-pagination float-right" uib-pagination total-items="paginationprojet.totalItems" ng-model="paginationprojet.currentPage" max-size="paginationprojet.maxSize" items-per-page="paginationprojet.entryLimit" ng-change="pageChanged('projet')" previous-text="‹" next-text="›" first-text="«" last-text="»" boundary-link-numbers="true" rotate="false"></ul>
                        </nav>
                    </div>
                </div>
                <!-- /PAGINATION -->
            </div>
        </div>

    </div>

    <br>

</div>
