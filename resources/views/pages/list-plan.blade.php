
<div class="">
    <div class="float-right pt-0">
        <button class="btn btn-primary"  ng-click="viderTab();showModalAdd('plan')" title="ajouter un nouveau projet"><i class="fa fa-plus"></i></button>
    </div>
    <h1 class="h3 mb-4 text-gray-800"> Liste des plans</h1>

    <!-- Page Heading -->
    <div class="card shadow mb-4">
        <!-- Card Header - Accordion -->

        <!-- Card Content - Collapse -->
        <div class="collapse show" id="collapseCardExample">
            <div class="card-body">
                <form ng-submit="pageChanged('plan')">
                    <div class="row mt-40">
                        <div class="col-md-6 mt-1 pt-1">
                            <input type="text" class="form-control" placeholder="Nom client ..." id="client_plan_filtre" ng-model="client_plan_filtre" ng-change="pageChanged('plan')">
                        </div>
                        <div class="col-md-6 mt-1 pt-1">
                            <input type="date" class="form-control" placeholder="Date ..." id="date_plan_filtre" ng-model="date_plan_filtre" ng-change="pageChanged('plan')">
                        </div>
                       <div class="col-md-3 mt-1 pt-1">
                            <input type="text" class="form-control" placeholder="Code ..." id="code_plan_filtre" ng-model="code_plan_filtre" ng-change="pageChanged('plan')">
                        </div>
                        <div class="col-md-3 mt-1 pt-1">
                             <input type="text" class="form-control" placeholder="Superficie ..."  id="superficie_plan_filtre" ng-model="superficie_plan_filtre" ng-change="pageChanged('plan')">
                         </div>
                        {{--  <div class="col-md-3 mt-1 pt-1">
                             <input type="text" class="form-control" placeholder="Longeur ..."  id="longeur_plan_filtre" ng-model="longeur_plan_filtre" ng-change="pageChanged('plan')">
                         </div>
                         <div class="col-md-3 mt-1 pt-1">
                             <input type="text" class="form-control" placeholder="Largeur ..."  id="largeur_plan_filtre" ng-model="largeur_plan_filtre" ng-change="pageChanged('plan')">
                         </div>--}}
{{--                        <div class="col-md-3 mt-1 pt-1">--}}
{{--                            <input type="text" class="form-control" placeholder="Salon ..."  id="salon_plan_filtre" ng-model="salon_plan_filtre" ng-change="pageChanged('plan')">--}}
{{--                        </div>--}}
{{--                        <div class="col-md-3 mt-1 pt-1">--}}
{{--                            <input type="text" class="form-control" placeholder="WC ..."  id="toillette_plan_filtre" ng-model="toillette_plan_filtre" ng-change="pageChanged('plan')">--}}
{{--                        </div>--}}
{{--                        <div class="col-md-3 mt-1 pt-1">--}}
{{--                            <input type="text" class="form-control" placeholder="Cuisine ..."  id="cuisine_plan_filtre" ng-model="cuisine_plan_filtre" ng-change="pageChanged('plan')">--}}
{{--                        </div>--}}

                        <div class="col-md-6 mt-1 pt-1 text-right">
                            <button class="mt-2 btn btn-primary pull-right" ng-click="pageChanged('plan')">
                                Filtrer <i class="fa fa-search"></i>
                            </button>
                        </div>

                    </div>
                </form>

                <div class="mt-3">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                            <thead>
                            <tr class="text-center">
                                <th>Code Pl</th>
                                <th>Client</th>
                                <th>Superficie</th>
                                <th>Chambre</th>
                                <th>Salons</th>
                                <th>WC</th>
                                <th>CSN</th>
                                <th class="text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr ng-repeat="item in plans" class="text-center">
                                <td>@{{ item.code }}</td>
                                <td>Nom_client</td>
                                <td>@{{ item.superficie }}</td>
                                <td>@{{ item.nb_chambre }}</td>
                                <td>@{{ item.nb_salon }}</td>
                                <td>@{{ item.nb_toillette }}</td>
                                <td>@{{ item.nb_cuisine }}</td>
                                <td class="text-center">
                                    <a href="#!/detail-plan/@{{ item.id }}" title="detail" class="btn btn-sm btn-primary btn-circle">
                                        <i class="fas fa-info"></i>
                                    </a>
                                    <button class="btn btn-secondary btn-sm btn-circle" ng-click="showModalUpdate('plan',item.id)" title="cloner le plan">
                                        <i class="fa fa-clone">

                                        </i></button>
                                    <button  title="Editer" ng-click="showModalUpdate('plan',item.id)" class="btn btn-success btn-sm btn-circle">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button  title="Supprimer" ng-click="deleteElement('plan',item.id)" class="btn btn-danger btn-sm btn-circle">
                                        <i class="fas fa-trash"></i>
                                    </button>

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
                        <select class="form-control-sm" ng-model="paginationentrestock.entryLimit" ng-change="pageChanged('entrestock')">
                            <option value="10" selected>10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div class="col-md-8 float-right">
                        <nav aria-label="Page navigation">
                            <ul class="uk-pagination float-right" uib-pagination total-items="paginationentrestock.totalItems" ng-model="paginationentrestock.currentPage" max-size="paginationentrestock.maxSize" items-per-page="paginationentrestock.entryLimit" ng-change="pageChanged('entrestock')" previous-text="‹" next-text="›" first-text="«" last-text="»" boundary-link-numbers="true" rotate="false"></ul>
                        </nav>
                    </div>
                </div>
                <!-- /PAGINATION -->
            </div>
        </div>

    </div>

    <br>

    {{--<div class="row">
        <div class="col-lg-12">
            <div class="card">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                            <thead>
                            <tr align="center">
                                <th>Code P</th>
                                <th>Type de plan</th>
                                <th>Chambre</th>
                                <th>Salons</th>
                                <th> SDB</th>
                                <th> WC</th>
                                <th> CSN</th>
                                <th>Superficie</th>
                                <th> ETG</th>
                                <th>Jardin</th>
                                <th>Garage</th>
                                <th>Piscine</th>
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            <tr align="center">
                                <td>PL0001</td>
                                <td>TYPE3</td>
                                <td>6</td>
                                <td>2</td>
                                <td>3</td>
                                <td>2</td>
                                <td>1</td>
                                <td>200 m2</td>
                                <td>2</td>
                                <td>OUI</td>
                                <td>NON</td>
                                <td>NON</td>
                                <td>
                                    <a href="detail-plan.html" title="detail" class="btn btn-primary btn-circle">
                                        <i class="fas fa-info-circle"></i>
                                    </a>
                                    <button  title="detail" class="btn btn-success btn-circle">
                                        <i class="fas fa-search"></i>
                                    </button>

                                </td>
                            </tr>
                            <tr align="center">
                                <td>PL0001</td>
                                <td>TYPE 1</td>
                                <td>6</td>
                                <td>2</td>
                                <td>3</td>
                                <td>2</td>
                                <td>1</td>
                                <td>200 m2</td>
                                <td>2</td>
                                <td>OUI</td>
                                <td>NON</td>
                                <td>NON</td>
                                <td>
                                    <a href="detail-plan.html" class="btn btn-primary btn-circle">
                                        <i class="fas fa-info-circle"></i>
                                    </a>
                                    <button  title="detail" class="btn btn-success btn-circle">
                                        <i class="fas fa-search"></i>
                                    </button>
                                </td>
                            </tr>
                            <tr align="center">
                                <td>PL0001</td>
                                <td>TYPE 1</td>
                                <td>6</td>
                                <td>2</td>
                                <td>3</td>
                                <td>2</td>
                                <td>1</td>
                                <td>200 m2</td>
                                <td>2</td>
                                <td>OUI</td>
                                <td>NON</td>
                                <td>OUI</td>
                                <td>
                                    <a href="detail-client.html" class="btn btn-primary btn-circle">
                                        <i class="fas fa-info-circle"></i>
                                    </a>
                                    <button  title="detail" class="btn btn-success btn-circle">
                                        <i class="fas fa-search"></i>
                                    </button>
                                </td>
                            </tr>


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>--}}
</div>
