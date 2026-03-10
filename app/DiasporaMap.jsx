'use client';
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import * as d3 from "d3";

const TALENTS = [{"pays": "Bénin", "lat": 9.419241438766308, "lng": 1.9358086041781335, "age": "26-35", "niveau": "bac+5", "ecoles": "IDRAC, Euridis", "domaines": "Arts & Culture, Commerce & Entrepreneuriat, Éducation & Formation, Innovation & Tech", "statut": "Entrepreneur", "poste": "Fondateur de la marque Vodun et la Edtech Culturelle Teli", "entreprise": "", "linkedin": ""}, {"pays": "Bénin", "lat": 9.127723454695296, "lng": 2.094368590519058, "age": "26-35", "niveau": "bac+5", "ecoles": "École de politique appliquée, université de Sherbrooke", "domaines": "Politique & Gouvernance", "statut": "Salarié", "poste": "Chargée de coopération", "entreprise": "Ministère de l'économie et des finances", "linkedin": "https://www.linkedin.com/in/ana%C3%ABlle-jean-charles-4a428113b"}, {"pays": "Bénin", "lat": 9.496876971331211, "lng": 2.457159589938329, "age": "26-35", "niveau": "bac+8", "ecoles": "Grenoble Ecole de Management, Lancaster University, University of the Western Cape", "domaines": "Banque & Finance, Commerce & Entrepreneuriat, Innovation & Tech", "statut": "Salarié", "poste": "Senior Programs Manager", "entreprise": "Etrilabs", "linkedin": "https://linkedin.com/abiolaakobi"}, {"pays": "Bénin", "lat": 9.621443654163876, "lng": 1.9853510661035327, "age": "26-35", "niveau": "bac+5", "ecoles": "ESAE", "domaines": "Arts & Culture, Commerce & Entrepreneuriat, Éducation & Formation, Innovation & Tech", "statut": "Salarié", "poste": "Manager", "entreprise": "Digital Valley", "linkedin": "https://www.linkedin.com/in/yanndjossinou"}, {"pays": "France", "lat": 48.79413745574821, "lng": 1.9760377755504561, "age": "26-35", "niveau": "bac+5", "ecoles": "Junia Isen, université catholique de Lille", "domaines": "Autre", "statut": "Salarié", "poste": "Consultant/Officier Cybersécurité", "entreprise": "Advens", "linkedin": "https://www.linkedin.com/in/alan-adotevi"}, {"pays": "France", "lat": 48.63151037984288, "lng": 2.35648423048269, "age": "26-35", "niveau": "bac+8", "ecoles": "Faculté de médecine", "domaines": "Médecine & Santé", "statut": "Salarié", "poste": "Gynécologue obstétricien", "entreprise": "CHR Metz Thionville", "linkedin": ""}, {"pays": "France", "lat": 48.47782877574709, "lng": 2.1112701205493187, "age": "26-35", "niveau": "bac+8", "ecoles": "DEC", "domaines": "Banque & Finance", "statut": "Salarié", "poste": "Manager audit", "entreprise": "Ernst & Young", "linkedin": "https://www.linkedin.com/in/lydvine-zinsou"}, {"pays": "Bénin", "lat": 9.42760755022362, "lng": 2.351753184482573, "age": "26-35", "niveau": "bac+5", "ecoles": "Ecole Supérieure Polytechnique de Dakar", "domaines": "Commerce & Entrepreneuriat, Ingénierie & BTP", "statut": "Entrepreneur", "poste": "Directeur Général", "entreprise": "AFAD STEEL", "linkedin": "https://www.linkedin.com/in/paolo-alissoutin-792b00146"}, {"pays": "Bénin", "lat": 9.084052497632557, "lng": 2.387212547100727, "age": "26-35", "niveau": "bac+5", "ecoles": "Institut Supérieur du Commerce; INSEEC Paris", "domaines": "Commerce & Entrepreneuriat, Innovation & Tech, Relations internationales", "statut": "Salarié", "poste": "Coordonnateur des opérations", "entreprise": "SESUR SA", "linkedin": ""}, {"pays": "France", "lat": 49.104144365342265, "lng": 1.9573990077424486, "age": "26-35", "niveau": "bac+5", "ecoles": "Neoma BS", "domaines": "Banque & Finance, Communication & Médias", "statut": "Salarié", "poste": "FP&A Group Controller", "entreprise": "RATP DEV", "linkedin": "https://www.linkedin.com/in/pierre-yves-loko-747237153"}, {"pays": "France", "lat": 49.10125540146625, "lng": 2.5107115159905815, "age": "18-25", "niveau": "bac+5", "ecoles": "Centrale Lille - ITEEM; Cranfield University UK", "domaines": "Commerce & Entrepreneuriat, Énergie & Environnement, Ingénierie & BTP, Autre", "statut": "Étudiant", "poste": "Ingénieure d'affaires", "entreprise": "OuiACT", "linkedin": "http://linkedin.com/in/lucileadjahi"}, {"pays": "Bénin", "lat": 9.179900413214394, "lng": 2.040183599849425, "age": "26-35", "niveau": "bac+5", "ecoles": "UAC", "domaines": "Communication & Médias", "statut": "Entrepreneur", "poste": "General Manager", "entreprise": "Fastlane Agence 360", "linkedin": "https://www.linkedin.com/in/olivier-max-zoumenou/"}, {"pays": "Bénin", "lat": 9.673470457765426, "lng": 2.1850756360901014, "age": "26-35", "niveau": "bac+5", "ecoles": "Sciences Po Bordeaux, Université de Stuttgart", "domaines": "Éducation & Formation, Politique & Gouvernance, Relations internationales", "statut": "Salarié", "poste": "Conseillère Technique", "entreprise": "GIZ", "linkedin": "https://www.linkedin.com/in/nadine-ablefoni-937b72209"}, {"pays": "France", "lat": 48.53079667470412, "lng": 2.029573101466771, "age": "26-35", "niveau": "bac+5", "ecoles": "", "domaines": "Droit & Justice", "statut": "Profession libérale", "poste": "Avocat", "entreprise": "Linklaters LLP", "linkedin": "https://www.linkedin.com/in/anisah-inoussa-390782129"}, {"pays": "Bénin", "lat": 9.585695493077969, "lng": 2.3987808250935125, "age": "26-35", "niveau": "bac+3", "ecoles": "University of Westminster (UK)", "domaines": "Arts & Culture, Commerce & Entrepreneuriat, Communication & Médias, Autre", "statut": "Salarié", "poste": "Chargé Pôle Communication Digitale", "entreprise": "Port Autonome de Cotonou", "linkedin": "http://linkedin.com/in/djiffa-r-tonato-ba3596154"}, {"pays": "France", "lat": 49.102302618619504, "lng": 2.535985429355054, "age": "18-25", "niveau": "bac+5", "ecoles": "ESP Paris", "domaines": "Arts & Culture, Communication & Médias", "statut": "Étudiant", "poste": "Assistante communication", "entreprise": "Cercle", "linkedin": "http://linkedin.com/in/ines-cone-bovis-"}, {"pays": "Suisse", "lat": 46.977082473163755, "lng": 7.825892611183496, "age": "26-35", "niveau": "bac+5", "ecoles": "HEC", "domaines": "Banque & Finance", "statut": "Salarié", "poste": "Trader - Securities Finance & Repo", "entreprise": "Leonteq", "linkedin": ""}, {"pays": "Bénin", "lat": 9.210527501766684, "lng": 2.3574325050185814, "age": "18-25", "niveau": "bac+3", "ecoles": "PIGIER", "domaines": "Communication & Médias", "statut": "Salarié", "poste": "Chargé de communication et marketing", "entreprise": "ENTOURAGE AFRICA", "linkedin": "https://www.linkedin.com/in/hamdiyath-bissiriou/"}, {"pays": "Sierra Leone", "lat": 8.729223731402396, "lng": -13.136884198108604, "age": "26-35", "niveau": "bac+5", "ecoles": "ESGF", "domaines": "Banque & Finance", "statut": "Salarié", "poste": "Directeur financier", "entreprise": "CFAO MOBILITY SIERRA LEONE", "linkedin": "https://www.linkedin.com/in/yvann-coffi-929837b3"}, {"pays": "France", "lat": 49.14596552024862, "lng": 2.4140817162054096, "age": "26-35", "niveau": "bac+5", "ecoles": "INSEEC MSC & MBA", "domaines": "Banque & Finance", "statut": "Salarié", "poste": "Gestion de Patrimoine", "entreprise": "Societe Generale", "linkedin": ""}, {"pays": "France", "lat": 49.02025746897194, "lng": 1.9888595069245296, "age": "26-35", "niveau": "bac+5", "ecoles": "EDHEC BUSINESS SCHOOL", "domaines": "Banque & Finance", "statut": "Salarié", "poste": "Senior expérimenté", "entreprise": "KPMG", "linkedin": ""}, {"pays": "Bénin", "lat": 9.090018620521239, "lng": 2.1473103708816854, "age": "26-35", "niveau": "bac+5", "ecoles": "ISC Paris", "domaines": "Communication & Médias", "statut": "Salarié", "poste": "Responsable Communication Produit", "entreprise": "Celtiis", "linkedin": "https://www.linkedin.com/in/frédéric-dagnon-6a215481/"}, {"pays": "Bénin", "lat": 8.971533581538903, "lng": 2.102032709088824, "age": "26-35", "niveau": "bac+8", "ecoles": "Faculté des Sciences de la Santé", "domaines": "Médecine & Santé", "statut": "Profession libérale", "poste": "Dermatologie-Vénérologue", "entreprise": "Clinique Pôle Santé, Clinique Oluwa Sheyi", "linkedin": ""}, {"pays": "Bénin", "lat": 8.988501143527785, "lng": 2.1381788824880736, "age": "26-35", "niveau": "bac+5", "ecoles": "UNIVERSITÉ CATHOLIQUE DE LILLE", "domaines": "Banque & Finance, Commerce & Entrepreneuriat", "statut": "Profession libérale", "poste": "Consultante nationale en intelligence commerciale", "entreprise": "APIEx/ ITC", "linkedin": ""}, {"pays": "Bénin", "lat": 9.416247555411521, "lng": 2.2076657431760673, "age": "26-35", "niveau": "bac+2", "ecoles": "École Normale d'Instituteurs", "domaines": "Arts & Culture, Innovation & Tech, Sport & Performance, Tourisme & Hôtellerie", "statut": "Salarié", "poste": "Content Manager", "entreprise": "Agence PROCOM", "linkedin": "https://www.linkedin.com/in/achraf-aboubakar-bb7674216"}, {"pays": "France", "lat": 48.75274477369351, "lng": 2.11980562461719, "age": "26-35", "niveau": "bac+5", "ecoles": "Polytech Grenoble", "domaines": "Innovation & Tech", "statut": "Salarié", "poste": "Ingénieur", "entreprise": "", "linkedin": ""}, {"pays": "France", "lat": 48.67018225763929, "lng": 2.701523670169995, "age": "26-35", "niveau": "bac+5", "ecoles": "IIM / EMLV", "domaines": "Innovation & Tech", "statut": "Salarié", "poste": "Consultant en Intelligence Décisionnelle / Data Analyst", "entreprise": "Aubay", "linkedin": "https://www.linkedin.com/in/youri-agbokou-b0a97a131"}, {"pays": "Bénin", "lat": 9.426128308197276, "lng": 2.4031048045335903, "age": "26-35", "niveau": "bac+5", "ecoles": "Inseec Lyon", "domaines": "Banque & Finance", "statut": "Salarié", "poste": "Analyste financier", "entreprise": "CAGD", "linkedin": "https://www.linkedin.com/in/maryline-quenum"}, {"pays": "France", "lat": 48.59351091855848, "lng": 2.535501438360279, "age": "18-25", "niveau": "bac+5", "ecoles": "Kedge", "domaines": "Commerce & Entrepreneuriat, Autre", "statut": "Salarié", "poste": "Assistante Achats/Production haute joaillerie", "entreprise": "Chaumet (LVMH)", "linkedin": "https://www.linkedin.com/in/priscille-tagbodji-a42bb2205"}, {"pays": "France", "lat": 48.587321995009546, "lng": 2.2557643534061182, "age": "26-35", "niveau": "bac+5", "ecoles": "ISTELI Paris", "domaines": "Autre", "statut": "Salarié", "poste": "Supply Chain & Operations Project Coordinator", "entreprise": "Essity", "linkedin": "https://www.linkedin.com/in/grace-gnamblohou-pmp"}, {"pays": "Bénin", "lat": 9.699318680509277, "lng": 2.4277998078832743, "age": "26-35", "niveau": "bac+5", "ecoles": "UMASS BOSTON, FLORIDA INTERNATIONAL UNIVERSITY, BARRY UNIVERSITY", "domaines": "Commerce & Entrepreneuriat, Relations internationales", "statut": "Entrepreneur", "poste": "Directeur Commercial & Exploitation", "entreprise": "RITIS GROUP", "linkedin": ""}, {"pays": "France", "lat": 48.90215979501972, "lng": 2.4998914007918995, "age": "26-35", "niveau": "bac+5", "ecoles": "Université de Nanterre", "domaines": "Banque & Finance, Éducation & Formation, Innovation & Tech", "statut": "Salarié", "poste": "Business Analyst IT", "entreprise": "Devoteam", "linkedin": "http://linkedin.com/in/bérénice-gnamblohou-4a28a912b"}, {"pays": "France", "lat": 49.13088153615185, "lng": 2.5729999292369956, "age": "18-25", "niveau": "bac+5", "ecoles": "CY Tech, MBA ESG Paris", "domaines": "Banque & Finance, Innovation & Tech, Autre", "statut": "Salarié", "poste": "Ingénieur", "entreprise": "", "linkedin": ""}, {"pays": "Royaume-Uni", "lat": 51.29063845757128, "lng": -0.5021198048767698, "age": "26-35", "niveau": "bac+5", "ecoles": "ESCP business school", "domaines": "Banque & Finance", "statut": "Salarié", "poste": "Analyst investment banking", "entreprise": "", "linkedin": ""}, {"pays": "Bénin", "lat": 9.160062438447266, "lng": 2.129992700780562, "age": "26-35", "niveau": "bac+5", "ecoles": "Université Sorbonne Paris Nord, European Communication School", "domaines": "Communication & Médias", "statut": "Salarié", "poste": "Communication Officer", "entreprise": "EtriLabs", "linkedin": "https://www.linkedin.com/in/gloria-maria-djossinou/"}, {"pays": "France", "lat": 48.62538627486906, "lng": 2.7065277714680436, "age": "26-35", "niveau": "bac+5", "ecoles": "Montpellier Business School", "domaines": "Arts & Culture, Banque & Finance, Sport & Performance", "statut": "Salarié", "poste": "Consultant en Finance, Stratégie et Transformation", "entreprise": "KPMG", "linkedin": "https://www.linkedin.com/in/alexandre-ahoyo"}, {"pays": "France", "lat": 49.15769410117814, "lng": 2.2039423046387823, "age": "26-35", "niveau": "bac+5", "ecoles": "CentraleSupélec", "domaines": "Innovation & Tech", "statut": "Salarié", "poste": "Consultant/Ingénieur devops", "entreprise": "BNP", "linkedin": "https://www.linkedin.com/in/cadnel-z-9197b7122"}, {"pays": "France", "lat": 48.980950932235906, "lng": 2.268705520848531, "age": "18-25", "niveau": "bac+5", "ecoles": "CY Tech, MBA ESG Paris", "domaines": "Banque & Finance, Innovation & Tech, Autre", "statut": "Salarié", "poste": "Ingénieure Data - Chargée d'études", "entreprise": "", "linkedin": "https://www.linkedin.com/in/audrey-gnamblohou"}, {"pays": "France", "lat": 49.18823807179243, "lng": 2.319281482069919, "age": "26-35", "niveau": "bac+5", "ecoles": "INSEEC MSc & MBA, Paris 1 Panthéon-Sorbonne", "domaines": "Droit & Justice", "statut": "Salarié", "poste": "Juriste et Référente Juridique en Droit Fiscal", "entreprise": "Groupe COVEA", "linkedin": "https://www.linkedin.com/in/rodiane-amoussou-guenou-32b3161a4"}, {"pays": "France", "lat": 48.66850413319844, "lng": 2.1495020061551866, "age": "26-35", "niveau": "bac+5", "ecoles": "Grenoble Ecole de Management", "domaines": "Innovation & Tech", "statut": "Profession libérale", "poste": "Product Owner experience cloud & Service Cloud (CRM)", "entreprise": "Engie", "linkedin": "https://www.linkedin.com/in/izarm-adounvo"}, {"pays": "France", "lat": 48.90569450733052, "lng": 2.162393286818348, "age": "18-25", "niveau": "bac+5", "ecoles": "ESIEA", "domaines": "Innovation & Tech", "statut": "Étudiant", "poste": "Alternante data scientist", "entreprise": "Manpower France", "linkedin": "https://www.linkedin.com/in/laurinegnamblohou"}, {"pays": "France", "lat": 48.924268792178836, "lng": 2.6704583068819816, "age": "26-35", "niveau": "bac+5", "ecoles": "Université Paris Nanterre", "domaines": "Banque & Finance, Innovation & Tech", "statut": "Salarié", "poste": "Modélisation Risques et ALM", "entreprise": "Banque Chabrières", "linkedin": "https://www.linkedin.com/in/melissa-sucle"}, {"pays": "France", "lat": 48.77612040411232, "lng": 2.1276566073258265, "age": "26-35", "niveau": "bac+5", "ecoles": "ITECH Lyon, ENSAM Paris", "domaines": "Énergie & Environnement, Recherche & Sciences", "statut": "Salarié", "poste": "Chef de projet", "entreprise": "", "linkedin": "https://www.linkedin.com/in/lauren-gnigla-0b261939"}, {"pays": "France", "lat": 49.25463008519609, "lng": 2.3598210349411715, "age": "26-35", "niveau": "bac+5", "ecoles": "ESIEA", "domaines": "Innovation & Tech", "statut": "Étudiant", "poste": "", "entreprise": "", "linkedin": ""}, {"pays": "France", "lat": 48.529327529739035, "lng": 1.9898931003397875, "age": "26-35", "niveau": "bac+5", "ecoles": "", "domaines": "Énergie & Environnement", "statut": "Salarié", "poste": "Consultant en Efficacité énergétique", "entreprise": "ABYLSEN", "linkedin": "https://www.linkedin.com/in/loïc-bohoun-28817012b"}, {"pays": "Bénin", "lat": 8.995419304280528, "lng": 2.417756833362472, "age": "36-45", "niveau": "bac+5", "ecoles": "ISEG PARIS", "domaines": "Arts & Culture, Commerce & Entrepreneuriat, Communication & Médias", "statut": "Entrepreneur", "poste": "Directeur", "entreprise": "Agence Point Com", "linkedin": "https://www.linkedin.com/in/kwassi-daniel-malangue-677a7869"}, {"pays": "Bénin", "lat": 9.541363491490372, "lng": 2.253527973439747, "age": "26-35", "niveau": "bac+5", "ecoles": "ESTP PARIS", "domaines": "Ingénierie & BTP", "statut": "Salarié", "poste": "Directeur de travaux", "entreprise": "Koffi et Diabaté", "linkedin": "http://linkedin.com/in/orphée-abalo-6718b8119"}, {"pays": "France", "lat": 48.507422164921564, "lng": 2.257495429205229, "age": "18-25", "niveau": "bac+5", "ecoles": "Espol, Efap", "domaines": "Arts & Culture, Communication & Médias", "statut": "Salarié", "poste": "Chef de Projet / Attachée de presse", "entreprise": "Furst Agency", "linkedin": "https://www.linkedin.com/in/morayo-osseni/"}, {"pays": "France", "lat": 49.25349710419208, "lng": 2.3754914760793095, "age": "26-35", "niveau": "bac+5", "ecoles": "EURIA", "domaines": "Banque & Finance", "statut": "Étudiant", "poste": "Technicien niveau 2 actuariat", "entreprise": "Generali", "linkedin": "https://www.linkedin.com/in/carène-dossou-yovo-1a6331203"}, {"pays": "Bénin", "lat": 9.684562702090895, "lng": 2.6044237617875985, "age": "18-25", "niveau": "bac+5", "ecoles": "Université de Genève", "domaines": "Politique & Gouvernance, Relations internationales", "statut": "Étudiant", "poste": "Consultante stagiaire en affaires publiques", "entreprise": "Public Affairs Africa", "linkedin": "http://linkedin.com/in/lola-salam-0a09b3236"}, {"pays": "France", "lat": 48.46578481755426, "lng": 2.5287774554881555, "age": "26-35", "niveau": "bac+5", "ecoles": "Université Paris X", "domaines": "Banque & Finance", "statut": "Salarié", "poste": "Chargée de middle office", "entreprise": "La Banque Postale", "linkedin": ""}, {"pays": "France", "lat": 49.00196829522126, "lng": 2.381776264327036, "age": "26-35", "niveau": "bac+5", "ecoles": "ESIGELEC", "domaines": "Innovation & Tech", "statut": "Profession libérale", "poste": "Senior Analytics Engineer", "entreprise": "Freelance", "linkedin": "https://www.linkedin.com/in/jeanmarczinzindohoue/"}, {"pays": "France", "lat": 48.67006015196203, "lng": 2.4649694388638466, "age": "18-25", "niveau": "bac+5", "ecoles": "EM Lyon, Skema", "domaines": "Banque & Finance, Innovation & Tech", "statut": "Salarié", "poste": "Investment Analyst", "entreprise": "Private Market", "linkedin": "https://www.linkedin.com/in/dayanedorego"}, {"pays": "Bénin", "lat": 8.996941738876702, "lng": 2.2636122005352837, "age": "18-25", "niveau": "bac+5", "ecoles": "INSEEC", "domaines": "Politique & Gouvernance", "statut": "Étudiant", "poste": "", "entreprise": "", "linkedin": ""}, {"pays": "France", "lat": 48.819578965063364, "lng": 2.715252742016864, "age": "26-35", "niveau": "bac+5", "ecoles": "", "domaines": "Commerce & Entrepreneuriat", "statut": "Entrepreneur", "poste": "CEO", "entreprise": "Ayo Agency", "linkedin": ""}, {"pays": "France", "lat": 49.15728235230256, "lng": 2.1629112406008724, "age": "18-25", "niveau": "bac+5", "ecoles": "", "domaines": "Ingénierie & BTP, Innovation & Tech", "statut": "Étudiant", "poste": "Chef de projet IA", "entreprise": "Caisse d'épargne", "linkedin": "https://www.linkedin.com/in/ismaël-aminou"}, {"pays": "France", "lat": 48.85706889044024, "lng": 2.095121504424105, "age": "26-35", "niveau": "bac+5", "ecoles": "ESIEA", "domaines": "Innovation & Tech", "statut": "Salarié", "poste": "Senior Data Engineer", "entreprise": "BNP PARIBAS", "linkedin": "https://www.linkedin.com/in/jean-baptiste-yehouenou"}, {"pays": "France", "lat": 49.18670227147586, "lng": 2.6486148558694134, "age": "26-35", "niveau": "bac+5", "ecoles": "INSEEC", "domaines": "Banque & Finance", "statut": "Salarié", "poste": "Head of Credit Europe", "entreprise": "Banque Privée", "linkedin": "https://www.linkedin.com/in/emeric-sotomey-439570139"}, {"pays": "France", "lat": 48.69535583315891, "lng": 2.463359595892804, "age": "26-35", "niveau": "bac+3", "ecoles": "IUT Amiens, Cnam Paris", "domaines": "Agriculture & Agroalimentaire", "statut": "Salarié", "poste": "Responsable de production", "entreprise": "Les moulins associés", "linkedin": ""}, {"pays": "France", "lat": 48.94377616915054, "lng": 2.0744714148397074, "age": "26-35", "niveau": "bac+5", "ecoles": "Université de Cergy", "domaines": "Arts & Culture, Commerce & Entrepreneuriat, Communication & Médias, Innovation & Tech, Sport & Performance", "statut": "Entrepreneur", "poste": "Ingénieur QA", "entreprise": "À mon compte", "linkedin": "https://www.linkedin.com/in/olajuwon-nicolas-houegbelo-78198ba2"}, {"pays": "France", "lat": 49.066608640060124, "lng": 2.3837032240957003, "age": "36-45", "niveau": "bac+5", "ecoles": "Télécom SudParis", "domaines": "Innovation & Tech", "statut": "Salarié", "poste": "Architecte Informatique", "entreprise": "Capgemini", "linkedin": "https://www.linkedin.com/in/solia-gr%C3%A2ce-g-4aa65883"}, {"pays": "Bénin", "lat": 9.530601182904448, "lng": 2.340082937756142, "age": "26-35", "niveau": "bac+3", "ecoles": "UATM Gasa formation, UM6P", "domaines": "Commerce & Entrepreneuriat, Éducation & Formation, Innovation & Tech", "statut": "Salarié", "poste": "Consultant Go To Market", "entreprise": "Open SI", "linkedin": "https://www.linkedin.com/in/kelvin-adantchede-51417713a"}];

