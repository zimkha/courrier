@extends('layouts.app')

@section('content')

    <body ng-controller="BackEndCtl" id="page-top">

    <!-- Page Wrapper -->
        <div id="wrapper">

            @include('layouts.partials.menu_bar')

            <div id="content-wrapper" class="d-flex flex-column">

                <!-- Main Content -->
                <div id="content">
                    @include('layouts.partials.nav_bar')

                    <div class="container-fluid" ng-view>
                    </div>

                    <footer class="fixed-footer bg-white fixed-bottom">
                        <div class="container my-auto">
                            <div class="copyright text-center my-auto">
                                <span>Copyright &copy; Khazim Ndiaye Développeur  2021</span>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    </body>


{{--    les modals ici--}}

@endsection
