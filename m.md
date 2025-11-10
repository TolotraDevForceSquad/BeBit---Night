// MEMOIRE ANCIEN ELEVE L3 - LICENCE3

**UNIVERSITE DE FIANARANTSOA**

**ECOLE NATIONALE D'INFORMATIQUE**

**MEMOIRE DE FIN D'ETUDES POUR L'OBTENTION DU DIPLÔME DE LICENCE PROFESSIONNELLE**

**Mention : INFORMATIQUE**

**Parcours : Informatique Générale**

**CONCEPTION ET DEVELOPPEMENT D'UNE APPLICATION WEB DE GESTION DES NOTES**

Intitulé :  

Présenté le 16 Mars 2020, par :

- Monsieur

**Membres du Jury :**

- **Président  :** Monsieur RAZAFINDRANDRIATSIMANIRY Dieu Donné Michel, Maitre de Conférences.
- **Examinateur :** Monsieur RABETAFIKA Louis Haja, Assistant d'Enseignement Supérieur et de Recherche.
- **Rapporteurs :** Monsieur RABETAFIKA Louis Haja, Assistant d'Enseignement Supérieur et de Recherche.

Monsieur RAKOTONIRINA Janvier Benjamin, Chef du Service de la Scolarité.

Année Universitaire 2018-2019

# CURRICULUM VITAE

**Etat civil et Coordonnées :**

**Formations et Diplôme :**

**2018 - 2019 :** troisième année de licence professionnelle en informatique à l'Ecole Nationale  
d'Informatique, Université de Fianarantsoa.  
**2017 - 2018 :** Deuxième année de licence professionnelle en informatique à l'Ecole Nationale  
d'Informatique, Université de Fianarantsoa.  
**2016 - 2017 :** Première année de licence professionnelle en informatique à l'Ecole Nationale  
d'Informatique, Université de Fianarantsoa.

**2015 - 2016 :** Première année de licence professionnelle en informatique au CNTMAD

**2013-2014 :** Obtention du Baccalauréat Série D au Lycée ACEEM

**Stages et Expériences Professionnelles:**

**2019 :** Mini-projet au sein de l'ENI :  
\- Réalisation d'une application web pour la gestion des stocks avec Asp, Jsp,  
avec la Base de donné MySQL.  
\- Réalisation d'une application Desktop pour la gestion des stocks avec Java  
avec la Base de donné MySQL.

**2018 :** Stage de 3 mois au sein du Ministère des FOP sur « Gestion des flux des dossiers »

**2018 :** Mini-projet au sein de l'ENI :  
\- Supervision réseau à l'aide d'un logiciel appelé « Cacti ».  
\- Réalisation d'une application web pour la gestion des carburants avec PHP et MySQL.  

**2017 :** Mini-projet au sein de l'ENI :  
\- Création d'un site web dynamique avec JavaScript et Html avec CSS.  
\- Création d'un logiciel pour la Gestion des Utilisateurs avec QT.

**Compétences Linguistiques :**

| **Langues** | **Compréhension** | **Expression Orale** | **Expression Ecrite** |
| --- | --- | --- | --- |
| Malagasy | 4   | 4   | 4   |
| Français | 3   | 2   | 3   |
| Anglais | 1   | 1   | 1   |

**Grille d'évaluation** : 1 : Passable **\-** 2 : Assez-Bien - 3 : Bien - 4 : Très Bien

**Divers :**

**Sports :** Football et Pétanque  
**Loisir :** Dessiner, lire

# SOMMAIRE GENERAL

