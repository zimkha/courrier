<div class="">

    <!-- Page Heading -->
    <!-- <div class="d-sm-flex align-items-center justify-content-between mb-4">
      <h1 class="h3 mb-0 text-gray-800">Tableau Indicateur</h1>
      <a href="#" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i class="fas fa-download fa-sm text-white-50"></i> Generate Report</a>
    </div> -->

    <!-- Content Row -->
    <div class="row">

        <!-- Earnings (Monthly) Card Example -->
        <div class="col-xl-3 col-md-6 mb-3">
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">N</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800" ><span id="total"></span></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-calendar fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-md-6 mb-3">
            <div class="card border-left-danger shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">En attente de validation</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800" ><span id="en_attente"></span></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-valid fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Earnings (Monthly) Card Example -->
        <div class="col-xl-3 col-md-6 mb-3">
            <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">Encours</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800" ><span id="encour"></span></div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Earnings (Monthly) Card Example -->
        <div class="col-xl-3 col-md-6 mb-3">
            <div class="card border-left-info shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">Finalisées</div>
                            <div class="row no-gutters align-items-center">
                                <div class="col-auto">
                                    <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800"><span id="final"></span></div>
                                </div>
                                <!-- <div class="col">
                                  <div class="progress progress-sm mr-2">
                                    <div class="progress-bar bg-info" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                  </div>
                                </div> -->
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <!-- Content Row -->

    <div class="row">

        <!-- Area Chart -->
        <div class="col-xl-6 col-lg-6">
             <div class="card shadow mb-4">
                <!-- Card Header - Dropdown -->
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">5 derniers Chantiers</h6>

                </div>
                <!-- Card Body -->
                <div class="card-body">
                      <div class="chart-area">
                        <div class="table-responsive">
                            <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                <thead>
                                    <th>Numéro</th>
                                    <th>Date création</th>
                                    <th>Propriétaire</th>
                                    <th>Validité</th>
                                </thead>
                            </table>
                        </div>
                       </div> 
                </div>
            </div>
        </div>
        <div class="col-xl-6 col-lg-6">
            <div class="card shadow mb-4">
                <!-- Card Header - Dropdown -->
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">5 derniers demandes en cours</h6>

                </div>
                <!-- Card Body -->
                <div class="card-body">
                    <div class="chart-area">
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
                                <tr align="center" ng-repeat="item in projets"  ng-if="projets.length < 6">
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
                                        {{--<a  class="btn btn-sm btn-success btn-circle text-white" ng-if="item.etat == 0"  ng-click="showModalUpdate('projet',item.id)">
                                            <i class="fa fa-check" title="Valider"></i>
                                        </a>--}}
                                        <a href="#!/detail-projet/@{{ item.id }} " class="btn btn-sm btn-primary btn-circle">
                                            <i class="fas fa-info"></i>
                                        </a>

                                       {{-- <button ng-click="deleteElement('projet',item.id)" class="btn btn-sm btn-danger btn-circle">
                                            <i class="fas fa-trash"></i>
                                        </button>--}}
                                        {{-- <a  class="btn btn-sm btn-warning btn-circle"  href="#!/detail-projet/@{{ item.id }} ">
                                             <i class="fa fa-file-pdf" title="generer le pdf"></i>
     </a>--}}
                                    </td>
                                </tr>

                                </tbody>
                            </table>
                        </div>



{{--
                        <table class="table table-responsive-sm table-bordered mb-0 text-center dataTable dtr-inline" id="tabLigneLiv" role="grid">

                            <thead>
                            <tr align="center">
                                <th scope="col">code</th>
                                <th scope="col">Nom complet</th>
                                <th scope="col">date</th>
                                <th scope="col">etat</th>
                                <th scope="col">action</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr align="center">
                                <th scope="row">2</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td><span class="badge badge-danger">encours</span></td>
                                <td>
                                    <a href="#!/detail-projet/@{{ item.id }} " class="btn btn-sm btn-primary btn-circle">
                                        <i class="fas fa-info"></i>
                                    </a>
                                </td>
                            </tr>


                            </tbody>
                        </table>
--}}
                    </div>
                </div>
            </div>
        </div>

        <!-- Pie Chart -->
       {{-- <div class="col-xl-4 col-lg-5">
            <div class="card shadow mb-4">
                <!-- Card Header - Dropdown -->
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Pourcentages Recettes</h6>
                    <div class="dropdown no-arrow">
                        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                            <div class="dropdown-header">Dropdown Header:</div>
                            <a class="dropdown-item" href="#">Action</a>
                            <a class="dropdown-item" href="#">Another action</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="#">Something else here</a>
                        </div>
                    </div>
                </div>
                <!-- Card Body -->
                <div class="card-body">
                    <div class="chart-pie pt-4 pb-2">
                        <canvas id="myPieChart"></canvas>
                    </div>
                    <div class="mt-4 text-center small">
                    <span class="mr-2">
                      <i class="fas fa-circle text-primary"></i> finalisé
                    </span>
                        <span class="mr-2">
                      <i class="fas fa-circle text-success"></i> encours
                    </span>

                    </div>
                </div>
            </div>
        </div>--}}
    </div>


</div>
