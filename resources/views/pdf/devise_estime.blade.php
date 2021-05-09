<!DOCTYPE html>
<html lang="zxx" ng-app="samakeur">
<head>
    <!-- Meta Tag -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name='copyright' content=''>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Sama keur</title>
    <link rel="icon" type="image/png" href="images/">



    <style>


        .body-1 {
           /* padding: 20px;*/
        }
        .titre-1 {
            font-size: 25px;
            text-align: center;
        }

        .display-flex {
            display: inline-flex;
        }

        .display-flex-1 {
            background-color: #F7941D!important;width: 20px;height: 20px;line-height: 20px;color: white;text-align: center;margin-right: 10px;
        }

        .display-flex-1-1 {
            background-color: #999C9F!important;width: 30px;height: 20px;line-height: 20px;color: white;text-align: center;margin-right: 10px;
        }

        .display-flex-2 {
            font-size: 16px;font-weight: 600;color: #F7941D;
        }

        #customers {
            font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }

        #customers td, #customers th {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
            font-size: 15px;
        }

        #customers tr:nth-child(even){background-color: #f2f2f2;}

        #customers tr:hover {background-color: #ddd;}

        #customers th {
            padding-top: 12px;
            padding-bottom: 12px;
            background-color: #F7941D;
            text-align: center;
            color: white;}

        /**
            Set the margins of the page to 0, so the footer and the header
            can be of the full height and width !
         **/
        @page {
            margin: 0px 0px;
        }

        /** Define now the real margins of every page in the PDF **/
        body {
            margin-top: 1.5cm;
            margin-left: 1.5cm;
            margin-right: 1.5cm;
            margin-bottom: 1.5cm;
            /*font-size: 1.2em;*/
          /*  font: 12pt/1.5 'Raleway','Cambria', sans-serif;
            font-weight: 350;*/
            background:  #fff;
            color: black;
            /*
                        -webkit-print-color-adjust:  exact;
            */
        }

        .end-page
        {
            position:fixed;
            bottom: 0cm !important;
            left: 1cm;
            right: 1cm;
            height:1cm;
        }

        /** Define the header rules **/
        .header {
            position: fixed;
            top: 0.8cm;
            /* left: 1cm;
             right: 2cm;*/
            height: 4cm;

        }

        /** Define the footer rules **/
        .footer {
            position: fixed;
            bottom: 0cm;
            left: 1cm;
            right: 1cm;
            height: 3cm;
        }

        .pagenum:before {
            content: counter(page);
        }


        .wd30 {
            width: 30%!important;
        }

        .wd40 {
            width: 40%!important;
        }

        .wd60 {
            width: 60%!important;
        }

        .wd70 {
            width: 70%!important;
        }

        .wd100 {
            width: 100%!important;
        }

        .hpx-40 {
            height: 70px!important;
        }

        .hpx-70 {
            height: 70px!important;
        }

        .hpx-90 {
            height: 90px!important;
            padding-left: 15px;
        }
        .hpx-120 {
            height: 120px!important;
        }

    </style>
<title>Devis Estime </title>
</head>

<body class="body-1">
<div class="titre-1">Devis Estime SAMAKEUR</div>


</body>


</html>
