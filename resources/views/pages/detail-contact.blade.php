<div class="">
    <h1 class="h3 mb-4 text-gray-800">Detail Message</h1>

    <!-- Page Heading -->

    <div class="row">
        <div class="col-lg-12">
            <div class="card">
                <div class="card-body">
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" target="_self" role="tab" aria-controls="home" aria-selected="true">Infos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" target="_self" role="tab" aria-controls="profile" aria-selected="false">Message</a>
                        </li>
                        <li class="nav-item">
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
                                                <i class="fa fa-calendar-check"></i> <strong><u>Date Reçu:</u></strong>
                                                <span class="text-muted">@{{ messagesendview.created_at_fr }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div  class="card-body row animated fadeInUp">
                                        <div class=" col-md-6 col-sm-12 mt-10">
                                            <div class="border-danger">
                                                <h6><span class="fa fa-user text-dark"></span> Expéditeurr :<strong><u>@{{ messagesendview.nom }}</u></strong></h6>

                                            </div>

                                        </div>

                                        <div class=" col-md-6 col-sm-12 mt-10">
                                            <div class="border-danger">
                                                <h6 ><span class="fa fa-home text-dark"></span> Objet :<strong><u>@{{ messagesendview.objet }} </u></strong></h6>

                                            </div>

                                        </div>
                                        <div class=" col-md-6 col-sm-12 mt-4">
                                            <div class="border-danger">
                                                <h6 ><span class="fa fa-phone text-dark"></span> telephone:<strong><u> @{{ messagesendview.telephone }}</u></strong></h6>

                                            </div>

                                        </div>
                                        <div class=" col-md-6 col-sm-12 mt-4">
                                            <div class="border-danger">
                                                <h6 > <span class="fa fa-envelope text-dark"></span> Email :<strong><u></u>@{{ messagesendview.email }}</u></strong></h6>
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
                               <p>@{{ messagesendview.message}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <br>

</div>
