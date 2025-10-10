<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>SesamPayx</title>

    <!-- Styles -->
    <style>
        html, body {
            background-color: #fff;
            color: #636b6f;
            font-family: 'Nunito', sans-serif;
            font-weight: 200;
            height: 100vh;
            margin: 0;
        }

        .full-height {
            height: 100vh;
        }

        .flex-center {
            align-items: center;
            display: flex;
            justify-content: center;
        }

        .position-ref {
            position: relative;
        }

        .top-right {
            position: absolute;
            right: 10px;
            top: 18px;
        }

        .content {
            text-align: center;
        }

        .title {
            font-size: 84px;
        }

        .links > a {
            color: #636b6f;
            padding: 0 25px;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: .1rem;
            text-decoration: none;
            text-transform: uppercase;
        }

        .m-b-md {
            margin-bottom: 30px;
            padding: 24px;
        }

        .btn{
            background-color: #fddb2c;
            padding: 12px;
            border: 0.5px solid #fddb2c;
            text-decoration: none;
            color: black;
        }
    </style>
</head>
<body>
<div class="flex-center position-ref full-height">

    <div class="content">
        <a href="{{env('WEBCLIENT_URL')}}" style="float: left; padding:6px;"><- Retour à la page d'accueil</a>
        @if ($status==1)
            <a href="{{'pdfview?'.'code_op='.app('request')->input('code_operation')}}&download=" style="float: right; padding:6px;">Telecharger les details</a>
        @endif

        <div class="m-b-md" style="border: 1px solid {{$status==1?'green':'red'}}">

            <img src="{{asset('logo_sesampayx.png')}}" style="width: 70px;">
            <h3 class="kt-login__title" style="color: #000000;font-weight: bold;">{{$status==1?$output:$output}}</h3>
            @if ($status==1)
                <a class="btn" href="{{'pdfview?'.'code_op='.app('request')->input('code_operation')}}">Voir les details</a>
            @endif
        </div>
    </div>
</div>
<footer>
    Pour toutes reclammations veuillez-nous contacter au (+237)670034545 ou par Email à l'adresse ba.serviceclient@sesamefinance.com
</footer>
</body>
</html>