const DOMAIN_COLORS = {
  "Innovation & Tech": "#818cf8",
  "Banque & Finance": "#fbbf24",
  "Commerce & Entrepreneuriat": "#34d399",
  "Communication & Médias": "#f472b6",
  "Arts & Culture": "#a78bfa",
  "Médecine & Santé": "#f87171",
  "Droit & Justice": "#94a3b8",
  "Ingénierie & BTP": "#fb923c",
  "Politique & Gouvernance": "#38bdf8",
  "Éducation & Formation": "#a3e635",
  "Relations internationales": "#22d3ee",
  "Énergie & Environnement": "#4ade80",
  "Recherche & Sciences": "#c084fc",
  "Sport & Performance": "#fb7185",
  "Agriculture & Agroalimentaire": "#a8a29e",
  "Tourisme & Hôtellerie": "#2dd4bf",
  "Autre": "#64748b",
};

function getPrimaryDomain(domaines) {
  if (!domaines) return "Autre";
  return domaines.split(",")[0].trim() || "Autre";
}
function getColor(domaines) {
  return DOMAIN_COLORS[getPrimaryDomain(domaines)] || "#64748b";
}

const STATUT_ICON = { "Entrepreneur": "🚀", "Étudiant": "🎓", "Profession libérale": "⚖️", "Salarié": "💼" };