[CURRICULUM VITAE I](#_Toc34144391)

[SOMMAIRE GENERAL III](#_Toc34144392)

[REMERCIEMENTS IV](#_Toc34144393)

[LISTE DES FIGURES V](#_Toc34144394)

[LISTE DES TABLEAUX VII](#_Toc34144395)

[LISTE DES ABBREVIATIONS VIII](#_Toc34144396)

[INTRODUCTION GENERALE 1](#_Toc34144397)

[PREMIERE PARTIE : PRESENTATION 2](#_Toc34144398)

[Chapitre 1 : Présentation de l'ENI 3](#_Toc34144399)

[Chapitre 2 : Description du projet 15](#_Toc34144409)

[DEUXIEME PARTIE : ANALYSE ET CONCEPTION 17](#_Toc34144417)

[Chapitre 3 : Analyse préalable 18](#_Toc34144418)

[Chapitre 4 : ANALYSE CONCEPTUELLE 29](#_Toc34144426)

[Chapitre 5: CONCEPTION DETAILLEE 46](#_Toc34144437)

[TROISEME PARTIE : REALISATION 54](#_Toc34144454)

[Chapitre 6. Mise en place de l'environnement de développement 55](#_Toc34144455)

[Chapitre 7. Développement de l'application 73](#_Toc34144462)

[CONCLUSION GENERALE 86](#_Toc34144468)

[BIBLIOGRAPHIE IX](#_Toc34144469)

[WEBOGRAPHIE X](#_Toc34144470)

[GLOSSAIRES XI](#_Toc34144471)

[TABLE DES MATIERES XII](#_Toc34144472)

[RESUME XV](#_Toc34144473)

[ABSTRACT XV](#_Toc34144474)

# REMERCIEMENTS

Tout d'abord, je tiens à remercier DIEU TOUT PUISSANT de m'avoir aidé et assisté tout au long de la réalisation de mon projet ainsi que de m'avoir donné la force et la santé nécessaire à l'accomplissement de ma formation pratique.

Je tiens à présenter mes sincères remerciements à :

- Monsieur RAFAMANTANANTSOA Fontaine, Professeur, Président de l'Université de Fianarantsoa, d'avoir bien organisé l'année universitaire
- Monsieur RAMAMONJISOA Andriatiana Bertin Olivier, Professeur Titulaire, Directeur de l'Ecole Nationale d'Informatique de m'avoir permis d'effectuer des stages en entreprise pour compléter mes formations académiques.
- Monsieur RABETAFIKA Louis Haja, responsable de mention qui a accepté avec bienveillance d'être mon examinateur,
- Monsieur RAZAFINDRANDRIATSIMANIRY Dieu Donné Michel, qui a accepté avec bienveillance d'être mon président durant cette soutenance.
- Monsieur RALAIVAO Jean Christian mon encadreur pédagogique pour la lecture, le suivis d'état d'avancement de mon mémoire. Son aide, sa disponibilité ainsi que ses précieuses remarques qui ont contribué à améliorer la qualité de ce mémoire.
- Monsieur RAKOTONIRINA Janvier Benjamin, Chef du Service de la Scolarité, qui est aussi mon encadreur professionnel. Il m'a soutenu tout le long du stage et m'a donné toute l'aide nécessaire pour la réalisation de mon projet.

Je profite de cette occasion pour remercier :

- Les personnels enseignants et administratifs de l'Ecole Nationale d'Informatique de m'avoir transmis leurs connaissances.
- Mes parents, pour leurs moraux et psychologiques ainsi que leurs aides financières, qui m'a permis de mener à bien mon étude.
- Mes amis pour leurs conseils, leurs recommandations et leurs aides matérielles car sans eux je n'aurais pas pu arriver jusqu'au bout de mon projet.
- Enfin j'exprime ma profonde gratitude à toutes les personnes qui ont contribués de près ou de loin à la réalisation de notre projet.

# LISTE DES FIGURES

[_Figure 1 : Organigramme actuel de l'Ecole._ 6](#_Toc34983243)

[_Figure 2:Présentation de PostGreSQL_ 22](#_Toc34983244)

[_Figure 3 : Cas d'utilisation globale du système_ 30](#_Toc34983245)

[_Figure 4 : Diagramme de cas d'utilisation : « Gérer utilisateur système »_ 31](#_Toc34983246)

[_Figure 5 : Diagramme de cas d'utilisation : « Gérer année universitaire »_ 32](#_Toc34983247)

[_Figure 6 : Diagramme de cas d'utilisation : « Gérer semestre »_ 33](#_Toc34983248)

[_Figure 7 : Diagramme de cas d'utilisation : « Gérer unité d'enseignement »_ 34](#_Toc34983249)

[_Figure 8 : Diagramme de cas d'utilisation : « Gérer matière »_ 35](#_Toc34983250)

[_Figure 9 : Diagramme de cas d'utilisation : « Gérer note »_ 36](#_Toc34983251)

[_Figure 10 : Diagramme de cas d'utilisation : « Gérer étudiant »_ 37](#_Toc34983252)

[_Figure 11 : Diagramme de séquence : « Authentification »_ 39](#_Toc34983253)

[_Figure 12 : Diagramme de séquence : « Ajout année universitaire »_ 39](#_Toc34983254)

[_Figure 13 : Diagramme de séquence : « Suppression année universitaire »_ 40](#_Toc34983255)

[_Figure 14 : Diagramme de séquence : « Modification année universitaire »_ 40](#_Toc34983256)

[_Figure 15 : Diagramme de séquence : « Ajout unité d'enseignement »_ 41](#_Toc34983257)

[_Figure 16 : Diagramme de séquence : « Suppression unité d'enseignement »_ 41](#_Toc34983258)

[_Figure 17 : Diagramme de séquence : « Ajout matière »_ 42](#_Toc34983259)

[_Figure 18 : Diagramme de séquence : « modification matière »_ 42](#_Toc34983260)

[_Figure 19 : Diagramme de séquence : « Suppression matière »_ 43](#_Toc34983261)

[_Figure 20 : Diagramme de séquence : « Ajoute et modification note »_ 43](#_Toc34983262)

[_Figure 21 : Diagramme de séquence : « Lister étudiant »_ 44](#_Toc34983263)

[_Figure 22 : Modèle du domaine_ 45](file:///C:\Users\Mea-Amor\Desktop\boky%20L3%20VRAIE.docx#_Toc34983264)

[_Figure 23 : Architecture MVC_ 46](#_Toc34983265)

[_Figure 24 : Diagramme de séquence de conception « S'authentifier »_ 47](#_Toc34983266)

[_Figure 25 : Diagramme de séquence de conception « Ajout utilisateur »_ 47](#_Toc34983267)

[_Figure 26 : Diagramme de séquence de conception « Créer année »_ 48](#_Toc34983268)

[_Figure 27 : Diagramme de séquence de conception  « Ajout unité d'enseignement »_ 48](#_Toc34983269)

[_Figure 28 : Diagramme de séquence de conception « Ajout matière »_ 49](#_Toc34983270)

[_Figure 29 : Diagramme de séquence de conception « Ajout ou modifier note »_ 49](#_Toc34983271)

[_Figure 30 : Diagramme de classe de conception : « Année universitaire »_ 50](#_Toc34983272)

[_Figure 31 : Diagramme de classe de conception : « Unité d'enseignement »_ 50](#_Toc34983273)

[_Figure 32 : Diagramme de classe de conception : « Matière »_ 50](#_Toc34983274)

[_Figure 33 : Diagramme de classe de conception : « Note »_ 51](#_Toc34983275)

[_Figure 34 : Diagramme de classe de conception : « Etudiant »_ 51](#_Toc34983276)

[_Figure 35 : Diagramme de classe de conception global_ 52](#_Toc34983277)

[_Figure 36 : Diagramme de Paquetage_ 52](#_Toc34983278)

[Figure 37 : Diagramme de déploiement 53](#_Toc34983279)

[Figure 38 : Page de téléchargement du composer 55](#_Toc34983280)

[Figure 39 : Début de l'installation de Composer 56](#_Toc34983281)

[_Figure 40 : Choix de version de PHP_ 56](#_Toc34983282)

[_Figure 41 : Démarrage de l'installation_ 57](#_Toc34983283)

[_Figure 42 : Confirmation de l'installation de composer_ 57](#_Toc34983284)

[Figure 43 : Début de l'installation du git 58](#_Toc34983285)

[Figure 44 : Choix d'emplacement de dossier d'installation de Git 58](#_Toc34983286)

[Figure 45 : Sélections des éléments à installer avec Git 59](#_Toc34983287)

[Figure 46 : démarrage de l'installation git 59](#_Toc34983288)

[Figure 47 : Fenêtre de confirmation de l'installation Git 60](#_Toc34983289)

[Figure 48 : Création d'un projet Symfony 60](#_Toc34983290)

[Figure 49 : Lancement de l'application 61](#_Toc34983291)

[Figure 50 : Page d'accueil du projet Symfony 61](#_Toc34983292)

[_Figure 51 : Début d'installation de Visual studio code_ 62](#_Toc34983293)

[_Figure 52 : Destination d'emplacement de Visual studio code_ 62](#_Toc34983294)

[_Figure 53 : Démarrage de processus d'installation_ 63](#_Toc34983295)

[_Figure 54 : Fin d'installation de Visual studio code_ 63](#_Toc34983296)

[_Figure 55 : Début d'installation de Nodejs_ 64](#_Toc34983297)

[_Figure 56 : Sélection des composants à installer avec Nodejs_ 64](#_Toc34983298)

[_Figure 57 : Processus d'installation de nodejs_ 65](#_Toc34983299)

[_Figure 58 : Fin d'installation de Nodejs_ 65](#_Toc34983300)

[_Figure 59 : Début d'installation de postgresql_ 66](#_Toc34983301)

[_Figure 60 : Choix de l'emplacement de destination de dossier_ 66](#_Toc34983302)

[_Figure 61 : Enregistrement de mot de passe_ 67](#_Toc34983303)

[_Figure 62 : Sélection de port de Postgresql_ 67](#_Toc34983304)

[_Figure 63 : Lancement de l'installation de postgresql_ 68](#_Toc34983305)

[_Figure 64 : Fin d'installation de postgresql_ 68](#_Toc34983306)

[_Figure 65 : Début de l'installation de Visual Paradigm_ 69](#_Toc34983307)

[_Figure 66 : Choix de l'emplacement de l'installation de visual paradigm_ 70](#_Toc34983308)

[_Figure 67 : Démarrage de processus d'installation de Visual Paradigm_ 70](#_Toc34983309)

[_Figure 68 : Fin d'installation de Visual Paradigm_ 71](#_Toc34983310)

[_Figure 69 : Fonctionnement du MVC_ 72](#_Toc34983311)

[_Figure 70 : Création des tables_ 73](#_Toc34983312)

[_Figure 71 : Formulaire à remplir_ 74](#_Toc34983313)

[_Figure 72 : Présentation de toutes les tables_ 74](#_Toc34983314)

[_Figure 73 : Structure du code de serveur_ 75](#_Toc34983315)

[_Figure 74 : Installation de Sequelize_ 76](#_Toc34983316)

[_Figure 75 : Création de nouveau projet avec Sequelize_ 76](#_Toc34983317)

[_Figure 76 : Fichier de configuration de connexion_ 76](#_Toc34983318)

[_Figure 77 : Dossier controllers_ 77](#_Toc34983319)

[_Figure 78 : Dossier migration_ 77](#_Toc34983320)

[_Figure 79 : Dossier model_ 78](#_Toc34983321)

[_Figure 80 : Dossier route_ 78](#_Toc34983322)

[Figure 81 : Dossier nommée seeders 79](#_Toc34983323)

[_Figure 82 : Structure de projet Symfony_ 79](#_Toc34983324)

[_Figure 83 : UE contrôleur_ 80](#_Toc34983325)

[_Figure 84 : UE Modèle_ 81](file:///C:\Users\Mea-Amor\Desktop\boky%20L3%20VRAIE.docx#_Toc34983326)

[_Figure 85 : UEVieu_ 81](#_Toc34983327)

[Figure 86 : Page d'Accueil de l'Application 82](#_Toc34983328)

[Figure 87 : Formulaire de connexion 82](#_Toc34983329)

[Figure 88 : Résultat d'examen 83](#_Toc34983330)

[Figure 89 : Rang par ordre de merite 83](#_Toc34983331)

[Figure 90 : Relever de notes 84](#_Toc34983332)

[Figure 91 : Enregistrement d'année universitaire 84](#_Toc34983333)

[Figure 92 : Gérer un utilisateur 85](#_Toc34983334)

# LISTE DES TABLEAUX

[_Tableau 1 : Organisation du système de formation pédagogique de l'Ecole. 7_](#_Toc34120319)

[_Tableau 2 : Architecture des études correspondant au système LMD. 8_](#_Toc34120320)

[_Tableau 3 : Liste des formations existantes à l'ENI 9_](#_Toc34120321)

[_Tableau 4 : Débouchés professionnels éventuels des diplômés 13_](#_Toc34120322)

[_Tableau 5 : Matériels utilisés par le stagiaire 16_](#_Toc34120323)

[_Tableau 6 : Matériels au sein du service de la scolarité 18_](#_Toc34120324)

[_Tableau 7 : Comparaison des solutions proposées 20_](#_Toc34120325)

[_Tableau 8 : Comparaison des SGBD 21_](#_Toc34120326)

[_Tableau 9 : Outils de modélisation 23_](#_Toc34120327)

[_Tableau 10 : Comparaison des méthodes de conception 25_](#_Toc34120328)

[_Tableau 11 : Comparaison Langages de programmation 27_](#_Toc34120329)

[_Tableau 12 : Comparaison des Framework 27_](#_Toc34120330)

[_Tableau 13 : Dictionnaire des données 29_](#_Toc34120331)

[_Tableau 14 : Fiche de description du cas d'utilisation : « Gérer utilisateur du système » 31_](#_Toc34120332)

[_Tableau 15 : Fiche de description du cas d'utilisation : « Gérer année universitaire » 32_](#_Toc34120333)

[_Tableau 16 : Fiche de description du cas d'utilisation : « Gérer semestre » 33_](#_Toc34120334)

[_Tableau 17 : Fiche de description du cas d'utilisation : « Gérer unité d'enseignement » 34_](#_Toc34120335)

[_Tableau 18 : Fiche de description du cas d'utilisation : « Gérer matière » 35_](#_Toc34120336)

[_Tableau 19 : Fiche de description du cas d'utilisation : « Gérer note » 36_](#_Toc34120337)

[_Tableau 20 : Fiche de description du cas d'utilisation : « Gérer étudiant » 37_](#_Toc34120338)

[_Tableau 21 : Priorisation des cas d'utilisation 38_](#_Toc34120339)

# LISTE DES ABBREVIATIONS

API  :  Application Programming Interface

AUF : Agence Universitaire de la Francophonie

BD  : Base de données

BNGRC : Bureau national de gestion des Risques et des catastrophes

BPMN : Business Process Modeling Notation

BTS : Brevet de Technicien Supérieur

CARI : Colloque Africain sur la Recherche en Informatique

CCNA : CISCO Networking Academy

CHU : Centre Hospitalier Universitaire

CITEF : Conférence Internationale des Ecoles de formation d'Ingénieurs et Technicien d'Expression Française

CNH : Commission Nationale d'Habilitation

COFAV : Corridor forestier de Fandriana jusqu'à Vondrozo

CUR : Centre Universitaire Régional

DEA : Diplôme d'Etudes Approfondies

DTS : Diplôme de Technicien Supérieur

DUT : Diplôme Universitaire de Technicien

EC  : Elément Constitutif

ESPA : Ecole Supérieure Polytechnique d'Antananarivo

ENI  : Ecole Nationale d'Informatique

FPPSM : Forêts, Parcs et Pauvreté dans le Sud de Madagascar

HDD : Hard Disk Drive

INPG : Institut National Polytechnique de Grenoble

IRD : Institut de Recherche pour le Développement

IREMIA : Institut de Recherche en Mathématiques et Informatique Appliquées

LMD : Licence - Master - Doctorat

MERISE : Méthode d'Étude et de Réalisation Informatique par les Sous-ensemble

MESupRES : Ministère de l'Enseignement Supérieure et de la Recherche Scientifique

MVC : Model-View-Controller

RAM: Random Access Memory

PHP : HyperText Préprocesseur

PRESUP  : Programme de Renforcement de l'Enseignement Supérieur

RUP : Rational Unified Process

SGBD   : Système de Gestion de Base de Données

TIC  : Technologies de l'Information et de la Communication

2TUP  : 2 Track Unified Process

UCB : Université de Californie à Berkeley

UE  : Unité d'Enseignement

UML   : Unified Modeling Language

UP  : Unified Process

UPTS : Université Paul Sabatier de Toulouse

XP : eXtreme Programming

#

# INTRODUCTION GENERALE

L'explosion de l'informatisation des sociétés du monde actuel reste impressionnante. En effet, que cela soit dans les grandes ou les petites entreprises, l'informatique occupe une place importante. Tout le monde a sa part : les magasins, les établissements publics et privés, les hôpitaux ainsi que les universités et bien d'autres encore.

Dans le cadre de ce développement, notre stage s'est déroulé à l'Ecole Nationale d'Informatique plus précisément au service de la scolarité où la réalisation du projet intitulé « Conception et réalisation d'une application web de gestion des notes » est demandée. Le but de ce projet est d'informatiser davantage l'école en développant une application web afin de gérer au mieux et avec plus de faciliter les notes des étudiants.

Pour ce faire, une méthodologie de conception, un Framework pour le développement de l'application et un système pour la gestion de la base de données sont indispensables.

Afin de mener à bien ce mémoire, la première partie est composée de la présentation de l'Ecole Nationale d'informatique qui est en même temps la société d'accueil ainsi que de la description du projet. La deuxième partie comporte l'analyse et conception où les méthodes et les matériels nécessaires pour la conception sont mis à la loupe. La troisième partie est la partie où la réalisation de l'intégralité du projet est exposée.

#

# PREMIERE PARTIE : PRESENTATIONS

# Chapitre 1 : Présentation de l'ENI

## 1.1 Informations d'ordre général

L'Ecole Nationale d'Informatique, en abrégé ENI, est un établissement d'enseignement supérieur rattaché académiquement et administrativement à l'Université de Fianarantsoa.

Le siège de l'Ecole se trouve à Tanambao-Antaninarenina à Fianarantsoa.

L'adresse pour la prise de contact avec l'Ecole est la suivante:

Ecole Nationale d'Informatique(ENI) Tanambao, Fianarantsoa. Le numéro de sa boîte postale est 1487 avec le code postal 301. Téléphone : 034 05 733 36. Son adresse électronique est la suivante : [**_eni@univ-fianar.mg_**. Site](mailto:eni@univ-fianar.mg.%20Site) Web : <www.univ-fianar.mg/eni>.

## 1.2 Missions et historique

L'ENI se positionne sur l'échiquier socio-éducatif malgache comme étant le plus puissant vecteur de diffusion et de vulgarisation des connaissances et des technologies informatiques.

Cette Ecole Supérieure peut être considérée aujourd'hui comme la vitrine et la pépinière des élites informaticiennes du pays.

L'Ecole s'est constituée de façon progressive au sein du Centre Universitaire Régional (CUR) de Fianarantsoa.

De façon formelle, l'ENI était constituée et créée au sein du (CUR) par le décret N° 83-185 du 24 Mai 1983, comme étant le seul établissement Universitaire Professionnalisé au niveau national, destiné à former des techniciens et des Ingénieurs de haut niveau, aptes à répondre aux besoins et exigences d'Informatisation des entreprises, des sociétés et des organes implantés à Madagascar.

L'ENI a pour conséquent pour mission de former des spécialistes informaticiens compétents et opérationnels de différents niveaux notamment :

- En fournissant à des étudiants des connaissances de base en informatique ;
- En leur transmettant le savoir-faire requis, à travers la professionnalisation des formations dispensées et en essayant une meilleure adéquation des formations par rapport aux besoins évolutifs des sociétés et des entreprises ;
- En initiant les étudiants aux activités de recherche dans les différents domaines des Technologies de l'information et de la communication (TIC).

L'implantation de cette Ecole Supérieure de technologie de pointe dans un pays en développement et dans une Province (ou Faritany) à tissu économique et industriel faiblement développé ne l'a pourtant pas défavorisée, ni empêchée de former des spécialistes informaticiens de bon niveau, qui sont recherchés par les entreprises, les sociétés et les organismes publics et privés sur le marché de l'emploi.

La filière de formation d'Analystes Programmeurs a été mise en place à l'Ecole en 1983, et a été gelée par la suite en 1996, tandis que la filière de formation d'ingénieurs a été ouverte à l'Ecole en 1986.

Dans le cadre du Programme de renforcement en l'Enseignement Supérieur (PRESUP), la filière de formation des Techniciens Supérieurs en Maintenance des Systèmes des informatiques a été mise en place en 1986 grâce à l'appui matériel et financier de la Mission Française de coopération auprès de l'Ambassade de France à Madagascar.

Une formation pour l'obtention de la certification CCNA et / ou NETWORK + .appelée « CISCO Networking Academy » a été créée à l'Ecole en 2002-2003 grâce au partenariat avec CISCO SYSTEM et l'Ecole Supérieure Polytechnique d'Antananarivo (ESPA). Cependant, cette formation n'avait pas duré longtemps.

Une formation de troisième cycle a été ouverte à l'Ecole a été ouverte à l'Ecole depuis l'année 2003-2004 grâce à la coopération académique et scientifique entre l'Université de Fianarantsoa pour le compte de l'ENI et l'Université Paul Sabatier de Toulouse (UPST).

Cette filière avait pour objectif de former certains étudiants à la recherche dans les différents domaines de l'Informatique, et notamment pour préparer la relève des Enseignants-Chercheurs qui étaient en poste.

Pendant l'année 2007-2008**,** la formation en vue de l'obtention du diplôme de Licence Professionnelle en Informatique a été mise en place à l'ENI avec les deux options suivantes de formation :

- Génie Logiciel et base de Données.
- Administration des Système et réseaux.

La mise en place à l'Ecole de ces deux options de formation devait répondre au besoin de basculement vers le système Licence - Master - Doctorat (LMD).

Mais la filière de formation des Techniciens Supérieurs en Maintenance des Systèmes Informatiques a été gelée en 2009.

En vue de surmonter les difficultés de limitation de l'effectif des étudiants accueillis à l'Ecole, notamment à cause du manque d'infrastructures, un système de «  Formation Hybride » a été mise en place à partir de l'année 2010. Il s'agit en effet d'un système de formation semi-présentielle et à distance avec l'utilisation de la visioconférence pour la formation à distance.

Le système de formation hybride a été ainsi créé à Fianarantsoa ainsi qu'Université de Toliara.

1.3 Organigramme institutionnel de l'ENI

Cet organigramme de l'Ecole est inspiré des dispositions du décret N° 83-185 du 23 Mai 1983.

L'ENI est administrée par un conseil d'Ecole, et dirigée par un directeur nommé par un décret adopté en conseil des Ministres.

Le Collège des enseignants regroupant tous les enseignants-chercheurs de l'Ecole est chargé de résoudre les problèmes liés à l'organisation pédagogique des enseignements ainsi que à l'élaboration des emplois du temps.

Le Conseil Scientifique propose les orientations pédagogiques et scientifiques de l'établissement, en tenant compte notamment de l'évolution du marché de travail et de l'adéquation des formations dispensées par rapport aux besoins des entreprises.

La figure 1 présente l'organigramme actuel de l'école

_Figure 1 : Organigramme actuel de l'Ecole._

Sur cet organigramme, l'Ecole placée sous la tutelle académique et administrative de l'Université de Fianarantsoa, et dirigée par un Directeur élu par les Enseignants - Chercheurs permanents de l'Etablissement et nommé par un décret pris en Conseil des ministres pour un mandat de 3 ans.

Le Conseil de l'Ecole est l'organe délibérant de l'Ecole.

Le Collège des Enseignants propose et coordonne les programmes d'activités pédagogiques.

Le Conseil scientifique coordonne les programmes de recherche à mettre en œuvre à l'Ecole.

Le Secrétariat principal coordonne les activités des services administratifs (Scolarité, Comptabilité, et Intendance).

Conformément aux textes en vigueur régissant les Etablissements malgaches d'Enseignement Supérieur, qui sont barrés sur le système LMD, les Départements de Formation pédagogique ont été ainsi remplacés par des Mentions et des parcours. Et les chefs des Départements ont été ainsi remplacés par des responsables des mentions et les responsables des parcours.

Un administrateur des Réseaux et Systèmes gère le système d'information de l'Ecole et celui de l'Université.

## 1.4 Domaines de spécialisation

Les activités de formation et de recherche organisées à l'ENI portent sur les domaines suivants :

- Génie logiciel et Base de Données ;
- Administration des Systèmes et Réseaux ;
- Informatique Générale ;
- Modélisation informatique et mathématique des Systèmes complexes ;

D'une manière plus générale, les programmes des formations sont basés sur l'informatique de gestion et sur l'informatique des Systèmes et Réseaux. Et les modules de formation intègrent aussi bien des éléments d'Informatique fondamentale que des éléments d'Informatique appliquée.

Le tableau 1 décrit l'organisation du système de formation pédagogique de l'Ecole.

_Tableau 1 : Organisation du système de formation pédagogique de l'Ecole._

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>Formation théorique</strong></p></th><th><p><strong>Formation pratique</strong></p></th></tr><tr><td><ul><li>Enseignement théorique</li><li>Travaux dirigés</li><li>Travaux pratiques</li></ul></td><td><ul><li>Etude de cas</li><li>Travaux de réalisation</li><li>Projets&nbsp;/ Projets tutorés</li><li>Voyage d'études</li><li>Stages</li></ul></td></tr></tbody></table></div>

## 1.5 Architecture des formations pédagogiques

Le recrutement des étudiants à l'ENI se fait uniquement par voie de concours d'envergure nationale en première année.

Les offres de formation organisées à l'Ecole ont été validées par la Commission Nationale d'Habilitation (CNH) auprès du Ministères de l'Enseignement Supérieur et de la Recherche Scientifique selon les dispositions de l'Arrêté N°31.174/2012-MENS en date du 05 Décembre 2012.

Au sein de l'ENI, il existe une seule mention (INFORMATIQUE) et trois parcours :

- - Génie logiciel et Base de Données ;
    - Administration des Systèmes et Réseaux ;
    - Informatique Générale.

L'architecture des études à trois niveaux conforment au système Licence-Master-Doctoral (LMD) permet les comparaisons et les équivalences académiques des diplômes au niveau international.

- L = Licence (Bac + 3) = L1, L2, L3 = 6 semestres S1 à S6
- M = Master (Bac + 5) = M1, M2 = 4 semestres S7 à S10

Le diplôme de licence est obtenu en 3 années des études après Baccalauréat. Et le diplôme de Master est obtenu en 2 ans après obtenu du diplôme de LICENCE.

Le MASTER PROFESSIONNEL est un diplôme destiné à la recherche emploi au terme des études.

Le MASTER RECHERCHE est un diplôme qui remplace l'ancien Diplôme d'Etudes Approfondies (DEA), et qui permet de s'inscrire directement dans une Ecole Doctorale au terme des études.

- D = Doctorat (Bac +8)

Le Doctorat est un diplôme qu'on peut obtenir en 3 ans après l'obtention du diplôme de MASTER RECHERCHE.

Le tableau 2 présente l'architecture des études correspondant au système LMD.

_Tableau 2 : Architecture des études correspondant au système LMD._

[IMAGE]

DTS : Diplôme de Technicien Supérieur

BTS : Brevet de Technicien Supérieur

DUT : Diplôme Universitaire de Technicien

La licence peut avoir une vocation générale ou professionnelle.

Le master peut avoir une vocation professionnelle ou de recherche.

_Tableau 3 : Liste des formations existantes à l'ENI_

|     | **FORMATION EN** |     |
| --- | --- |     | --- |
|     | LICENCE PROFESSIONNELLE | MASTER |
| Condition d'admission | Par voie de concours Formation Professionnelle : 100 candidats<br><br>Formation généraliste : 150 candidats |     |
| Condition d'accès | Bac de série C, D ou Technique | Etre titulaire de licence professionnelle |
| Durée de formation | 3 années | 2 années |
| Diplôme à délivrer | Diplôme de Licence Professionnelle en Informatique | Diplôme de Master Professionnel<br><br>Diplôme de Master Recherche |

L'accès en première année de MASTER se fait automatiquement pour les étudiants de l'Ecole qui ont obtenu le diplôme de Licence Professionnelle.

Le Master Recherche permet à son titulaire de poursuivre directement des études en doctorat et de s'inscrire directement dans une Ecole Doctorale.

Les Ecoles Doctorales jouissent d'une autonomie de gestion par rapport aux Etablissements de formation universitaire.

Il convient de signaler que par arrêté ministériel N° 21.626/2012 - MESupRES publié le 9 Août 2012 par la Commission Nationale d'habilitation (CNH), l'Ecole Doctorale « Modélisation - Informatique » a été habilitée pour l'Université de Fianarantsoa.

Depuis l'année universitaire 2010-2011, l'ENI s'est mise à organiser des formations hybrides en informatique dans les différentes régions (Fianarantsoa, Toliara) en raison de l'insuffisance de la capacité d'accueil des infrastructures logistiques. En effet, le système de formation hybride semi - présentielle utilise la visioconférence pour la formation à distance.

Bien qu'il n'existe pas encore au niveau international de reconnaissance écrite et formelle des diplômes délivrés par l'ENI, les étudiants diplômés de l'Ecole sont plutôt bien accueillis dans les instituts universitaires étrangères (CANADA, Suisse, France…)

## 1.6 RELATIONS DE L'ENI AVEC LES ENTREPRISES ET LES ORGANISMES

Les stages effectués chaque année par les étudiants mettent l'Ecole en rapport permanent avec plus de 300 entreprises et organismes publics, semi-publics et privés, nationaux et internationaux.

L'Ecole dispose ainsi d'un réseau d'entreprises, de sociétés et d'organismes publics et privés qui sont des partenaires par l'accueil en stage de ses étudiants, et éventuellement pour le recrutement après l'obtention des diplômes par ces derniers.

Les compétences que l'Ecole cherche à développer chez ses étudiants sont l'adaptabilité, le sens de la responsabilité, du travail en équipe, le goût de l'expérimentation et l'innovation.

En effet, la vocation de l'ENI est de former des techniciens supérieurs de niveau LICENCE et des ingénieurs de type généraliste de niveau MASTER avec des qualités scientifiques, techniques et humaines reconnues, capables d'évoluer professionnellement dans des secteurs d'activité variés intégrant l'informatique.

Les stages en milieu professionnel permettent de favoriser une meilleure adéquation entre les formations à l'Ecole et les besoins évolutif du marché de l'emploi.

Les principaux débouchés professionnels des diplômés de l'Ecole concernent les domaines suivants :

- L'informatique de gestion d'entreprise ;
- Les technologies de l'information et de la communication (TIC) ;
- La sécurité informatique des réseaux ;
- L'administration des réseaux et des systèmes ;
- Les services bancaires et financiers, notamment le Mobile Banking ;
- Les télécommunications et la téléphonie mobile ;
- Les Big Data ;
- Le commerce, la vente et l'achat, le Marketing ;
- L'ingénierie informatique appliquée ;
- L'écologie et le développement durable ;

Parmi les sociétés, entreprises et organismes partenaires de l'Ecole, on peut citer : ACCENTURE Mauritius, Air Madagascar, Ambre Associates, Airtel, Agence Universitaire de la Francophonie ( AUF), B2B, Banque Centrale, BFG-SG, BIANCO, BLUELINE, Bureau national de gestion des Risques et des catastrophes (BNGRC), CEDII-Fianarantsoa, Central Test, Centre National Antiacridien, CNRE, CHU, CNRIT, COLAS, Data Consulting, Direction Générale des Douanes, DLC, DTS/Moov, FID, FTM, GNOSYS, IBONIA, INGENOSIA, INSTAT, IOGA, JIRAMA, JOUVE, MADADEV, MAEP, MEF, MEN, MESupRES, MFB, MIC, MNINTER, Min des postes/Télécommunications et du Développement Numérique, NEOV MAD, Ny Havana, Madagascar National Parks, OMNITEC, ORANGE, OTME, PRACCESS, QMM Fort-Dauphin, SMMC, SNEDADRS Antsirabe, Sénat, Société d'Exploitation du Port de Toamasina (SEPT), SOFTWELL, Strategy Consulting, TELMA, VIVETEC, Société LAZAN'I BETSILEO, WWF …

L'organisation de stage en entreprise continue non seulement à renforcer la professionnalisation des formations dispensées, mais elle continue surtout à accroître de façon exceptionnelle les opportunités d'embauche pour les diplômés de l'Ecole.

## 1.7 Partenariat au niveau international

Entre 1996 et 1999, l'ENI avait bénéficié de l'assistance technique et financière de la Mission Française de Coopération et d'action culturelle dans le cadre du Programme de Renforcement de l'Enseignement Supérieur (PRESUP) consacré à l'Ecole a notamment porté sur :

• Une dotation en logiciels, micro-ordinateurs, équipements de laboratoire de maintenance et de matériels didactiques

• La réactualisation des programmes de formation assortie du renouvellement du fonds de la bibliothèque

• L'appui à la formation des formateurs

• L'affectation à l'Ecole d'Assistants techniques français

De 2000 à 2004, l'ENI avait fait partie des membres du bureau de la Conférence Internationale des Ecoles de formation d'Ingénieurs et Technicien d'Expression Française (CITEF).

Les Enseignants-Chercheurs de l'Ecole participent régulièrement aux activités organisées dans le cadre du Colloque Africain sur la Recherche en Informatique (CARI).

L'ENI avait également signé un accord de coopération inter-universitaire avec l'Institut de Recherche en Mathématiques et Informatique Appliquées (IREMIA) de l'Université de la Réunion, l'Université de Rennes 1, l'INSA de Rennes, l'Institut National Polytechnique de Grenoble (INPG).

A partir du mois de Juillet 2001, l'ENI avait abrité le Centre de Réseau Opérationnel (Network Operating Center) du point d'accès à Internet de l'Ecole ainsi que de l'Université de Fianarantsoa. Grâce à ce projet américain qui a été financé par l'USAID Madagascar, l'ENI de l'Université de Fianarantsoa avait été dotées d'une ligne spécialisée d'accès permanent au réseau Internet.

L'ENI avait de même noué des relations de coopération avec l'Institut de Recherche pour le Développement (IRD).

L'objet du projet de coopération avait porté sur la modélisation environnementale du Corridor forestier de Fandriana jusqu'à Vondrozo (COFAV). Dans ce cadre, un atelier scientifique international avait été organisé à l'ENI en Septembre 2008. Cet atelier scientifique avait eu pour thème de modélisation des paysages.

Et dans le cadre du programme scientifique PARRUR, l'IRD avait financé depuis 2010 le projet intitulé « Forêts, Parcs et Pauvreté dans le Sud de Madagascar (FPPSM). Des étudiants en DEA et des Doctorants issus de l'ENI avaient participé à ce Programme.

Par ailleurs, depuis toujours la même année 2010, l'ENI de Fianarantsoa avait été sélectionnée pour faire partie des organismes partenaires de l'Université de Savoie dans le cadre du projet TICEVAL relatif à la certification des compétences en TIC ;

Le projet TICEVAL avait été financé par le Fonds Francophone des Inforoutes pour la période allant de 2010 à 2012, et il avait eu pour objectif de généraliser la certification des compétences en Informatique et Internet du type C2i2e et C2imi.

Dans le cadre du projet TICEVAL, une convention de coopération avec l'Université de Savoie avait été signée par les deux parties concernées. La mise en œuvre de la Convention de Coopération avait permis d'envoyer des étudiants de l'ENI à Chambéry pour poursuivre des études supérieures en Informatique.

Enfin et non des moindres, l'ENI avait signé en Septembre 2009 un protocole de collaboration scientifique avec l'ESIROI - STIM de l'Université de la Réunion.

Comme l'ENI constitue une pépinière incubatrice de technologie de pointe, d'emplois et d'entreprises, elle peut très bien servir d'instrument efficace pour renforcer la croissance économique du pays, et pour lutter contre la Pauvreté.

De même que le statut de l'Ecole devrait permettre de renforcer la position concurrentielle de la Grande Ile sir l'orbite de la modélisation grâce au développement des nouvelles technologies.

## 1.8 Débouches professionnels des diplômes

Le chômage des jeunes diplômés universitaires fait partie des maux qui gangrènent Madagascar. L'environnement socio-politique du pays depuis 2008 jusqu' à ce jour a fait que le chômage des diplômés est devenu massif par rapport aux établissements de formation supérieure existants.

Cependant, les formations proposées par l'Ecole permettent aux diplômés d'être immédiatement opérationnels sur le marché du travail avec la connaissance d'un métier complet lié à l'informatique aux TIC.

L'Ecole apporte à ses étudiants un savoir-faire et un savoir-être qui les accompagnent tout au long de leur vie professionnelle. Elle a une vocation professionnalisante.

Les diplômés en LICENCE et en MASTER issus de l'ENI peuvent faire carrière dans différents secteurs.

L'Ecole bénéficie aujourd'hui de 35 années d'expériences pédagogiques et de reconnaissance auprès des sociétés, des entreprises et des organismes. C'est une Ecole Supérieure de référence en matière informatique.

Par conséquent, en raison de fait que l'équipe pédagogique de l'Ecole est expérimentée, les enseignants-chercheurs et les autres formateurs de l'Ecole sont dotés d'une grande expérience dans l'enseignement et dans le milieu professionnel.

L'Ecole est fière de collaborer de façon régulière avec un nombre croissant d'entreprises, de sociétés et d'organismes publics et privés à travers les stages des étudiants. Les formations dispensées à l'Ecole sont ainsi orientées vers le besoin et les attentes des entreprises et des sociétés.

L'Ecole fournit à ses étudiants de niveau LICENCE et MASTER des compétences professionnelles et métiers indispensables pour les intégrer sur le marché du travail.

L'Ecole s'efforce de proposer à ses étudiants une double compétence à la fois technologique et managériale combinant l'informatique de gestion ainsi que l'administration des réseaux et systèmes.

D'une manière générale, les diplômés de l'ENI n'éprouvent pas de difficultés particulières à être recrutés au terme de leurs études. Cependant, l'ENI recommande à ses diplômés de promouvoir l'entrepreneuriat en TIC et de créer des cybercafés, des SSII ou des bureaux d'études.

_Tableau 4 : Débouchés professionnels éventuels des diplômés_

<div class="joplin-table-wrapper"><table><tbody><tr><th><p>LICENCE</p></th><th><ul><li>Analyste</li><li>Programmeur</li><li>Administrateur de site web/de portail web</li><li>Assistant Informatique et internet</li><li>Chef de projet web ou multimédia</li><li>Développeur Informatique ou multimédia</li><li>Intégrateur web ou web designer</li><li>Hot liner/Hébergeur Internet</li><li>Agent de référencement</li><li>Technicien/Supérieur de help desk sur Informatique</li><li>Responsable de sécurité web</li><li>Administrateur de réseau</li><li>Administrateur de cybercafé</li></ul></th></tr><tr><td><p>MASTER</p></td><td><ul><li>Administrateur de cybercafé</li><li>Administrateur de réseau et système</li><li>Architecture de système d'information</li><li>Développeur d'application /web&nbsp;/java /Python / IOS /Androïde</li><li>Ingénieur réseau</li><li>Webmaster /web designer</li><li>Concepteur Réalisateur d'applications</li><li>Directeur du système de formation</li><li>Directeur de projet informatique</li><li>Chef de projet informatique</li><li>Responsable de sécurité informatique</li><li>Consultant fonctionnel ou freelance</li></ul></td></tr></tbody></table></div>

##

## 1.9 Ressources humaines

L'Ecole Nationale d'informatique est composé des plusieurs ressources humaines dont :

- Le directeur de l'Ecole : Monsieur RAMAMONJISOA Bertin Olivier, Professeur Titulaire ;
- Le Chef de Mention : Monsieur RABETAFIKA Louis Haja;
- Le responsable de Parcours « Génie Logiciel et Base de Données » : Monsieur  
    RALAIVAO Jean Christian;
- Le responsable de Parcours « Administration Systèmes et Réseaux » : Monsieur SIAKA ;
- Le responsable de Parcours « Informatique Générale » : Monsieur GILANTE Gesazafy;
- Le nombre d'Enseignants permanents : 13 dont deux (02) Professeurs Titulaires, un (01) Professeur, cinq (05) Maîtres de Conférences et cinq (05) Assistants d'Enseignement Supérieur et de Recherche ;
- Le nombre d'Enseignants vacataires : 10 ;
- Le personnel Administratif : 23.

# Chapitre 2 : Description du projet

## 2.1. Formulation

Pour une activité plus rapide et efficace de gestion des notes, le service de la scolarité nous a confié la tâche de développer une application web plus adaptée à la gestion des notes des étudiants de l'Ecole Nationale d'Informatique.

Le service de la scolarité gère actuellement les notes des étudiants par l'utilisation d'une logiciel Microsoft Excel qui liste seulement les notes de chaque étudiant dans un tableau alors que la scolarité a besoin d'autres fonctionnalités.

## 2.2. Objectif et besoins de l'utilisateur

L'Objectif principal de ce projet est de concevoir et réaliser une application web capable de gérer au mieux les notes. Les fonctionnalités de cette application sont donc les suivantes :

- Enregistrer les notes de chaque étudiant ;
- Modifier les notes en cas de besoin ;
- Permettre de lister les notes des étudiants ;
- Permettre de calculer la moyenne de chaque étudiant ;
- Permettre de classer par ordre de mérite les étudiants ;
- Faciliter l'établissement du relevé des notes d'un étudiant ;
- Afficher automatiquement le résultat final en fin d'année ;
- Permettre de rechercher un étudiant en vue d'extraire ses notes.

## 2.3. Moyens nécessaires à la réalisation du projet

### 2.3.1 Moyens humains

Des moyens humains ont été mobilisés afin de mener à bien le projet :

- Chef de projet :
- Directeur de l'Ecole Nationale de l'Informatique
- Chef du service de la scolarité
- Personnel du service de la scolarité
- Le stagiaire responsable de la conception et de la réalisation

### 2.3.2 Moyens matériels

La création d'une application ne peut se faire qu'avec l'utilisation des ordinateurs comme matériels. Le tableau 5 présente les propriétés de ces ordinateurs.

_Tableau 5 : Matériels utilisés par le stagiaire_

| **MARQUES** | **PROCESSEURS** | **RAM** | **HD** | **SE** |
| --- | --- | --- | --- | --- |
| _ASUS_ | Intel Core i5 | 4Go | 500Go | Windows 10 |
| _HP_ | Intel Core duo | 2Go | 500Go | Windows 10 |

### 2.3.3 Moyens logiciels

De nombreux logiciels ont été installés sur l'ordinateur qui a servi à la réalisation de l'application :

- PostGreSQL
- Visual Studio Code
- Visual Paradigm
- Git
- PHP
- Composer

## 2.4 Résultats attendus

Une fois le projet terminé, le service de la scolarité de l'Ecole Nationale d'Informatique aura une application web à leur disposition, une application qui facilite la gestion des notes et donc le personnel pourra dresser facilement les relevés des notes de chaque étudiant ainsi qu'enregistrer et modifier les notes en cas de besoins et bien d'autres fonctionnalités encore.

# DEUXIEME PARTIE : ANALYSE ET CONCEPTION

# Chapitre 3 : Analyse préalable

Avant toute réalisation du projet, une analyse doit être faite à l'avance afin de connaître tout ce qui concerne l'entreprise d'accueil, son fonctionnement actuel.

## 3.1 Analyse de l'existant

L'analyse de l'existant est une étape indispensable à faire avant de commencer à développer une application car non seulement, elle permet de comprendre comment l'entreprise qui dans le cas présent est le service de la scolarité de l'ENI fonctionne ; mais aussi de connaître leur attente et souhait quant au développement de l'application.

### 3.1.1 Organisation actuelle

Au bureau du service de la scolarité de l'ENI, la gestion des notes est exclusivement assurée par le Chef de la Scolarité ; une fois que les feuilles de copie corrigées arrivent entre ses mains, il s'occupe de les copier et de les enregistrer sur le logiciel Microsoft Excel. Puis, il calcule les moyennes grâce au barre de calcule du Microsoft Excel. Quand un étudiant veut prendre son relevé de notes, le chef de la scolarité va ouvrir une autre fenêtre dans Microsoft Word pour copier en intégralité les notes de l'étudiant.

### 3.1.2 Inventaire des moyens matériels et logiciels

Le service de la scolarité de l'ENI est muni d'un ordinateur, une imprimante. Leurs propriétés sont inscrites dans le tableau 6.

_Tableau 6 : Matériels au sein du service de la scolarité_

| **MATERIELS** | **MARQUE** | **PROCESSEUR** | **RAM** | **HD** | **SE** |
| --- | --- | --- | --- | --- | --- |
| **ORDINATEUR** | HP  | Intel Pentium Dual Core | 1Go | 500Go | Windows 7 |
| **IMPRIMANTE** | HP  |

Les logiciels utilisés pour la gestion des notes sont le Microsoft Excel et le Microsoft Word.

## 3.2 Critique de l'existant

Le service de scolarité de l'ENI possède au sein de son bureau un ordinateur ainsi qu'une imprimante. Pour la gestion des notes, le personnel utilise l'application Word et Excel.

Suite aux remarques qu'on a faites, on a trouvé que cette application présente des points forts et aussi des limites :

**3.2.1 Point Fort**

L'application a ses points forts comme :

- La rapidité de traitement de calcul ;
- Sa manipulation qui est facile à apprendre ;
- **Très flexible :** il est possible avec Excel de moduler à souhait la forme et le contenu, à travers ses colonnes, lignes, feuilles de calcul qui offrent d'énormes possibilités ;
- **Toutes les données sur une seule page :** avec Excel, pas besoin de changer de page pendant le travail, car toutes les informations nécessaires sont contenues sur la même page, ce qui facilite ainsi son utilisation.

**3.2.2 Point Faible**

L'application a aussi ses points faibles comme :

- Incapacité de faire une recherche rapide grâce à un nom ou à un numéro d'un étudiant ;
- Elle ne peut classer les étudiants par ordre de mérite ;
- Elle ne peut pas générer automatiquement le relever de note d'un étudiant eu format pdf.

## 3.3 Conception avant-projet

### 3.3.1 Solutions

La proposition des solutions visant à régler les problèmes est indispensable afin de déterminer quelle est la meilleure solution et ainsi répondre à la demande du personnel.

Les solutions proposées sont :

- Solution 1 : Utilisation d'un logiciel payant
- Solution 2 : Utilisation d'un logiciel libre et gratuit sur internet
- Solution 3 : Conception et Développement d'une application web de gestion des notes

Le tableau 7 indique les avantages et les inconvénients des solutions proposées afin de les départager.

_Tableau 7 : Comparaison des solutions proposées_

| **SOLUTIONS** | **AVANTAGES** | **INCONVENIENTS** |
| --- | --- | --- |
| **SOLUTION 1** | En cas de problème de ce logiciel, le propriétaire est le premier responsable | Ce logiciel coûte cher et le prix n'est pas accessible à tous<br><br>Ne correspond pas parfaitement aux attentes de l'utilisateur |
| **SOLUTION 2** | Pas de dépense d'argent<br><br>Facile d'accès | Ne correspond pas parfaitement aux besoins de l'utilisateur |
| **SOLUTION 3** | Correspond totalement aux attentes de l'utilisateur car les fonctionnalités de l'application créée est à ses demandes<br><br>Manipulation facile<br><br>Mise à jour à la demande | La réalisation peut prendre du temps |

**La solution retenue**

La solution retenue est solution numéro 3 qui est le développement et la création d'une application pour la gestion des notes car cette solution correspond le plus aux attentes de l'utilisateur, ce qui leur permettra d'avoir aussi leur propre application.

### 3.3.2 Méthodes et outils proposés

La conception d'une application nécessite la prise en compte de divers méthodes et outils comme le système de gestion de la base des données, le langage de programmation, la méthode et l'outil de modélisation, méthode de conception.

Ces outils et méthodes peuvent présenter différentes sortes qui seront comparées prochainement.

- Choix du SGBD

Le SGBD ou Système de Gestion de la Base de données contient un système qui permet non seulement de stocker les données qui constituent une information, mais aussi de manipuler les données afin de contrôler les recherches, le tri ou n'importe quelle demande de gestion des données ; donc, l'accès aux informations est libre.

Il existe de nombreux SGBD qui peuvent être utilisés dans le cadre du développement d'une application comme le MySQL, l'oracle, le PostGreSQL, le MariaDb ainsi que bien d'autres encore. Une comparaison entre ces différents SGBD serait d'actualité et est dressée dans le tableau 8.

_Tableau 8 : Comparaison des SGBD_

| **SGBD** | **COTE POSITIF** | **COTE NEGATIF** |
| --- | --- | --- |
| MySQL | \- Rapide et intègre<br><br>\- Le plus populaire de tous les SGBD<br><br>\- Son acquisition ne coûte rien du tout : gratuit<br><br>\- Après manipulation des données, il y a actualisation automatique<br><br>\-Conçu pour les informations | \- Moyennement sécurisé<br><br>\- Ne supporte pas d'énorme quantité de données<br><br>\- Le support de transaction n'est pas très bien<br><br>\- Les modifications qui s'effectuent sur plusieurs tables sont difficiles à faire avec MySQL<br><br>\- Pas de vue matérialisée |
| Oracle | \- Il fait partie des plus rapides et il est intègre<br><br>\- Beaucoup moins populaire que MySQL<br><br>\- Très sécurisé | \- Coûte cher<br><br>\- Migration longue |
| PostGreSQL | \- Le plus rapide et le plus intègre<br><br>\- Il est gratuit et open source<br><br>\- Il est sécurisé<br><br>\- Il est fiable et très performant<br><br>\- Les bases de données sont plus sous contrôle avec PostGreSQL<br><br>\- Facile à installer | \- Moyennement populaire |
| Maria DB | \- Service Web<br><br>\- Facile à installer<br><br>\- Gratuit | \- Sécurité moyenne<br><br>\- Ne convient pas pour de grosses bases de données |
| Access | \- Facile à manipuler même pour les débutants | \- La sécurité est non fiable et fragile<br><br>\- Au moindre défaut de fichier, la réparation automatique n'est pas garantie et les risques de perte des données sont considérables |

Après mure réflexion et comparaison des différents systèmes de base de données, le SGBD qui convient le plus au développement de l'application est le PostGreSQL, de plus, l'entreprise d'accueil possède un serveur PostGreSQL ce qui facilitera l'utilisation de l'application.

**Présentation du PostGreSQL**

La figure 2 indique la présentation de PostGreSQL

![https://tse2.mm.bing.net/th?id=OIP.d48mNTX2-d1muOJOqrIOxAHaHa&pid=Api&P=0&w=300&h=300]

[IMAGE]

_Figure 2:Présentation de PostGreSQL_

Le PostGreSQL est un gestionnaire de bases de données relationnelles supportant le langage SQL. Il a été développé à partir du projet Postgres 4.2 initié par l'université de Californie à Berkeley (UCB), département informatique, dès 1986. PostGres est lui-même délivré d'Ingres.

PostGreSQL est libre et gratuit et il est développé selon le mode « open-source » sous licence BSD.

PostGreSQL dispose des fonctionnalités suivantes :

- Il respecte la norme SQL92 ; il supporte les standards SQL92 avec peu de restriction ;
- L'utilisation standard PostGreSQL est la plus proche de la norme ANSISQL ;
- Clés étrangères ;
- Plusieurs langages procéduraux ;
- Déclencheurs ;
- Vues ;
- Il est conforme au modèle transactionnel ACID ;
- Son optimiseur fait des optimisations que d'autre SGBD comme MySQL ne peut pas faire.

- Choix de l'outil de modélisation

L'outil de modélisation est un logiciel qui permet de dessiner et ainsi d'avoir un aperçu au préalable des procédures servant à la création de l'application. Cet outil permet de modéliser l'organisation et les activités de l'application sur la carte afin d'analyser finement ses fonctionnements.

Comme outils de modélisation, nombreux sont à choisir pour la réalisation d'une application : le Modelio, l'ArgoUML, le Visual Paradigm, le PowerAMC. Ces outils feront l'objet d'une comparaison dans le tableau 9 afin de déterminer celui qui sera utilisé.

_Tableau 9 : Outils de modélisation_

|     | **Modelio** | **ArgoUML** | **Visual Paradigm** | **PowerAMC** |
| --- | --- | --- | --- | --- |
| **Outils de conception** | UML2, MDA, XML | MDA, XML | UML, MDA | UML, MDA, XMA |
| **Langage de rétro-génération** | Java, C++, C# | Java et d'autres langages dont C# en Plugins | C++, Java#, PHP, C#(binary) |     |
| **Caractéristiques** | Support tout l'UML2; intègre BPMN. Génération de document HTML et MS-WORD, Open Document, Modélisation et application de design Patterns | Suit de près les standards<br><br>UML | Support complet de l'UML 2 .1, SysML, ERD, BPMN, modélisation de données, modélisation de métier et retro-conception à partir du code source et de base de données | Modélisation de données, modélisation de processus métier, conception et retro-co |
| **Langages générés** | Java, C# , C++, XSD, WSDL, BPEL, SQL | C++, C#, PHP4, PHP5, java, Ruby ,SQL | Java, C#, C++, PHP, Ada, Action Script | Java, C# et VB.NET |
| **Créateur** | Modéliosoft |     | Visual Paradigm Int'l Ltd | Sybase |
| **Plateforme / OS** | Windows, Linux, Mac OS | Multiplateforme (Java) | Multiplateforme (Java) | Windows |
| **Dernière diffusion stable** | 20 Janvier 2015 | 15 Décembre 2011 | 21 Janvier 2013 | 01 Octobre 2008 |
| **Licence logiciel** | Commerciale avec édition communautaire (GPL V3, apache 2.0) | EPL v1.0 | Commerciale avec édition communautaire gratuite | Commerciale |
| **Langage de programmation utilisée** | Java, C++ | Java | Java |     |
| **Open source** | Oui | OUI | NON | NON |

Suite à ces nombreux outils de modélisation, celui qui a été choisi pour la réalisation de l'application est le Visual Paradigm pour UML.

**Présentation du Visual Paradigm**

Le Visual Paradigm est un outil de l'UML CASE (Computer-aided Software Ingeneering) qui supporte l'UML 2, le Sys ML et le BPMN (Buisness Process Modeling Notation) venant de l'OMG (Object Management Group). En plus d'être un modèle de support, il fournit le rapport des générations et la capacité de construction des codes incluant les codes de génération.

Les institutions qui dirigent le monde utilisent Visual Paradigm afin d'équiper la prochaine génération de développeurs avec les techniques professionnels dont ils ont besoin dans leur espace de travail.

Avec Visual Paradigm, on peut avoir son modèle ER cartographié avec le modèle classe c'est-à-dire la carte des entités à classer, la carte des colonnes à attribuer et la relation dans la carte ERD à l'association dans le modèle classe ; et on peut générer en dehors de ça.

Les caractéristiques de Visual Paradigm permettent de créer et de maintenir un groupe de domaine des termes spécifique utilisé dans le modèle. Apprendre avec Visual Paradigm est un plaisir ; c'est facile à utiliser, c'est intuitif.

- Choix de la méthode de conception

Avant de passer à la conception d'un projet pour de développement d'une application, une modélisation de l'application en question doit être effectuée pour avoir un schéma préalable de l'application.

Il existe différentes méthodes de développement de l'application qui vont faire l'objet d'une comparaison afin de tirée la bonne méthode qui sera utilisée pour la réalisation de l'application. Ce sont : le MERISE, RUP, 2TUP, XP, Le tableau 10 montre les caractéristiques des méthodes ainsi que leurs avantages et inconvénients.

_Tableau 10 : Comparaison des méthodes de conception_

| **METHODES** | **AVANTAGES** | **INCONVENIENTS** | **CARACTERISTIQUES** |
| --- | --- | --- | --- |
| **MERISE** | \- Sépare clairement les données et le traitement | \- Changement très dur en cas de modification de spécification | \- Séquence de réalisation, conception et spécification |
| **RUP** | \- Spécifie le dialogue entre les différents intervenants du projet (les livrables, plannings et prototypes...) Propose des modèles de documents, et des canevas pour des projets types<br><br>\- Rôles bien définis, modélisation. | \- Coûteux à personnaliser<br><br>\- Très axé processus, au détriment du développement (peu de place pour le code et la technologie)<br><br>\- Lourd, largement étendu, il peut être difficile à mettre en œuvre de façon spécifique<br><br>\- Convient pour les grands projets qui génèrent beaucoup de documentation. | \- Méthodologie centrée sur l'architecture et couplée aux diagrammes UML<br><br>\- Concerne des projets de plus dix personnes<br><br>\- Processus complet assisté par des outils exhaustifs. |
| **2TUP** | \- Laisse une très grande partie au risque<br><br>\- Fait place intégrale à la technologie<br><br>\- Adaptation facile<br><br>\- Laisse une large place aux aspects techniques<br><br>\- Définit les profils des intervenants, des livrables et les prototypes | \- Faible proposition de documents types<br><br>\- Sur les phrases en amont et en aval du développement, elle est superficielle | \- S'organise autour de l'architecture<br><br>\- Convient et adaptée au projet de toute taille<br><br>\- Cycle de développement en Y |
| **XP** | \- S'intéresse à la satisfaction du client<br><br>\- Mise en œuvre facile et simple<br><br>\- S'adapte facilement aux modifications<br><br>\- L'amélioration est constante | \- Documents très réduits<br><br>\- Ne couvre pas les phases en amont et en aval du développement<br><br>\- Assez flou dans sa mise en œuvre : quels intervenants ? Quels livrables ?<br><br>\- Focalisé sur l'aspect individuel du développement, au détriment d'une vue globale et des pratiques de management ou de formalisation | \- Adaptée à l'équipe<br><br>\- Incrémentation<br><br>\- Utile pour la réalisation d'un projet de moins de dix personnes |

Suite à la comparaison des méthodes de développement et après avoir évalué leur qualité ainsi que leur défaut et en pesant la balance du pour et du contre, la méthode qui a été choisie est la 2TUP.

**Présentation du 2TUP**

Le 2TUP ou « 2 Track Unified Process fait partie du processus UP ou « Unified Process » qui est un processus de développement logiciel construit sur UML qui répond aux caractéristiques suivants : la capture des besoins, l'analyse et la conception, l'implémentation, le test et le déploiement constituant les disciplines de fondamentales pour ses activités de développement.

Le processus 2TUP apporte une réponse aux contraintes de changement continuel imposées aux systèmes d'information de l'entreprise. Donc, il renforce le contrôle sur la correction des systèmes et la capacité d'évolution. Etant un processus 2TUP, il suit 2 options qui sont : l'option fonctionnelle et l'option d'architecture technique correspondant aux deux axes imposés par le système informatique et c'est la raison pour laquelle, le processus 2TUP a un cycle de développement en Y qui dissocie les aspects techniques des aspects fonctionnels ; il commence par une étude préliminaire qui consiste essentiellement à identifier les acteurs qui vont interagir avec le système à construire, les messages qu'échangent les acteurs et le système, à produire le cahier des charges et à modéliser le contexte : le système est une boîte noire, les acteurs l'entourent et sont reliés à lui, sur l'axe qui lie un acteur au système on met les messages que les deux s'échangent avec le sens.

Le cycle de développement comprend trois branches : la branche technique, la branche fonctionnelle et la phase de réalisation.

- La branche technique capitalise un savoir-faire technique et/ou des contraintes techniques. Les techniques développées pour le système le sont indépendamment des fonctions à réaliser.
- La branche fonctionnelle capitalise la connaissance du métier de l'entreprise. Cette branche capture les besoins fonctionnels, ce qui produit un modèle focalisé sur le métier des utilisateurs finaux.
- La phase de réalisation consiste à réunir les deux branches.

- Choix de langage de programmation et Framework

Il existe de nombreux langage de programmation, parmi lesquels il y a : le langage PHP, l'ASP et le C#. La comparaison de ces trois langages s'effectue dans le tableau 11.

_Tableau 11 : Comparaison Langages de programmation_

| **LANGAGE** | **POINTS FORTS** | **POINTS FAIBLES** |
| --- | --- | --- |
| **PHP** | \- Gratuit<br><br>\-Disponibilité du code source<br><br>\-L'écriture du script est simple<br><br>\- Idéal pour les grands projets<br><br>\- Open Source<br><br>\- Intégration au sein de nombreux serveurs web (Apache, Microsoft IIS, ...)<br><br>\- Possibilité d'inclure le script PHP au sein d'une page HTML<br><br>\- Serveur léger, facile à héberger | \- Problèmes de portabilités<br><br>\- Permet des personnalisations qui peuvent causer des bugs à l'application<br><br>\- Ecriture de code gênante, variable non typée |
| **Java** | \- Langage typé, facile à utiliser et à maintenir |     |
| **C#** | \- Puissant et rapide<br><br>\- Déploiement des applications plus rapide<br><br>\- Moins de code à écrire | \- Applications plus lentes au<br><br>démarrage que d'autres<br><br>\- Environnements moins<br><br>stables |

Après mûre réflexion et comparaison des différents langages de programmation, celui qui a été choisi pour le développement de l'application est le langage PHP.

Le langage PHP possède un Framework convenable, c'est pour cela que la comparaison des Framework est nécessaire et est montré par le tableau 12.

_Tableau 12 : Comparaison des Frameworks_

| **SYMFONY** | **LARAVEL** |
| --- | --- |
| \- Architecture MVC<br><br>\- Les URL du site sont optimisées par un système de routage centralisé<br><br>\-Utilisation du langage YAML pour la configuration<br><br>\- Persistance de données simplifiée avec l'ORM Doctrine<br><br>\- Intégration de modules fonctions ou bundles (ligne de commande)<br><br>\- Gestion BDD par classes objets : entity<br><br>\- Développement du concept de services<br><br>\- Utilisation de Twig (moteur de template) | \- Créateur de requêtes SQL<br><br>\- Routage perfectionné (RESTFul)<br><br>\- ORM performants<br><br>\-Moteur de template efficace<br><br>\- Système d'authentification pour les connexions<br><br>\- Migration pour les bases de données<br><br>\- Envoi d'e-mails<br><br>\- Système cache |

Le Framework choisi est le Framework Symfony car il a des fonctionnalités qui correspondent aux attentes de l'utilisateur et en plus, l'entreprise la proposée aussi

- Choix du serveur utilisés

De nombreux serveurs ont été utilisés pour la réalisation de l'application : un serveur web, un serveur d'application.

Le serveur Web a été créé à partir d'une technologie : NodeJs

# Chapitre 4 : ANALYSE CONCEPTUELLE

L'objet de cette étude est d'avoir une gestion de note adéquate grâce à une application Web développée durant une période déterminée pour le service de scolarité à l'ENI. Pour la réalisation de l'application le PostGreSql, la méthode 2TUP avec la notation UML, l'outil de modélisation Visual Paradigm, le langage de programmation PHP et le Framework Symfony ont été utilisés.

## 4.1 Dictionnaire des données

Le dictionnaire des données est décrit dans le tableau 13.

_Tableau 13 : Dictionnaire des données_

| **NOM** | **DESCRIPTION** | **TYPE** | **TAILLE** |
| --- | --- | --- | --- |
| Année_Etudiant | Année d'inscription ou de réinscription de l'étudiant | AN  | 9   |
| Crédit_Matière | Crédit des matières | N   | 1   |
| Crédit_UE | Crédit des unités d'enseignement | N   | 2   |
| Id_Année | Identification de l'année universitaire | N   | 5   |
| Id_Matière | Identification de la matière | N   | 5   |
| Id_Niveau | Identification du niveau | N   | 5   |
| Id_Note | Identification de la note | N   | 5   |
| Id_Parcours | Identification du parcours | N   | 5   |
| Id_Semestre | Identification du semestre | N   | 5   |
| Id_UE | Identification de l'unité d'enseignement | N   | 5   |
| Libelle_Année | Année universitaire | AN  | 9   |
| Libelle_Matière | Nom de la matière | AN  | 25  |
| Libelle_Niveau | Nom du niveau | AN  | 2   |
| Libelle_Parcours | Nom du parcours | A   | 50  |
| Libelle_UE | Nom de l'unité d'enseignement | AN  | 50  |
| Nom_Etudiant | Nom de l'étudiant | A   | 25  |
| Nom_Semestre | Nom du semestre | AN  | 2   |
| Num_Etudiant | Numéro de classe de l'étudiant | N   | 3   |
| Num_Mat_Etudiant | Numéro matricule de l'étudiant | AN  | 10  |
| Poids_Matière | Valeur de la matière | N   | 3   |
| Prénom_étudiant | Prénoms de l'étudiant | A   | 50  |
| Valeur_Note | Valeur de la note (avec 2 décimales) | N   | 5   |

A : Alphabétique ; N : Numérique ; AN : Alphanumérique

## 4.2 Règles de gestion

Définition d'une règle de gestion :

RG1 : Chaque étudiant a son propre numéro matricule.

RG2 : Si une matière a une note inférieure ou égale à la note éliminatoire, l'unité d'enseignement correspondant n'est pas validée.

RG3 : Pour un semestre, un étudiant possède au moins une note par matière.

RG4 : Une unité d'enseignement doit avoir au moins une matière.

RG5 : Une année universitaire est composée de deux semestres.

RG6 : Un semestre regroupe plusieurs unité d'enseignement.

## 4.3 Représentation spécifique des besoins

### 4.3.1 Cas d'utilisation globale du système

Le cas d'utilisation globale du système est représenté par la figure 3.

[IMAGE]

_Figure 3 : Cas d'utilisation globale du système_

### 4.3.2 Description des diagrammes des cas d'utilisation

Les prochaines figures et tableaux montrent la description de chaque cas d'utilisation ainsi que leur diagramme respectif.

![C:\Users\Lanj's Ram\Desktop\schema\use case gerer utilisateur.PNG]

[IMAGE]

_Figure 4 : Diagramme de cas d'utilisation : « Gérer utilisateur système »_

_Tableau 14 : Fiche de description du cas d'utilisation : « Gérer utilisateur du système »_

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>TITRE</strong></p></th><th colspan="2"><p><strong>GERER UTILISATEUR DU SYSTEME</strong></p></th></tr><tr><td><p><strong>BUT</strong></p></td><td colspan="2"><p>Créer, modifier ou supprimer un compte d'utilisateur par l'administrateur du système</p></td></tr><tr><td><p><strong>RESUME</strong></p></td><td colspan="2"><p>L'administrateur peut créer, modifier ou supprimer un compte d'utilisateur</p></td></tr><tr><td><p><strong>ACTEUR</strong></p></td><td colspan="2"><p>Administrateur</p></td></tr><tr><td colspan="3"><p><strong>DESCRIPTION DES ENCHAINEMENTS</strong></p></td></tr><tr><td colspan="2"><p><strong>PRE-CONDITIONS</strong></p></td><td><p><strong>POST CONDITIONS</strong></p></td></tr><tr><td colspan="2"><p>L'administrateur est authentifié</p></td><td><p>- Affichage des informations à remplir par l'utilisateur pour créer un nouveau compte</p><p>- Affichage des informations du compte à modifier ou à supprimer</p></td></tr><tr><td colspan="3"><p><strong>SCENARIO NOMINAL</strong></p></td></tr><tr><td colspan="3"><ul><li>Après authentification, le système affiche selon le choix de l'administrateur soit les champs à remplir permettant de créer un compte, soit les champs permettant de modifier un compte, soit le bouton permettant de supprimer un compte.</li><li>L'administrateur valide par l'intermédiaire du bouton «&nbsp;valider&nbsp;»</li></ul></td></tr><tr><td colspan="3"><p><strong>SCENARIO ALTERNATIF</strong></p></td></tr><tr><td colspan="3"><ul><li>L'administrateur n'a rempli aucun champ</li><li>L'administrateur n'a rempli qu'un champ et n'a pas rempli les autres</li><li>Le système affiche un message d'erreur</li><li>Retour à la première étape du scénario nominal</li></ul></td></tr></tbody></table></div>

![C:\Users\Lanj's Ram\Desktop\schema\use case annee universitaire.PNG]

[IMAGE]

_Figure 5 : Diagramme de cas d'utilisation : « Gérer année universitaire »_

_Tableau 15 : Fiche de description du cas d'utilisation : « Gérer année universitaire »_

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>TITRE</strong></p></th><th colspan="2"><p><strong>GERER ANNEE UNIVERSITAIRE</strong></p></th></tr><tr><td><p><strong>BUT</strong></p></td><td colspan="2"><p>Ajouter, supprimer, modifier et lister l'année universitaire par l'utilisateur</p></td></tr><tr><td><p><strong>RESUME</strong></p></td><td colspan="2"><p>L'utilisateur peut ajouter, supprimer, modifier ou lister une année universitaire</p></td></tr><tr><td><p><strong>ACTEUR</strong></p></td><td colspan="2"><p>Utilisateur</p></td></tr><tr><td colspan="3"><p><strong>DESCRIPTION DES ENCHAINEMENTS</strong></p></td></tr><tr><td colspan="2"><p><strong>PRE-CONDITIONS</strong></p></td><td><p><strong>POST CONDITIONS</strong></p></td></tr><tr><td colspan="2"><p>L'utilisateur est authentifié</p></td><td><p><strong>- </strong>Affichage des informations à remplir par l'utilisateur pour pouvoir ajouter et lister une année universitaire</p><p>- Affichage des informations afin de modifier et de supprimer une année universitaire</p></td></tr><tr><td colspan="3"><p><strong>SCENARIO NOMINAL</strong></p></td></tr><tr><td colspan="3"><ul><li>Après authentification, le système affiche les informations sur les années universitaires listées, le champ à remplir pour un ajout, une modification ou une suppression d'année universitaire.</li><li>L'utilisateur valide par le bouton «&nbsp;valider&nbsp;»</li></ul></td></tr><tr><td colspan="3"><p><strong>SCENARIO ALTERNATIF</strong></p></td></tr><tr><td colspan="3"><ul><li>L'utilisateur n'a pas rempli tous les champs</li><li>L'utilisateur n'a rempli aucun champ</li><li>Le système affiche un message d'erreur</li><li>Une erreur s'est produite dans le résultat attendu</li><li>Retour à l'étape initiale du scénario nominal</li></ul></td></tr></tbody></table></div>

**![C:\Users\Lanj's Ram\Desktop\schema\use case semestre.PNG]

[IMAGE]

_Figure 6 : Diagramme de cas d'utilisation : « Gérer semestre »_

_Tableau 16 : Fiche de description du cas d'utilisation : « Gérer semestre »_

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>TITRE</strong></p></th><th colspan="2"><p><strong>GERER SEMESTRE</strong></p></th></tr><tr><td><p><strong>BUT</strong></p></td><td colspan="2"><p>Ajouter et modifier un semestre par l'utilisateur</p></td></tr><tr><td><p><strong>RESUME</strong></p></td><td colspan="2"><p>L'utilisateur peut ajouter ou modifier un semestre</p></td></tr><tr><td><p><strong>ACTEUR</strong></p></td><td colspan="2"><p>Utilisateur</p></td></tr><tr><td colspan="3"><p><strong>DESCRIPTION DES ENCHAINEMENTS</strong></p></td></tr><tr><td colspan="2"><p><strong>PRE-CONDITIONS</strong></p></td><td><p><strong>POST CONDITIONS</strong></p></td></tr><tr><td colspan="2"><p>L'utilisateur est authentifié</p></td><td><p>Affichage des informations à remplir par l'utilisateur pour l'ajout ou la modification d'un semestre</p></td></tr><tr><td colspan="3"><p><strong>SCENARIO NOMINAL</strong></p></td></tr><tr><td colspan="3"><ul><li>Après authentification, les champs à remplir pour l'ajout ou la modification du semestre</li><li>L'utilisateur valide l'opération par le bouton «&nbsp;valider&nbsp;»</li></ul></td></tr><tr><td colspan="3"><p><strong>SCENARIO ALTERNATIF</strong></p></td></tr><tr><td colspan="3"><ul><li>L'utilisateur n'a pas rempli tous les champs</li><li>L'utilisateur n'a rempli aucun champ</li><li>Le système affiche un message d'erreur</li><li>Retour à l'étape initiale du scénario nominal</li></ul></td></tr></tbody></table></div>

**![C:\Users\Lanj's Ram\Desktop\schema\use case uniter d'enseignement.PNG]

[IMAGE]

_Figure 7 : Diagramme de cas d'utilisation : « Gérer unité d'enseignement »_

_Tableau 17 : Fiche de description du cas d'utilisation : « Gérer unité d'enseignement »_

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>TITRE</strong></p></th><th colspan="2"><p><strong>GERER UNITE D'ENSEIGNEMENT</strong></p></th></tr><tr><td><p><strong>BUT</strong></p></td><td colspan="2"><p>Ajouter, supprimer, modifier et lister l'unité d'enseignement par l'utilisateur</p></td></tr><tr><td><p><strong>RESUME</strong></p></td><td colspan="2"><p>L'utilisateur peut ajouter, supprimer, modifier ou lister une unité d'enseignement</p></td></tr><tr><td><p><strong>ACTEUR</strong></p></td><td colspan="2"><p>Utilisateur</p></td></tr><tr><td colspan="3"><p><strong>DESCRIPTION DES ENCHAINEMENTS</strong></p></td></tr><tr><td colspan="2"><p><strong>PRE-CONDITIONS</strong></p></td><td><p><strong>POST CONDITIONS</strong></p></td></tr><tr><td colspan="2"><p>L'utilisateur est authentifié</p></td><td><p><strong>- </strong>Affichage des informations à remplir par l'utilisateur pour pouvoir ajouter et lister une unité d'enseignement</p><p>- Affichage des informations afin de modifier et de supprimer une unité d'enseignement</p></td></tr><tr><td colspan="3"><p><strong>SCENARIO NOMINAL</strong></p></td></tr><tr><td colspan="3"><ul><li>Après authentification, le système affiche les informations sur les unités d'enseignement listées, le champ à remplir pour un ajout, une modification ou une suppression d'unité d'enseignement.</li><li>L'utilisateur valide par le bouton «&nbsp;valider&nbsp;</li></ul></td></tr><tr><td colspan="3"><p><strong>SCENARIO ALTERNATIF</strong></p></td></tr><tr><td colspan="3"><ul><li>L'utilisateur n'a pas rempli tous les champs</li><li>L'utilisateur n'a rempli aucun champ</li><li>Le système affiche un message d'erreur</li><li>Une erreur s'est produite dans le résultat attendu</li><li>Retour à l'étape initiale du scénario nominal</li></ul></td></tr></tbody></table></div>

**![C:\Users\Lanj's Ram\Desktop\schema\use case matiere.PNG]

[IMAGE]

_Figure 8 : Diagramme de cas d'utilisation : « Gérer matière »_

_Tableau 18 : Fiche de description du cas d'utilisation : « Gérer matière »_

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>TITRE</strong></p></th><th colspan="2"><p><strong>GERER MATIERE</strong></p></th></tr><tr><td><p><strong>BUT</strong></p></td><td colspan="2"><p>Ajouter, supprimer, modifier et lister les matières par l'utilisateur</p></td></tr><tr><td><p><strong>RESUME</strong></p></td><td colspan="2"><p>L'utilisateur peut ajouter, supprimer, modifier ou lister les matières</p></td></tr><tr><td><p><strong>ACTEUR</strong></p></td><td colspan="2"><p>Utilisateur</p></td></tr><tr><td colspan="3"><p><strong>DESCRIPTION DES ENCHAINEMENTS</strong></p></td></tr><tr><td colspan="2"><p><strong>PRE-CONDITIONS</strong></p></td><td><p><strong>POST CONDITIONS</strong></p></td></tr><tr><td colspan="2"><p>L'utilisateur est authentifié</p></td><td><p><strong>- </strong>Affichage des informations à remplir par l'utilisateur pour pouvoir ajouter et lister une matière</p><p>- Affichage des informations afin de modifier et de supprimer une matière</p></td></tr><tr><td colspan="3"><p><strong>SCENARIO NOMINAL</strong></p></td></tr><tr><td colspan="3"><ul><li>Après authentification, le système affiche les informations sur les</li></ul><p>matières listées, le champ à remplir pour un ajout, une modification ou une suppression de matière.</p><ul><li>L'utilisateur valide par le bouton «&nbsp;valider&nbsp;</li></ul></td></tr><tr><td colspan="3"><p><strong>SCENARIO ALTERNATIF</strong></p></td></tr><tr><td colspan="3"><ul><li>L'utilisateur n'a pas rempli tous les champs</li><li>L'utilisateur n'a rempli aucun champ</li><li>Le système affiche un message d'erreur</li><li>Une erreur s'est produite dans le résultat attendu</li><li>Retour à l'étape initiale du scénario nominal</li></ul></td></tr></tbody></table></div>

**![C:\Users\Lanj's Ram\Desktop\schema\use case note_only.PNG]

[IMAGE]

_Figure 9 : Diagramme de cas d'utilisation : « Gérer note »_

_Tableau 19 : Fiche de description du cas d'utilisation : « Gérer note »_

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>TITRE</strong></p></th><th colspan="2"><p><strong>GERER NOTE</strong></p></th></tr><tr><td><p><strong>BUT</strong></p></td><td colspan="2"><p>Ajouter, imprimer, modifier et lister les notes par l'utilisateur</p></td></tr><tr><td><p><strong>RESUME</strong></p></td><td colspan="2"><p>L'utilisateur peut ajouter, imprimer, modifier ou lister les notes</p></td></tr><tr><td><p><strong>ACTEUR</strong></p></td><td colspan="2"><p>Utilisateur</p></td></tr><tr><td colspan="3"><p><strong>DESCRIPTION DES ENCHAINEMENTS</strong></p></td></tr><tr><td colspan="2"><p><strong>PRE-CONDITIONS</strong></p></td><td><p><strong>POST CONDITIONS</strong></p></td></tr><tr><td colspan="2"><p>L'utilisateur est authentifié</p></td><td><p><strong>- </strong>Affichage des informations à remplir par l'utilisateur pour pouvoir ajouter et lister une note</p><p>- Affichage des informations afin de modifier et de imprimer une note</p></td></tr><tr><td colspan="3"><p><strong>SCENARIO NOMINAL</strong></p></td></tr><tr><td colspan="3"><ul><li>Après authentification, le système affiche les informations sur les</li></ul><p>notes listées, le champ à remplir pour un ajout, une modification ou une impression de note.</p><ul><li>L'utilisateur valide par le bouton «&nbsp;valider&nbsp;»</li></ul></td></tr><tr><td colspan="3"><p><strong>SCENARIO ALTERNATIF</strong></p></td></tr><tr><td colspan="3"><ul><li>L'utilisateur n'a pas rempli tous les champs</li><li>L'utilisateur n'a rempli aucun champ</li><li>Le système affiche un message d'erreur</li><li>Une erreur s'est produite dans le résultat attendu</li><li>Retour à l'étape initiale du scénario nominal</li></ul></td></tr></tbody></table></div>

**![C:\Users\Lanj's Ram\Desktop\schema\Use case etudant.PNG]

[IMAGE]

_Figure 10 : Diagramme de cas d'utilisation : « Gérer étudiant »_

Tableau 20 : Fiche de description du cas d'utilisation : « Gérer étudiant »

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>TITRE</strong></p></th><th colspan="2"><p><strong>GERER ETUDIANT</strong></p></th></tr><tr><td><p><strong>BUT</strong></p></td><td colspan="2"><p>Lister les étudiants par l'utilisateur</p></td></tr><tr><td><p><strong>RESUME</strong></p></td><td colspan="2"><p>L'utilisateur peut lister les étudiants</p></td></tr><tr><td><p><strong>ACTEUR</strong></p></td><td colspan="2"><p>Utilisateur</p></td></tr><tr><td colspan="3"><p><strong>DESCRIPTION DES ENCHAINEMENTS</strong></p></td></tr><tr><td colspan="2"><p><strong>PRE-CONDITIONS</strong></p></td><td><p><strong>POST CONDITIONS</strong></p></td></tr><tr><td colspan="2"><p>L'utilisateur est authentifié</p></td><td><p><strong>- </strong>Affichage des informations à remplir par l'utilisateur pour pouvoir lister les étudiants.</p></td></tr><tr><td colspan="3"><p><strong>SCENARIO NOMINAL</strong></p></td></tr><tr><td colspan="3"><ul><li>Après authentification, le système affiche les informations sur les</li></ul><p>étudiants listées</p><ul><li>L'utilisateur valide par le bouton «&nbsp;valider&nbsp;»</li></ul></td></tr><tr><td colspan="3"><p><strong>SCENARIO ALTERNATIF</strong></p></td></tr><tr><td colspan="3"><ul><li>L'utilisateur n'a pas rempli tous les champs</li><li>L'utilisateur n'a rempli aucun champ</li><li>Le système affiche un message d'erreur</li><li>Une erreur s'est produite dans le résultat attendu</li><li>Retour à l'étape initiale du scénario nominal</li></ul></td></tr></tbody></table></div>

### 4.3.3 Priorisation des cas d'utilisation

La priorisation des cas d'utilisation est une manière de démontrer quel cas d'utilisation va en premier suivant l'ordre de priorité des différents cas. Le tableau 21 montre cette priorisation.

_Tableau 21 : Priorisation des cas d'utilisation_

<div class="joplin-table-wrapper"><table><tbody><tr><th><p><strong>Cas d'utilisation</strong></p></th><th><p><strong>Acteur principale</strong></p></th><th><p><strong>Messages reçus/ émis</strong></p></th></tr><tr><td><ol><li><strong>S'authentifier</strong></li></ol></td><td rowspan="8"><p>Administrateur</p></td><td><p>-demande de s'authentifier</p><p>-résultat d'authentification</p></td></tr><tr><td><ol><li><strong>Utilisateur système</strong></li></ol></td><td></td></tr><tr><td><ol><li><strong>Année universitaire</strong></li></ol></td><td><p>-demande de gérer ordonnateur</p><p>-résultat de la demande de gérer ordonnateur</p></td></tr><tr><td><ol><li><strong>Semestre</strong></li></ol></td><td><p>-demande de gérer service</p><p>-résultat de la demande de gérer service</p></td></tr><tr><td><ol><li><strong>Unité d'enseignement</strong></li></ol></td><td><p>-demande de gérer mission</p><p>-résultat de la demande de gérer mission</p></td></tr><tr><td><ol><li><strong>Matière</strong></li></ol></td><td><p>-demande de gérer période</p><p>-résultat de la demande de gérer période</p></td></tr><tr><td><ol><li><strong>Note</strong></li></ol></td><td><p>-demande de gérer dépenses</p><p>-résultat de la demande de gérer dépenses</p></td></tr><tr><td><ol><li><strong>Etudiant</strong></li></ol></td><td><p>-demande lister Etudiant</p><p>-résultat de la demande de lister Etudiant</p></td></tr></tbody></table></div>

### 4.3.4 Diagrammes de séquence pour chaque cas d'utilisation

Les prochaines figures et tableaux montrent chaque Diagrammes de séquence de chaque cas d'utilisation.

- **Diagramme de séquence : « Authentification »**

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\3sequence\sequence s'autentifier.PNG]

[IMAGE]

_Figure 11 : Diagramme de séquence : « Authentification »_

- **Diagramme de séquence « Ajout année universitaire »**

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\3sequence\sequence Ajout Année.PNG]

[IMAGE]

_Figure 12 : Diagramme de séquence : « Ajout année universitaire »_

- **Diagramme de séquence « Suppression année universitaire »**

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\3sequence\sequence Suppression Année.PNG]

[IMAGE]

_Figure 13 : Diagramme de séquence : « Suppression année universitaire »_

- **Diagramme de séquence « Modification année universitaire »**

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\3sequence\sequence Modifier Année.PNG]

[IMAGE]

_Figure 14 : Diagramme de séquence : « Modification année universitaire »_

- **Diagramme de séquence : « Ajout unité d'enseignement »**

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\3sequence\Sequence Ajout Unité.PNG]

[IMAGE]

_Figure 15 : Diagramme de séquence : « Ajout unité d'enseignement »_

- **Diagramme de séquence : « Suppression unité d'enseignement »**

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\3sequence\sequence de suppression uniter.PNG]

[IMAGE]

_Figure 16 : Diagramme de séquence : « Suppression unité d'enseignement »_

- **Diagramme de séquence : « Ajout matière »**

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\3sequence\sequence ajout matiere.PNG]

[IMAGE]

_Figure 17 : Diagramme de séquence : « Ajout matière »_

- **Diagramme de séquence : « Modification matière »**

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\3sequence\sequence Modification Matiere.PNG]

[IMAGE]

_Figure 18 : Diagramme de séquence : « modification matière »_

- **Diagramme de séquence : « Suppression matière »**

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\3sequence\Sequence Suppression Matiere.PNG]

[IMAGE]

_Figure 19 : Diagramme de séquence : « Suppression matière »_

- **Diagramme de séquence : « Ajout et modification note »**

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\3sequence\Sequence note ajout et modification.PNG]

[IMAGE]

_Figure 20 : Diagramme de séquence : « Ajoute et modification note »_

- **Diagramme de séquence : « lister étudiant »**

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\3sequence\Sequence liste etudiant.PNG]

[IMAGE]

_Figure 21 : Diagramme de séquence : « Lister étudiant »_

## 4.4 Spécification des besoins techniques

Les besoins techniques décrivent toutes les contraintes techniques auxquelles sont soumis le système pour sa réalisation et son bon fonctionnement. Pour notre application, des besoins ont été relevés :

- Les données fournies par l'application doivent être fiables ;
- L'application doit fournir une interface conviviale et simple ;
- L'accès aux différents menus doit être facile ;
- L'application doit être disponible pour être utilisée par n'importe quel utilisateur.

## 4.5 Modèle du domaine

Le choix de la méthodologie adopté est très complexe car la manière de répondre aux attentes de l'utilisateur dépend de ce choix. Donc, l'étude et l'analyse des cas comme l'analyse des besoins ainsi que l'analyse du domaine doit se faire obligatoirement afin de satisfaire le client et réaliser l'application en temps et en heure suivant le délai soumis.

La figure 22 montre le modèle du domaine :

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\4diagramme de classe\diagramme de class global.PNG]

[IMAGE]

_Figure 22 : Modèle du domaine_

# Chapitre 5: CONCEPTION DETAILLEE

## 5.1 Architecture du système

L'organisation d'une interface graphique d'un programme se fait par l'intermédiaire de l'architecture MVC qui comprend les trois entités : le Modèle, la Vue et le Contrôle. C'est le motif le plus adapté au modèle trois tiers. Pour le développement d'une application logicielle, on a besoin de ce motif qui sépare le modèle de données, l'interface utilisateur et la logique de contrôle malgré le fait que l'organisation d'une interface graphique peut être délicate. Néanmoins, cette architecture offre des avantages car non seulement avec la structuration, l'évolution ainsi que le maintien des codes de l'application reste bien cadrer, ce qui permet une bonne organisation des données. Ces trois entités possèdent leurs fonctions propres qui sont les suivants :

- Le Modèle représente les données et permet d'avoir une idée sur la façon de manipuler les données de l'application c'est-à-dire qu'il modélise les données avec toutes les informations qu'elles contiennent.
- La Vue est comme son nom l'indique, elle représente la vision des données à l'écran, elle ne fait que se concentre sur l'affichage et ne fait pas de traitement mais reçoit juste les textes à afficher envoyés par le Contrôleur.
- Le contrôle représente l'intermédiaire entre le Modèle et la Vue, il fait communiquer les deux. Il prend les décisions et contrôle la logique des codes ainsi que la gestion des évènements en veillant à ce que tout soit synchrone.

La figure 23 montre le déroulement et fonctionnement de l'architecture MVC.

[IMAGE]

_Figure 23 : Architecture MVC_

## 5.2 Diagramme de séquence de conception pour chaque cas d'utilisation

Les prochaines figures et tableaux montrent chaque Diagrammes de séquence de conception de chaque cas d'utilisation.

### 5.2.1 Cas d'utilisation : Authentification

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\1conception\Conception sequence s'authentifier.PNG]

[IMAGE]

_Figure 24 : Diagramme de séquence de conception « S'authentifier »_

### 5.2.2 Cas d'utilisation : Utilisateur

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\1conception\Conception sequence ajout utilisqteur.PNG]

[IMAGE]

_Figure 25 : Diagramme de séquence de conception « Ajout utilisateur »_

### 5.2.3 Cas d'utilisation : Année

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\1conception\Conception sequence creer annee.PNG]

[IMAGE]

_Figure 26 : Diagramme de séquence de conception « Créer année »_

### 5.2.4 Cas d'utilisation : Unité d'enseignement

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\1conception\Conception sequence creer Uniter.PNG]

[IMAGE]

_Figure 27 : Diagramme de séquence de conception  « Ajout unité d'enseignement »_

### 5.2.5 Cas d'utilisation : Matière

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\1conception\Conception sequence creer Matiere.PNG]

[IMAGE]

_Figure 28 : Diagramme de séquence de conception « Ajout matière »_

### 5.2.6 Cas d'utilisation : Note

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\1conception\Conception sequence ajout ou modifie note.PNG]

[IMAGE]

_Figure 29 : Diagramme de séquence de conception « Ajout ou modifier note »_

## 5.3 Diagramme de classe de conception pour chaque cas d'utilisateur

Le diagramme de classe est un moyen de modéliser les fonctionnements de l'application afin de comprendre au mieux l'application. Ce diagramme se base sur quatre concepts : la classe, l'association, la propriété et la méthode. Voici successivement les diagrammes de classe pour chaque cas d'utilisation

### 5.3.1. Cas d'utilisation : Gérer année

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\4diagramme de classe\diagramme de class  Annee.PNG]

[IMAGE]

_Figure 30 : Diagramme de classe de conception : « Année universitaire »_

### 5.3.2. Cas d'utilisation : Gérer Unité d'enseignement

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\4diagramme de classe\diagramme de class  UE.PNG]

[IMAGE]

_Figure 31 : Diagramme de classe de conception : « Unité d'enseignement »_

### 5.3.3. Cas d'utilisation : Gérer Matière

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\4diagramme de classe\diagramme de class  matiere.PNG]

[IMAGE]

_Figure 32 : Diagramme de classe de conception : « Matière »_

### 5.3.4.. Cas d'utilisation : Gérer Note

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\4diagramme de classe\diagr class note.PNG]

[IMAGE]

_Figure 33 : Diagramme de classe de conception : « Note »_

### 5.3.5. Cas d'utilisation : Gérer Etudiant

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\4diagramme de classe\diagamme de class etudiant.PNG]

[IMAGE]

_Figure 34 : Diagramme de classe de conception : « Etudiant »_

## 5.4 Diagramme de classe de conception global

Le diagramme de classe de conception global est un diagramme unique qui permet de résumer dans un seul diagramme les diagrammes de classe selon le cas d'utilisation.

![C:\Users\Lanj's Ram\Desktop\dossier other systeme\4diagramme de classe\diagramme de class global.PNG]

[IMAGE]

_Figure 35 : Diagramme de classe de conception global_

## 5.5 Diagramme de paquetages

Les diagrammes de paquetages sont la représentation graphique des relations existant entre les paquetages composant un système.

La figure 36 montre le diagramme de paquetages.

[IMAGE]

_Figure 36 : Diagramme de Paquetage_

**5.6. Diagramme de déploiement**

Le diagramme de déploiement permet d'illustrer l'architecture physique du système et de montrer la relation entre ses différentes composantes.

La figure 37 montre le diagramme de déploiement.

[IMAGE]

Figure 37 : Diagramme de déploiement

#

# TROISEME PARTIE : REALISATION

# Chapitre 6. Mise en place de l'environnement de développement

Dans ce chapitre, nous allons présenter l'installation et configuration de tous les outils nécessaires au développement de cette application.

## 6.1 Installation et configuration des outils

### 6.1.1 Environnement de développement

**a) Installation Framework Symfony**

Avant d'installer symfony, on doit tout d'abord installer les deux (02) composants suivantes :

Composer, et Git.

**b) Installation de Composer**

Composer est un outil pour gérer les dépendances en PHP. Les dépendances dans un projet, ce sont toutes les bibliothèques dont le projet dépend pour fonctionner.

Avant de l'installer, on va d'abord le télécharger via ce lien : [getcomposer.org/Composer-Setup.exe](https://getcomposer.org/Composer-Setup.exe). Ce téléchargement est montré sur la figure 38.

![composer]

[IMAGE]

Figure 38 : Page de téléchargement du composer

- Après le téléchargement, on va lancer l'installateur :

![composer-installer-wizard-windows-2]

[IMAGE]

Figure 39 : Début de l'installation de Composer

- On clique sur le bouton « next » pour continuer l'installation et on obtient une nouvelle fenêtre qui nous permet de choisir la version PHP qu'on va utiliser

![install 2 composer]

[IMAGE]

_Figure 40 : Choix de version de PHP_

- On clique sur le bouton next et le processus de l'installation se lance :

**![install 4 composer]

[IMAGE]

_Figure 41 : Démarrage de l'installation_

- Enfin, après l'installation, une nouvelle fenêtre s'affiche quand l'application est installée

![install end composer]

[IMAGE]

_Figure 42 : Confirmation de l'installation de composer_

**c) Installation de Git**

Git est un logiciel de gestion de versions décentralisé, elle permet de garder des traces de toutes les modifications faites sur le code pour pouvoir y retrouver à tout moment. À chaque fois qu'il y a une série de modifications (créer un fichier, supprimer un fichier, modifier un texte dans un fichier, etc.),  On peut enregistrer ces modifications dans un **commit**.

Avant de commencer on doit d'abord télécharger le logiciel sur le site officiel de Git : <https://git-scm.com/downloads>

- Après le téléchargement, on va commencer à l'installation :

![git 1]

[IMAGE]

Figure 43 : Début de l'installation du git

- On clique sur le bouton next et une fenêtre va ouvrir

![git3]

[IMAGE]

Figure 44 : Choix d'emplacement de dossier d'installation de Git

- Apres, on choisit le répertoire de destination et on clique sur le bouton next

![git4]

[IMAGE]

Figure 45 : Sélections des éléments à installer avec Git

- On sélectionne les éléments à installer et on clique sur le bouton next

![git6]

[IMAGE]

Figure 46 : démarrage de l'installation git

- Apres le processus de l'installation, une fenêtre confirme la réussite de l'installation

**![git7]

[IMAGE]

Figure 47 : Fenêtre de confirmation de l'installation Git

- **A**pres avoir installé les deux composants Composer et Git, On peut maintenant créer un projet Symfony.
- Pour cela, on va utiliser la commande suivante pour créer un projet Symfony:

![installation symfony 5]

[IMAGE]

Figure 48 : Création d'un projet Symfony

- Une fois que le projet est créé, on va le lancer à l'aide de cette commande:

![syf2]

[IMAGE]

Figure 49 : Lancement de l'application

- Après, voyons la page d'accueil de Symfony ;

[IMAGE]

Figure 50 : Page d'accueil du projet Symfony

**d) Installation de Visual Studio Code**

**Visual Studio Code** est un éditeur de code multiplateforme édité par Microsoft. Cet outil destiné aux développeurs supporte plusieurs dizaines de langages de programmation comme le HTML, C++, PHP, Javascript, Markdown, CSS, etc. **Visual Studio Code** intègre plusieurs outils facilitant la saisie de code par les développeurs comme la coloration syntaxique ou encore le système d'auto-complétion IntelliSense. En outre, l'outil permet aux développeurs de corriger leur code et de gérer les différentes versions de leurs fichiers de travail puisqu'un module de débogage est aussi de la partie.

Lancement de l'installation de l'application :

[IMAGE]

_Figure 51 : Début d'installation de Visual studio code_

- Maintenant pour continuer, on va cliquer sur next, et on obtient une nouvelle fenêtre

[IMAGE]

_Figure 52 : Destination d'emplacement de Visual studio code_

- On clique encore sur next pour continuer

[IMAGE]

_Figure 53 : Démarrage de processus d'installation_

- Une fois le processus terminé, Une fenêtre s'affiche pour affirmer que l'installation est terminée

[IMAGE]

_Figure 54 : Fin d'installation de Visual studio code_

### 6.1.2 Installation du serveur

Ici on va utiliser Un serveur web (API) créé à l'aide de Nodejs qui va récupérer les données concernant les gestions des notes dans la base de données Postgresql

**Installation de Node js**

Maintenant on va installer NodeJs étape par étape

- Début d'installation de nodejs

![node1]

[IMAGE]

_Figure 55 : Début d'installation de Nodejs_

- Pour continuer l'installation, on doit cliquer sur le bouton next et une nouvelle fenêtre s'ouvre

![node2]

[IMAGE]

_Figure 56 : Sélection des composants à installer avec Nodejs_

- Après, On sélectionne les éléments à installer et on clique sur le bouton next

![node3]

[IMAGE]

_Figure 57 : Processus d'installation de nodejs_

- Lancement de processus d'installation et après une nouvelle fenêtre confirme la fin de l'installation

![node4]

[IMAGE]

_Figure 58 : Fin d'installation de Nodejs_

### 6.1.3 Installation de Postgresql

Postresql est un système de gestion de base de données relationnelle et objet .C'est un outil libre disponible selon les termes d'une licence de type BSD.

Après cette petite définition, on va maintenant l'installer.

- Après le lancement de l'exécutable, une nouvelle fenêtre s'ouvre

![post1]

[IMAGE]

_Figure 59 : Début d'installation de postgresql_

- On clique sur le bouton next pour continuer l'installation.

![post2]

[IMAGE]

_Figure 60 : Choix de l'emplacement de destination de dossier_

- Après avoir choisi l'emplacement de destination du dossier on clique sur next

![post3]

[IMAGE]

_Figure 61 : Enregistrement de mot de passe_

- Ici on demande de fournir un nouveau mot de passe pour l'administrateur de la base de données ensuite en clique sur next

![post4]

[IMAGE]

_Figure 62 : Sélection de port de Postgresql_

- On va laisser le port par défaut ici, et on clique sur next

![post7]

[IMAGE]

_Figure 63 : Lancement de l'installation de postgresql_

- Après l'installation, une fenêtre va s'ouvrir pour affirme que l'installation est terminer

![C:\Users\Mea\AppData\Local\Microsoft\Windows\INetCache\Content.Word\endPost.png]

[IMAGE]

_Figure 64 : Fin d'installation de postgresql_

- Ici on décoche la case à cocher, car on n'a pas besoin d'ajouter d'autre composant et on clique sur finish

### 6.1.4 Installation de Visual Paradigm

**Visual Paradigm** est un logiciel de création de diagrammes dans le cadre d'une programmation. Il possède plusieurs options permettant une large possibilité de modélisation en ULM.

Maintenant on va l'installer après de l'avoir téléchargé :

![visu1]

[IMAGE]

_Figure 65 : Début de l'installation de Visual Paradigm_

- Ici l'installateur nous propose si on accepte ou pas le License, donc on va cocher la case d'acceptation et on clique sur next

![visu2]

[IMAGE]

_Figure 66 : Choix de l'emplacement de l'installation de visual paradigm_

- On choisit l'emplacement de l'installation de dossier et on clique sur next

![visu3]

[IMAGE]

_Figure 67 : Démarrage de processus d'installation de Visual Paradigm_

- Après le processus d'installation, une nouvelle fenêtre s'ouvre et affirme la fin de l'installation de Visual Paradigm

![C:\Users\Mea\AppData\Local\Microsoft\Windows\INetCache\Content.Word\endvisu.png]

[IMAGE]

_Figure 68 : Fin d'installation de Visual Paradigm_

## 6.2 Architecture de l'application

Dans le cadre de projet Symfony, Symfony se pose sur l'architecture MVC (Modèle-Vue-Contrôleur).

Modèle-vue-contrôleur ou MVC est un motif d'[architecture logicielle](https://fr.wikipedia.org/wiki/Architecture_logicielle) destiné aux [interfaces graphiques](https://fr.wikipedia.org/wiki/Interface_graphique) lancé en 1978 et très populaire pour les [applications web](https://fr.wikipedia.org/wiki/Application_web). Le motif est composé de trois types de modules ayant trois responsabilités différentes : les modèles, les vues et les contrôleurs.

- Un modèle (Model) :

Élément qui contient les données ainsi que de la logique en rapport avec les données: validation, lecture et enregistrement. Il peut, dans sa forme la plus simple, contenir uniquement une simple valeur, ou une structure de données plus complexe. Le modèle représente l'univers dans lequel s'inscrit l'application. Par exemple pour une application de banque, le modèle représente des comptes, des clients, ainsi que les opérations telles que dépôt et retraits, et vérifie que les retraits ne dépassent pas la limite de crédit

- Une vue (View) :

Partie visible d'une [interface graphique](https://fr.wikipedia.org/wiki/Interface_graphique). La vue se sert du modèle, et peut être un diagramme, un formulaire, des boutons, etc. Une vue contient des éléments visuels ainsi que la logique nécessaire pour afficher les données provenant du modèle[<sup>3</sup>](https://fr.wikipedia.org/wiki/Mod%C3%A8le-vue-contr%C3%B4leur#cite_note-lott-3). Dans une application de bureau classique, la vue obtient les données nécessaires à la présentation du modèle en posant des questions. Elle peut également mettre à jour le modèle en envoyant des messages appropriés. Dans une application web une vue contient des balises [HTML](https://fr.wikipedia.org/wiki/Hypertext_Markup_Language).

- Un contrôleur (Controller) :

Contient la logique concernant les actions effectuées par l'utilisateur, il traite les actions de l'utilisateur. C'est en quelque sorte l'intermédiaire entre le modèle et la vue : le contrôleur va demander au modèle les données, les analyser, prendre des décisions et renvoyer le texte à afficher à la vue.

La figure 69 montre le fonctionnement  de l'architecture.

![Architecture-dun-projet-organise-en-MVC]

[IMAGE]

_Figure 69 : Fonctionnement du MVC_

# Chapitre 7. Développement de l'application

## 7.1 Création de la base de données

La base de données a été sous Postgresql comprenant tous les tables nécessaires avec leurs identifiants, leurs différentes propriétés, leurs masques de saisie et ses diverses caractéristiques qui les composent mais aussi la création des relations entre les tables. La création de la base de données et ses tables s'est faite via l'interface de pgAdmin4.

Voici quelque capture d'écran qui présente la création de la base de données avec sa différente table et propriété.

**Base de données Postgresql**

![create table]

[IMAGE]

_Figure 70 : Création des tables_

- Créer une base de données n'a rien de compliqué. Il suffit juste de cliquer sur «  Create - table  » et remplir au fur et à mesure les champs. Et on arrive ensuite à l'interface suivante.

![Annotation 2020-02-29 012336]

[IMAGE]

_Figure 71 : Formulaire à remplir_

- La figure 71 montre un formulaire pour créer la table et à côté du lien nommé «  general » en haut, il y a un lien nommé «  Columns » qui permet de créer les propriétés ou attribut de la table et en clique sur le bouton « save »

![table crée]

[IMAGE]

_Figure 72 : Présentation de toutes les tables_

- La figure 72 montre toutes les tables qui ont été créé avec ses attributs

## 7.2. Codage de l'application

Dans cette partie, on va présenter successivement des extraits de code de notre application.

Ici la présentation va se diviser en deux parties :

- Premièrement, présentation des codes de création de l'API. C'est le serveur qu'on va créer on utilisant nodejs qui était déjà précisé précédemment
- Deuxièmement, présentation des codes de notre projet Symfony.

### 7.2.1. Présentation du code de l'API

**a) Structure de l'API**

Avant toute chose, l'architecture du code de l'API suit aussi l'architecture MVC  « Modèle-Vue-Contrôleur », la figure suivante montre sa structure :

[IMAGE]

_Figure 73 : Structure du code de serveur_

**b) Interaction avec la base de données**

Pour interagir avec la base de données, Nodejs possède un ORM qui le permet de se connecter facilement et de manipuler facilement les données de la base.

Cette ORM est appelée " Sequelize", pour l'utiliser dans nodejs, on doit l'installer avec la commande suivante :

![npm se]

[IMAGE]

_Figure 74 : Installation de Sequelize_

Après l'installation, On peut commencer à crée un nouveau projet de nodejs avec sequelize on utilisant la commande suivante :

![npm se2]

[IMAGE]

_Figure 75 : Création de nouveau projet avec Sequelize_

Une fois que le projet est créé on voie qu'il y a quatre nouveaux dossiers qui ont été créé :

- Le dossier nommée "Config" : qui contient un fichier configuration de connexion avec la base de données
- Le dossier nommée "models" : qui contient tous les modèles de notre projet
- Le dossier nommée "migration" : qui contient tous les fichiers de migration
- Le dossier nommée "seeders"

Les autres dossiers ont été créés manuellement.

Voici quelque capture d'écran qui va montrer chacun de contenue de chaque dossier :

![1se]

[IMAGE]

_Figure 76 : Fichier de configuration de connexion_

![controller]

[IMAGE]

_Figure 77 : Dossier controllers_

**![seq2]

[IMAGE]

_Figure 78 : Dossier migration_

**![seq3]

[IMAGE]

_Figure 79 : Dossier model_

**![routeseq]

[IMAGE]

_Figure 80 : Dossier route_

**![seq4]

[IMAGE]

Figure 81 : Dossier nommée seeders

### 7.2.2. Présentation du code du projet Symfony

Maintenant on va présenter le projet Symfony qui est l'application qui va utiliser cette API pour récupérer les données dans la base de données.

- **Structure du projet Symfony**

Voici la présentation de l'architecture MVC de notre application :

[IMAGE]

_Figure 82 : Structure de projet Symfony_

Dans cette structure, les models et les controllers sont placés dans le répertoire « src », les views sont placés dans le répertoire «templates».

**b) Manipulation de donnée dans Symfony**

Dans le cas ici, on récupère les données :

- Par un Bundle de Symfony appelé "HTTPCLIENT" qui a pour but de récupérer ou d'envoyer les données à l'aide d'une requête http vers un API qui est connecte avec une base de données ici c'est le postgresql

Voici un exemple d'une entité qui va montrer son code en respectant l'architecture MVC :

- Contrôleur " Unité d'enseignement " :

![uecontroleur]

[IMAGE]

_Figure 83 : UE contrôleur_

- ![ueentite]

[IMAGE]

_Figure 84 : UE Modèle_

- Vue " Unité d'enseignement " :

[IMAGE]

_Figure 85 : UEVieu_

## 7.3. Présentation de l'application

La présentation de l'application ainsi développée s'effectue par ces différentes captures d'écran.

La page d'accueil de l'application est inscrite sur la figure 86.

![C:\Users\Mea-Amor\Pictures\page d'accueil.PNG]

[IMAGE]

Figure 86 : Page d'Accueil de l'Application

La figure 87 présente le formulaire de connexion de l'application.

![C:\Users\Mea-Amor\Pictures\login.PNG]

[IMAGE]

Figure 87 : Formulaire de connexion

La figure 88 montre le résultat des examens.

**![C:\Users\Mea-Amor\Pictures\resultat.PNG]

[IMAGE]

Figure 88 : Résultat d'examen

La figure 89 montre le rang de chaque étudiant.

![C:\Users\Mea-Amor\Pictures\rang.PNG]

[IMAGE]

Figure 89 : Rang par ordre de merite

La figure 90 montre le relever de note de chaque étudiant.

![C:\Users\Mea-Amor\Pictures\relever.PNG]

[IMAGE]

Figure 90 : Relever de notes

La figure 91 montre l'enregistrement d'une année universitaire.

![C:\Users\Mea-Amor\Pictures\année.PNG]

[IMAGE]

Figure 91 : Enregistrement d'année universitaire

La figure 92 montre la page pour gérer les utilisateurs.

![C:\Users\Mea-Amor\AppData\Local\Microsoft\Windows\INetCache\Content.Word\utilisateur.png]

[IMAGE]

Figure 92 : Gérer un utilisateur

# CONCLUSION GENERALE

Ce stage qui a été effectué au niveau du service de scolarité de l'ENI nous a été bénéfique car non seulement, il a permis de mettre en pratique les connaissances théoriques acquises durant les cours mais il nous a appris à nous faufiler dans le monde du travail et à comprendre comment une entreprise marche.

C'était une expérience enrichissante en matière de connaissance ainsi qu'en apprentissage. Il nous a permis de nous adapter à toutes les situations concernant les étapes à suivre pour le développement de l'application, de chercher les éventuelles erreurs en cas de problème de code, de gérer notre temps pour pouvoir terminer l'application suivant le délai soumis.

Les différentes analyses effectués au début, nous a permis de relever les défis rencontrés et contourner les problèmes en trouvant des solutions aux problèmes et en avançant de plus en plus dans le développement et la réalisation du projet.

Pour la réalisation du projet, on a fait appel à des méthodes et outils comme le 2TUP, PHP, le PostGreSql, le Visual Paradigm et bien d'autres encore.

Le défi fut finalement relevé et l'application web permettant de faire la gestion des notes pour le plaisir des utilisateurs est désormais opérationnelle.

La perspective d'apporter une amélioration à l'application pour encore plus de fonctionnalités autres que celle attendu par l'entreprise est envisageable pour prochainement.

# BIBLIOGRAPHIE

\[1\] Steve Berberat, Juillet 2012, Visual Paradigm

\[2\] John C. Worsley et Joshua D. Drake PostGreSQL sur la pratique, page 628

\[3\] Pasqual Roques et Franck Vallée UML en action, 2<sup>ème</sup> édition, page 402

# WEBOGRAPHIE

\[4\] <https://symfonycasts.com/screencast/symfony-doctrine>, Symfony, Consulté en Decembre 2019

\[5\] <https://sequelize.org/>, Sequelize, Consulté en Janvier 2020

\[6\] <https://symfony.com/>, Symfony, Consulté en Janvier 2020

<https://www.tutorialsteacher.com/mvc/mvc-architecture>, Consulté en fevrier 2020

\[7\] <https://www.tutorialsteacher.com/mvc/mvc-architecture>, Consulté en Janvier 2020

# GLOSSAIRE

Compensation  : c'est la possibilité de valider une entité (Unité d'Enseignement, semestre) en obtenant une moyenne pondérée égale ou supérieure à 10/20 à chacun des éléments qui le compose.

Crédit  : Un crédit est une unité de mesure, une unité de compte, exprimant la valeur donnée à une Unité d'Enseignement ou à un élément constitutif d'une Unité d'Enseignement.

LMD  : désigne un ensemble de mesures modifiant le système d'enseignement supérieur français pour l'adapter aux standards européens de la réforme BMD.

Mode d'enseignement : C'est la façon dont en enseigne un étudiant, c'est-à-dire il y a le mode

A distant et le mode présentiel.

Semestre : C'est une subdivision d'une année universitaire avec classement des unités d'enseignement qui y va.

Unité d'Enseignement : C'est le regroupement de plusieurs matières ayant un point commun et un lien pédagogique

# TABLE DES MATIERES

[CURRICULUM VITAE I](#_Toc34143966)

[SOMMAIRE GENERAL III](#_Toc34143967)

[REMERCIEMENTS IV](#_Toc34143968)

[LISTE DES FIGURES V](#_Toc34143969)

[LISTE DES TABLEAUX VII](#_Toc34143970)

[LISTE DES ABBREVIATIONS VIII](#_Toc34143971)

[INTRODUCTION GENERALE 1](#_Toc34143972)

[PREMIERE PARTIE : PRESENTATION 2](#_Toc34143973)

[Chapitre 1 : Présentation de l'ENI 3](#_Toc34143974)

[1.1 Informations d'ordre général 3](#_Toc34143975)

[1.2 Missions et historique 3](#_Toc34143976)

[1.3 Organigramme institutionnel de l'ENI 5](#_Toc34143977)

[1.4 Domaines de spécialisation 7](#_Toc34143978)

[1.5 Architecture des formations pédagogiques 7](#_Toc34143979)

[1.6 RELATIONS DE L'ENI AVEC LES ENTREPRISES ET LES ORGANISMES 10](#_Toc34143980)

[1.7 Partenariat au niveau international 11](#_Toc34143981)

[1.8 Débouches professionnels des diplômes 12](#_Toc34143982)

[1.9 Ressources humaines 14](#_Toc34143983)

[Chapitre 2 : Description du projet 15](#_Toc34143984)

[2.1. Formulation 15](#_Toc34143985)

[2.2. Objectifs et besoins de l'utilisateur 15](#_Toc34143986)

[2.3. Moyens nécessaires à la réalisation du projet 15](#_Toc34143987)

[2.3.1 Moyens humains 15](#_Toc34143988)

[2.3.2 Moyens matériels 16](#_Toc34143989)

[2.3.3 Moyens logiciels 16](#_Toc34143990)

[2.4 Résultats attendus : 16](#_Toc34143991)

[DEUXIEME PARTIE : ANALYSE ET CONCEPTION 17](#_Toc34143992)

[Chapitre 3 : Analyse préalable 18](#_Toc34143993)

[3.1 Analyse de l'existant : 18](#_Toc34143994)

[3.1.1 Organisation actuelle : 18](#_Toc34143995)

[3.1.2 Inventaire des moyens matériels et logiciels : 18](#_Toc34143996)

[3.2 Critique de l'existant : 19](#_Toc34143997)

[3.3 Conception avant-projet : 19](#_Toc34143998)

[3.3.1 Solutions : 19](#_Toc34143999)

[3.3.2 Méthodes et outils proposés : 20](#_Toc34144000)

[Chapitre 4 : ANALYSE CONCEPTUELLE 29](#_Toc34144001)

[4.1 Présentation de l'UML : 29](#_Toc34144002)

[4.2 Dictionnaire des données 29](#_Toc34144003)

[4.3 Règle de gestion : 30](#_Toc34144004)

[4.4 Représentation spécifique des besoins 30](#_Toc34144005)

[4.4.1 Cas d'utilisation globale du système : 30](#_Toc34144006)

[4.4.2 Description des diagrammes des cas d'utilisation : 31](#_Toc34144007)

[4.4.3 Priorisation des cas d'utilisation : 38](#_Toc34144008)

[4.4.4 Diagrammes de séquence pour chaque cas d'utilisation 38](#_Toc34144009)

[4.5 Spécification des besoins techniques : 44](#_Toc34144010)

[4.6 Modèle du domaine : 44](#_Toc34144011)

[Chapitre 5: CONCEPTION DETAILLEE 46](#_Toc34144012)

[5.1 Architecture du système : 46](#_Toc34144013)

[5.2 Diagramme de séquence de conception pour chaque cas d'utilisation : 47](#_Toc34144014)

[5.2.1 Cas d'utilisation : Authentification 47](#_Toc34144015)

[5.2.2 Cas d'utilisation : Utilisateur 47](#_Toc34144016)

[5.2.3 Cas d'utilisation : Année 48](#_Toc34144017)

[5.2.4 Cas d'utilisation : Unité d'enseignement 48](#_Toc34144018)

[5.2.5 Cas d'utilisation : Matière 49](#_Toc34144019)

[5.2.6 Cas d'utilisation : Note 49](#_Toc34144020)

[5.3 Diagramme de classe de conception pour chaque cas d'utilisateur 50](#_Toc34144021)

[5.3.1. Cas d'utilisation : Gérer annéé 50](#_Toc34144022)

[5.3.2. Cas d'utilisation : Gérer Unité d'enseignement 50](#_Toc34144023)

[5.3.3. Cas d'utilisation : Gérer Matière 50](#_Toc34144024)

[5.3.4.. Cas d'utilisation : Gérer Note 51](#_Toc34144025)

[5.3.5. Cas d'utilisation : Gérer Etudiant 51](#_Toc34144026)

[5.4 Diagramme de classe de conception globale : 52](#_Toc34144027)

[5.5 Diagramme de paquetages 52](#_Toc34144028)

[TROISEME PARTIE : REALISATION 54](#_Toc34144029)

[Chapitre 6. Mise en place de l'environnement de développement 55](#_Toc34144030)

[6.1 Installation et configuration des outils 55](#_Toc34144031)

[6.1.1 Environnement de développement : 55](#_Toc34144032)

[6.1.2 Installation du serveur : 63](#_Toc34144033)

[6.1.3 Installation de Postgresql : 66](#_Toc34144034)

[6.1.4 Installation de Visual Paradigm : 69](#_Toc34144035)

[6.2 Architecture de l'application 71](#_Toc34144036)

[Chapitre 7. Développement de l'application 73](#_Toc34144037)

[7.1 Création de la base de données 73](#_Toc34144038)

[7.2. Codage de l'application 75](#_Toc34144039)

[7.2.1. Présentation du code de l'API : 75](#_Toc34144040)

[7.2.2. Présentation du code du projet Symfony: 79](#_Toc34144041)

[7.3. Présentation de l'application : 82](#_Toc34144042)

[CONCLUSION GENERALE 83](#_Toc34144043)

[BIBLIOGRAPHIE IX](#_Toc34144044)

[WEBOGRAPHIE X](#_Toc34144045)

[GLOSSAIRES XI](#_Toc34144046)

[TABLE DES MATIERES XII](#_Toc34144047)

[RESUME XV](#_Toc34144048)

[ABSTRACT XVI](#_Toc34144049)

# RESUME

Le service de la scolarité de l'ENI a accueilli des stagiaire car il voulait changer la façon de gérer la note des étudiants qui a été jusqu'à aujourd'hui gérer manuellement et avec des logiciels qui ne répondent pas à leur attente et donc, un projet de développement d'une application web répondant complètement aux attentes de l'école s'était mis en route. Tout au début, une description du projet a été effectuée avec l'énoncé des différents objectifs et attentes de l'entreprise ; puis une analyse des cas actuels a été faites afin de déceler les éventuels vices et ainsi trouver la solution adéquate pour ses vices. Des méthodes ont été choisi afin de développer l'application : la méthode de modélisation, le 2TUP, le système de gestion des bases de données le PostGréSQL, le langage de programmation PHP, le Framework Symfony et le serveur a été créé par NodeJs. Une analyse conceptuelle s'en est suit après afin de modéliser l'application avec les différents diagrammes pour montrer ses fonctionnalités. Et finalement, des captures d'écran ont servi à montrer le développement propre de l'application.

Mots clés : modélisation, le 2TUP, bases de données, PostGréSQL, langage de programmation, logiciels

# ABSTRACT

The ENI's tuition department welcomed interns because it wanted to change the way of managing the students' marks, which until today have been managed manually and with software that does not meet their expectations and therefore, a project to develop a web application fully meeting the expectations of the school had started. At the very beginning, a description of the project was made with the statement of the various objectives and expectations of the company; then an analysis of the current cases was made in order to detect possible vices and thus find the adequate solution for its vices. Methods were chosen in order to develop the application: the modeling method, 2TUP, the database management system PostGréSQL, the programming language PHP, the Symfony Framework and the server was created by NodeJs. A conceptual analysis followed afterwards in order to model the application with the different diagrams to show its functionality. And finally, screenshots were used to show the proper development of the application.