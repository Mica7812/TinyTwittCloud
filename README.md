# TinyTwittCloud Project

Contribuants : **Mica Ménard, Robin Wibaux et Quentin LeGouvello**


## Le projet

Ce projet consiste à créer une application web pouvant potentiellement passer à l'échelle (scalability). Le but est de créer une plateforme pouvant (avec des fonds suffisants) supporter des millions d'utilisateurs simultanés, à la manière de Twitter ou Facebook.
L'objectif de ce projet est d'émuler une application web similaire à Twitter.

Le modèle sur lequel se base ce projet est celui du publieur-abonné (publisher-subscriber). Ce modèle décrit des situations typiques de microblogging, dans lesquelles un nombre n de publieurs génèrent des messages lisibles pour un nombre équivalent d'abonnés.

Le modèle de base de données relationelle ne permet pas de supporter le modèle publieur-abonné. Pour remedier à ce problème, Google a proposé le Datastore, une base de données NoSQL stockant les données de manière ordonnées et permettant d'effectuer des "merge joins" à l'aide de clés. Ces clés permettent d'attribuer des propriétés parent/enfant aux entités de la base données afin de faciliter l'accès.

Voici comment nous avons implémenté cette architecture. 

![Modèle](https://github.com/Mica7812/TinyTwittCloud/blob/master/model.png)

Nous avons utilisé l'API Google Cloud Endpoints ansi que le Google Datastore. Les étiquettes indiquées ci-dessus représentent les entités de notre datastore.

Nous avons une entité *User* qui est le parent de *UserIndex* et de *Tweet*. 

Chaque utilisateur est unique et peut être créer avec [l'interface API suivante](https://apis-explorer.appspot.com/apis-explorer/?base=https://tinytwittcloudpr-1512468252062.appspot.com/_ah/api#p/myapi/v1/myapi.user.insert).

À chaque utilisateur est associé un UserIndex contenant une liste d'un de maximum de 5000 abonnés. Ainsi, une entité *User* ayant 100 000 abonnés aura au moins 20 entités enfantes *UserIndex*.

Un Tweet est unique et a pour parent une instance unique de *User*. Ainsi, le temps de post d'un tweet pour un nombre n d'abonnés est constant.

## Implémentation

Cette architecture a été implémentée sur la plateforme Google App Engine et Google Cloud Endpoints (lisant et écrivant sur le Datastore). Cette implémentation s'est déroulée en deux étapes. La première étant l'interface API, côté serveur et l'interface client.

Ce projet utilise **python 2.7** (interface API Google Cloud Endpoints) et **Angular 5.0** pour l'interface client.

## L'Interface API

L'interface API a été implémentée en python et correspond au fichier [main.py](https://github.com/Mica7812/TinyTwittCloud/blob/master/main.py). Elle donne accès à des *endpoints* permettant de créer des instances de *User*, *UserIndex* et *Tweet* ainsi que de lire de telles instances.

La librarie [endpoints-proto-datastore](https://github.com/GoogleCloudPlatform/endpoints-proto-datastore) a été utilisée.


### Comment un Tweet est ajouté?

Comme mentioné précédemment, le post d'un Tweet se fait en temps constant puisque le processus est indépendant du nombre d'abonnés. Un tweet est posté par l'intermédiaire de [cet endpoint](https://apis-explorer.appspot.com/apis-explorer/?base=https://tinytwittcloudpr-1512468252062.appspot.com/_ah/api#p/myapi/v1/myapi.tweet.insert).


### Comment les Tweets d'un utilisateur sont-ils lus?

La lecture des tweets d'un utilisateur est simple. Celle-ci est réalisée à partir de l'[endpoint suivant](https://apis-explorer.appspot.com/apis-explorer/?base=https://tinytwittcloudpr-1512468252062.appspot.com/_ah/api#p/myapi/v1/myapi.tweet.list). Cette méthode prend en paramètre le parent *User* des Tweets recherchés. Cette méthode n'accède donc que les entités *Tweet*, sans lire les *User*.

### Comment les Tweets sont-ils lus dans le fil d'actualité d'un abonné?

La lecture des tweets reçus par un abonné est cependant plus complexe. Celle-ci requiert l'accès au parent de chaque *UserIndex* (le *User* en question) qui contient l'id de l'abonné, effectué par [cet endpoint](https://apis-explorer.appspot.com/apis-explorer/?base=https://tinytwittcloudpr-1512468252062.appspot.com/_ah/api#p/myapi/v1/myapi.userindex.follower).

Une fois que les parents sont obtenus, une lecture des Tweets ayant ce parent est effectuée. Ce processus nécessite donc deux transactions.

## L'Interface Client

L'interface client a été codée en Angular 5.0. Angular utilise Typescript qui est ensuite compilé en Javascript pour créer l'interface client.

Cette interface est celle utilisée par [notre application](https://tinytwittcloudpr-1512468252062.appspot.com/).

[La page d'accueil](https://tinytwittcloudpr-1512468252062.appspot.com/) de notre application permet de poster un tweet avec un utilisateur préselectionné (avec un nombre d'abonnés spécifique).

[La page User](https://tinytwittcloudpr-1512468252062.appspot.com/user) permet de sélectionner un utilisateur afin de consulter ces tweets.

[La page Followers](https://tinytwittcloudpr-1512468252062.appspot.com/user) permet de sélectionner un utilisateur et de consulter son fil d'actualités (c'est-à-dire la liste des 100 derniers tweets des utilisateurs auxquels celui-ci est abonné).

## Exécuter l'interface client Angular

Il est possible d'exécuter l'interface client Angular localement. Voici comment procéder:

### Installer npm

Angular nécessite npm pour fonctionner. Suivre les instructions de la [documentation](https://www.npmjs.com/get-npm).

### Installer Angular CLI

Une fois npm installé, il suffit d'installer Angular CLI. Suivre les instructions de la [documentation](https://www.npmjs.com/package/@angular/cli).

### Lancer le serveur local

Cloner le projet et se déplacer dans le dossier primaire.

Exécuter la commande `npm install` afin d'installer les librairies requises.

Exécuter `ng serve --open` afin de lancer le serveur local.

## Temps d'exécution des requêtes HTTP

Chaque temps est une moyenne sur 30 mesures. (écart-type , variance)

### Temps d'exécution des ajouts de tweets :
Ajout d'un tweet avec un compte ayant :
- 100 followers : 167.27ms    (41.39 , 1712.8)
- 1000 followers : 159.53ms    (39.9 , 1592.33)
- 5000 followers : 188.17ms    (105.95 , 11225)

### Temps d'exécution de l'affichage des tweets :
Affichage de 10 tweets depuis un compte ayant :
- 100 followers : 162.00ms    (42.94 , 1844.07)
- 1000 followers : 143.73ms    (39.91 , 1592.96)
- 5000 followers : 159.93ms    (31.32 , 981.24)

Affichage de 50 tweets depuis un compte ayant :
- 100 followers : 213.93ms    (49.02 , 2402.82)
- 1000 followers : 193.23ms    (82.59 , 6821.43)
- 5000 followers : 244.43ms    (47.52 , 2257.91)

Affichage de 100 tweets depuis un compte ayant :
- 100 followers : 306.57ms    (55.84 , 3118.32)
- 1000 followers : 300.87ms    (50.5 , 2550.28)
- 5000 followers : 299.83ms    (47.41 , 2247.57)

