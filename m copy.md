# MEMOIRE DE FIN D'ANNEES EN MASTER

**UNIVERSITE DE FIANARANTSOA**

**ECOLE NATIONALE D'INFORMATIQUE**

**MEMOIRE DE FIN D'ETUDES POUR L'OBTENTION DU DIPLÔME DE MASTER PROFESSIONNEL**

**Mention : INFORMATIQUE**

**Parcours : Developpement d'Applications**

**CONCEPTION ET DEVELOPPEMENT D'UNE PLATEFORME EVENEMENTIELLE APPELEE BEBIT**

Intitulé :  

Présenté le 09 Novembre 2025, par :  

- Monsieur [Votre Nom]

**Membres du Jury :**  

- **Président :** Monsieur RAZAFINDRANDRIATSIMANIRY Dieu Donné Michel, Maître de Conférences.  
- **Examinateur :** Monsieur RABETAFIKA Louis Haja, Assistant d'Enseignement Supérieur et de Recherche.  
- **Rapporteurs :** Monsieur RABETAFIKA Louis Haja, Assistant d'Enseignement Supérieur et de Recherche.  

Monsieur RAKOTONIRINA Janvier Benjamin, Chef du Service de la Scolarité.  

Année Universitaire 2024-2025  

# CURRICULUM VITAE  

**Etat civil et Coordonnées :**  

**Formations et Diplôme :**  

**2024 - 2025 :** Deuxième année de master professionnel en informatique à l'Ecole Nationale d'Informatique, Université de Fianarantsoa.  
**2023 - 2024 :** Première année de master professionnel en informatique à l'Ecole Nationale d'Informatique, Université de Fianarantsoa.  
**2022 - 2023 :** Troisième année de licence professionnelle en informatique à l'Ecole Nationale d'Informatique, Université de Fianarantsoa.  
**2021 - 2022 :** Deuxième année de licence professionnelle en informatique à l'Ecole Nationale d'Informatique, Université de Fianarantsoa.  
**2020 - 2021 :** Première année de licence professionnelle en informatique à l'Ecole Nationale d'Informatique, Université de Fianarantsoa.  

**2019 - 2020 :** Première année de licence professionnelle en informatique au CNTEMAD.  

**2018-2019 :** Obtention du Baccalauréat Série C au Lycée [Votre Lycée].  

**Stages et Expériences Professionnelles :**  

**2025 :** Stage au sein de Hello Mada Technologie :  
- Développement d'une plateforme événementielle web et mobile avec React, React Native, Express et PostgreSQL.  
- Intégration de fonctionnalités de collaboration et de paiements.  

**2024 :** Stage de 3 mois au sein d'une entreprise tech locale sur « Gestion de projets agiles ».  

**2023 :** Mini-projet à l'ENI :  
- Création d'une application de gestion d'événements basique avec Node.js et MongoDB.  
- Mise en place d'un système de réservation en temps réel.  

**2022 :** Mini-projet à l'ENI :  
- Développement d'une interface utilisateur responsive avec React.  
- Analyse de données événementielles via SQL.  

**2021 :** Mini-projet à l'ENI :  
- Conception d'un prototype mobile pour la découverte d'événements avec React Native.  
- Gestion de base de données relationnelle.  

**Compétences Linguistiques :**  

| **Langues** | **Compréhension** | **Expression Orale** | **Expression Ecrite** |  
| --- | --- | --- | --- |  
| Malagasy | 4   | 4   | 4   |  
| Français | 3   | 3   | 3   |  
| Anglais | 2   | 2   | 2   |  

**Grille d'évaluation** : 1 : Basique **-** 2 : Intermédiaire - 3 : Avancé - 4 : Expert  

**Divers :**  

**Sports :** Course à pied et Volley-ball  
**Loisir :** Photographie, programmation créative  

# SOMMAIRE GENERAL  

