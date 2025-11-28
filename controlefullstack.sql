-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 28 nov. 2025 à 15:44
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `controlefullstack`
--

-- --------------------------------------------------------

--
-- Structure de la table `choix`
--

DROP TABLE IF EXISTS `choix`;
CREATE TABLE IF NOT EXISTS `choix` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page_id` int NOT NULL,
  `texte` varchar(255) NOT NULL,
  `next_page_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `page_id` (`page_id`),
  KEY `pagesuivante_id` (`next_page_id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `choix`
--

INSERT INTO `choix` (`id`, `page_id`, `texte`, `next_page_id`) VALUES
(6, 1, 'choix 2', 3),
(5, 1, 'choix 1', 2),
(9, 2, 'Choix 1', 4),
(10, 2, 'Choix 2', 5);

-- --------------------------------------------------------

--
-- Structure de la table `histoire`
--

DROP TABLE IF EXISTS `histoire`;
CREATE TABLE IF NOT EXISTS `histoire` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) NOT NULL,
  `description` text,
  `statut` enum('brouillon','publié') NOT NULL DEFAULT 'brouillon',
  `pagedepart_id` int DEFAULT NULL,
  `auteur_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `auteur_id` (`auteur_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `histoire`
--

INSERT INTO `histoire` (`id`, `titre`, `description`, `statut`, `pagedepart_id`, `auteur_id`) VALUES
(1, 'Histoire 1', 'Description de l\'histoire', 'publié', 1, 2),
(2, '', NULL, 'brouillon', NULL, 2),
(3, 'Histoire 3', 'test', 'brouillon', NULL, 2);

-- --------------------------------------------------------

--
-- Structure de la table `page`
--

DROP TABLE IF EXISTS `page`;
CREATE TABLE IF NOT EXISTS `page` (
  `id` int NOT NULL AUTO_INCREMENT,
  `histoire_id` int NOT NULL,
  `contenu` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `isEnd` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `histoire_id` (`histoire_id`)
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `page`
--

INSERT INTO `page` (`id`, `histoire_id`, `contenu`, `isEnd`) VALUES
(1, 1, 'Bonjour, fait ton choix', 0),
(3, 1, 'Fin 1', 1),
(2, 1, 'Choix 1', 0),
(4, 1, 'Fin 2', 1),
(5, 1, 'Fin 3', 1);

-- --------------------------------------------------------

--
-- Structure de la table `statistique`
--

DROP TABLE IF EXISTS `statistique`;
CREATE TABLE IF NOT EXISTS `statistique` (
  `id` int NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int NOT NULL,
  `histoire_id` int NOT NULL,
  `pagefinale_id` int NOT NULL,
  `datecreation` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  KEY `histoire_id` (`histoire_id`),
  KEY `pagefinale_id` (`pagefinale_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `statistique`
--

INSERT INTO `statistique` (`id`, `utilisateur_id`, `histoire_id`, `pagefinale_id`, `datecreation`) VALUES
(1, 2, 1, 4, '2025-11-28 15:22:19'),
(2, 2, 1, 4, '2025-11-28 16:20:34');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `motdepasse` varchar(255) NOT NULL,
  `role` enum('auteur','lecteur','admin') NOT NULL DEFAULT 'lecteur',
  `statut` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `pseudo`, `email`, `motdepasse`, `role`, `statut`) VALUES
(1, 'Kelvin', 'kelvin@example.com', '$2b$10$3/s3V1qcPMESVVkFmAWmcuNR/vo9Nz9Gq1vzz7KRI/WFdmVZE74my', 'lecteur', 'banni'),
(2, 'test', 'test@example.com', '$2b$10$8r.YqfQ98Ys.TjzC6HiUf.5zya59W1SLnsKsVfi/lAiKkZCBHIUYC', 'lecteur', ''),
(3, 'admin', 'admin@example.com', '$2b$10$Ar3frijLzEpiOXRyy6RtHuUw33V/v0kqWGnKK.nPBuQCDU9DUibWy', 'admin', '');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
