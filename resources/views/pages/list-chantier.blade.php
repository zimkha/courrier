
<div class="">
    <h1 class="h3 mb-4 text-gray-800">Liste des chantiers</h1>

    <!-- Page Heading -->
    <div class="card shadow mb-4">
        <!-- Card Header - Accordion -->

        <!-- Card Content - Collapse -->
        <div class="collapse show" id="collapseCardExample">
            <div class="card-body">
                <form>
                    <div class="form-row mt-4">
                        <div class="col-md-6">
                            <select class="form-control form-control-sm" id="searchoption_client" ng-model="searchoption_client" name="searchoption">
                                <option value="">Rechercher dans </option>
                                <option value="nomcomplet">Nom client</option>
                                <option value="telephone">Téléphone</option>
                                <option value="email">E-mail</option>
                                <option value="code_client">Code client</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <input type="text" class="form-control form-control-sm" id="searchtexte_client" ng-model="searchtexte_client" placeholder="Texte de la recherche" ng-readonly="!searchoption_client" autocomplete="off">
                            </div>
                        </div>
                        <div class="col-md-12 text-right">
                            <button class="mb-2 btn btn-primary pull-right" ng-click="pageChanged('chantier')">
                                Filtrer <i class="fa fa-search"></i>
                            </button>
                        </div>

                    </div>
                </form>

                <div class="mt-3">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                            <thead>
                            <tr>
                                <th>Nom Complet</th>
                                <th>Date creation</th>
                                <th>Etat</th>
                                <th>Desive Estimes</th>
                                <th>Finance</th>
                                <th>Contrat</th>
                                <th class="text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr align="center" ng-repeat="item in chantiers" >
                                <td>@{{ item.user.name}}</td>
                                <td>@{{ item.created_at_fr}}</td>
                                <td>@{{ item.etat }}</td>
                                <td>@{{ item.devise}}</td>
                                <td>@{{ item.finance}}</td>
                                <td>@{{ item.contrat}}</td>
                                <td class="text-center">
                                    <a href="#!/detail-chantier/@{{ item.id }}" class="btn btn-sm btn-primary btn-circle">
                                        <i class="fas fa-info"></i>
                                    </a>
                                    <button class="btn btn-sm btn-circle btn-danger" ng-click="deleteElement('chantier', item.id)" titel="Supprimer le chantier">
                                        <span class="fa fa-trash"></span>
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

</div>
