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

    </style>

</head>
<body class="body-1">

    <div class="titre-1">Contrat SAMAKEUR</div>
    <br>
    <div style="display: inline-flex!important;margin-top: 30px">
        <div style="background-color: #F7941D!important;width: 20px;height: 20px;line-height: 20px;color: white;text-align: center;margin-right: 10px;">1</div>
        <span style="font-size: 16px;font-weight: 600;color: #F7941D;margin-left: 30px">PARTIES CONTRACTANTES</span>
    </div>
    <br>
    <div style="color: #F7941D;font-size: 16px;margin-top: 15px">Le client</div>

    <div style="margin-top: 10px">
        <div class="">
            <span>M / Mme</span>

            <span style="color: #F7941D;font-weight: bold;margin-left: 30px">{{ $client->prenom}} {{ $client->nom}}</span>

            <span style="margin-left: 20px"> Numéro carte d'identité.</span>
            <span style="margin-left: 20px"> {{ $client->nci}}</span>
        </div>
    </div>
    <div style="margin-top: 10px">
        <!-- <div>
            <span>La société</span>

            <span style="color: #F7941D;font-weight: bold;margin-left: 30px">Socite_du_client</span>

            <span style="margin-left: 20px">n° RCS <span style="color: #F7941D;font-weight: bold">data_du_client</span></span>
        </div> -->
    </div>

    <div class="font-italic" style="margin: 20px 0px;font-size: 15px;font-style: italic">
        (préciser les prénom, nom et qualité du représentant de la société)
    </div>

    <div style="margin-top: 10px">
        <span>Adresse</span>

        <span style="color: #F7941D;font-weight: bold;margin-left: 20px">{{$client->adresse_complet}}</span>

        <span style="margin-left: 20px">Téléphone</span>

        <span style="color: #F7941D;font-weight: bold;margin-left: 20px">{{$client->telephone}}</span>

        <div>
            <span>Couriel</span>

            <span style="color: #F7941D;font-weight: bold;margin-left: 20px">{{$client->email}}</span>
        </div>
    </div>


    <div style="color: #F7941D;font-size: 20px;margin-top: 30px">Samakeur</div>

    <div style="margin-top: 10px">
        <span>La societe</span>

        <span style="color: #F7941D;font-weight: bold;margin-left: 20px">SAMAKEUR, </span> <span>représenté par Moussa DANFAKHA gérant de la société</span>
    </div>

    <div class="font-italic" style="margin: 20px 0px;font-size: 15px;font-style: italic">
        (préciser les prénom, nom et qualité du représentant de la société)
    </div>

    <div style="margin-top: 10px">
        <span>Adresse</span>


        <span style="color: #F7941D;font-weight: bold;margin-left: 13px">Villa n° 66, Rue HS18 quartier Hersent Thiès (SENEGAL)</span>

        <span style="margin-left: 10px">Téléphone</span>


        <span style="color: #F7941D;font-weight: bold;margin-left: 10px">+221 78 178 93 83</span>


        <div style="margin-top: 10px">
            <span>Couriel</span>

            <span style="color: #F7941D;font-weight: bold;margin-left: 20px">admin@samakeur.sn</span>
        </div>
    </div>

    <div style="margin: 20px 0px">
        Conformément aux dispositions, qui font obligation de recourir à une convention écrite préalable à <br>
        tout engagement professionnel, il est convenu ce qui suit :
    </div>
    <br><br>
    <div style="display: inline-flex;margin-top: 20px">
        <div style="background-color: #F7941D!important;width: 20px;height: 20px;line-height: 20px;color: white;text-align: center;margin-right: 10px;">2</div>
        <span style="font-size: 16px;font-weight: 600;color: #F7941D;margin-left: 30px">DESIGNATION DE L’OPERATION</span>
    </div>

    <div style="margin-top: 10px">
        <span>Adresse du terrain : </span>

        <span style="color: #F7941D;font-weight: bold;margin-left: 20px">{{$projet->adresse_terrain}}</span>

        <span style="margin-left: 40px">Références cadastrales : </span>

        <span style="color: #F7941D;font-weight: bold;margin-left: 20px">.........................................</span>



        <div style="margin-top: 10px">
            <span>Surface foncière du terrain : </span>

            <span style="color: #F7941D;font-weight: bold;margin-left: 20px">{{$projet->superficie}}</span>
        </div>
    </div>
    <br><br><br><br><br><br><br><br>
    <div style="color: #F7941D;font-size: 16px;margin-top: 20px">Samakeur</div>

    <div style="margin-top: 10px">Les informations </div>

    <div style="margin-top: 20px">
        <div class="table-responsive">
            <table class="table table-bordered" id="customers">
                <thead>
                <tr class="text-center" style="background-color: #F7941D;color: #fff">
                    <th>Code Projet</th>
                    <th>Date creation</th>
                    <th>Adresse</th>
                    <th>Superficie</th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-center">
                    <td>{{ $projet->name }}</td>
                    <td>{{ $projet->created_at }}</td>
                    <td>{{ $projet->adresse_terrain }}</td>
                    <td>{{$projet->superficie}}</td>

                </tr>

                </tbody>
            </table>
        </div>
    </div>
    <br>
    <div style="margin-top: 10px;margin-bottom: 10px">Les niveaux </div>

    <div style="margin-top: 20px;margin-bottom: 10px">
        <div class="table-responsive">
            <table class="table table-bordered" id="customers">
                <tr class="text-center" style="background-color: #F7941D;color: #fff">
                <td>
                    Niveau
                </td>
                <td>Nbr Chambre</td>
                <td>Nbr Salon</td>
                <td>Nbr Bureau</td>
                <td>Nbr SDB</td>
                <td>Nbr Cuisine</td>
                <td>Nbr toillette</td>

                </tr>

                    <tr>
                        <td>{{ $tableau[0]["etage"] }}</td>
                        <td>{{ $tableau[0]["chambre"]}}</td>
                        <td>{{ $tableau[0]["salon"]}}</td>
                        <td>{{ $tableau[0]["bureau"]}}</td>
                        <td>{{ $tableau[0]["sdb"]}}</td>
                        <td>{{ $tableau[0]["cuisine"]}}</td>
                        <td>{{ $tableau[0]["toillette"]}}</td>

                    </tr>

            </table>
        </div>
    </div>
    <br>
    <div style="display: inline-flex;margin-top: 20px">
        <div style="background-color: #F7941D!important;width: 20px;height: 20px;line-height: 20px;color: white;text-align: center;margin-right: 10px;">3</div>
        <div style="font-size: 16px;font-weight: 600;color: #F7941D;margin-left: 30px">CONDITIONS DE REALISATION DE LA MISSION</div>
    </div>

    <div style="margin-top: 20px">Cette mission est établie sur la base des éléments de programmation du client.</div>

    <div style="margin-top: 20px">
        Le client dispose d'une enveloppe financière pour les travaux. <br>
        Il est informé que ce montant est indépendant du montant des honoraires de Samakeur, et que <br>
        d’autres dépenses, dont la liste figure en annexe dans le programme, seront à sa charge. <br>
    </div>

    <div style="color: #F7941D;font-size: 16px;margin-top: 20px">Contenu de la mission</div>

    <div style="margin-top: 20px">
        Samakeur analyse le programme fourni par le client, visite les lieux s’il le juge nécessaire et prend
        connaissance des données juridiques, techniques et financières qui lui sont communiquées par le
        client. Ces données comprennent notamment les titres de propriété, les levés de géomètre et les
        relevés des existants, le cas échéant. Samakeur émet toutes les observations et propositions qui lui
        semblent utiles
    </div>

    <div style="margin-top: 20px">
        Il établit les études préliminaires qui ont pour objet de vérifier la constructibilité de l’opération au
        regard des règles d’urbanisme, de vérifier sa faisabilité, d’établir une esquisse, ou au maximum deux
        esquisses du projet répondant au programme
    </div>


    <div style="margin-top: 20px">
        Le niveau de définition de l’esquisse correspond généralement à des documents graphiques établis à
        l’échelle de 1/100 (1cm/m) ou  1/200 (½ cm/m).
    </div>

    <div style="margin-top: 20px">
        Les documents graphiques sont établis : <br>
        sur support informatique modifiable (3 fois au maximum) par samakeur : Les requêtes du client sont
        à transmettre dans son espace client sous un délai de 15 jours à partir de la date de dépôt du plan
        avec le dernier indice. Il est clairement précisé que l’ajout de pièces correspond à un nouveau
        programme et ne peut en aucun cas être considéré comme une modification.
    </div>

    <div style="color: #F7941D;font-size: 16px;margin-top: 20px">Délai de réalisation de la mission</div>

    <div style="margin-top: 20px">
        <div style="display: inline-flex;">
            <div style="background-color: #999C9F!important;width: 30px;height: 20px;line-height: 20px;color: white;text-align: center;margin-right: 10px;">20</div>
            <div class="" style="margin-left: 40px">jours ouvrables à compter de la date de signature du présent contrat</div>
        </div>
    </div>

    <div style="margin-top: 10px">
        <div style="display: inline-flex;">
            <div style="background-color: #999C9F!important;width: 30px;height: 20px;line-height: 20px;color: white;text-align: center;margin-right: 10px;">5</div>
            <div class="" style="margin-left: 40px">jours ouvrables à compter de la demande de modification du plan.</div>
        </div>
    </div>

    <div style="margin-top: 20px">
        <div style="display: inline-flex;">
            <div style="background-color: #F7941D!important;width: 20px;height: 20px;line-height: 20px;color: white;text-align: center;margin-right: 10px;">4</div>
            <div style="font-size: 16px;font-weight: 600;color: #F7941D;margin-left: 30px">REMUNERATION </div>
        </div>
    </div>

    <div style="margin-top: 20px">
        Pour la mission qui lui est confiée, samakeur perçoit une rémunération forfaitaire de
        <span style="color: #F7941D;font-size: 16px;margin-top: 30px"> charger la somme rentrée par l’administrateur lors de la validation de la demande </span> . {{ $projet->montant }} Fcfa
    </div>


    <div style="margin-top: 20px">
        <div style="display: inline-flex;">
            <div style="background-color: #F7941D!important;width: 20px;height: 20px;line-height: 20px;color: white;text-align: center;margin-right: 10px;">5</div>
            <div style="font-size: 16px;font-weight: 600;color: #F7941D;margin-left: 30px">RÉALISATION DU PROJET - POURSUITE DE LA MISSION </div>
        </div>
    </div>

    <div style="margin-top: 20px">
        Si le client donne suite au projet établi par Samakeur, un nouveau contrat contractuel est passé entre
        eux pour la poursuite de la mission en suivi de chantier ou réalisation des travaux. Le contenu des
        études préliminaires est alors intégré dans ce nouveau contrat et son coût est déduit du montant
        global des honoraires prévus pour la mission confiée
    </div>

    <div style="margin-top: 20px">
        Dans tous les cas, Samakeur conserve la propriété intellectuelle et artistique de son œuvre,
        conformément aux articles L111-1 et suivants du code de la propriété intellectuelle.
    </div>

    <div style="color: #F7941D;font-size: 30px;text-align: center;margin: 40px 0px;">Conditions générales du présent contrat</div>


    {{--    ici les textes--}}

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">A.Article 1 : Objet de la présente section</div>
    <div>Samakeur réalisera pour le Client la prestation prévue Dans les parties description de la demande rentrées par le client.
        <br>
        Les prestations à fournir par Samakeur ont été préalablement établies sur le site et acceptées par ce dernier.
        Elles sont détaillées, notamment pour ce qui concerne la méthodologie employée, mais aussi le déroulement temporel, respectivement dans la section
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">B.Article 2 : Collaboration</div>
    <div>
        Les parties s'engagent à assurer une étroite collaboration afin de vérifier, aussi souvent que l’une d'elles le jugera nécessaire,
        l’adéquation entre la prestation fournie et les besoins du client, tels qu’ils ont été définis précédemment.
        <br>
        Dans l’hypothèse où l’une des deux parties considérerait que la mission ne s’exécute plus conformément aux conditions initiales,
        celles-ci conviendront de se rapprocher afin d’examiner les possibilités d’adaptation du Contrat. En cas de désaccord persistant rendant
        impossible la poursuite de l’étude, le Contrat pourra être rompu à l’initiative de l’une ou l’autre partie selon les conditions et modalités prévues à l’article 10.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">C.Article 3 : Responsabilités</div>
    <div>
        Toute inexécution de l’une des obligations visées au présent Contrat engage la responsabilité de son auteur. Compte tenu tant de
        la nature de la mission que de la spécificité de Samakeur, il convient de rappeler que Samakeur n'est tenue qu'à une obligation de moyen. Elle mettra donc en œuvre
        tout son savoir-faire et tous les moyens nécessaires à l’exécution de la mission qui lui est confiée par le présent Contrat.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">D.Article 4 : Délais de réalisation</div>
    <div>
        Le délai de réalisation de l’étude est précisé dans la section «CONDITIONS DE REALISATION DE LA MISSION ».
        L’étude débute à la signature du présent Contrat sauf cas de force majeure ou cause imputable au Client et sous réserve de
        réception de l’acompte éventuellement prévu avant la date d’échéance de la facture, ainsi que sous réserve de réception des éléments
        nécessaires à la réalisation de l’étude tels que mentionnés plus tôt.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">E.Article 5 : Budget</div>
    <div>
        Le prix de l'étude réalisée par Samakeur dans le cadre du présent Contrat est fixé d’un commun accord et est précisé dans la section « REMUNERATION ».
        <br>
        Les autres frais engagés pour la réalisation de cette étude ainsi que les frais de téléphone et de déplacements sont à la charge du Client.
        Ces autres frais seront refacturés au réel sur présentation des justificatifs.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">F.Article 6 : Conditions de paiement</div>
    <div>
        <div style="font-weight: 500;font-size: 17px;">Prix à payer</div>
        <div style="margin-bottom: 10px">
            Conformément au Contrat, le Client s’engage à régler à Samakeur le montant défini à l'article 5 selon les modalités de
            l’échéancier et avant échéance de la facture correspondante.
        </div>

        <div style="font-weight: 500;font-size: 17px;">Conditions de paiement</div>
        <div style="margin-bottom: 10px">
            Le Client s’engage à effectuer le paiement à Samakeur en ligne.Le montant est donné à la section La facture qui leur est associée sera transmise par mail.
            En cas de retard de paiement, conformément à la loi 2008-776 du 4 août 2008, il sera appliqué des pénalités au taux de 3 fois le taux d'intérêt légal
            en vigueur et en application des articles L441-3 et L441- 6 du code de commerce, il sera appliqué une indemnité de recouvrement de 40 €. Le délai de retard
            pouvant en outre être ajouté au délai de réalisation tel que défini dans l'article 4. En cas de non- paiement,
            Samakeur se réserve le droit de faire appel au tribunal compétent tel que défini dans l’article 13.
        </div>

        <div style="margin-bottom: 10px">
            Dans l'hypothèse où la mission confiée par le client cesserait à la seule initiative de Samakeur, Samakeur s'engage à rembourser au client l'intégralité de l'acompte versé.
        </div>

        <div style="margin-bottom: 10px">
            Dans l'hypothèse où la mission cesserait de la seule initiative du client, le montant dû par le client sera calculé au prorata
            du travail effectué. Dans le cas où le montant de prestations effectuées serait inférieur à celui de l'acompte versé, Samakeur
            s'engage à reverser la différence au client. Dans le cas contraire,
            le client devra verser à Samakeur la différence entre l'acompte versé et le montant des travaux effectués.
        </div>

        <div style="margin-bottom: 10px">
            Dans l’hypothèse où la mission confiée cesserait d’un commun accord, les parties au présent Contrat règleront de manière amiable le sort des sommes perçues par Samakeur.
        </div>

        <div style="margin-bottom: 10px">
            Toute rupture du présent Contrat doit respecter les termes de l'article 10.
        </div>

        <div style="margin-bottom: 10px">
            Clause pénale : <br>
            En cas de retard de paiement à l’échéance, des intérêts de retard au taux annuel de 12 % sur le montant impayé seront dus de plein droit, sans mise en demeure préalable.
        </div>

    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">F.Article 6 : Conditions de paiement</div>
    <div>
        Au cours de la période de modification de 15 jours, tout motif d’insatisfaction du Client portant sur un élément du
        cahier des charges défini précédemment devra être pris en compte par Samakeur, qui s’engage à commencer la
        correction des prestations sous quinze jours ouvrés, tout en fournissant au préalable une estimation de la durée des travaux.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">H.Article 8 : Force majeure</div>
    <div>
        En cas de force majeure, la partie empêchée verra ses obligations suspendues pendant la durée de la force majeure.
        La partie empêchée doit en aviser immédiatement l'autre partie par lettre recommandée avec accusé de réception.
        La partie empêchée informera également des dispositions palliatives qu'elle a prises ou se propose de prendre.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">I. Article 9 : Modifications</div>
    <div>
        Le présent Contrat ne pourra être modifié qu'après accord écrit entre les parties. <br>
        Toute modification de la part de l’une des deux parties, de l’objet de l’étude, du budget prévisionnel,
        de l'échéancier prévisionnel, de la méthodologie ou de toute autre disposition du présent Contrat devra faire l’objet d’un Avenant.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">J. Article 10 : Résiliation</div>
    <div>
        Toute résiliation par l’une des parties se fera par lettre recommandée avec accusé de réception, précédée
        en cas de non-respect par l’une des parties des obligations prévues par le présent Contrat, d’une mise en demeure de se conformer auxdites obligations. La partie ne pourra procéder
        à la résiliation du Contrat que passé un délai de 15 jours après notification par lettre recommandée avec accusé de réception à l'autre partie.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">K.Article 11 : Confidentialité</div>
    <div>
        Tous les membres de Samakeur seront tenus au secret le plus absolu et s’engagent à ne communiquer à des tiers,
        sans une autorisation expresse du Client, aucune indication sur les travaux effectués ni aucune information qu’ils pourraient recueillir du fait de leur mission pour le Client.
        Ceci à l'exception d'une utilisation pédagogique des renseignements et documents ayant un rapport avec l'étude, utilisation faite avec l'accord écrit du Client.

        <div style="margin-bottom: 10px">
            La confidentialité touche notamment :
        </div>

        <div style="margin-bottom: 10px">
            <div> <span class="color: #F7941D">*</span> Toute information transmise par le Client,</div>
            <div> <span class="color: #F7941D">*</span> Les rapports, travaux, études, résultats de la mission.</div>
        </div>

    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">L.Article 12 : Propriété de l’étude</div>
    <div>
        L'ensemble des techniques et méthodes de recherche demeure la propriété de Samakeur et ne pourra faire l'objet d'aucune utilisation ou reproduction sans accord express.
        <br>
        L’ensemble des travaux techniques et méthodologiques nécessaires à la réalisation de l’étude demeure toutefois
        la propriété exclusive de Samakeur jusqu’au paiement global de l’étude, après quoi le résultat de l’étude sera la propriété exclusive du Client.
        <br>
        Samakeur, en accord avec le Client, archivera les données concernant l’étude sur support informatique et papier.
        Cependant, aucune utilisation ou reproduction des travaux ou études ne pourra se faire sans l’autorisation écrite du Client.
        Le client pourra exploiter ou faire exploiter les résultats de l'étude sans aucune rémunération au profit de Samakeur autre que celle mentionnée dans l’article 5 du présent Contrat.
        Samakeur se réserve le droit d'utiliser le nom et le logo du client à titre de référence.

    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">M. Article 13 : Litiges et tribunaux compétents</div>
    <div>
        Le présent Contrat est soumis au droit français. En cas de litige relatif à l'interprétation,
        l'exécution ou la fin du présent Contrat, les parties s’engagent à rechercher, avant tout recours contentieux, une solution à l'amiable.
        <br>
        En cas de désaccord persistant, le litige sera porté devant la juridiction d'instance compétente dont dépend le siège de Samakeur.

    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">N.Article 14 : Loi Informatique et Libertés</div>
    <div>
        <div style="margin-bottom: 10px">
            Les termes « données à caractère personnel », « traiter/traitement », « responsable du traitement », « sous traitement »
            ont la même signification que celle qui leur est donnée par la Loi
            « Informatique et Libertés » du 6 janvier 1978, ainsi que par tout Règlement européen dès ce dernier applicable, ci-après dénommés « la Règlementation ».
        </div>
        <div style="margin-bottom: 10px">
            Les données récoltées et transmises au client au cours de cette étude peuvent être nominatives et à destination
            du client. Chacune des Parties déclare faire son affaire des diverses déclarations et/ou mesures exigées par la Réglementation dans le cadre de la mise en œuvre des
            traitements de données à caractère personnel. Samakeur ne saurait être tenue responsable d'un quelconque manquement du client aux obligations qui lui incombent.
        </div>
        <div style="margin-bottom: 10px">
            Les informations relatives au client font l'objet d'un traitement informatique et sont destinées
            à Samakeur et traitées par le Président pour la gestion de sa clientèle et sa prospection commerciale.
        </div>
        <div style="margin-bottom: 10px">
            Conformément à la Règlementation, le client dispose et peut exercer ses droits d'accès, de rectification, d’effacement, d’opposition,
            à la portabilité, aux informations qui le concernent
            et les faire rectifier en contactant le Président de Samakeur, par envoi d'un courrier électronique ou postal, dans un délai d’une semaine.
        </div>

    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">O. Article 15 : Enregistrement du contrat</div>
    <div>
        Le présent contrat n’est soumis à enregistrement que si l’une des parties le désire et dans ce cas à ses frais.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">P.Article 16 : Prise d’effet de la Contrat</div>
    <div>
        Le présent Contrat prendra effet à compter de la signature des parties en présence.
        Fait en deux exemplaires, à :
        <div style="display : inline-flex;">
            <div style="width:600px;border-bottom:.5px  dashed black;"> Le client : {{ $client->prenom}} {{ $client->nom}} </div>
            <div style="width:600px;border-bottom:.5px  dashed black;margin-left:350px">La date : @if($projet->contrat!=null) {{ $projet->update_at}} @endif  </div>
        </div>

        <div style="padding : 5px 10px;margin-top: 30px">
        J'ai lu et j'accepte les termes du présent contrat.        </div>
    </div>


    <div id="footer" class="footer" >
  
<br>
        <div style="border: 1px solid black;padding : 5px 10px;margin-top: 30px">
            Ce document est la propriété de SAMAKEUR. Il ne peut être reproduit, même partiellement, sans autorisation.
        </div>
    </div>

    <p class="end-page" style="text-align: right;margin-top: 10px">
        Page <span class="pagenum"></span>
    </p>

</body>
</html>
