<html>
<head>
    <style>
        /**
            Set the margins of the page to 0, so the footer and the header
            can be of the full height and width !
         **/
        @page {
            margin: 0cm 0cm;
            font-size: 12px;
        }

        /** Define now the real margins of every page in the PDF **/
        body {
            margin-top: -1cm;
            margin-left: 0.5cm
        ;
            margin-right: 1cm;
            margin-bottom: -0.5cm;
            /*font-size: 1.2em;*/
            font: 12pt/1.5 'Raleway','Cambria', sans-serif;
            font-weight: 300;
            background:  #fff;
            color: black;
            -webkit-print-color-adjust:  exact;
        }

        /** Define the header rules **/


        /** Define the footer rules **/
        footer {
            position: fixed;
            bottom: 0cm;
            left: 0cm;
            right: 0cm;
            height: 3cm;
        }
        section{
            /*margin-top:5%;*/
            /*border:1px solid black;*/
        }

        div{
            position: relative;
            /*border-top: 1px solid black;*/
        }

        .droite{
            float: right;
        }

        hr{
            border-top: 1px dotted red;
        }

        .centrer{
            text-align: center;
        }

        nav{
            /*border:1px solid black;*/
            margin-top:30px;
            float: right;

        }

        table {
            font-family: arial, sans-serif;

            width: 100%;
        }

        td, th {

            text-align: center;
            padding: 10px;
        }

        tr:nth-child(even) {
            /*background-color: #dddddd;*/
        }

        .table {
            width: 100%;
            margin-bottom: 1rem;
            background-color: transparent;
        }

        .table th,
        .table td {
            padding: 0.55rem;
            vertical-align: top;
            border-top: 1px solid #e9ecef;
        }

        .table thead th {
            vertical-align: bottom;
            border-bottom: 2px solid #e9ecef;
        }

        .table tbody + tbody {
            border-top: 2px solid #e9ecef;
        }

        .table .table {
            background-color: #fff;
        }

        .table-sm th,
        .table-sm td {
            padding: 0.3rem;
        }

        .table-bordered {
            border: 1px solid #e9ecef;
        }

        .table-bordered th,
        .table-bordered td {
            border: 1px solid #e9ecef;
        }

        .table-bordered thead th,
        .table-bordered thead td {
            border-bottom-width: 2px;
        }

        .table-borderless th,
        .table-borderless td,
        .table-borderless thead th,
        .table-borderless tbody + tbody {
            border: 0;
        }

        .table-striped tbody tr:nth-of-type(odd) {
            background-color: rgba(0, 0, 0, 0.03);
        }
        /*** Style pour doc3.html (Tables) ***/

#demo-table {
  font: 100% sans-serif;
  background-color: #efe;
  border-collapse: collapse;
  empty-cells: show;
  border: 1px solid #7a7;
  }

#demo-table > caption {
  text-align: left;
  font-weight: bold;
  font-size: 200%;
  border-bottom: .2em solid #4ca;
  margin-bottom: .5em;
  }


/* règles de base partagées */
#demo-table th,
#demo-table td {
  text-align: right;
  padding-right: .5em;
  }

#demo-table th {
  font-weight: bold;
  padding-left: .5em;
  }


/* en-tête */
#demo-table > thead > tr:first-child > th {
  text-align: center;
  color: blue;
  font-size: 12px;
  font-weight: lighter;
  }

#demo-table > thead > tr + tr > th {
  font-style: italic;
  color: gray;
  }

/* taille des valeurs en exposant */
#demo-table sup {
  font-size: 75%;
  }

/* corps du tableau */
#demo-table td {
  background-color: #cef;
  padding:.5em .5em .5em 3em;
  }

#demo-table tbody th:after {
  content: " :";
  }


/* pied du tableau */
#demo-table tfoot {
  font-weight: bold;
  }

#demo-table tfoot th {
  color: blue;
  }

#demo-table tfoot th:after {
  content: " :";
  }

#demo-table > tfoot td {
  background-color: #cee;
  }

#demo-table > tfoot > tr:first-child td {
  border-top: .2em solid #7a7;
  }
  #droit
  {
    float:left;
    width:240px;
  }
    </style>
</head>
<body style="margin-top: 50px;">
    <div class="my_header">
        <h3>Samakeur</h3>
    </div>
    <h3 align="center">PDF PLAN</h3>
    <div >
    <table class="table table-striped" >
        <thead >
            <tr align="center"  style="font-size: 10px; font-weight: lighter;" >
            <th>Pieces</th>
            <th>Chambre</th>
            <th>SDB</th>
             <th>Salon</th>
             <th>Cuisine</th>
             <th>Toillette</th>
             <th>Garage</th>
            </tr>
        </thead>
        <body>
            <tr align="center">
                <td>13</td>
                <td>3</td>
                <td>3</td>
                <td>2</td>
                <td>2</td>
                <td>4</td>
                <td>2</td>
            </tr>
        </body>
    </table>
    <br>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>Niveau</th>
                <th>Pieces</th>
                <th>Chambre</th>
                <th>SDB</th>
                <th>Salon</th>
                <th>Cuisine</th>
                <th>Toillette</th>
            </tr>
        </thead>
    </table>
</div>
</body>
</html>