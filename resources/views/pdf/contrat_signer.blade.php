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

            <span style="margin-left: 20px"> Num??ro carte d'identit??.</span>
            <span style="margin-left: 20px"> {{ $client->nci}}</span>
        </div>
    </div>
    <div style="margin-top: 10px">
        <!-- <div>
            <span>La soci??t??</span>

            <span style="color: #F7941D;font-weight: bold;margin-left: 30px">Socite_du_client</span>

            <span style="margin-left: 20px">n?? RCS <span style="color: #F7941D;font-weight: bold">data_du_client</span></span>
        </div> -->
    </div>

    <div class="font-italic" style="margin: 20px 0px;font-size: 15px;font-style: italic">
        (pr??ciser les pr??nom, nom et qualit?? du repr??sentant de la soci??t??)
    </div>

    <div style="margin-top: 10px">
        <span>Adresse</span>

        <span style="color: #F7941D;font-weight: bold;margin-left: 20px">{{$client->adresse_complet}}</span>

        <span style="margin-left: 20px">T??l??phone</span>

        <span style="color: #F7941D;font-weight: bold;margin-left: 20px">{{$client->telephone}}</span>

        <div>
            <span>Couriel</span>

            <span style="color: #F7941D;font-weight: bold;margin-left: 20px">{{$client->email}}</span>
        </div>
    </div>


    <div style="color: #F7941D;font-size: 20px;margin-top: 30px">Samakeur</div>

    <div style="margin-top: 10px">
        <span>La societe</span>

        <span style="color: #F7941D;font-weight: bold;margin-left: 20px">SAMAKEUR, </span> <span>repr??sent?? par Moussa DANFAKHA g??rant de la soci??t??</span>
    </div>

    <div class="font-italic" style="margin: 20px 0px;font-size: 15px;font-style: italic">
        (pr??ciser les pr??nom, nom et qualit?? du repr??sentant de la soci??t??)
    </div>

    <div style="margin-top: 10px">
        <span>Adresse</span>


        <span style="color: #F7941D;font-weight: bold;margin-left: 13px">Villa n?? 66, Rue HS18 quartier Hersent Thi??s (SENEGAL)</span>

        <span style="margin-left: 10px">T??l??phone</span>


        <span style="color: #F7941D;font-weight: bold;margin-left: 10px">+221 78 178 93 83</span>


        <div style="margin-top: 10px">
            <span>Couriel</span>

            <span style="color: #F7941D;font-weight: bold;margin-left: 20px">admin@samakeur.sn</span>
        </div>
    </div>

    <div style="margin: 20px 0px">
        Conform??ment aux dispositions, qui font obligation de recourir ?? une convention ??crite pr??alable ?? <br>
        tout engagement professionnel, il est convenu ce qui suit :
    </div>
    <br><br>
    <div style="display: inline-flex;margin-top: 20px">
        <div style="background-color: #F7941D!important;width: 20px;height: 20px;line-height: 20px;color: white;text-align: center;margin-right: 10px;">2</div>
        <span style="font-size: 16px;font-weight: 600;color: #F7941D;margin-left: 30px">DESIGNATION DE L???OPERATION</span>
    </div>

    <div style="margin-top: 10px">
        <span>Adresse du terrain : </span>

        <span style="color: #F7941D;font-weight: bold;margin-left: 20px">{{$projet->adresse_terrain}}</span>

        <span style="margin-left: 40px">R??f??rences cadastrales : </span>

        <span style="color: #F7941D;font-weight: bold;margin-left: 20px">.........................................</span>



        <div style="margin-top: 10px">
            <span>Surface fonci??re du terrain : </span>

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

    <div style="margin-top: 20px">Cette mission est ??tablie sur la base des ??l??ments de programmation du client.</div>

    <div style="margin-top: 20px">
        Le client dispose d'une enveloppe financi??re pour les travaux. <br>
        Il est inform?? que ce montant est ind??pendant du montant des honoraires de Samakeur, et que <br>
        d???autres d??penses, dont la liste figure en annexe dans le programme, seront ?? sa charge. <br>
    </div>

    <div style="color: #F7941D;font-size: 16px;margin-top: 20px">Contenu de la mission</div>

    <div style="margin-top: 20px">
        Samakeur analyse le programme fourni par le client, visite les lieux s???il le juge n??cessaire et prend
        connaissance des donn??es juridiques, techniques et financi??res qui lui sont communiqu??es par le
        client. Ces donn??es comprennent notamment les titres de propri??t??, les lev??s de g??om??tre et les
        relev??s des existants, le cas ??ch??ant. Samakeur ??met toutes les observations et propositions qui lui
        semblent utiles
    </div>

    <div style="margin-top: 20px">
        Il ??tablit les ??tudes pr??liminaires qui ont pour objet de v??rifier la constructibilit?? de l???op??ration au
        regard des r??gles d???urbanisme, de v??rifier sa faisabilit??, d?????tablir une esquisse, ou au maximum deux
        esquisses du projet r??pondant au programme
    </div>


    <div style="margin-top: 20px">
        Le niveau de d??finition de l???esquisse correspond g??n??ralement ?? des documents graphiques ??tablis ??
        l?????chelle de 1/100 (1cm/m) ou ??? 1/200 (?? cm/m).
    </div>

    <div style="margin-top: 20px">
        Les documents graphiques sont ??tablis : <br>
        sur support informatique modifiable (3 fois au maximum) par samakeur : Les requ??tes du client sont
        ?? transmettre dans son espace client sous un d??lai de 15 jours ?? partir de la date de d??p??t du plan
        avec le dernier indice. Il est clairement pr??cis?? que l???ajout de pi??ces correspond ?? un nouveau
        programme et ne peut en aucun cas ??tre consid??r?? comme une modification.
    </div>

    <div style="color: #F7941D;font-size: 16px;margin-top: 20px">D??lai de r??alisation de la mission</div>

    <div style="margin-top: 20px">
        <div style="display: inline-flex;">
            <div style="background-color: #999C9F!important;width: 30px;height: 20px;line-height: 20px;color: white;text-align: center;margin-right: 10px;">20</div>
            <div class="" style="margin-left: 40px">jours ouvrables ?? compter de la date de signature du pr??sent contrat</div>
        </div>
    </div>

    <div style="margin-top: 10px">
        <div style="display: inline-flex;">
            <div style="background-color: #999C9F!important;width: 30px;height: 20px;line-height: 20px;color: white;text-align: center;margin-right: 10px;">5</div>
            <div class="" style="margin-left: 40px">jours ouvrables ?? compter de la demande de modification du plan.</div>
        </div>
    </div>

    <div style="margin-top: 20px">
        <div style="display: inline-flex;">
            <div style="background-color: #F7941D!important;width: 20px;height: 20px;line-height: 20px;color: white;text-align: center;margin-right: 10px;">4</div>
            <div style="font-size: 16px;font-weight: 600;color: #F7941D;margin-left: 30px">REMUNERATION </div>
        </div>
    </div>

    <div style="margin-top: 20px">
        Pour la mission qui lui est confi??e, samakeur per??oit une r??mun??ration forfaitaire de
        <span style="color: #F7941D;font-size: 16px;margin-top: 30px"> charger la somme rentr??e par l???administrateur lors de la validation de la demande </span> . {{ $projet->montant }} Fcfa
    </div>


    <div style="margin-top: 20px">
        <div style="display: inline-flex;">
            <div style="background-color: #F7941D!important;width: 20px;height: 20px;line-height: 20px;color: white;text-align: center;margin-right: 10px;">5</div>
            <div style="font-size: 16px;font-weight: 600;color: #F7941D;margin-left: 30px">R??ALISATION DU PROJET - POURSUITE DE LA MISSION </div>
        </div>
    </div>

    <div style="margin-top: 20px">
        Si le client donne suite au projet ??tabli par Samakeur, un nouveau contrat contractuel est pass?? entre
        eux pour la poursuite de la mission en suivi de chantier ou r??alisation des travaux. Le contenu des
        ??tudes pr??liminaires est alors int??gr?? dans ce nouveau contrat et son co??t est d??duit du montant
        global des honoraires pr??vus pour la mission confi??e
    </div>

    <div style="margin-top: 20px">
        Dans tous les cas, Samakeur conserve la propri??t?? intellectuelle et artistique de son ??uvre,
        conform??ment aux articles L111-1 et suivants du code de la propri??t?? intellectuelle.
    </div>

    <div style="color: #F7941D;font-size: 30px;text-align: center;margin: 40px 0px;">Conditions g??n??rales du pr??sent contrat</div>


    {{--    ici les textes--}}

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">A.Article 1 : Objet de la pr??sente section</div>
    <div>Samakeur r??alisera pour le Client la prestation pr??vue Dans les parties description de la demande rentr??es par le client.
        <br>
        Les prestations ?? fournir par Samakeur ont ??t?? pr??alablement ??tablies sur le site et accept??es par ce dernier.
        Elles sont d??taill??es, notamment pour ce qui concerne la m??thodologie employ??e, mais aussi le d??roulement temporel, respectivement dans la section
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">B.Article 2 : Collaboration</div>
    <div>
        Les parties s'engagent ?? assurer une ??troite collaboration afin de v??rifier, aussi souvent que l???une d'elles le jugera n??cessaire,
        l???ad??quation entre la prestation fournie et les besoins du client, tels qu???ils ont ??t?? d??finis pr??c??demment.
        <br>
        Dans l???hypoth??se o?? l???une des deux parties consid??rerait que la mission ne s???ex??cute plus conform??ment aux conditions initiales,
        celles-ci conviendront de se rapprocher afin d???examiner les possibilit??s d???adaptation du Contrat. En cas de d??saccord persistant rendant
        impossible la poursuite de l?????tude, le Contrat pourra ??tre rompu ?? l???initiative de l???une ou l???autre partie selon les conditions et modalit??s pr??vues ?? l???article 10.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">C.Article 3 : Responsabilit??s</div>
    <div>
        Toute inex??cution de l???une des obligations vis??es au pr??sent Contrat engage la responsabilit?? de son auteur. Compte tenu tant de
        la nature de la mission que de la sp??cificit?? de Samakeur, il convient de rappeler que Samakeur n'est tenue qu'?? une obligation de moyen. Elle mettra donc en ??uvre
        tout son savoir-faire et tous les moyens n??cessaires ?? l???ex??cution de la mission qui lui est confi??e par le pr??sent Contrat.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">D.Article 4 : D??lais de r??alisation</div>
    <div>
        Le d??lai de r??alisation de l?????tude est pr??cis?? dans la section ??CONDITIONS DE REALISATION DE LA MISSION ??.
        L?????tude d??bute ?? la signature du pr??sent Contrat sauf cas de force majeure ou cause imputable au Client et sous r??serve de
        r??ception de l???acompte ??ventuellement pr??vu avant la date d?????ch??ance de la facture, ainsi que sous r??serve de r??ception des ??l??ments
        n??cessaires ?? la r??alisation de l?????tude tels que mentionn??s plus t??t.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">E.Article 5 : Budget</div>
    <div>
        Le prix de l'??tude r??alis??e par Samakeur dans le cadre du pr??sent Contrat est fix?? d???un commun accord et est pr??cis?? dans la section ?? REMUNERATION ??.
        <br>
        Les autres frais engag??s pour la r??alisation de cette ??tude ainsi que les frais de t??l??phone et de d??placements sont ?? la charge du Client.
        Ces autres frais seront refactur??s au r??el sur pr??sentation des justificatifs.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">F.Article 6 : Conditions de paiement</div>
    <div>
        <div style="font-weight: 500;font-size: 17px;">Prix ?? payer</div>
        <div style="margin-bottom: 10px">
            Conform??ment au Contrat, le Client s???engage ?? r??gler ?? Samakeur le montant d??fini ?? l'article 5 selon les modalit??s de
            l?????ch??ancier et avant ??ch??ance de la facture correspondante.
        </div>

        <div style="font-weight: 500;font-size: 17px;">Conditions de paiement</div>
        <div style="margin-bottom: 10px">
            Le Client s???engage ?? effectuer le paiement ?? Samakeur en ligne.Le montant est donn?? ?? la section La facture qui leur est associ??e sera transmise par mail.
            En cas de retard de paiement, conform??ment ?? la loi 2008-776 du 4 ao??t 2008, il sera appliqu?? des p??nalit??s au taux de 3 fois le taux d'int??r??t l??gal
            en vigueur et en application des articles L441-3 et L441- 6 du code de commerce, il sera appliqu?? une indemnit?? de recouvrement de 40 ???. Le d??lai de retard
            pouvant en outre ??tre ajout?? au d??lai de r??alisation tel que d??fini dans l'article 4. En cas de non- paiement,
            Samakeur se r??serve le droit de faire appel au tribunal comp??tent tel que d??fini dans l???article 13.
        </div>

        <div style="margin-bottom: 10px">
            Dans l'hypoth??se o?? la mission confi??e par le client cesserait ?? la seule initiative de Samakeur, Samakeur s'engage ?? rembourser au client l'int??gralit?? de l'acompte vers??.
        </div>

        <div style="margin-bottom: 10px">
            Dans l'hypoth??se o?? la mission cesserait de la seule initiative du client, le montant d?? par le client sera calcul?? au prorata
            du travail effectu??. Dans le cas o?? le montant de prestations effectu??es serait inf??rieur ?? celui de l'acompte vers??, Samakeur
            s'engage ?? reverser la diff??rence au client. Dans le cas contraire,
            le client devra verser ?? Samakeur la diff??rence entre l'acompte vers?? et le montant des travaux effectu??s.
        </div>

        <div style="margin-bottom: 10px">
            Dans l???hypoth??se o?? la mission confi??e cesserait d???un commun accord, les parties au pr??sent Contrat r??gleront de mani??re amiable le sort des sommes per??ues par Samakeur.
        </div>

        <div style="margin-bottom: 10px">
            Toute rupture du pr??sent Contrat doit respecter les termes de l'article 10.
        </div>

        <div style="margin-bottom: 10px">
            Clause p??nale : <br>
            En cas de retard de paiement ?? l?????ch??ance, des int??r??ts de retard au taux annuel de 12 % sur le montant impay?? seront dus de plein droit, sans mise en demeure pr??alable.
        </div>

    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">F.Article 6 : Conditions de paiement</div>
    <div>
        Au cours de la p??riode de modification de 15 jours, tout motif d???insatisfaction du Client portant sur un ??l??ment du
        cahier des charges d??fini pr??c??demment devra ??tre pris en compte par Samakeur, qui s???engage ?? commencer la
        correction des prestations sous quinze jours ouvr??s, tout en fournissant au pr??alable une estimation de la dur??e des travaux.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">H.Article 8 : Force majeure</div>
    <div>
        En cas de force majeure, la partie emp??ch??e verra ses obligations suspendues pendant la dur??e de la force majeure.
        La partie emp??ch??e doit en aviser imm??diatement l'autre partie par lettre recommand??e avec accus?? de r??ception.
        La partie emp??ch??e informera ??galement des dispositions palliatives qu'elle a prises ou se propose de prendre.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">I. Article 9 : Modifications</div>
    <div>
        Le pr??sent Contrat ne pourra ??tre modifi?? qu'apr??s accord ??crit entre les parties. <br>
        Toute modification de la part de l???une des deux parties, de l???objet de l?????tude, du budget pr??visionnel,
        de l'??ch??ancier pr??visionnel, de la m??thodologie ou de toute autre disposition du pr??sent Contrat devra faire l???objet d???un Avenant.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">J. Article 10 : R??siliation</div>
    <div>
        Toute r??siliation par l???une des parties se fera par lettre recommand??e avec accus?? de r??ception, pr??c??d??e
        en cas de non-respect par l???une des parties des obligations pr??vues par le pr??sent Contrat, d???une mise en demeure de se conformer auxdites obligations. La partie ne pourra proc??der
        ?? la r??siliation du Contrat que pass?? un d??lai de 15 jours apr??s notification par lettre recommand??e avec accus?? de r??ception ?? l'autre partie.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">K.Article 11 : Confidentialit??</div>
    <div>
        Tous les membres de Samakeur seront tenus au secret le plus absolu et s???engagent ?? ne communiquer ?? des tiers,
        sans une autorisation expresse du Client, aucune indication sur les travaux effectu??s ni aucune information qu???ils pourraient recueillir du fait de leur mission pour le Client.
        Ceci ?? l'exception d'une utilisation p??dagogique des renseignements et documents ayant un rapport avec l'??tude, utilisation faite avec l'accord ??crit du Client.

        <div style="margin-bottom: 10px">
            La confidentialit?? touche notamment :
        </div>

        <div style="margin-bottom: 10px">
            <div> <span class="color: #F7941D">*</span> Toute information transmise par le Client,</div>
            <div> <span class="color: #F7941D">*</span> Les rapports, travaux, ??tudes, r??sultats de la mission.</div>
        </div>

    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">L.Article 12 : Propri??t?? de l?????tude</div>
    <div>
        L'ensemble des techniques et m??thodes de recherche demeure la propri??t?? de Samakeur et ne pourra faire l'objet d'aucune utilisation ou reproduction sans accord express.
        <br>
        L???ensemble des travaux techniques et m??thodologiques n??cessaires ?? la r??alisation de l?????tude demeure toutefois
        la propri??t?? exclusive de Samakeur jusqu???au paiement global de l?????tude, apr??s quoi le r??sultat de l?????tude sera la propri??t?? exclusive du Client.
        <br>
        Samakeur, en accord avec le Client, archivera les donn??es concernant l?????tude sur support informatique et papier.
        Cependant, aucune utilisation ou reproduction des travaux ou ??tudes ne pourra se faire sans l???autorisation ??crite du Client.
        Le client pourra exploiter ou faire exploiter les r??sultats de l'??tude sans aucune r??mun??ration au profit de Samakeur autre que celle mentionn??e dans l???article 5 du pr??sent Contrat.
        Samakeur se r??serve le droit d'utiliser le nom et le logo du client ?? titre de r??f??rence.

    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">M. Article 13 : Litiges et tribunaux comp??tents</div>
    <div>
        Le pr??sent Contrat est soumis au droit fran??ais. En cas de litige relatif ?? l'interpr??tation,
        l'ex??cution ou la fin du pr??sent Contrat, les parties s???engagent ?? rechercher, avant tout recours contentieux, une solution ?? l'amiable.
        <br>
        En cas de d??saccord persistant, le litige sera port?? devant la juridiction d'instance comp??tente dont d??pend le si??ge de Samakeur.

    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">N.Article 14 : Loi Informatique et Libert??s</div>
    <div>
        <div style="margin-bottom: 10px">
            Les termes ?? donn??es ?? caract??re personnel ??, ?? traiter/traitement ??, ?? responsable du traitement ??, ?? sous traitement ??
            ont la m??me signification que celle qui leur est donn??e par la Loi
            ?? Informatique et Libert??s ?? du 6 janvier 1978, ainsi que par tout R??glement europ??en d??s ce dernier applicable, ci-apr??s d??nomm??s ?? la R??glementation ??.
        </div>
        <div style="margin-bottom: 10px">
            Les donn??es r??colt??es et transmises au client au cours de cette ??tude peuvent ??tre nominatives et ?? destination
            du client. Chacune des Parties d??clare faire son affaire des diverses d??clarations et/ou mesures exig??es par la R??glementation dans le cadre de la mise en ??uvre des
            traitements de donn??es ?? caract??re personnel. Samakeur ne saurait ??tre tenue responsable d'un quelconque manquement du client aux obligations qui lui incombent.
        </div>
        <div style="margin-bottom: 10px">
            Les informations relatives au client font l'objet d'un traitement informatique et sont destin??es
            ?? Samakeur et trait??es par le Pr??sident pour la gestion de sa client??le et sa prospection commerciale.
        </div>
        <div style="margin-bottom: 10px">
            Conform??ment ?? la R??glementation, le client dispose et peut exercer ses droits d'acc??s, de rectification, d???effacement, d???opposition,
            ?? la portabilit??, aux informations qui le concernent
            et les faire rectifier en contactant le Pr??sident de Samakeur, par envoi d'un courrier ??lectronique ou postal, dans un d??lai d???une semaine.
        </div>

    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">O. Article 15 : Enregistrement du contrat</div>
    <div>
        Le pr??sent contrat n???est soumis ?? enregistrement que si l???une des parties le d??sire et dans ce cas ?? ses frais.
    </div>

    <div style="font-weight: 600;font-size: 20px;margin: 10px 0px;">P.Article 16 : Prise d???effet de la Contrat</div>
    <div>
        Le pr??sent Contrat prendra effet ?? compter de la signature des parties en pr??sence.
        Fait en deux exemplaires, ?? :
        <div style="display : inline-flex;">
            <div style="width:600px;border-bottom:.5px  dashed black;"> Le client : {{ $client->prenom}} {{ $client->nom}} </div>
            <div style="width:600px;border-bottom:.5px  dashed black;margin-left:350px">La date : @if($projet->contrat!=null) {{ $projet->update_at}} @endif  </div>
        </div>

        <div style="padding : 5px 10px;margin-top: 30px">
        J'ai lu et j'accepte les termes du pr??sent contrat.        </div>
    </div>


    <div id="footer" class="footer" >
  
<br>
        <div style="border: 1px solid black;padding : 5px 10px;margin-top: 30px">
            Ce document est la propri??t?? de SAMAKEUR. Il ne peut ??tre reproduit, m??me partiellement, sans autorisation.
        </div>
    </div>

    <p class="end-page" style="text-align: right;margin-top: 10px">
        Page <span class="pagenum"></span>
    </p>

</body>
</html>