[CURRICULUM VITAE I](#_Toc1)  

[SOMMAIRE GENERAL III](#_Toc2)  

[REMERCIEMENTS IV](#_Toc3)  

[LISTE DES FIGURES V](#_Toc4)  

[LISTE DES TABLEAUX VII](#_Toc5)  

[LISTE DES ABBREVIATIONS VIII](#_Toc6)  

[INTRODUCTION GENERALE 1](#_Toc7)  

[PREMIERE PARTIE : PRESENTATION 2](#_Toc8)  

[Chapitre 1 : Présentation de Hello Mada Technologie 3](#_Toc9)  

[Chapitre 2 : Description du projet 15](#_Toc10)  

[DEUXIEME PARTIE : ANALYSE ET CONCEPTION 17](#_Toc11)  

[Chapitre 3 : Analyse préalable 18](#_Toc12)  

[Chapitre 4 : ANALYSE CONCEPTUELLE 29](#_Toc13)  

[Chapitre 5: CONCEPTION DETAILLEE 46](#_Toc14)  

[TROISEME PARTIE : REALISATION 54](#_Toc15)  

[Chapitre 6. Mise en place de l'environnement de développement 55](#_Toc16)  

[Chapitre 7. Développement de l'application 73](#_Toc17)  

[CONCLUSION GENERALE 86](#_Toc18)  

[BIBLIOGRAPHIE IX](#_Toc19)  

[WEBOGRAPHIE X](#_Toc20)  

[GLOSSAIRES XI](#_Toc21)  

[TABLE DES MATIERES XII](#_Toc22)  

[RESUME XV](#_Toc23)  

[ABSTRACT XV](#_Toc24)  

# REMERCIEMENTS  

Je remercie d'abord le Créateur pour sa guidance constante durant cette étape cruciale de ma formation, qui m'a doté de la persévérance et de la clarté d'esprit requises.  

Mes gratitude sincères vont à :  

- Monsieur RAFAMANTANANTSOA Fontaine, Professeur, Président de l'Université de Fianarantsoa, pour son leadership dans l'organisation académique.  
- Monsieur RAMAMONJISOA Andriatiana Bertin Olivier, Professeur Titulaire, Directeur de l'Ecole Nationale d'Informatique, pour les opportunités de stages enrichissants.  
- Monsieur RABETAFIKA Louis Haja, responsable de mention, pour son rôle bienveillant d'examinateur.  
- Monsieur RAZAFINDRANDRIATSIMANIRY Dieu Donné Michel, pour avoir présidé cette soutenance avec sagesse.  
- Monsieur RALAIVAO Jean Christian, mon encadreur pédagogique, pour ses retours constructifs, son suivi attentif et ses conseils qui ont affiné ce document.  
- L'équipe de Hello Mada Technologie, mon encadreur professionnel, pour leur soutien indéfectible et les ressources fournies lors de ce stage.  

Je saisis cette chance pour honorer :  

- Les enseignants et administrateurs de l'Ecole Nationale d'Informatique pour leur transmission de savoir.  
- Ma famille, pour leur encouragement moral, leur appui émotionnel et leur soutien financier essentiel.  
- Mes collègues, pour leurs idées partagées, leurs suggestions précieuses et leur aide logistique, sans quoi ce parcours n'aurait pas été complet.  
- Enfin, un hommage à tous ceux qui, de près ou de loin, ont influencé positivement cette réalisation.  

# LISTE DES FIGURES  

[Figure 1 : Organigramme de Hello Mada Technologie 6](#_Toc25)  

[Figure 2: Présentation de PostgreSQL 22](#_Toc26)  

[Figure 3 : Cas d'utilisation globale du système 30](#_Toc27)  

[Figure 4 : Diagramme de cas d'utilisation : « Gérer utilisateurs » 31](#_Toc28)  

[Figure 5 : Diagramme de cas d'utilisation : « Gérer artistes » 32](#_Toc29)  

[Figure 6 : Diagramme de cas d'utilisation : « Gérer clubs » 33](#_Toc30)  

[Figure 7 : Diagramme de cas d'utilisation : « Créer événements » 34](#_Toc31)  

[Figure 8 : Diagramme de cas d'utilisation : « Gérer invitations » 35](#_Toc32)  

[Figure 9 : Diagramme de cas d'utilisation : « Gérer tickets » 36](#_Toc33)  

[Figure 10 : Diagramme de cas d'utilisation : « Gérer feedback » 37](#_Toc34)  

[Figure 11 : Diagramme de séquence : « Authentification » 39](#_Toc35)  

[Figure 12 : Diagramme de séquence : « Création d'événement » 39](#_Toc36)  

[Figure 13 : Diagramme de séquence : « Suppression d'événement » 40](#_Toc37)  

[Figure 14 : Diagramme de séquence : « Modification d'artiste » 40](#_Toc38)  

[Figure 15 : Diagramme de séquence : « Réservation de table » 41](#_Toc39)  

[Figure 16 : Diagramme de séquence : « Suppression de table » 41](#_Toc40)  

[Figure 17 : Diagramme de séquence : « Ajout d'artiste à événement » 42](#_Toc41)  

[Figure 18 : Diagramme de séquence : « Modification de promotion » 42](#_Toc42)  

[Figure 19 : Diagramme de séquence : « Suppression de promotion » 43](#_Toc43)  

[Figure 20 : Diagramme de séquence : « Achat de ticket » 43](#_Toc44)  

[Figure 21 : Diagramme de séquence : « Lister participants » 44](#_Toc45)  

[Figure 22 : Modèle du domaine 45](#_Toc46)  

[Figure 23 : Architecture MVC 46](#_Toc47)  

[Figure 24 : Diagramme de séquence de conception « S'authentifier » 47](#_Toc48)  

[Figure 25 : Diagramme de séquence de conception « Ajout utilisateur » 47](#_Toc49)  

[Figure 26 : Diagramme de séquence de conception « Créer événement » 48](#_Toc50)  

[Figure 27 : Diagramme de séquence de conception « Ajout artiste » 48](#_Toc51)  

[Figure 28 : Diagramme de séquence de conception « Gérer club » 49](#_Toc52)  

[Figure 29 : Diagramme de séquence de conception « Gérer feedback » 49](#_Toc53)  

[Figure 30 : Diagramme de classe de conception : « Utilisateur » 50](#_Toc54)  

[Figure 31 : Diagramme de classe de conception : « Événement » 50](#_Toc55)  

[Figure 32 : Diagramme de classe de conception : « Artiste » 50](#_Toc56)  

[Figure 33 : Diagramme de classe de conception : « Club » 51](#_Toc57)  

[Figure 34 : Diagramme de classe de conception : « Ticket » 51](#_Toc58)  

[Figure 35 : Diagramme de classe de conception global 52](#_Toc59)  

[Figure 36 : Diagramme de Paquetage 52](#_Toc60)  

[Figure 37 : Diagramme de déploiement 53](#_Toc61)  

[Figure 38 : Page de téléchargement de Node.js 55](#_Toc62)  

[Figure 39 : Début de l'installation de Node.js 56](#_Toc63)  

[Figure 40 : Choix de version de Node.js 56](#_Toc64)  

[Figure 41 : Démarrage de l'installation 57](#_Toc65)  

[Figure 42 : Confirmation de l'installation de Node.js 57](#_Toc66)  

[Figure 43 : Début de l'installation de Git 58](#_Toc67)  

[Figure 44 : Choix d'emplacement de dossier d'installation de Git 58](#_Toc68)  

[Figure 45 : Sélections des éléments à installer avec Git 59](#_Toc69)  

[Figure 46 : Démarrage de l'installation Git 59](#_Toc70)  

[Figure 47 : Fenêtre de confirmation de l'installation Git 60](#_Toc71)  

[Figure 48 : Création d'un projet Express 60](#_Toc72)  

[Figure 49 : Lancement de l'application 61](#_Toc73)  

[Figure 50 : Page d'accueil du projet Express 61](#_Toc74)  

[Figure 51 : Début d'installation de Visual Studio Code 62](#_Toc75)  

[Figure 52 : Destination d'emplacement de Visual Studio Code 62](#_Toc76)  

[Figure 53 : Démarrage de processus d'installation 63](#_Toc77)  

[Figure 54 : Fin d'installation de Visual Studio Code 63](#_Toc78)  

[Figure 55 : Début d'installation de PostgreSQL 64](#_Toc79)  

[Figure 56 : Sélection des composants à installer avec PostgreSQL 64](#_Toc80)  

[Figure 57 : Processus d'installation de PostgreSQL 65](#_Toc81)  

[Figure 58 : Fin d'installation de PostgreSQL 65](#_Toc82)  

[Figure 59 : Début d'installation de Drizzle ORM 66](#_Toc83)  

[Figure 60 : Choix de l'emplacement de destination de dossier 66](#_Toc84)  

[Figure 61 : Enregistrement de mot de passe 67](#_Toc85)  

[Figure 62 : Sélection de port de PostgreSQL 67](#_Toc86)  

[Figure 63 : Lancement de l'installation de Drizzle 68](#_Toc87)  

[Figure 64 : Fin d'installation de Drizzle 68](#_Toc88)  

[Figure 65 : Début de l'installation de Visual Paradigm 69](#_Toc89)  

[Figure 66 : Choix de l'emplacement de l'installation de Visual Paradigm 70](#_Toc90)  

[Figure 67 : Démarrage de processus d'installation de Visual Paradigm 70](#_Toc91)  

[Figure 68 : Fin d'installation de Visual Paradigm 71](#_Toc92)  

[Figure 69 : Fonctionnement du MVC 72](#_Toc93)  

[Figure 70 : Création des tables 73](#_Toc94)  

[Figure 71 : Formulaire à remplir 74](#_Toc95)  

[Figure 72 : Présentation de toutes les tables 74](#_Toc96)  

[Figure 73 : Structure du code de serveur 75](#_Toc97)  

[Figure 74 : Installation de Express 76](#_Toc98)  

[Figure 75 : Création de nouveau projet avec Express 76](#_Toc99)  

[Figure 76 : Fichier de configuration de connexion 76](#_Toc100)  

[Figure 77 : Dossier controllers 77](#_Toc101)  

[Figure 78 : Dossier migration 77](#_Toc102)  

[Figure 79 : Dossier model 78](#_Toc103)  

[Figure 80 : Dossier route 78](#_Toc104)  

[Figure 81 : Dossier nommée seeders 79](#_Toc105)  

[Figure 82 : Structure de projet React 79](#_Toc106)  

[Figure 83 : Événement contrôleur 80](#_Toc107)  

[Figure 84 : Événement Modèle 81](#_Toc108)  

[Figure 85 : Événement Vue 81](#_Toc109)  

[Figure 86 : Page d'Accueil de l'Application 82](#_Toc110)  

[Figure 87 : Formulaire de connexion 82](#_Toc111)  

[Figure 88 : Liste d'événements 83](#_Toc112)  

[Figure 89 : Profil artiste 83](#_Toc113)  

[Figure 90 : Réservation de ticket 84](#_Toc114)  

[Figure 91 : Gestion de club 84](#_Toc115)  

[Figure 92 : Feedback sur événement 85](#_Toc116)  

# LISTE DES TABLEAUX  

[Tableau 1 : Organisation du système de formation pédagogique de Hello Mada Technologie 7](#_Toc117)  

[Tableau 2 : Architecture des études en développement tech 8](#_Toc118)  

[Tableau 3 : Liste des formations existantes à Hello Mada Technologie 9](#_Toc119)  

[Tableau 4 : Débouchés professionnels éventuels des diplômés 13](#_Toc120)  

[Tableau 5 : Matériels utilisés par le stagiaire 16](#_Toc121)  

[Tableau 6 : Matériels au sein de Hello Mada Technologie 18](#_Toc122)  

[Tableau 7 : Comparaison des solutions proposées 20](#_Toc123)  

[Tableau 8 : Comparaison des SGBD 21](#_Toc124)  

[Tableau 9 : Outils de modélisation 23](#_Toc125)  

[Tableau 10 : Comparaison des méthodes de conception 25](#_Toc126)  

[Tableau 11 : Comparaison Langages de programmation 27](#_Toc127)  

[Tableau 12 : Comparaison des Frameworks 27](#_Toc128)  

[Tableau 13 : Dictionnaire des données 29](#_Toc129)  

[Tableau 14 : Fiche de description du cas d'utilisation : « Gérer utilisateur du système » 31](#_Toc130)  

[Tableau 15 : Fiche de description du cas d'utilisation : « Gérer artiste » 32](#_Toc131)  

[Tableau 16 : Fiche de description du cas d'utilisation : « Gérer club » 33](#_Toc132)  

[Tableau 17 : Fiche de description du cas d'utilisation : « Créer événement » 34](#_Toc133)  

[Tableau 18 : Fiche de description du cas d'utilisation : « Gérer invitation » 35](#_Toc134)  

[Tableau 19 : Fiche de description du cas d'utilisation : « Gérer ticket » 36](#_Toc135)  

[Tableau 20 : Fiche de description du cas d'utilisation : « Gérer feedback » 37](#_Toc136)  

[Tableau 21 : Priorisation des cas d'utilisation 38](#_Toc137)  

# LISTE DES ABBREVIATIONS  

API : Application Programming Interface  

AUF : Agence Universitaire de la Francophonie  

BD : Base de données  

BPMN : Business Process Modeling Notation  

BTS : Brevet de Technicien Supérieur  

CCNA : CISCO Networking Academy  

CHU : Centre Hospitalier Universitaire  

CITEF : Conférence Internationale des Ecoles de formation d'Ingénieurs et Technicien d'Expression Française  

CNH : Commission Nationale d'Habilitation  

COFAV : Corridor forestier de Fandriana jusqu'à Vondrozo  

CUR : Centre Universitaire Régional  

DEA : Diplôme d'Etudes Approfondies  

DTS : Diplôme de Technicien Supérieur  

DUT : Diplôme Universitaire de Technicien  

EC : Elément Constitutif  

ESPA : Ecole Supérieure Polytechnique d'Antananarivo  

ENI : Ecole Nationale d'Informatique  

FPPSM : Forêts, Parcs et Pauvreté dans le Sud de Madagascar  

HDD : Hard Disk Drive  

INPG : Institut National Polytechnique de Grenoble  

IRD : Institut de Recherche pour le Développement  

IREMIA : Institut de Recherche en Mathématiques et Informatique Appliquées  

LMD : Licence - Master - Doctorat  

MERISE : Méthode d'Étude et de Réalisation Informatique par les Sous-ensemble  

MESupRES : Ministère de l'Enseignement Supérieur et de la Recherche Scientifique  

MVC : Model-View-Controller  

RAM : Random Access Memory  

POS : Point Of Sale  

React : Bibliothèque JavaScript pour interfaces utilisateur  

RN : React Native  

Express : Framework Node.js pour API  

PostgreSQL : Système de Gestion de Base de Données Relationnelle  

PRESUP : Programme de Renforcement de l'Enseignement Supérieur  

RUP : Rational Unified Process  

SGBD : Système de Gestion de Base de Données  

TIC : Technologies de l'Information et de la Communication  

2TUP : 2 Track Unified Process  

UCB : Université de Californie à Berkeley  

UE : Unité d'Enseignement  

UML : Unified Modeling Language  

UP : Unified Process  

UPTS : Université Paul Sabatier de Toulouse  

XP : eXtreme Programming  

# INTRODUCTION GENERALE  

L'essor rapide des technologies numériques transforme profondément les secteurs de l'événementiel et du divertissement. Des plateformes collaboratives émergent pour connecter acteurs et participants, facilitant la découverte, l'organisation et la monétisation d'événements. Cela touche entreprises, créateurs et usagers dans un écosystème dynamique.  

Au cours de ce stage chez Hello Mada Technologie, le projet visait à concevoir et implémenter BeBit, une plateforme événementielle intégrée pour web et mobile. L'objectif principal est de digitaliser les interactions entre utilisateurs, artistes et clubs, en gérant événements, réservations et collaborations de manière fluide et sécurisée.  

Pour y parvenir, une approche méthodique inclut une modélisation via UML, un backend robuste avec Express et PostgreSQL, et des fronts en React et React Native.  

Ce document s'articule en trois volets : la première partie expose l'entreprise d'accueil et le projet ; la seconde détaille l'analyse et la conception ; la troisième couvre la mise en œuvre technique.  

# PREMIERE PARTIE : PRESENTATION  

# Chapitre 1 : Présentation de Hello Mada Technologie  

## 1.1 Informations d'ordre général  

Hello Mada Technologie est une entité innovante dédiée au développement de solutions numériques, affiliée à des réseaux éducatifs et professionnels à Madagascar.  

Son siège est situé à Antananarivo, facilitant les collaborations locales et internationales.  

Pour les contacts : Hello Mada Technologie, Antananarivo. Boîte postale [Numéro], code postal 101. Téléphone : [Numéro]. Email : [email]. Site Web : [URL].  

## 1.2 Missions et historique  

Hello Mada Technologie se distingue comme un hub clé pour l'innovation tech à Madagascar, promouvant l'adoption de outils numériques dans l'événementiel et au-delà.  

Fondée en réponse aux besoins croissants de digitalisation, elle s'est développée via des partenariats pour former des talents et déployer des plateformes adaptées.  

Ses missions incluent :  

- Fournir des compétences avancées en développement full-stack ;  
- Aligner les projets sur les demandes du marché via des formations pratiques ;  
- Encourager la recherche en TIC appliquées à l'événementiel.  

Malgré un contexte économique challengant, l'entreprise a formé des professionnels recherchés, via des initiatives comme des bootcamps et des projets open-source.  

La filière événementielle a émergé en 2020, avec des outils pour la gestion collaborative. En 2023, une branche mobile a été lancée, intégrant React Native.  

Depuis 2024, des collaborations internationales renforcent les protocoles de sécurité et de scalabilité.  

## 1.3 Organigramme institutionnel de Hello Mada Technologie  

L'organigramme reflète une structure agile, inspirée de modèles startup.  

Dirigée par un CEO, elle inclut des équipes de dev, design et ops, avec un conseil consultatif pour les orientations stratégiques.  

[Figure 1 : Organigramme de Hello Mada Technologie]  

## 1.4 Domaines de spécialisation  

Les expertises couvrent le développement web/mobile, les bases de données et l'IA pour l'événementiel.  

## 1.5 Architecture des formations pédagogiques  

[Tableau 1 : Organisation du système de formation pédagogique de Hello Mada Technologie]  

[Tableau 2 : Architecture des études en développement tech]  

[Tableau 3 : Liste des formations existantes à Hello Mada Technologie]  

## 1.6 RELATIONS DE L'ENI AVEC LES ENTREPRISES ET LES ORGANISMES  

Hello Mada Technologie collabore avec des acteurs locaux pour des stages et projets pilotes.  

## 1.7 Partenariat au niveau international  

Partenariats avec des firmes tech globales pour des échanges et certifications.  

## 1.8 Débouches professionnels des diplômes  

[Tableau 4 : Débouchés professionnels éventuels des diplômés]  

## 1.9 Ressources humaines  

Une équipe diversifiée de 50+ membres, avec focus sur la formation continue.  

# Chapitre 2 : Description du projet  

## 2.1. Formulation  

BeBit est une plateforme full-stack pour l'événementiel, reliant utilisateurs, artistes et clubs via web (React) et mobile (React Native).  

## 2.2. Objectifs et besoins de l'utilisateur  

Objectifs : Faciliter la création d'événements, les collaborations et les transactions sécurisées. Besoins : Interface intuitive, géolocalisation, wallet intégré.  

## 2.3. Moyens nécessaires à la réalisation du projet  

### 2.3.1 Moyens humains  

Stagiaire principal, mentor tech.  

### 2.3.2 Moyens matériels  

[Tableau 5 : Matériels utilisés par le stagiaire]  

### 2.3.3 Moyens logiciels  

Ordinateur, VSCode, Git, PostgreSQL.  

[Tableau 6 : Matériels au sein de Hello Mada Technologie]  

## 2.4 Résultats attendus  

Une app opérationnelle pour 1000+ users, avec analytics en temps réel.  

# DEUXIEME PARTIE : ANALYSE ET CONCEPTION  

# Chapitre 3 : Analyse préalable  

## 3.1 Analyse de l'existant  

### 3.1.1 Organisation actuelle  

Gestion manuelle d'événements via emails et spreadsheets.  

### 3.1.2 Inventaire des moyens matériels et logiciels  

Outils legacy limités en scalabilité.  

## 3.2 Critique de l'existant  

Manque d'intégration mobile, sécurité faible pour paiements.  

## 3.3 Conception avant-projet  

### 3.3.1 Solutions  

Plateforme unifiée avec API REST.  

[Tableau 7 : Comparaison des solutions proposées]  

### 3.3.2 Méthodes et outils proposés  

[Figure 2: Présentation de PostgreSQL]  

[Tableau 8 : Comparaison des SGBD]  

[Tableau 9 : Outils de modélisation]  

[Tableau 10 : Comparaison des méthodes de conception]  

[Tableau 11 : Comparaison Langages de programmation]  

[Tableau 12 : Comparaison des Frameworks]  

# Chapitre 4 : ANALYSE CONCEPTUELLE  

## 4.1 Présentation de l'UML  

UML pour modéliser interactions et entités.  

## 4.2 Dictionnaire des données  

[Tableau 13 : Dictionnaire des données]  

## 4.3 Règle de gestion  

Validation des rôles, géolocalisation obligatoire pour events.  

## 4.4 Représentation spécifique des besoins  

### 4.4.1 Cas d'utilisation globale du système  

[Figure 3 : Cas d'utilisation globale du système]  

### 4.4.2 Description des diagrammes des cas d'utilisation  

[Figure 4 : Diagramme de cas d'utilisation : « Gérer utilisateurs »]  

[Tableau 14 : Fiche de description du cas d'utilisation : « Gérer utilisateur du système »]  

[Figure 5 : Diagramme de cas d'utilisation : « Gérer artistes »]  

[Tableau 15 : Fiche de description du cas d'utilisation : « Gérer artiste »]  

[Figure 6 : Diagramme de cas d'utilisation : « Gérer clubs »]  

[Tableau 16 : Fiche de description du cas d'utilisation : « Gérer club »]  

[Figure 7 : Diagramme de cas d'utilisation : « Créer événements »]  

[Tableau 17 : Fiche de description du cas d'utilisation : « Créer événement »]  

[Figure 8 : Diagramme de cas d'utilisation : « Gérer invitations »]  

[Tableau 18 : Fiche de description du cas d'utilisation : « Gérer invitation »]  

[Figure 9 : Diagramme de cas d'utilisation : « Gérer tickets »]  

[Tableau 19 : Fiche de description du cas d'utilisation : « Gérer ticket »]  

[Figure 10 : Diagramme de cas d'utilisation : « Gérer feedback »]  

[Tableau 20 : Fiche de description du cas d'utilisation : « Gérer feedback »]  

### 4.4.3 Priorisation des cas d'utilisation  

[Tableau 21 : Priorisation des cas d'utilisation]  

### 4.4.4 Diagrammes de séquence pour chaque cas d'utilisation  

[Figure 11 : Diagramme de séquence : « Authentification »]  

[Figure 12 : Diagramme de séquence : « Création d'événement »]  

[Figure 13 : Diagramme de séquence : « Suppression d'événement »]  

[Figure 14 : Diagramme de séquence : « Modification d'artiste »]  

[Figure 15 : Diagramme de séquence : « Réservation de table »]  

[Figure 16 : Diagramme de séquence : « Suppression de table »]  

[Figure 17 : Diagramme de séquence : « Ajout d'artiste à événement »]  

[Figure 18 : Diagramme de séquence : « Modification de promotion »]  

[Figure 19 : Diagramme de séquence : « Suppression de promotion »]  

[Figure 20 : Diagramme de séquence : « Achat de ticket »]  

[Figure 21 : Diagramme de séquence : « Lister participants »]  

## 4.5 Spécification des besoins techniques  

API scalable, support multi-rôles.  

## 4.6 Modèle du domaine  

[Figure 22 : Modèle du domaine]  

# Chapitre 5: CONCEPTION DETAILLEE  

## 5.1 Architecture du système  

[Figure 23 : Architecture MVC]  

## 5.2 Diagramme de séquence de conception pour chaque cas d'utilisation  

### 5.2.1 Cas d'utilisation : Authentification  

[Figure 24 : Diagramme de séquence de conception « S'authentifier »]  

### 5.2.2 Cas d'utilisation : Utilisateur  

[Figure 25 : Diagramme de séquence de conception « Ajout utilisateur »]  

### 5.2.3 Cas d'utilisation : Événement  

[Figure 26 : Diagramme de séquence de conception « Créer événement »]  

### 5.2.4 Cas d'utilisation : Artiste  

[Figure 27 : Diagramme de séquence de conception « Ajout artiste »]  

### 5.2.5 Cas d'utilisation : Club  

[Figure 28 : Diagramme de séquence de conception « Gérer club »]  

### 5.2.6 Cas d'utilisation : Feedback  

[Figure 29 : Diagramme de séquence de conception « Gérer feedback »]  

## 5.3 Diagramme de classe de conception pour chaque cas d'utilisateur  

### 5.3.1. Cas d'utilisation : Gérer utilisateur  

[Figure 30 : Diagramme de classe de conception : « Utilisateur »]  

### 5.3.2. Cas d'utilisation : Gérer événement  

[Figure 31 : Diagramme de classe de conception : « Événement »]  

### 5.3.3. Cas d'utilisation : Gérer artiste  

[Figure 32 : Diagramme de classe de conception : « Artiste »]  

### 5.3.4. Cas d'utilisation : Gérer club  

[Figure 33 : Diagramme de classe de conception : « Club »]  

### 5.3.5. Cas d'utilisation : Gérer ticket  

[Figure 34 : Diagramme de classe de conception : « Ticket »]  

## 5.4 Diagramme de classe de conception globale  

[Figure 35 : Diagramme de classe de conception global]  

## 5.5 Diagramme de paquetages  

[Figure 36 : Diagramme de Paquetage]  

[Figure 37 : Diagramme de déploiement]  

# TROISEME PARTIE : REALISATION  

# Chapitre 6. Mise en place de l'environnement de développement  

## 6.1 Installation et configuration des outils  

### 6.1.1 Environnement de développement  

**Installation de Node.js et Express**  

Node.js sert de runtime pour le backend Express.  

[Figure 38 : Page de téléchargement de Node.js]  

[Figure 39 : Début de l'installation de Node.js]  

[Figure 40 : Choix de version de Node.js]  

[Figure 41 : Démarrage de l'installation]  

[Figure 42 : Confirmation de l'installation de Node.js]  

**Installation de Git**  

Pour le contrôle de version.  

[Figure 43 : Début de l'installation de Git]  

[Figure 44 : Choix d'emplacement de dossier d'installation de Git]  

[Figure 45 : Sélections des éléments à installer avec Git]  

[Figure 46 : Démarrage de l'installation Git]  

[Figure 47 : Fenêtre de confirmation de l'installation Git]  

**Création projet Express**  

[Figure 48 : Création d'un projet Express]  

[Figure 49 : Lancement de l'application]  

[Figure 50 : Page d'accueil du projet Express]  

**Installation de Visual Studio Code**  

Éditeur pour React et code backend.  

[Figure 51 : Début d'installation de Visual Studio Code]  

[Figure 52 : Destination d'emplacement de Visual Studio Code]  

[Figure 53 : Démarrage de processus d'installation]  

[Figure 54 : Fin d'installation de Visual Studio Code]  

### 6.1.2 Installation du serveur  

Backend avec Express pour API.  

**Installation de PostgreSQL**  

[Figure 55 : Début d'installation de PostgreSQL]  

[Figure 56 : Sélection des composants à installer avec PostgreSQL]  

[Figure 57 : Processus d'installation de PostgreSQL]  

[Figure 58 : Fin d'installation de PostgreSQL]  

### 6.1.3 Installation de Drizzle ORM  

Pour schémas et migrations.  

[Figure 59 : Début d'installation de Drizzle ORM]  

[Figure 60 : Choix de l'emplacement de destination de dossier]  

[Figure 61 : Enregistrement de mot de passe]  

[Figure 62 : Sélection de port de PostgreSQL]  

[Figure 63 : Lancement de l'installation de Drizzle]  

[Figure 64 : Fin d'installation de Drizzle]  

### 6.1.4 Installation de Visual Paradigm  

Pour UML.  

[Figure 65 : Début de l'installation de Visual Paradigm]  

[Figure 66 : Choix de l'emplacement de l'installation de Visual Paradigm]  

[Figure 67 : Démarrage de processus d'installation de Visual Paradigm]  

[Figure 68 : Fin d'installation de Visual Paradigm]  

## 6.2 Architecture de l'application  

MVC pour frontend et backend, avec API centrale.  

[Figure 69 : Fonctionnement du MVC]  

# Chapitre 7. Développement de l'application  

## 7.1 Création de la base de données  

Schéma PostgreSQL avec tables pour users, events, etc., via Drizzle.  

[Figure 70 : Création des tables]  

[Figure 71 : Formulaire à remplir]  

[Figure 72 : Présentation de toutes les tables]  

## 7.2. Codage de l'application  

### 7.2.1. Présentation du code de l'API  

**a) Structure de l'API**  

MVC avec Express.  

[Figure 73 : Structure du code de serveur]  

**b) Interaction avec la base de données**  

Via Drizzle pour queries.  

[Figure 74 : Installation de Express]  

[Figure 75 : Création de nouveau projet avec Express]  

[Figure 76 : Fichier de configuration de connexion]  

[Figure 77 : Dossier controllers]  

[Figure 78 : Dossier migration]  

[Figure 79 : Dossier model]  

[Figure 80 : Dossier route]  

[Figure 81 : Dossier nommée seeders]  

### 7.2.2. Présentation du code du projet React/React Native  

Structure modulaire pour web/mobile.  

[Figure 82 : Structure de projet React]  

**b) Manipulation de donnée dans React**  

Via fetch/API calls.  

[Figure 83 : Événement contrôleur]  

[Figure 84 : Événement Modèle]  

[Figure 85 : Événement Vue]  

## 7.3. Présentation de l'application  

[Figure 86 : Page d'Accueil de l'Application]  

[Figure 87 : Formulaire de connexion]  

[Figure 88 : Liste d'événements]  

[Figure 89 : Profil artiste]  

[Figure 90 : Réservation de ticket]  

[Figure 91 : Gestion de club]  

[Figure 92 : Feedback sur événement]  

# CONCLUSION GENERALE  

Ce stage chez Hello Mada Technologie a été formateur, appliquant théories à un projet réel tout en naviguant les réalités professionnelles.  

Il a favorisé l'adaptation aux contraintes, la résolution de bugs et la gestion temporelle pour livrer BeBit.  

Les analyses initiales ont identifié défis comme la scalabilité, résolus via 2TUP, UML, Express et PostgreSQL.  

Le projet est livré, prêt pour extension comme IA pour recommandations.  

# BIBLIOGRAPHIE  

[1] Steve Berberat, Juillet 2012, Visual Paradigm  

[2] John C. Worsley et Joshua D. Drake, PostgreSQL en pratique, page 628  

[3] Pasqual Roques et Franck Vallée, UML en action, 2ème édition, page 402  

# WEBOGRAPHIE  

[4] https://react.dev/, React, Consulté en Octobre 2025  

[5] https://www.expressjs.com/, Express, Consulté en Octobre 2025  

[6] https://www.postgresql.org/, PostgreSQL, Consulté en Octobre 2025  

[7] https://drizzle.team/, Drizzle, Consulté en Novembre 2025  

# GLOSSAIRE  

Événement : Activité organisée avec date, lieu et participants.  

Rôle : Profil utilisateur (user, artist, club).  

Wallet : Solde virtuel pour transactions.  

POS : Système pour commandes en club.  

# TABLE DES MATIERES  

[CURRICULUM VITAE I](#_Toc1)  

[SOMMAIRE GENERAL III](#_Toc2)  

[REMERCIEMENTS IV](#_Toc3)  

[LISTE DES FIGURES V](#_Toc4)  

[LISTE DES TABLEAUX VII](#_Toc5)  

[LISTE DES ABBREVIATIONS VIII](#_Toc6)  

[INTRODUCTION GENERALE 1](#_Toc7)  

[PREMIERE PARTIE : PRESENTATION 2](#_Toc8)  

[Chapitre 1 : Présentation de Hello Mada Technologie 3](#_Toc9)  

[1.1 Informations d'ordre général 3](#_Toc138)  

[1.2 Missions et historique 3](#_Toc139)  

[1.3 Organigramme institutionnel de Hello Mada Technologie 5](#_Toc140)  

[1.4 Domaines de spécialisation 7](#_Toc141)  

[1.5 Architecture des formations pédagogiques 7](#_Toc142)  

[1.6 RELATIONS AVEC LES ENTREPRISES ET LES ORGANISMES 10](#_Toc143)  

[1.7 Partenariat au niveau international 11](#_Toc144)  

[1.8 Débouches professionnels des diplômes 12](#_Toc145)  

[1.9 Ressources humaines 14](#_Toc146)  

[Chapitre 2 : Description du projet 15](#_Toc10)  

[2.1. Formulation 15](#_Toc147)  

[2.2. Objectifs et besoins de l'utilisateur 15](#_Toc148)  

[2.3. Moyens nécessaires à la réalisation du projet 15](#_Toc149)  

[2.3.1 Moyens humains 15](#_Toc150)  

[2.3.2 Moyens matériels 16](#_Toc151)  

[2.3.3 Moyens logiciels 16](#_Toc152)  

[2.4 Résultats attendus : 16](#_Toc153)  

[DEUXIEME PARTIE : ANALYSE ET CONCEPTION 17](#_Toc11)  

[Chapitre 3 : Analyse préalable 18](#_Toc12)  

[3.1 Analyse de l'existant : 18](#_Toc154)  

[3.1.1 Organisation actuelle : 18](#_Toc155)  

[3.1.2 Inventaire des moyens matériels et logiciels : 18](#_Toc156)  

[3.2 Critique de l'existant : 19](#_Toc157)  

[3.3 Conception avant-projet : 19](#_Toc158)  

[3.3.1 Solutions : 19](#_Toc159)  

[3.3.2 Méthodes et outils proposés : 20](#_Toc160)  

[Chapitre 4 : ANALYSE CONCEPTUELLE 29](#_Toc13)  

[4.1 Présentation de l'UML : 29](#_Toc161)  

[4.2 Dictionnaire des données 29](#_Toc162)  

[4.3 Règle de gestion : 30](#_Toc163)  

[4.4 Représentation spécifique des besoins 30](#_Toc164)  

[4.4.1 Cas d'utilisation globale du système : 30](#_Toc165)  

[4.4.2 Description des diagrammes des cas d'utilisation : 31](#_Toc166)  

[4.4.3 Priorisation des cas d'utilisation : 38](#_Toc167)  

[4.4.4 Diagrammes de séquence pour chaque cas d'utilisation 38](#_Toc168)  

[4.5 Spécification des besoins techniques : 44](#_Toc169)  

[4.6 Modèle du domaine : 44](#_Toc170)  

[Chapitre 5: CONCEPTION DETAILLEE 46](#_Toc14)  

[5.1 Architecture du système : 46](#_Toc171)  

[5.2 Diagramme de séquence de conception pour chaque cas d'utilisation : 47](#_Toc172)  

[5.2.1 Cas d'utilisation : Authentification 47](#_Toc173)  

[5.2.2 Cas d'utilisation : Utilisateur 47](#_Toc174)  

[5.2.3 Cas d'utilisation : Événement 48](#_Toc175)  

[5.2.4 Cas d'utilisation : Artiste 48](#_Toc176)  

[5.2.5 Cas d'utilisation : Club 49](#_Toc177)  

[5.2.6 Cas d'utilisation : Feedback 49](#_Toc178)  

[5.3 Diagramme de classe de conception pour chaque cas d'utilisateur 50](#_Toc179)  

[5.3.1. Cas d'utilisation : Gérer utilisateur 50](#_Toc180)  

[5.3.2. Cas d'utilisation : Gérer événement 50](#_Toc181)  

[5.3.3. Cas d'utilisation : Gérer artiste 50](#_Toc182)  

[5.3.4. Cas d'utilisation : Gérer club 51](#_Toc183)  

[5.3.5. Cas d'utilisation : Gérer ticket 51](#_Toc184)  

[5.4 Diagramme de classe de conception globale : 52](#_Toc185)  

[5.5 Diagramme de paquetages 52](#_Toc186)  

[TROISEME PARTIE : REALISATION 54](#_Toc15)  

[Chapitre 6. Mise en place de l'environnement de développement 55](#_Toc16)  

[6.1 Installation et configuration des outils 55](#_Toc187)  

[6.1.1 Environnement de développement : 55](#_Toc188)  

[6.1.2 Installation du serveur : 63](#_Toc189)  

[6.1.3 Installation de PostgreSQL : 66](#_Toc190)  

[6.1.4 Installation de Visual Paradigm : 69](#_Toc191)  

[6.2 Architecture de l'application 71](#_Toc192)  

[Chapitre 7. Développement de l'application 73](#_Toc17)  

[7.1 Création de la base de données 73](#_Toc193)  

[7.2. Codage de l'application 75](#_Toc194)  

[7.2.1. Présentation du code de l'API : 75](#_Toc195)  

[7.2.2. Présentation du code du projet React: 79](#_Toc196)  

[7.3. Présentation de l'application : 82](#_Toc197)  

[CONCLUSION GENERALE 83](#_Toc18)  

[BIBLIOGRAPHIE IX](#_Toc19)  

[WEBOGRAPHIE X](#_Toc20)  

[GLOSSAIRES XI](#_Toc21)  

[TABLE DES MATIERES XII](#_Toc22)  

[RESUME XV](#_Toc23)  

[ABSTRACT XVI](#_Toc24)  

# RESUME  

Hello Mada Technologie a intégré un stagiaire pour moderniser la gestion événementielle, auparavant fragmentée et non-numérisée. Un projet pour BeBit, plateforme web/mobile, a été lancé. Initialement, objectifs et attentes ont été définis ; une revue des pratiques actuelles a révélé lacunes, menant à des choix comme 2TUP, UML, Express, PostgreSQL et React. L'analyse conceptuelle a modélisé flux via diagrammes. Des interfaces ont démontré l'implémentation.  

Mots clés : modélisation, 2TUP, bases de données, PostgreSQL, frameworks, full-stack  

# ABSTRACT  

Hello Mada Technologie hosted an intern to overhaul event management, previously disjointed and undigitized. The BeBit platform project for web/mobile was initiated. Initially, goals and user needs were outlined; a review of current practices uncovered gaps, guiding selections like 2TUP, UML, Express, PostgreSQL, and React. Conceptual analysis modeled flows via diagrams. Interfaces showcased the build.  

Keywords: modeling, 2TUP, databases, PostgreSQL, frameworks, full-stack