Guzzle est une **bibliothèque PHP** qui sert de client HTTP pour envoyer des requêtes (GET, POST, etc.) vers des APIs ou d’autres services web de façon simple et propre.  Elle remplace avantageusement `curl` brut en offrant une interface orientée objet, la gestion des headers, du JSON, des erreurs, et même des requêtes asynchrones.[2][3][4]

## À quoi ça sert concrètement ?
- Consommer des APIs REST (par exemple appeler une API de paiement, SMS, géolocalisation, etc.).[3][4]
- Envoyer des requêtes HTTP avec paramètres, headers, authentification, et lire facilement la réponse (status, body, headers).[4][3]
- Gérer des cas avancés : timeouts, retries, upload/download de gros fichiers, cookies, etc.[7][4]

## Exemple simple en PHP
```php
use GuzzleHttp\Client;

$client = new Client([
    'base_uri' => 'https://api.github.com',
]);

$response = $client->request('GET', '/repos/guzzle/guzzle');

echo $response->getStatusCode();      // 200
echo $response->getBody();            // JSON de la réponse
```

Cet exemple montre comment faire un appel GET propre vers une API et récupérer la réponse sans se battre avec `curl`.[5][4]

[1](https://guzzle3.readthedocs.io/http-client/client.html)
[2](https://guzzle3.readthedocs.io)
[3](https://www.sitepoint.com/guzzle-php-http-client/)
[4](https://github.com/guzzle/guzzle)
[5](https://stackoverflow.com/questions/61358864/how-to-use-guzzle-http-client-in-simple-php)
[6](https://phpguzzle.org/fr/)
[7](https://docs.guzzlephp.org)
[8](https://www.phpguzzle.org/fr/)
[9](https://docs.guzzlephp.org/en/5.3/)
[10](https://www.gladir.com/CODER/PHP/guzzle.htm)