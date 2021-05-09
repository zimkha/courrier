<div class="">

    <!-- Page Heading -->
    <div class="row">

        <div class="col-lg-12">

            <div class="row">
                <div class="col-md-8">
                    Detail Plan: code-plan: <strong><u><span class="badge badge-info">@{{ planview.code }}</span></u></strong>
                </div>
                <div class="col-md-4">
                    <div class="float-right pt-0 mx-1 text-right">
                        <button class="btn btn-success btn-circle mb-2" ng-click="showModalAdd('lier_plan')" title="lier le plan a un projet"><i class="fa fa-magnet"></i></button>
                    </div>
                    <div class="float-right pt-0 mx-1 text-right">
                        <button class="btn btn-warning btn-circle mb-2" ng-click="showModalAdd('joined')" title="Joindre un fichier au plan"><i class="fa fa-file"></i></button>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="home-tab" target="_self" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">A propos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="profile-tab" data-toggle="tab" target="_self" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Demandes associés au plan : <u>en cour</u> </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="contact-tab" data-toggle="tab" target="_self" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Demandes associés au plan : <u>finalisés</u> </a>
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
                                                <i class="fa fa-calendar-check"></i> <strong><u>Date creation:</u></strong>
                                                <span class="text-muted">@{{ planview.created_at_fr }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div  class="card-body row animated fadeInUp">
                                        <div class=" col-md-3 col-sm-12 mt-10">
                                            <div class="border-danger">
                                                <h6> Superficie :<strong> <u>@{{ planview.superficie }}</u></strong></h6>
                                            </div>
                                        </div>
                                        <div class=" col-md-3 col-sm-12 mt-10">
                                            <div class="border-danger">
                                                <h6> Longeur :<strong> <u>@{{ planview.longeur }}</u></strong></h6>
                                            </div>
                                        </div>
                                        <div class=" col-md-3 col-sm-12 mt-10">
                                            <div class="border-danger">
                                                <h6> Largeur :<strong> <u>@{{ planview.largeur }}</u></strong></h6>
                                            </div>
                                        </div>
                                        <div class=" col-md-3 col-sm-12 mt-10">
                                            <div class="border-danger">
                                                <h6> Nombre Chambre :<strong> <u>@{{ planview.nb_chambre }}</u></strong></h6>
                                            </div>

                                        </div>
                                        <div class=" col-md-3 col-sm-12 mt-10">
                                            <div class="border-danger">
                                                <h6>Nbre cuisine :<strong> <u>@{{ planview.nb_cuisine }}</u></strong></h6>

                                            </div>

                                        </div>
                                        <div class=" col-md-3 col-sm-12 mt-10">
                                            <div class="border-danger">
                                                <h6> Nombre wc :<strong> <u>@{{ planview.nb_toillette }}</u></strong></h6>

                                            </div>

                                        </div>
                                        <div class=" col-md-3 col-sm-12 mt-10">
                                            <div class="border-danger">
                                                <h6> Nombre salon :<strong> <u>@{{ planview.nb_salon }}</u></strong></h6>

                                            </div>

                                        </div>

                                        <div class=" col-md-3 col-sm-12 mt-10">
                                            <div class="border-danger">
                                                <h6> Fichier du plan </h6>
                                                <a href="@{{link}}/@{{ planview.fichier }}">
                                                <span class="fa fa-file-pdf"></span>
                                                </a>

                                            </div>

                                        </div>


                                    </div>

                                    <div class="row mt-30 animated px-2">
                                        <div class="col-md-2 mb-10" ng-repeat="item in planview.joineds">
                                            <a href="@{{link}}/@{{ item.fichier }}">
                                                <span class="fa fa-file-pdf"></span>
                                            </a>
                                            @{{ item.description }}
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
                                            <th>Code</th>
                                            <th>Date</th>
                                            <th>Client</th>
                                            <th>Adresse </th>

                                            <th>Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        <tr align="center" ng-repeat="item in planview.plan_projets" ng-if="item.active==1 && item.etat==1">
                                            <td>@{{ item.id }}</td>
                                            <td>@{{ item.created_at_fr }}</td>
                                            <td>@{{ item.user.prenom }} -- @{{ item.nom }}</td>
                                            <td>@{{ item.adresse_terrain }}</td>

                                            <td>
                                                <button href="detail-client.html" class="btn btn-primary btn-circle" data-toggle="modal" data-target=".bd-example-modal-lg">
                                                    <i class="fas fa-info-circle"></i>
                                                </button>
                                                <button href="#" ng-click="deteleLiaison(planview.id,item.id)" class="btn btn-danger btn-circle" data-toggle="modal" data-target=".bd-example-modal-lg">
                                                    <i class="fa fa-trash"></i>
                                                </button>
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
                                            <th>Code</th>
                                            <th>Date</th>
                                            <th>Client</th>
                                            <th>Adresse </th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        <tr align="center" ng-repeat="item in planview.plan_projetss" ng-if="item.etat==2">
                                            <td>@{{ item.name }}</td>
                                            <td>@{{ item.created_at_fr }}</td>
                                            <td>@{{ item.user.prenom }}  @{{ item.user.nom }}</td>
                                            <td>@{{ item.adresse_terrain }}</td>
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

</div>
