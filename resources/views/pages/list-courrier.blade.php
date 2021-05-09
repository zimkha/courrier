
<div class="" ng-init="actionSurPosition()">
    
    <h1 class="h3 mb-4 text-gray-800">Liste des courriers</h1>

    <!-- Page Heading -->
    <div class="card shadow mb-4">
      <div class="collapse show">
        <div class="card-body">
        <div class="float-right pt-0">
        <button class="btn btn-primary"  ng-click="viderTab();showModalAdd('courrier')" title="Nouveau courrier"><i class="fa fa-plus"></i></button>
    </div>
    <br>
        <!-- <form>
                    <div class="form-row mt-4">
                      
                        <div class="col-md-6">
                            <select class="form-control" id="searchoption_courrier" ng-model="searchoption_courrier" name="searchoption">
                                <option value="">Rechercher dans </option>
                                <option value="numero">Numéro</option>
                                <option value="reference">reference</option>
                                <option value="reference">expéditeur</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <input type="text" class="form-control" id="searchoption_courrier" ng-model="searchoption_courrier" placeholder="Texte de la recherche" ng-readonly="!searchoption_courrier" autocomplete="off">
                            </div>

                        </div>
                       <div class="col-md-6">
                            <div class="form-group">
                                <label>Entre le </label>
                                <input type="date" id="created_at_start_listcourrier" name="created_at_start" class="form-control">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>et le </label>
                                <input type="date" id="created_at_end_listcourrier" name="created_at_end" class="form-control">
                            </div>
                        </div>
                        <div class="col-md-12 text-right">
                            <button class="mt-2 btn btn-primary pull-right" ng-click="pageChanged('courrier')">
                                Filtrer <i class="fa fa-search"></i>
                            </button>
                        </div>

                    </div>
                </form> -->
                <form>
                    <div class="form-row mt-4">
                       
                    <div class="col-md-6">
                            <div class="form-group">
                              <label>Numéro</label>
                                <input type="number" class="form-control" id="numero_courrier"  placeholder="Le numero du courrier"  autocomplete="off">
                            </div>
                        </div>
                        <div class="col-md-6">
                          <label>Réference</label>
                            <div class="form-group">
                                <input type="text" class="form-control" id="reference_courrier"  placeholder="La référence du courrier"  autocomplete="off">
                            </div>
                        </div>
                        <div class="col-md-12">
                          <label>Expediteur</label>
                          <div class="form-group">
                              <input type="text" class="form-control" id="expediteur_courrier"  placeholder="L'expediteur"  autocomplete="off">
                          </div>
                      </div>
                     
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Entre le </label>
                                <input type="date" id="created_at_start_listcourrier" name="created_at_start" class="form-control">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group">
                                <label>Et le </label>
                                <input type="date" id="created_at_end_listcourrier" name="created_at_end" class="form-control">
                            </div>
                        </div>
                        <div class="col-md-12 text-right">
                            <button class="mt-2 btn btn-primary pull-right" ng-click="pageChanged('courrier')">
                                Filtrer <i class="fa fa-search"></i>
                            </button>
                        </div>

                    </div>
                </form>
        </div>
      </div>
   </div>
    <div class="card shadow mb-4">
        <!-- Card Header - Accordion -->

        <!-- Card Content - Collapse -->
        <div class="collapse show" id="collapseCardExample">
            <div class="card-body">
              

                <div class="mt-3">
                    <div class="table-responsive">
                        <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                            <thead>
                                <tr align="center">
                                <th>Numero</th>
                                <th>Reference</th>
                                <th>Date arrivée</th>
                                <th>Expediteur</th>
                                
                            

                                <th class="text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr align="center" ng-repeat="item in courriers">
                                <td>@{{ item.numero}}</td>
                                <td>@{{ item.reference}}</td>
                                <td>@{{ item.date_courrier }}</td>
                                <td>@{{ item.expediteur }}</td>

                                <td class="text-center">
                                <nav class="menu-leftToRight uk-flex uk-position-center ">
                                  <a  class="menu-item uk-icon-button  border-0x btn btn-sm btn-success btn-circle text-white" title="Modifier le courrier"   ng-click="showModalUpdate('courrier',item.id)">
                                    <i class="fa fa-key" ></i>
                                </a>
                                   
                                    <a href="courrier/pdf/@{{ item.id }}" target="_blank" title="Imprimer le courrier"   class="menu-item btn btn-sm btn-warning btn-circle">
                                      <i class="fa fa-file"></i>
                                      </a>
                                    <button ng-click="deleteElement('courrier',item.id)" title="Supprimer le courrier" class="menu-item btn btn-sm btn-danger btn-circle">
                                        <i class="fas fa-trash"></i>
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
                        <select class="form-control-sm" ng-model="paginationcourrier.entryLimit" ng-change="pageChanged('courrier')">
                            <option value="10" selected>10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div class="col-md-8 float-right">
                        <nav aria-label="Page navigation">
                            <ul class="uk-pagination float-right" uib-pagination total-items="paginationcourrier.totalItems" ng-model="paginationcourrier.currentPage" max-size="paginationcourrier.maxSize" items-per-page="paginationcourrier.entryLimit" ng-change="pageChanged('courrier')" previous-text="‹" next-text="›" first-text="«" last-text="»" boundary-link-numbers="true" rotate="false"></ul>
                        </nav>
                    </div>
                </div>
                <!-- /PAGINATION -->
            </div>
        </div>

    </div>

    <br>

</div>
