<div class="">

    <!-- Page Heading -->
    <div class="row">

        <div class="col-lg-12">

            Detail Projet: code-projet: <strong><u><span class="badge badge-info">@{{ projetview.name }}</span></u></strong>
           
            <div class="card">
           
                <div class="card-body">
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="home-tab" target="_self" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">A propos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="profile-tab" data-toggle="tab" target="_self" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Niveaux du projet</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="contact-tab" data-toggle="tab" target="_self" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Remarques Associés</a>
                        </li>
                        <li>
                        <div class="float-right pt-0 mx-1 text-right">
                        <button class="btn btn-primary btn-circle mb-2" ng-click="activerProjet(projetview.id)" title="Valider le projet après paiment"><i class="fa fa-server"></i></button>
                    </div>
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
                                                <span class="text-muted">@{{ projetview.created_at_fr }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div  class="card-body row animated fadeInUp">
                                        <div class=" col-md-3 col-sm-12 mt-3">
                                            <div class="border-danger">
                                                <h6> Adresse :<strong><u> @{{ projetview.adresse_terrain }}</u></strong></h6>
                                            </div>

                                        </div>
                                        <div class=" col-md-3 col-sm-12 mt-3">
                                            <div class="border-danger">
                                                <h6> Superficie :<strong><u> @{{ projetview.superficie }}</u></strong></h6>
                                            </div>

                                        </div>
                                        <div class=" col-md-3 col-sm-12 mt-3">
                                            <div class="border-danger">
                                                <h6> Longeur :<strong><u> @{{ projetview.longeur }}</u></strong></h6>
                                            </div>

                                        </div>
                                        <div class=" col-md-3 col-sm-12 mt-3">
                                            <div class="border-danger">
                                                <h6> Largeur :<strong><u> @{{ projetview.largeur }}</u></strong></h6>
                                            </div>

                                        </div>
                                        <div class=" col-md-3 col-sm-12 mt-3">
                                            <div class="border-danger">
                                                <h6>Nbre Chambre Sple :<strong><u>@{{ projetview.nb_chambre }}</u></strong></h6>

                                            </div>

                                        </div>
                                        <div class=" col-md-3 col-sm-12 mt-3">
                                            <div class="border-danger">
                                                <h6>Nbre Chambre SDB :<strong><u>@{{ projetview.nb_sdb }}</u></strong></h6>

                                            </div>

                                        </div>
                                        <div class=" col-md-3 col-sm-12 mt-3">
                                            <div class="border-danger">
                                                <h6>Nbre cuisine :<strong><u>@{{ projetview.nb_cuisine }}</u></strong></h6>

                                            </div>

                                        </div>
                                        <div class=" col-md-3 col-sm-12 mt-3">
                                            <div class="border-danger">
                                                <h6> Nbre Toillette :<strong><u> @{{ projetview.nb_toillette }}</u></strong></h6>

                                            </div>

                                        </div>
                                        {{--<div class=" col-md-3 col-sm-12 mt-3">
                                            <div class="border-danger">
                                                <h6> Nbre Piece :<strong><u> @{{ projetview.nb_pieces }}</u></strong></h6>

                                            </div>

                                        </div>--}}
                                        <div class=" col-md-3 col-sm-12 mt-3">
                                            <div class="border-danger">
                                                <h6> Nbre Salon :<strong><u> @{{ projetview.nb_salon }}</u></strong></h6>

                                            </div>

                                        </div>
                                        <div class=" col-md-12 col-sm-12 mt-3">
                                            <div class="border-danger">
                                                <h6>Description : @{{ projetview.text_projet }}</h6>

                                            </div>

                                        </div>

                                        <div class="row mt-30 animated px-2">
                                           {{-- <div class="col-md-2 mb-10" ng-repeat="item in projetview.remarques">
                                                <a href="@{{link}}/@{{ item.demande_text }}">
                                                    <span class="fa fa-file-pdf"></span>
                                                </a>
                                                @{{ item.demande_text }}
                                            </div>--}}
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

                                            <th>Niveau</th>
                                            <th>Chbres Sple </th>
                                            <th>Chbres SDB</th>
                                            <th>Bureau</th>
                                            <th>Salon</th>
                                            <th>Cuisine</th>
                                            <th>Toillettes</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                        <tr class="animated fadeIn" ng-repeat="item in projetview.niveau_projets">
                                            <td class="text-center">
                                                @{{ item.niveau_name }}
                                            </td>
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
                                        </tr>



                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                        <div class="card">
                            <span class="badge badge-primary"> @{{ projetview.remarques.length }}</span>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                        <thead>
                                        <tr align="center">
                                           
                                            <th>Description</th>
                                            <th>Fichier</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody>
                                            <tr class="animated fadeIn" ng-repeat="item in projetview.remarques">
                                                <td> <u>Remarque  @{{ item.id }} :</u>  @{{ item.demande_text }}</td>
                                               {{-- <td><a href="@{{ base_url }}/{{ item.id }}"></a></td>--}}
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
