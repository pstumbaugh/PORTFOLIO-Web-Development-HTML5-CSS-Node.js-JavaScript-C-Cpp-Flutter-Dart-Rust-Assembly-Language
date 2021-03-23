-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 23, 2021 at 05:22 AM
-- Server version: 10.4.17-MariaDB-log
-- PHP Version: 7.4.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_stumbaup`
--

-- --------------------------------------------------------

--
-- Table structure for table `Artists`
--

CREATE TABLE `Artists` (
  `artistID` int(11) NOT NULL,
  `artistFirstName` varchar(255) DEFAULT NULL,
  `artistLastName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Artists`
--

INSERT INTO `Artists` (`artistID`, `artistFirstName`, `artistLastName`) VALUES
(1, 'Georgia', 'O\'Keeffe'),
(2, 'Pablo', 'Picaso'),
(3, 'Claude', 'Monet'),
(4, 'Frida', 'Kahlo'),
(5, 'Jackson', 'Pollock'),
(6, 'Gustav', 'Klimt'),
(7, 'Georges', 'Seurat'),
(8, 'Sandro', 'Botticelli'),
(9, 'Pierre Auguste', 'Renoir'),
(10, 'Michelangelo', 'Buonarroti'),
(11, 'Albert', 'Bierstadt'),
(12, 'Sandro', 'Botticelli');

-- --------------------------------------------------------

--
-- Table structure for table `Customers`
--

CREATE TABLE `Customers` (
  `customerID` int(11) NOT NULL,
  `customerFirstName` varchar(255) DEFAULT NULL,
  `customerLastName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Customers`
--

INSERT INTO `Customers` (`customerID`, `customerFirstName`, `customerLastName`) VALUES
(1, 'Neil', 'Armstrong'),
(2, 'Buzz', 'Aldrin'),
(3, 'Sally', 'Ride'),
(4, 'Valentina', 'Tereshkova'),
(5, 'Galileo', 'Galilei'),
(6, 'John B.', 'McKay'),
(7, 'Albert', 'Crossfield'),
(8, 'Alan', 'Shepard'),
(9, 'Yuri', 'Gagarin'),
(10, 'Jim', 'Lovell'),
(11, 'Mae C.', 'Jemison');

-- --------------------------------------------------------

--
-- Table structure for table `Galleries`
--

CREATE TABLE `Galleries` (
  `galleryID` int(11) NOT NULL,
  `galleryName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Galleries`
--

INSERT INTO `Galleries` (`galleryID`, `galleryName`) VALUES
(1, 'Louvre'),
(2, 'The National Gallery'),
(3, 'MET'),
(4, 'Meuseum of Modern Art'),
(5, 'Uffizi Gallery'),
(6, 'Musée d\'Orsay'),
(7, 'The National Gallery'),
(8, 'The British Museum'),
(9, 'The Centre Pompidou'),
(10, 'Solomon R. Guggenheim'),
(11, 'The Art Institute of Chicago'),
(12, 'Museo del Prado'),
(13, 'Rijksmuseum'),
(14, 'Whitney Museum of American Art'),
(15, 'San Francisco Museum of Modern Art');

-- --------------------------------------------------------

--
-- Table structure for table `Orders`
--

CREATE TABLE `Orders` (
  `orderID` int(11) NOT NULL,
  `customerID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Orders`
--

INSERT INTO `Orders` (`orderID`, `customerID`) VALUES
(1, 1),
(2, 1),
(4, 2),
(5, 3),
(6, 3),
(7, 3),
(3, 4),
(14, 5),
(8, 6),
(13, 7),
(11, 8),
(10, 9),
(12, 10),
(9, 11);

-- --------------------------------------------------------

--
-- Table structure for table `OrdersToGalleries`
--

CREATE TABLE `OrdersToGalleries` (
  `orderID` int(11) NOT NULL,
  `galleryID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `OrdersToGalleries`
--

INSERT INTO `OrdersToGalleries` (`orderID`, `galleryID`) VALUES
(1, 1),
(2, 5),
(3, 4),
(4, 3),
(5, 2),
(6, 1),
(7, 2),
(8, 11),
(9, 10),
(10, 14),
(11, 9),
(12, 15),
(13, 13),
(14, 11);

-- --------------------------------------------------------

--
-- Table structure for table `Paintings`
--

