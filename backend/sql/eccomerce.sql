-- MySQL dump 10.13  Distrib 9.2.0, for macos15 (arm64)
--
-- Host: localhost    Database: ecommerce
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `ecommerce`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `ecommerce` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `ecommerce`;

--
-- Table structure for table `Categoria`
--

DROP TABLE IF EXISTS `Categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categoria` (
  `cd_categoria` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(20) DEFAULT NULL,
  `estado` enum('ativo','pausado') DEFAULT 'ativo',
  `imagem` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`cd_categoria`),
  UNIQUE KEY `cd_categoria` (`cd_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categoria`
--

LOCK TABLES `Categoria` WRITE;
/*!40000 ALTER TABLE `Categoria` DISABLE KEYS */;
INSERT INTO `Categoria` VALUES (1,'televisores','ativo',NULL),(2,'Televisores','ativo',''),(3,'Computadores','ativo',''),(4,'Eletrodomésticos','ativo',''),(5,'Bicicletas','ativo',''),(6,'Móveis','ativo',''),(7,'Video Games','ativo',''),(8,'Pet','ativo',''),(9,'Roupas','ativo',''),(10,'Calçados','ativo','');
/*!40000 ALTER TABLE `Categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Cliente`
--

DROP TABLE IF EXISTS `Cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Cliente` (
  `cd_cliente` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `email` varchar(30) NOT NULL,
  `senha` varchar(16) NOT NULL,
  PRIMARY KEY (`cd_cliente`),
  UNIQUE KEY `cd_cliente` (`cd_cliente`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Cliente`
--

LOCK TABLES `Cliente` WRITE;
/*!40000 ALTER TABLE `Cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `Cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Imagem`
--

DROP TABLE IF EXISTS `Imagem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Imagem` (
  `cd_imagem` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(25) DEFAULT NULL,
  `caminho` varchar(40) DEFAULT NULL,
  `cd_produto` int DEFAULT NULL,
  PRIMARY KEY (`cd_imagem`),
  KEY `cd_produto` (`cd_produto`),
  CONSTRAINT `imagem_ibfk_1` FOREIGN KEY (`cd_produto`) REFERENCES `produto` (`cd_produto`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Imagem`
--

LOCK TABLES `Imagem` WRITE;
/*!40000 ALTER TABLE `Imagem` DISABLE KEYS */;
INSERT INTO `Imagem` VALUES (1,NULL,NULL,NULL),(2,NULL,NULL,NULL);
/*!40000 ALTER TABLE `Imagem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagens`
--

DROP TABLE IF EXISTS `imagens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagens` (
  `cd_imagem` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(25) DEFAULT NULL,
  `caminho` varchar(30) DEFAULT NULL,
  `cd_produto` int DEFAULT NULL,
  PRIMARY KEY (`cd_imagem`),
  KEY `fk_cd_produto` (`cd_produto`),
  CONSTRAINT `fk_cd_produto` FOREIGN KEY (`cd_produto`) REFERENCES `produto` (`cd_produto`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagens`
--

LOCK TABLES `imagens` WRITE;
/*!40000 ALTER TABLE `imagens` DISABLE KEYS */;
INSERT INTO `imagens` VALUES (1,'1745196845103.jpeg','/uploads/1745196845103.jpeg',NULL),(2,'1745196950438.jpeg','/uploads/1745196950438.jpeg',NULL),(3,'1745197131527.jpeg','/uploads/1745197131527.jpeg',NULL),(4,NULL,NULL,NULL),(5,NULL,NULL,NULL),(6,'1745686565249.jpeg','/uploads/1745686565249.jpeg',NULL),(7,'1745686565249.jpeg','/uploads/1745686565249.jpeg',NULL),(8,'1745686760504.jpeg','/uploads/1745686760504.jpeg',NULL),(9,'1745686760504.jpeg','/uploads/1745686760504.jpeg',NULL),(10,'1745686820166.jpeg','/uploads/1745686820166.jpeg',22),(11,'1745686820166.jpeg','/uploads/1745686820166.jpeg',22);
/*!40000 ALTER TABLE `imagens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Permissoes`
--

DROP TABLE IF EXISTS `Permissoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Permissoes` (
  `id_permissao` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(20) NOT NULL,
  `criar_produto` enum('S','N') DEFAULT 'N',
  `excluir_produto` enum('S','N') DEFAULT 'N',
  `criar_categoria` enum('S','N') DEFAULT 'N',
  `excluir_categoria` enum('S','N') DEFAULT 'N',
  `criar_promocoes` enum('S','N') DEFAULT 'N',
  PRIMARY KEY (`id_permissao`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Permissoes`
--

LOCK TABLES `Permissoes` WRITE;
/*!40000 ALTER TABLE `Permissoes` DISABLE KEYS */;
INSERT INTO `Permissoes` VALUES (1,'usuário','N','N','N','N','N');
/*!40000 ALTER TABLE `Permissoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produto`
--

DROP TABLE IF EXISTS `produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto` (
  `cd_produto` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `descricao` varchar(100) DEFAULT NULL,
  `preco` float DEFAULT NULL,
  `cd_categoria` int DEFAULT NULL,
  `cd_imagem` int DEFAULT NULL,
  PRIMARY KEY (`cd_produto`),
  UNIQUE KEY `cd_produto` (`cd_produto`),
  KEY `cd_categoria` (`cd_categoria`),
  KEY `fk_produto_imagem` (`cd_imagem`),
  CONSTRAINT `produto_ibfk_1` FOREIGN KEY (`cd_categoria`) REFERENCES `Categoria` (`cd_categoria`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto`
--

LOCK TABLES `produto` WRITE;
/*!40000 ALTER TABLE `produto` DISABLE KEYS */;
INSERT INTO `produto` VALUES (22,'xbox','',12000,7,NULL);
/*!40000 ALTER TABLE `produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(24) NOT NULL,
  `sobrenome` varchar(255) DEFAULT NULL,
  `senha` varchar(24) NOT NULL,
  `email` varchar(24) NOT NULL,
  `id_permissao` int DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `id_usuario` (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_permissao` (`id_permissao`),
  CONSTRAINT `fk_permissao` FOREIGN KEY (`id_permissao`) REFERENCES `Permissoes` (`id_permissao`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'william',NULL,'12345678','teste@teste.com',NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-26 19:13:22