const ALL_STATUTS = ["Salarié", "Entrepreneur", "Étudiant", "Profession libérale"];
const ALL_PAYS = ["Bénin", "France", "Royaume-Uni", "Suisse", "Sierra Leone"];

export default function DiasporaMap() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [geoData, setGeoData] = useState(null);
  const [projection, setProjection] = useState(null);
  const [size, setSize] = useState({ w: 800, h: 500 });
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [filterDomain, setFilterDomain] = useState("Tous");
  const [filterStatut, setFilterStatut] = useState("Tous");
  const [filterPays, setFilterPays] = useState("Tous");
  const [tooltip, setTooltip] = useState(null);
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const zoomRef = useRef(null);

  // Load world GeoJSON
  useEffect(() => {
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then(r => r.json())
      .then(world => {
        const { feature } = d3;
        const topojson = window.topojson;
        // Use d3 directly
        setGeoData(world);
      })
      .catch(() => {
        // fallback: load via different approach
      });
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setSize({ w: width, h: height });
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Build projection
  useEffect(() => {
    if (!size.w) return;
    const proj = d3.geoNaturalEarth1()
      .scale(size.w / 6.5)
      .translate([size.w / 2, size.h / 2]);
    setProjection(() => proj);
  }, [size]);

  // Setup zoom
  useEffect(() => {
    if (!svgRef.current || !projection) return;
    const svg = d3.select(svgRef.current);
    /* const zoom = d3.zoom()
      .scaleExtent([1, 12])
      .on("zoom", (event) => {
        setTransform({ k: event.transform.k, x: event.transform.x, y: event.transform.y });
      }); */

	const zoom = d3.zoom()
      .scaleExtent([1, 12])
      .on("zoom", (event) => {
	      const { k, x, y } = event.transform;
	      console.log({ k, x, y });
        setTransform({ k, x, y });
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Initial zoom to West Africa + Europe
    const initTransform = d3.zoomIdentity.translate(-1233.11, -266.75).scale(2.8);
    svg.call(zoom.transform, initTransform);
    setTransform({ k: initTransform.k, x: initTransform.x, y: initTransform.y });
  }, [projection, size]);

  const pathGen = useMemo(() => {
    if (!projection) return null;
    return d3.geoPath().projection(projection);
  }, [projection]);

  // Countries from topojson
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    if (!geoData || !pathGen) return;
    // Try topojson
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js";
    script.onload = () => {
      const features = window.topojson.feature(geoData, geoData.objects.countries).features;
      setCountries(features);
    };
    if (window.topojson) {
      const features = window.topojson.feature(geoData, geoData.objects.countries).features;
      setCountries(features);
    } else {
      document.head.appendChild(script);
    }
  }, [geoData, pathGen]);

  const filtered = useMemo(() => TALENTS.filter(t => {
    const d = filterDomain === "Tous" || (t.domaines && t.domaines.includes(filterDomain));
    const s = filterStatut === "Tous" || t.statut === filterStatut;
    const p = filterPays === "Tous" || t.pays === filterPays;
    return d && s && p;
  }), [filterDomain, filterStatut, filterPays]);

  const countsByCountry = useMemo(() => {
    const c = {}; ALL_PAYS.forEach(p => c[p] = 0);
    filtered.forEach(t => { if (c[t.pays] !== undefined) c[t.pays]++; });
    return c;
  }, [filtered]);

  const countsByDomain = useMemo(() => {
    const c = {};
    filtered.forEach(t => {
      if (!t.domaines) return;
      t.domaines.split(",").forEach(d => { const k = d.trim(); c[k] = (c[k] || 0) + 1; });
    });
    return c;
  }, [filtered]);

  const dots = useMemo(() => {
    if (!projection) return [];
    return filtered.map((t, i) => {
      const pt = projection([t.lng, t.lat]);
      if (!pt) return null;
      return { ...t, x: pt[0], y: pt[1], i };
    }).filter(Boolean);
  }, [filtered, projection]);

  // Arc paths from Benin centroid to each other country
  const arcPaths = useMemo(() => {
    if (!projection) return [];
    const beninCenter = projection([2.315, 9.307]);
    const targets = {
      "France": projection([2.352, 46.6]),
      "Royaume-Uni": projection([-1.5, 52.5]),
      "Suisse": projection([8.2, 46.8]),
      "Sierra Leone": projection([-11.8, 8.5]),
    };
    return Object.entries(targets).map(([pays, pt]) => {
      if (!pt || !beninCenter) return null;
      const count = countsByCountry[pays] || 0;
      if (count === 0) return null;
      const mx = (beninCenter[0] + pt[0]) / 2;
      const my = Math.min(beninCenter[1], pt[1]) - 60;
      return { pays, d: `M ${beninCenter[0]} ${beninCenter[1]} Q ${mx} ${my} ${pt[0]} ${pt[1]}`, count };
    }).filter(Boolean);
  }, [projection, countsByCountry]);

  const handleZoomReset = () => {
    if (!svgRef.current || !zoomRef.current) return;
    const svg = d3.select(svgRef.current);
    const t = d3.zoomIdentity.translate(size.w * 0.08, size.h * 0.05).scale(2.2);
    svg.transition().duration(750).call(zoomRef.current.transform, t);
  };

  const HIGHLIGHT_COUNTRIES = ["Benin", "France", "United Kingdom", "Switzerland", "Sierra Leone"];
  const COUNTRY_IDS = { "24": "Benin", "250": "France", "826": "United Kingdom", "756": "Switzerland", "694": "Sierra Leone" };

  return (
    <div style={{ fontFamily: "'Crimson Text', 'Georgia', serif", background: "#080c14", minHeight: "100vh", color: "#dde4f0", display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(90deg, #0d1525 0%, #0a1020 100%)", borderBottom: "1px solid #1c2840", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #f5c842, #e8953a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🇧🇯</div>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#f0e6c8", letterSpacing: 0.3 }}>Talents de la Diaspora Béninoise</h1>
            <p style={{ margin: 0, fontSize: 11, color: "#5a7090", fontStyle: "italic" }}>{filtered.length} talents · {Object.values(countsByCountry).filter(c => c > 0).length} pays</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {ALL_PAYS.map(p => (
            <div key={p} onClick={() => setFilterPays(filterPays === p ? "Tous" : p)}
              style={{ background: filterPays === p ? "#1e3a5f" : "#0d1525", border: `1px solid ${filterPays === p ? "#2a5a9f" : "#1c2840"}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer", color: filterPays === p ? "#7eb8f7" : "#607090", transition: "all 0.2s" }}>
              <strong style={{ color: filterPays === p ? "#a8d4ff" : "#8090a8" }}>{countsByCountry[p]}</strong> {p}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Left filters */}
        <div style={{ width: 200, background: "#0a0f1a", borderRight: "1px solid #141e30", padding: "14px 12px", overflowY: "auto", flexShrink: 0, fontSize: 12 }}>

          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#3a5070", textTransform: "uppercase", marginBottom: 8, fontFamily: "monospace" }}>STATUT</div>
            {["Tous", ...ALL_STATUTS].map(s => {
              const cnt = s === "Tous" ? filtered.length : filtered.filter(t => t.statut === s).length;
              return (
                <button key={s} onClick={() => setFilterStatut(s)} style={{
                  display: "flex", justifyContent: "space-between", width: "100%", padding: "5px 8px", marginBottom: 2,
                  background: filterStatut === s ? "#0f2040" : "transparent", color: filterStatut === s ? "#7eb8f7" : "#4a6080",
                  border: filterStatut === s ? "1px solid #1a4080" : "1px solid transparent",
                  borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: "inherit", textAlign: "left"
                }}>
                  <span>{s === "Tous" ? "Tous" : `${STATUT_ICON[s]} ${s}`}</span>
                  <span style={{ color: "#2a4060" }}>{cnt}</span>
                </button>
              );
            })}
          </div>

          <div>
            <div style={{ fontSize: 9, letterSpacing: 2.5, color: "#3a5070", textTransform: "uppercase", marginBottom: 8, fontFamily: "monospace" }}>DOMAINE</div>
            <button onClick={() => setFilterDomain("Tous")} style={{
              display: "flex", justifyContent: "space-between", width: "100%", padding: "5px 8px", marginBottom: 2,
              background: filterDomain === "Tous" ? "#0f2040" : "transparent", color: filterDomain === "Tous" ? "#7eb8f7" : "#4a6080",
              border: filterDomain === "Tous" ? "1px solid #1a4080" : "1px solid transparent",
              borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: "inherit", textAlign: "left"
            }}>
              <span>Tous</span><span style={{ color: "#2a4060" }}>{filtered.length}</span>
            </button>
            {Object.entries(countsByDomain).sort((a, b) => b[1] - a[1]).map(([d, c]) => (
              <button key={d} onClick={() => setFilterDomain(d)} style={{
                display: "flex", alignItems: "center", gap: 5, width: "100%", padding: "5px 8px", marginBottom: 2,
                background: filterDomain === d ? "#0f2040" : "transparent", color: filterDomain === d ? "#a8c8ff" : "#4a6080",
                border: filterDomain === d ? "1px solid #1a4080" : "1px solid transparent",
                borderRadius: 4, cursor: "pointer", fontSize: 10, fontFamily: "inherit", textAlign: "left"
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: DOMAIN_COLORS[d] || "#64748b", flexShrink: 0, boxShadow: `0 0 4px ${DOMAIN_COLORS[d]}` }}></span>
                <span style={{ flex: 1 }}>{d}</span>
                <span style={{ color: "#2a4060" }}>{c}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div ref={containerRef} style={{ flex: 1, position: "relative", background: "#060a10", overflow: "hidden" }}>
          <svg ref={svgRef} width="100%" height="100%" style={{ display: "block", cursor: "grab" }}>
            <defs>
              <radialGradient id="oceanGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0a1525" />
                <stop offset="100%" stopColor="#060a10" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="softglow">
                <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <rect width="100%" height="100%" fill="url(#oceanGrad)" />

            <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
              {/* Country paths */}
              {pathGen && countries.map((feature) => {
                const id = feature.id;
                const isHighlight = !!COUNTRY_IDS[id];
                const name = COUNTRY_IDS[id];
                const isBenin = name === "Benin";
                return (
                  <path
                    key={id}
                    d={pathGen(feature)}
                    fill={isBenin ? "#2a3d1a" : isHighlight ? "#1a2a40" : "#0f1a28"}
                    stroke={isBenin ? "#f5c842" : isHighlight ? "#2a4060" : "#0d1620"}
                    strokeWidth={isBenin ? 0.8 / transform.k : isHighlight ? 0.5 / transform.k : 0.3 / transform.k}
                    opacity={isHighlight ? 1 : 0.7}
                  />
                );
              })}

              {/* Graticule */}
              {pathGen && (
                <path d={pathGen(d3.geoGraticule()())} fill="none" stroke="#0e1a28" strokeWidth={0.3 / transform.k} />
              )}

              {/* Arc connections */}
              {arcPaths.map(({ pays, d, count }) => (
                <path key={pays} d={d} fill="none"
                  stroke="rgba(245,200,70,0.15)"
                  strokeWidth={Math.min(count * 0.3 + 0.5, 2) / transform.k}
                  strokeDasharray={`${4 / transform.k},${3 / transform.k}`}
                />
              ))}

              {/* Talent dots */}
              {dots.map((t) => {
                const color = getColor(t.domaines);
                const isHov = hovered === t.i;
                const isSel = selected && selected.i === t.i;
                const r = (isSel ? 6 : isHov ? 5.5 : 4) / transform.k;
                return (
                  <g key={t.i} style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => { setHovered(t.i); setTooltip({ t, x: e.clientX, y: e.clientY }); }}
                    onMouseLeave={() => { setHovered(null); setTooltip(null); }}
                    onClick={() => setSelected(isSel ? null : t)}>
                    {(isHov || isSel) && (
                      <circle cx={t.x} cy={t.y} r={r * 2.8} fill={color} opacity={0.12} />
                    )}
                    <circle cx={t.x} cy={t.y} r={r}
                      fill={color}
                      stroke={isSel ? "#fff" : isHov ? color : "rgba(0,0,0,0.4)"}
                      strokeWidth={(isSel ? 1.5 : 0.8) / transform.k}
                      filter={isHov || isSel ? "url(#softglow)" : undefined}
                      opacity={0.9}
                    />
                  </g>
                );
              })}

              {/* Country labels */}
              {projection && pathGen && [
                { name: "Bénin", coords: [2.315, 9.307], accent: true },
                { name: "France", coords: [2.352, 46.2], accent: false },
                { name: "Royaume-Uni", coords: [-1.5, 52.5], accent: false },
                { name: "Suisse", coords: [8.2, 46.8], accent: false },
                { name: "Sierra Leone", coords: [-11.8, 8.5], accent: false },
              ].map(({ name, coords, accent }) => {
                const pt = projection(coords);
                if (!pt) return null;
                const pays = name;
                const count = countsByCountry[pays] || 0;
                if (count === 0) return null;
                const fs = (accent ? 11 : 9) / transform.k;
                return (
                  <g key={name}>
                    <text x={pt[0]} y={pt[1] - 14 / transform.k} textAnchor="middle"
                      fontSize={fs} fill={accent ? "#f5c842" : "#5a8ab8"} fontWeight="600"
                      style={{ pointerEvents: "none", fontFamily: "Georgia, serif" }}>
                      {pays}
                    </text>
                    <text x={pt[0]} y={pt[1] - 5 / transform.k} textAnchor="middle"
                      fontSize={fs * 0.8} fill={accent ? "#a08030" : "#2a5070"}
                      style={{ pointerEvents: "none", fontFamily: "monospace" }}>
                      {count} talent{count > 1 ? "s" : ""}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Zoom controls */}
          <div style={{ position: "absolute", bottom: 20, right: 20, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { label: "+", action: () => { const svg = d3.select(svgRef.current); svg.transition().call(zoomRef.current.scaleBy, 1.5); } },
              { label: "−", action: () => { const svg = d3.select(svgRef.current); svg.transition().call(zoomRef.current.scaleBy, 0.67); } },
              { label: "⌂", action: handleZoomReset },
            ].map(({ label, action }) => (
              <button key={label} onClick={action} style={{
                width: 32, height: 32, background: "#0d1a2a", border: "1px solid #1c2840",
                color: "#5a8ab8", borderRadius: 4, cursor: "pointer", fontSize: label === "⌂" ? 14 : 18,
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace"
              }}>{label}</button>
            ))}
          </div>

          {/* Tooltip */}
          {tooltip && !selected && (
            <div style={{
              position: "fixed", left: tooltip.x + 14, top: tooltip.y - 30,
              background: "#0d1a2a", border: "1px solid #1c3050", borderRadius: 6,
              padding: "8px 12px", pointerEvents: "none", maxWidth: 220, zIndex: 100,
              boxShadow: "0 8px 24px rgba(0,0,0,0.6)"
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#d0e4f8", marginBottom: 2 }}>
                {tooltip.t.poste || "—"}
              </div>
              {tooltip.t.entreprise && <div style={{ fontSize: 11, color: "#4a8ab8" }}>{tooltip.t.entreprise}</div>}
              <div style={{ fontSize: 10, color: "#2a5070", marginTop: 4 }}>{tooltip.t.pays} · {tooltip.t.statut}</div>
              {tooltip.t.domaines && (
                <div style={{ marginTop: 4, display: "flex", gap: 3, flexWrap: "wrap" }}>
                  {tooltip.t.domaines.split(",").slice(0, 2).map(d => (
                    <span key={d} style={{ fontSize: 9, background: getColor(d) + "22", color: getColor(d), borderRadius: 3, padding: "1px 5px" }}>{d.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right panel - detail */}
        {selected && (
          <div style={{ width: 270, background: "#0a0f1a", borderLeft: "1px solid #141e30", padding: "18px 16px", overflowY: "auto", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: getColor(selected.domaines) + "22", border: `1px solid ${getColor(selected.domaines)}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                {STATUT_ICON[selected.statut] || "💼"}
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "#0d1a2a", border: "1px solid #1c2840", color: "#4a6080", cursor: "pointer", fontSize: 14, padding: "4px 8px", borderRadius: 4, fontFamily: "monospace" }}>✕</button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#c8daf0", lineHeight: 1.4, marginBottom: 4 }}>{selected.poste || "—"}</div>
              {selected.entreprise && <div style={{ fontSize: 12, color: "#3a7ab8" }}>{selected.entreprise}</div>}
            </div>

            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 14 }}>
              <span style={{ background: "#0f2040", color: "#5a9acf", borderRadius: 4, padding: "2px 8px", fontSize: 10, border: "1px solid #1a3060" }}>{selected.pays}</span>
              {selected.statut && <span style={{ background: "#0d1a28", color: "#4a6a80", borderRadius: 4, padding: "2px 8px", fontSize: 10, border: "1px solid #141e30" }}>{selected.statut}</span>}
              {selected.age && <span style={{ background: "#0d1a28", color: "#4a6a80", borderRadius: 4, padding: "2px 8px", fontSize: 10, border: "1px solid #141e30" }}>{selected.age} ans</span>}
              {selected.niveau && <span style={{ background: "#0d1a28", color: "#4a6a80", borderRadius: 4, padding: "2px 8px", fontSize: 10, border: "1px solid #141e30" }}>{selected.niveau}</span>}
            </div>

            {selected.domaines && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: "#2a4060", textTransform: "uppercase", marginBottom: 6, fontFamily: "monospace" }}>Domaines</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {selected.domaines.split(",").map(d => {
                    const col = getColor(d.trim());
                    return (
                      <span key={d} style={{ background: col + "18", color: col, border: `1px solid ${col}35`, borderRadius: 4, padding: "2px 7px", fontSize: 10 }}>{d.trim()}</span>
                    );
                  })}
                </div>
              </div>
            )}

            {selected.ecoles && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: "#2a4060", textTransform: "uppercase", marginBottom: 6, fontFamily: "monospace" }}>Formation</div>
                <div style={{ fontSize: 11, color: "#5a7090", lineHeight: 1.5 }}>{selected.ecoles}</div>
              </div>
            )}

            {selected.linkedin && (
              <a href={selected.linkedin} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "center", gap: 7, background: "#0a66c2", color: "#fff",
                borderRadius: 6, padding: "9px 12px", textDecoration: "none", fontSize: 12, fontWeight: 600,
                justifyContent: "center", marginTop: 4
              }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            )}
          </div>
        )}
      </div>

      {/* Bottom legend bar */}
      <div style={{ background: "#080c14", borderTop: "1px solid #0e1828", padding: "5px 20px", display: "flex", gap: 16, alignItems: "center", flexShrink: 0, overflowX: "auto" }}>
        {Object.entries(countsByDomain).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([d, c]) => (
          <div key={d} style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: DOMAIN_COLORS[d], boxShadow: `0 0 5px ${DOMAIN_COLORS[d]}` }}></span>
            <span style={{ fontSize: 10, color: "#3a5070" }}>{d}</span>
            <span style={{ fontSize: 10, color: "#1a3050", fontFamily: "monospace" }}>{c}</span>
          </div>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 10, color: "#1a2a40", flexShrink: 0, fontFamily: "monospace" }}>scroll pour zoomer · clic pour sélectionner</span>
      </div>
    </div>
  );
}
