-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 24 avr. 2023 à 10:24
-- Version du serveur : 10.4.27-MariaDB
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `banque`
--

-- --------------------------------------------------------

--
-- Structure de la table `account`
--

CREATE TABLE `account` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` int(11) NOT NULL,
  `balance` float NOT NULL,
  `createAt` varchar(255) NOT NULL,
  `updateAt` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `account`
--

INSERT INTO `account` (`id`, `name`, `phone`, `balance`, `createAt`, `updateAt`) VALUES
(1, 'Ludivine', 677582411, 5000, '1682103324439', '1682103324439'),
(2, 'Martin', 690562182, 5000, '1682103360220', '1682103360220'),
(3, 'Marlo', 670562182, 5000, '1682103376176', '1682103376176'),
(5, 'tata_1682108442528', 687582411, 5000, '1682108442625', '1682108442625'),
(6, 'tata_1682108605334', 637582411, 5000, '1682108605378', '1682108605378'),
(7, 'tata_1682109015035', 631582411, 5000, '1682109014927', '1682109015063'),
(8, 'tata_1682109649903', 632182411, 5000, '1682109649778', '1682109649929'),
(9, 'tata_1682110105517', 639182411, 5000, '1682109958791', '1682110105542');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `account`
--
ALTER TABLE `account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
