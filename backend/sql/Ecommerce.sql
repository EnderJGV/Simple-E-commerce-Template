-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 25/05/2025 às 16:08
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

USE eccomerce;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `eccomerce`
--
CREATE DATABASE IF NOT EXISTS `eccomerce` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `eccomerce`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `categoria`
--

DROP TABLE IF EXISTS `categoria`;
CREATE TABLE `categoria` (
  `cd_categoria` int(11) NOT NULL,
  `nome` varchar(20) DEFAULT NULL,
  `estado` enum('ativo','pausado') DEFAULT 'ativo',
  `imagem` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `categoria`
--

INSERT INTO `categoria` (`cd_categoria`, `nome`, `estado`, `imagem`) VALUES
(1, 'Eletrônicos', 'ativo', 'fa-solid fa-microchip'),
(2, 'Vestuário', 'ativo', 'fa-solid fa-shirt'),
(3, 'Eletrodomésticos', 'ativo', 'fa-solid fa-blender'),
(4, 'Livros', 'ativo', 'fa-solid fa-book'),
(5, 'Móveis', 'ativo', 'fa-solid fa-chair');

-- --------------------------------------------------------

--
-- Estrutura para tabela `imagens`
--

DROP TABLE IF EXISTS `imagens`;
CREATE TABLE `imagens` (
  `cd_imagem` int(11) NOT NULL,
  `nome` varchar(25) DEFAULT NULL,
  `caminho` varchar(30) DEFAULT NULL,
  `cd_produto` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `imagens`
--

INSERT INTO `imagens` (`cd_imagem`, `nome`, `caminho`, `cd_produto`) VALUES
(1, '1745196845103.jpeg', '/uploads/1745196845103.jpeg', NULL),
(2, '1745196950438.jpeg', '/uploads/1745196950438.jpeg', NULL),
(3, '1745197131527.jpeg', '/uploads/1745197131527.jpeg', NULL),
(4, 'Smartphone Galaxy A14', 'https://images.samsung.com/is/', 15),
(5, 'Notebook Dell Inspiron', 'https://m.media-amazon.com/ima', 16),
(6, 'Camisa Polo Azul', 'https://img.freepik.com/fotos-', 17),
(7, 'Tênis Nike Revolution 7', 'https://static.nike.com/a/imag', 18),
(8, 'Mouse Gamer Redragon Cobr', 'https://m.media-amazon.com/ima', 19),
(9, 'Fone Bluetooth JBL Tune 5', 'https://m.media-amazon.com/ima', 20),
(10, 'Liquidificador Arno Power', 'https://m.media-amazon.com/ima', 21),
(11, 'Cafeteira Nespresso Vertu', 'https://m.media-amazon.com/ima', 22),
(12, 'Livro - O Alquimista', 'https://m.media-amazon.com/ima', 23),
(13, 'Cadeira Gamer ThunderX3 C', 'https://m.media-amazon.com/ima', 24);

-- --------------------------------------------------------

--
-- Estrutura para tabela `permissoes`
--

DROP TABLE IF EXISTS `permissoes`;
CREATE TABLE `permissoes` (
  `id_permissao` int(11) NOT NULL,
  `nome` varchar(20) NOT NULL,
  `criar_produto` enum('S','N') DEFAULT 'N',
  `excluir_produto` enum('S','N') DEFAULT 'N',
  `criar_categoria` enum('S','N') DEFAULT 'N',
  `excluir_categoria` enum('S','N') DEFAULT 'N',
  `criar_promocoes` enum('S','N') DEFAULT 'N'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `permissoes`
--

INSERT INTO `permissoes` (`id_permissao`, `nome`, `criar_produto`, `excluir_produto`, `criar_categoria`, `excluir_categoria`, `criar_promocoes`) VALUES
(1, 'usuário', 'N', 'N', 'N', 'N', 'N'),
(2, 'Admin', 'S', 'S', 'S', 'S', 'S'),
(3, 'Editor', 'S', '', 'S', '', 'S'),
(4, 'Cliente', '', '', '', '', '');

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto`
--

DROP TABLE IF EXISTS `produto`;
CREATE TABLE `produto` (
  `cd_produto` int(11) NOT NULL,
  `nome` varchar(45) NOT NULL,
  `descricao` varchar(100) DEFAULT NULL,
  `preco` float DEFAULT NULL,
  `cd_categoria` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `produto`
--

INSERT INTO `produto` (`cd_produto`, `nome`, `descricao`, `preco`, `cd_categoria`) VALUES
(15, 'Smartphone Galaxy A14', 'Smartphone Samsung 64GB, Android 13', 1299.99, 1),
(16, 'Notebook Dell Inspiron', 'Notebook com Intel Core i5, 8GB RAM e SSD 256GB', 3599, 1),
(17, 'Camisa Polo Azul', 'Camisa polo de algodão azul marinho tamanho M', 89.9, 2),
(18, 'Tênis Nike Revolution 7', 'Tênis esportivo masculino Nike, preto', 249.5, 2),
(19, 'Mouse Gamer Redragon Cobra M711', 'Mouse com sensor de alta precisão e RGB', 129.9, 1),
(20, 'Fone Bluetooth JBL Tune 510BT', 'Fone de ouvido sem fio JBL com cancelamento de ruído', 399, 1),
(21, 'Liquidificador Arno Power Max', 'Liquidificador 2L com 5 velocidades e filtro', 159.9, 3),
(22, 'Cafeteira Nespresso Vertuo', 'Máquina de café expresso com 3 intensidades', 499, 3),
(23, 'Livro - O Alquimista', 'Romance de Paulo Coelho, edição de bolso', 34.9, 4),
(24, 'Cadeira Gamer ThunderX3 Core', 'Cadeira ergonômica para jogos, com ajuste de altura', 899.9, 5);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(24) NOT NULL,
  `sobrenome` varchar(255) DEFAULT NULL,
  `senha` varchar(24) NOT NULL,
  `email` varchar(24) NOT NULL,
  `id_permissao` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nome`, `sobrenome`, `senha`, `email`, `id_permissao`) VALUES
(1, 'william', NULL, '12345678', 'teste@teste.com', NULL),
(16, 'Ana', 'Silva', 'senha123', 'ana.silva@email.com', 3),
(17, 'Bruno', 'Souza', '123456', 'bruno.souza@email.com', 2),
(18, 'Carlos', 'Almeida', 'admin123', 'carlos.almeida@email.com', 1),
(19, 'Daniela', 'Lima', 'dani2025', 'daniela.lima@email.com', 3),
(20, 'Eduardo', 'Oliveira', 'edu123', 'eduardo.oliveira@email.c', 2),
(21, 'Fernanda', 'Costa', 'fernanda321', 'fernanda.costa@email.com', 3),
(22, 'Gabriel', 'Melo', 'gabriel456', 'gabriel.melo@email.com', 3),
(23, 'Helena', 'Rocha', 'helena789', 'helena.rocha@email.com', 2),
(24, 'Igor', 'Martins', 'igorm123', 'igor.martins@email.com', 3),
(25, 'Juliana', 'Pereira', 'juliana!@#', 'juliana.pereira@email.co', 1);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`cd_categoria`),
  ADD UNIQUE KEY `cd_categoria` (`cd_categoria`);

--
-- Índices de tabela `imagens`
--
ALTER TABLE `imagens`
  ADD PRIMARY KEY (`cd_imagem`),
  ADD KEY `fk_cd_produto` (`cd_produto`);

--
-- Índices de tabela `permissoes`
--
ALTER TABLE `permissoes`
  ADD PRIMARY KEY (`id_permissao`);

--
-- Índices de tabela `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`cd_produto`),
  ADD UNIQUE KEY `cd_produto` (`cd_produto`),
  ADD KEY `cd_categoria` (`cd_categoria`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_permissao` (`id_permissao`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categoria`
--
ALTER TABLE `categoria`
  MODIFY `cd_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `imagens`
--
ALTER TABLE `imagens`
  MODIFY `cd_imagem` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de tabela `permissoes`
--
ALTER TABLE `permissoes`
  MODIFY `id_permissao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `produto`
--
ALTER TABLE `produto`
  MODIFY `cd_produto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `imagens`
--
ALTER TABLE `imagens`
  ADD CONSTRAINT `fk_cd_produto` FOREIGN KEY (`cd_produto`) REFERENCES `produto` (`cd_produto`);

--
-- Restrições para tabelas `produto`
--
ALTER TABLE `produto`
  ADD CONSTRAINT `produto_ibfk_1` FOREIGN KEY (`cd_categoria`) REFERENCES `categoria` (`cd_categoria`) ON DELETE SET NULL;

--
-- Restrições para tabelas `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_permissao` FOREIGN KEY (`id_permissao`) REFERENCES `permissoes` (`id_permissao`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;