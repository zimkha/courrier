
<div class="">
    <div class="float-right pt-0">
        <button class="btn btn-primary"  ng-click="viderTab();showModalAdd('pub')" title="ajouter une punb"><i class="fa fa-plus"></i></button>
    </div>
    <h1 class="h3 mb-4 text-gray-800">Liste des publications</h1>

    <!-- Page Heading -->
    <div class="card shadow mb-4">
        <!-- Card Header - Accordion -->

        <!-- Card Content - Collapse -->
        <div class="collapse show" id="collapseCardExample">
            <div class="card-body">
               {{-- <form ng-submit="pageChanged('user')">
                    <div class="form-row mt-4">
                        --}}{{--<div class="col-md-6">
                            <select class="form-control" id="searchoption_client" ng-model="searchoption_client" name="searchoption">
                                <option value="">Rechercher dans </option>
                                <option value="nomcomplet">Nom client</option>
                                <option value="telephone">Téléphone</option>
                                <option value="email">E-mail</option>
                                <option value="code_client">Code client</option>
                            </select>
                        </div>--}}{{--
                        <div class="col-md-6">
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Nom utilisateur ..." id="nom_user_filtre" ng-model="nom_user_filtre" ng-change="pageChanged('user')">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Email ..." id="email_user_filtre" ng-model="email_user_filtre" ng-change="pageChanged('user')">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Adresse ..." id="adresse_user_filtre" ng-model="adresse_user_filtre" ng-change="pageChanged('user')">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <input type="text" class="form-control" placeholder="Telephone ..." id="telephone_user_filtre" ng-model="telephone_user_filtre" ng-change="pageChanged('user')">
                            </div>
                        </div>
                        <div class="col-md-12 text-right">
                            <button class="mt-2 btn btn-primary pull-right" ng-click="pageChanged('user')">
                                Filtrer <i class="fa fa-search"></i>
                            </button>
                        </div>

                    </div>
                </form>--}}

                <div class="mt-3">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                            <thead>
                            <tr class="text-center">
                                <th>Image</th>
                                <th>Description</th>
                                <th class="text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr align="center" ng-repeat="item in posts">
                               <td><img style="width: 40px;height: 40px;border-radius: 50%" src="@{{ item.fichier }}" alt=""></td>
                               <td>@{{ item.description }}</td>
                                <td class="text-center">
                                    {{--<button class="btn btn-sm btn-circle btn-primary"   ng-click="showModalUpdate('pub',item.id)" title="Modifier">
                                        <span class="fa fa-edit"></span>
                                    </button>--}}
                                    <button class="btn btn-sm btn-circle btn-danger"   ng-click="deleteElement('pub',item.id)" title="Supprimer">
                                        <span class="fa fa-trash"></span>
                                    </button>

                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </div>

                </div>


                <!-- PAGINATION -->
               {{-- <div class="row mt-10">
                    <div class="col-md-4">
                        <span>Affichage par</span>
                        <select class="form-control-sm" ng-model="paginationuser.entryLimit" ng-change="pageChanged('user')">
                            <option value="10" selected>10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div class="col-md-8 float-right">
                        <nav aria-label="Page navigation">
                            <ul class="uk-pagination float-right" uib-pagination total-items="paginationuser.totalItems" ng-model="paginationuser.currentPage" max-size="paginationuser.maxSize" items-per-page="paginationuser.entryLimit" ng-change="pageChanged('user')" previous-text="‹" next-text="›" first-text="«" last-text="»" boundary-link-numbers="true" rotate="false"></ul>
                        </nav>
                    </div>
                </div>--}}
                <!-- /PAGINATION -->
            </div>
        </div>

    </div>

    <br>

</div>
