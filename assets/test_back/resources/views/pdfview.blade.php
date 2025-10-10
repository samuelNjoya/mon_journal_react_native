<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Facture</title>
    <link rel="stylesheet" href="style.css" media="all" />
    <style>
        .clearfix:after {
  content: "";
  display: table;
  clear: both;
}

a {
  color: #5D6975;
  text-decoration: underline;
}

body {
  position: relative;
  width: 19cm;
  height: 19.7cm;
  margin: 0 auto;
  color: #001028;
  background: #FFFFFF;
  font-family: Arial, sans-serif;
  font-size: 12px;
  font-family: Arial;
}

header {
  /*padding: 10px 0;*/
  margin-bottom: 30px;
}

#logo {
  text-align: left;
  margin-bottom: 10px;
}

#logo img {
  width: 150px;
}

h1 {
  border-top: 1px solid  #5D6975;
  border-bottom: 1px solid  #5D6975;
  color: #5D6975;
  font-size: 2.4em;
  line-height: 1.4em;
  font-weight: normal;
  text-align: center;
  margin: 0 0 20px 0;
  background: url("{{asset('dimension.png')}}");
}

.project {
  float: left;
}

.project span {
  color: #5D6975;
  text-align: left;
  margin-right: 10px;
  display: inline-block;
  font-size: 0.8em;
}

#company {
  float: right;
  text-align: right;
}

.project div,
#company div {
  white-space: nowrap;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 20px;
}

/*table tr:nth-child(2n-1) td {
  background: #F5F5F5;
}

table th,
table td {
  text-align: center;
}*/

table th {
  padding: 5px 10px;
  color: #5D6975;
  border-bottom: 1px solid #C1CED9;
  white-space: nowrap;
  font-weight: normal;
}

table .service,
table .desc {
  text-align: left;
}

table td {
  padding: 18px;
  text-align: left;
}

table td.service,
table td.desc {
  vertical-align: top;
}


#notices .notice {
  color: #5D6975;
  font-size: 1em;
}

    </style>
  </head>
  <body>
    @if ($params["error"])
        <h1>Une erreur est survenue lors du chargement des données</h1>
        <h6>{{$params["msg"]}}</h6>
    @else
    <header class="clearfix">
        <div id="logo">
            <?php
            $path = 'sesame_logo.png';
            $type = pathinfo($path, PATHINFO_EXTENSION);
            $data = file_get_contents($path);
            $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
            ?>
          <img src="<?php echo $base64?>" alt="logo" style="width: 70px;">
        </div>
        <h1>{{$params["code_op"]}}</h1>
        <!--div id="company" class="clearfix">
          <div><b>SESAME FINANCIAL SERVICES S.A</b></div>
        </div-->

      </header>
      <main>
        <table>
          <thead>
            <tr>
              <th class="service">EXPEDITEUR</th>
              <th class="desc">BENEFICIAIRE</th>
              <th class="desc">TRANSACTION</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="service">
                <div class="project">
                    <div><span>Nom:</span>{{$params["emetteur_firstname"]}}</div>
                </div>
              </td>
              <td class="desc">
                <div class="project">
                    <div><span>Nom:</span>{{$params["beneficiaire_firstname"]}}</div>

                </div>
              </td>
              <td class="desc">
                <div class="project">
                    <div><span>N° Transaction:</span><br/><b style="font-size: 1.5em">{{$params["code_op"]}}</b></div>
                </div>
              </td>
              <!--td colspan="2" class="unit">{{$params["montant"]}} XAF</td  -->
            </tr>
            <tr>
                <td>
                    <div class="project">
                        <div><span>Prenom:</span>{{$params["emetteur_lastname"]}}</div>
                    </div>
                </td>
                <td>
                    <div class="project">
                        <div><span>Prenom:</span>{{$params["beneficiaire_lastname"]}}</div>
                    </div>
                </td>
                <td>
                    <div class="project">
                        <div style="padding-top: 5px"><span>Montant envoyé:</span>{{$params["montant"]}} XAF</div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="project">
                        <div><span>Téléphone: </span>{{$params["emetteur_phone_number"]}}</div>
                    </div>
                </td>
                <td>

                    <div class="project">
                        <div><span>Pays:</span>Cameroun</div>
                    </div>
                </td>
                <td>
                    <div class="project">
                        <div><span>Frais de transfert:</span>{{$params["frais"]}} XAF</div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="project">
                        <div><span>Effectué le:</span>{{$params["operation_date"]}}</div>
                    </div>
                </td>
                <td>

                    <div class="project">
                        <div><span>Telephone:</span>{{$params["phone_number"]}}</div>
                    </div>
                </td>
                <td>
                    <div class="project">
                        <div><span>Taxes:</span>0 XAF</div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="project">
                        <div><span>Facturé le:</span>{{$params["bill_date"]}}</div>
                    </div>
                </td>
                <td>

                    <div class="project">
                        <div><span>Type pièce d'identité:</span>{{$params["identification"]}}</div>
                    </div>
                </td>
                <td>

                </td>
            </tr>
            <tr>
                <td></td>
                <td>

                    <div class="project">
                        <div><span>N° pièce d'identité:</span>{{$params["identification_number"]}}</div>
                    </div>
                </td>
                <td>

                </td>
            </tr>
            <tr style="border-top: 1px solid;">
                <td></td>
                <td></td>
                <td>
                    <div class="project">
                        <div><span>TOTAL TTC:</span>{{$params["montant_total"]}} XAF</div>
                    </div>
                </td>
            </tr>
            <!--tr>
              <td colspan="3">COMMISSIONS</td>
              <td class="total" colspan="2">{{$params["commission"]}} XAF</td>
            </tr>
            <tr>
              <td colspan="3" class="grand total">TOTAL</td>
              <td class="grand total" colspan="2">{{$params["montant_total"]}} XAF</td>
            </tr-->
          </tbody>
        </table>
        <div id="notices">
          <div>NOTICE:</div>
          <div class="notice">En cas de problème veuillez contacter le service client au numéro (237) 6 50 78 79 87</div>
        </div>
      </main>
    @endif

  </body>
</html>
