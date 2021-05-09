<div class="">
    <h1 class="h3 mb-4 text-gray-800">Detail Client</h1>

    <!-- Page Heading -->

    <div class="row">
        <div class="col-lg-12">
            <div class="card">
                <div class="card-body">
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" target="_self" role="tab" aria-controls="home" aria-selected="true">A propos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" target="_self" role="tab" aria-controls="profile" aria-selected="false">En cours</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" target="_self" role="tab" aria-controls="contact" aria-selected="false">Finalisée</a>
                        </li>
                    </ul>
                </div>


                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                        <div class="card">
                            <div class="card-body">
                                <div class="mt-40">

                                    <div class="animated fadeInDown shadow px-1">
                                        <div class="text-center p-1">
                                            <div>
                                                <i class="fa fa-calendar-check"></i> <strong><u>Date inscription:</u></strong>
                                                <span class="text-muted">@{{ clientview.created_at_fr }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div  class="card-body row animated fadeInUp">
                                        <div class=" col-md-6 col-sm-12 mt-10">
                                            <div class="border-danger">
                                                <h6><span class="fa fa-user text-dark"></span> Nom Complet :<strong><u>@{{ clientview.prenom }}  @{{ clientview.nom }}</u></strong></h6>

                                            </div>

                                        </div>
                                       {{-- <div class=" col-md-4 col-sm-12 mt-10 mb-2">
                                            <div class="border-danger">
                                                <h6 > <span class="fa fa-flag text-dark"></span> Pays d'origine :<strong><u></u>@{{ clientview.pays }}</u></strong></h6>
                                            </div>

                                        </div>--}}
                                        <div class=" col-md-6 col-sm-12 mt-10">
                                            <div class="border-danger">
                                                <h6 ><span class="fa fa-home text-dark"></span> Adresse actuel :<strong><u>@{{ clientview.adresse_complet }} </u></strong></h6>

                                            </div>

                                        </div>
                                        <div class=" col-md-6 col-sm-12 mt-4">
                                            <div class="border-danger">
                                                <h6 ><span class="fa fa-phone text-dark"></span> Numero tel :<strong><u> @{{ clientview.telephone }}</u></strong></h6>

                                            </div>

                                        </div>
                                        <div class=" col-md-6 col-sm-12 mt-4">
                                            <div class="border-danger">
                                                <h6 > <span class="fa fa-envelope text-dark"></span> Email :<strong><u></u>@{{ clientview.email }}</u></strong></h6>
                                            </div>

                                        </div>


                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                        <div class="card">
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                        <thead>
                                        <tr align="center">
                                            <th>Code Projet</th>
                                            <th>Adresse</th>
                                            <th>Date creation</th>
                                            <th>Date a valider</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        <tr align="center" ng-repeat="item in projets" ng-if="item.etat==0">
                                            <td>@{{ $index + 1 }}</td>
                                           <td>@{{ item.adresse_terrain }}</td>
                                           <td>@{{ item.created_at_fr }}</td>
                                           <td>@{{ item.a_valider }}</td>

                                          {{-- <td><span class="badge badge-success">payé</span></td>--}}
                                            <td>
                                                <a href="#!/detail-projet/@{{ item.id }}" class="btn btn-primary btn-circle">
                                                    <i class="fas fa-info"></i>
                                                </a>
                                               {{-- <button ng-click="DeleteElement('projet', item.id)" class="btn btn-danger btn-circle">
                                                    <i class="fas fa-info-circle"></i>
                                                </button>--}}
                                            </td>
                                        </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                        <div class="card">
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                        <thead>
                                            <tr align="center">
                                                <th>Code Projet</th>
                                                <th>Adresse</th>
                                                <th>Date creation</th>
                                                <th>Date a valider</th>
                                                <th>Actions</th>
                                            </tr>
                                            </thead>

                                            <tbody>
                                            <tr align="center" ng-repeat="item in projets" ng-if="item.active==1 && item.etat==2">
                                                <td>@{{ $index + 1 }}</td>
                                                <td>@{{ item.adresse_terrain }}</td>
                                                <td>@{{ item.created_at_fr }}</td>
                                                <td>@{{ item.a_valider }}</td>

                                                {{-- <td><span class="badge badge-success">payé</span></td>--}}
                                                <td>
                                                    <a href="#!/detail-projet/@{{ item.id }}" class="btn btn-primary btn-circle">
                                                        <i class="fas fa-info"></i>
                                                    </a>
                                                   {{-- <button ng-click="DeleteElement('projet', item.id)" class="btn btn-danger btn-circle">
                                                        <i class="fas fa-info-circle"></i>
                                                    </button>--}}
                                                </td>
                                            </tr>

                                            </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    </div>
    <br>

</div>
