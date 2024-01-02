create database if not exists mrshaw_local;
use mrshaw_local;

-- DROP TABLE IF EXISTS `ftw.users`;
CREATE TABLE `ftw.users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(60) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `user_name` varchar(120) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` text NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `hash` text,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name` (`user_name`,`email`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `user_name_2` (`user_name`)
);

LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES 
(8,'Joeseph','Doe','JoDo','joedoe@gmail.com','b66bc7078ac8b4f24a427d7f07eaa7a9c0cf2835f72510fb49fbc90aa1bd11f0',1,'2021-08-24 07:12:30','0000-00-00 00:00:00',NULL),
(18,'Test','User','testUser','test@email.com','99a912bac8ef884ef9e613037f453f02c3ac9a8d6cd96978af336c6d3102511f',1,'2021-08-24 12:39:05','0000-00-00 00:00:00',NULL),
(78,'Test','User','testUser2','test02@email.com','99a912bac8ef884ef9e613037f453f02c3ac9a8d6cd96978af336c6d3102511f',1,'2021-08-24 13:00:18','0000-00-00 00:00:00',NULL),
(158,'0','User','testUser3','test03@email.com','99a912bac8ef884ef9e613037f453f02c3ac9a8d6cd96978af336c6d3102511f',1,'2021-08-24 13:07:19','0000-00-00 00:00:00',NULL),
(228,'Test','User','testUser4','test04@email.com','99a912bac8ef884ef9e613037f453f02c3ac9a8d6cd96978af336c6d3102511f',1,'2021-10-07 18:25:33','0000-00-00 00:00:00',NULL),
(248,'Test','User5','testUser5','test05@email.com','99a912bac8ef884ef9e613037f453f02c3ac9a8d6cd96978af336c6d3102511f',1,'2021-10-07 18:26:21','0000-00-00 00:00:00',NULL),
(278,'Testilion','Userduff','testDuff','test06@email.com','99a912bac8ef884ef9e613037f453f02c3ac9a8d6cd96978af336c6d3102511f',1,'2021-10-17 03:47:23','2023-03-22 01:12:21','f997464bbbf12401b22ecb298db2799d2ee49afd50f161a89a06af517d1faedc'),
(328,'Testilion','Userduff','testDuff_2','test07@email.com','99a912bac8ef884ef9e613037f453f02c3ac9a8d6cd96978af336c6d3102511f',1,'2021-10-30 18:28:02','0000-00-00 00:00:00',NULL),
(338,'Testiliano','Usertuff','testTuff','test08@email.com','99a912bac8ef884ef9e613037f453f02c3ac9a8d6cd96978af336c6d3102511f',1,'2021-10-30 19:26:42','0000-00-00 00:00:00',NULL);
UNLOCK TABLES;

-- DROP TABLE IF EXISTS `ftw_lists`;
CREATE TABLE `ftw.lists` (
  `lid` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `tags` text NOT NULL,
  `pid` int(11) NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `states` text NOT NULL,
  PRIMARY KEY (`lid`)
);

show tables;

