<!DOCTYPE html>
<html lang="zxx" ng-app="samakeur">
<head>
    <!-- Meta Tag -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name='copyright' content=''>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Sama Courrier</title>
    <link rel="icon" type="image/png" href="images/">
{{--
    <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/sb-admin-2.min.css') }}">
--}}


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
        table{
  border-collapse: collapse
}

td{
  border: 1px solid black;
  padding: 10px;
  font-size: 14px;
}
#watermark { position: fixed; bottom: 0px; right: 0px; width: 200px; height: 200px; opacity: .1; }
    </style>


</head>
<body class="body-1">
<div id="watermark"><img  src="assets/images/coud.jpeg" height="100%" width="100%"></div>
  <img style="width:80px;height: 80px;" src="assets/images/coud.jpeg">
  <h3 align="center"> Fiche de ventilation du courrier</h3>
  <table  width="100 %">
  
    <tr>
      <td>
        REFERENCES   : {{ $courrier["reference"]}}
        <br> <br> <br>
        EXPEDITEUR : {{ $courrier["expediteur"]}}
      </td>
      <td>DATE COURRIER : {{ $courrier["date_courrier"]}} </td>
      <td>
        ARRIVEE N° {{ $courrier["numero"]}}
        <br> <br> <br>
        DATE ARRIVE : {{ $courrier["date_arrive"]}}
      </td>
   
    </tr>
  </table>
  <table  width="100 %">
    <tr >
      <td >Objet du courrier: {{ $courrier["objet"]}} </td>
    </tr>
  </table>
  <table  width="100 %">
  @foreach($services as $service)
    <tr align="center">
      <td>{{ $service['service_gauche']['name']}} </td>
       <td> {{ $service['service'] }} </td>
       <td>  {{ $service['service_droite']['name']  }} </td>
    </tr>
  @endforeach
   
  </table>
    <table  width="100 %">
    <tr >
      <td >Autre Instructions
         <br>
         {{ $courrier['autre_instruction']}}
       </td>
    </tr>
  </table>

    <!-- <tr>
      <td>Joly</td>
      <td>Pauline</td>
      <td>27</td>
    </tr> -->
  
</body>
</html>