CREATE TABLE `Paintings` (
  `paintingID` int(11) NOT NULL,
  `artistID` int(11) NOT NULL,
  `artType` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `galleryID` int(11) NOT NULL,
  `orderID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Paintings`
--

INSERT INTO `Paintings` (`paintingID`, `artistID`, `artType`, `price`, `galleryID`, `orderID`) VALUES
(1, 1, 'Oil on Linen', 12000, 2, 7),
(2, 3, 'Oil on Canvas', 4000, 4, NULL),
(3, 3, 'Oil on Canvas', 15000, 1, 1),
(4, 2, 'Watercolor', 3200, 5, 2),
(5, 1, 'Acrylic', 4000, 1, 6),
(6, 1, 'Pastel', 9000, 2, 5),
(7, 4, 'Pastel', 3855, 3, 4),
(8, 2, 'Fresco secco', 4050, 4, 3),
(9, 3, 'Oil on Canvas', 200, 1, NULL),
(10, 8, 'Tempera', 985, 12, NULL),
(11, 5, 'Oil Painting', 255, 11, NULL),
(12, 9, 'Pastel', 650, 10, NULL),
(13, 10, 'Watercolor', 1200, 14, NULL),
(14, 12, 'Oil on Canvas', 4200, 9, NULL),
(15, 5, 'Oil Painting', 255, 11, 8),
(16, 9, 'Pastel', 650, 10, 9),
(17, 10, 'Watercolor', 1200, 14, 10),
(18, 12, 'Oil on Canvas', 4200, 9, 11),
(19, 11, 'Art Deco', 7900, 15, 12),
(20, 8, 'Cubism', 500, 13, 13),
(21, 7, 'Art Nouveau', 400, 11, 14),
(22, 6, 'Contemporary', 3000, 9, NULL),
(23, 5, 'Pop Art', 8000, 7, NULL),
(24, 2, 'Surrealism', 900, 5, NULL),
(25, 9, 'Renaissance Art', 22000, 8, NULL),
(26, 11, 'Abstract', 3100, 6, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Artists`
--
ALTER TABLE `Artists`
  ADD PRIMARY KEY (`artistID`),
  ADD UNIQUE KEY `artistID` (`artistID`);

--
-- Indexes for table `Customers`
--
ALTER TABLE `Customers`
  ADD PRIMARY KEY (`customerID`),
  ADD UNIQUE KEY `customerID` (`customerID`);

--
-- Indexes for table `Galleries`
--
ALTER TABLE `Galleries`
  ADD PRIMARY KEY (`galleryID`),
  ADD UNIQUE KEY `galleryID` (`galleryID`);

--
-- Indexes for table `Orders`
--
ALTER TABLE `Orders`
  ADD PRIMARY KEY (`orderID`),
  ADD UNIQUE KEY `orderID` (`orderID`),
  ADD KEY `fk_orders_1` (`customerID`);

--
-- Indexes for table `OrdersToGalleries`
--
ALTER TABLE `OrdersToGalleries`
  ADD PRIMARY KEY (`orderID`,`galleryID`),
  ADD KEY `fk_gallery` (`galleryID`);

--
-- Indexes for table `Paintings`
--
ALTER TABLE `Paintings`
  ADD PRIMARY KEY (`paintingID`),
  ADD UNIQUE KEY `paintingID` (`paintingID`),
  ADD KEY `fk_paintings_1` (`artistID`),
  ADD KEY `fk_paintings_2` (`galleryID`),
  ADD KEY `fk_paintings_3` (`orderID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Artists`
--
ALTER TABLE `Artists`
  MODIFY `artistID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `Customers`
--
ALTER TABLE `Customers`
  MODIFY `customerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Galleries`
--
ALTER TABLE `Galleries`
  MODIFY `galleryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `Orders`
--
ALTER TABLE `Orders`
  MODIFY `orderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `Paintings`
--
ALTER TABLE `Paintings`
  MODIFY `paintingID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Orders`
--
ALTER TABLE `Orders`
  ADD CONSTRAINT `fk_orders_1` FOREIGN KEY (`customerID`) REFERENCES `Customers` (`customerID`) ON UPDATE CASCADE;

--
-- Constraints for table `OrdersToGalleries`
--
ALTER TABLE `OrdersToGalleries`
  ADD CONSTRAINT `fk_gallery` FOREIGN KEY (`galleryID`) REFERENCES `Galleries` (`galleryID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_order` FOREIGN KEY (`orderID`) REFERENCES `Orders` (`orderID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Paintings`
--
ALTER TABLE `Paintings`
  ADD CONSTRAINT `fk_paintings_1` FOREIGN KEY (`artistID`) REFERENCES `Artists` (`artistID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_paintings_2` FOREIGN KEY (`galleryID`) REFERENCES `Galleries` (`galleryID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_paintings_3` FOREIGN KEY (`orderID`) REFERENCES `Orders` (`orderID`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
