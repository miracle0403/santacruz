CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(50) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar (255) NOT NULL,
  `profile` varchar (255) NOT NULL DEFAULT 'No',
  `user_type` varchar(255) DEFAULT 'user',
  `date_joined` datetime NOT NULL DEFAULT current_timestamp(),
   PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
);

CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `regid` varchar(50) NOT NULL ,
  `full_name` varchar(50) NOT NULL,
  `session` varchar(255) NOT NULL,
  `email` varchar(255)  NULL,
  `phone` varchar(255)  NULL,
  `class` varchar (255) NOT NULL,
  `classteacher` varchar (255) NOT NULL,
  `date_joined` datetime NOT NULL DEFAULT current_timestamp(),
   PRIMARY KEY (`id`),
  
);


CREATE TABLE `results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `regid` varchar(50) NOT NULL ,
  `full_name` varchar(50) NOT NULL,
  `term` varchar(50) NOT NULL,
  `session` varchar(255) NOT NULL,
  `class` varchar (255) NOT NULL,
  `subject` varchar(50) NOT NULL ,
  `ca` INT(11) NOT NULL ,
  `exam` INT(11) NOT NULL,
   `grade` varchar(50) NOT NULL ,
   `total` INT(11) NOT NULL,
  `date_submitted` datetime NOT NULL DEFAULT current_timestamp(),
   PRIMARY KEY (`id`)
  
);


CREATE TABLE `card_error_history` (
  `regid` varchar(50) NOT NULL,
  `trials` varchar(50) NOT NULL,
  `term` varchar(50) NOT NULL,
  `user` varchar(50) NOT NULL,
  `session` varchar(255) NOT NULL,
  `class` varchar (255) NOT NULL,
  `date_committed` datetime NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `available_results` (
  
  `session` varchar(50) NOT NULL,
  `remark` varchar(50) DEFAULT 'No',
  `term` varchar(255) NOT NULL,
  `available` varchar(255) DEFAULT 'No',
  `date_entered` datetime NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `classteacher` (
  
  `full_name` varchar(50) NOT NULL,
  `theclass` varchar(50) NOT NULL,
  
  `date_entered` datetime NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `subjects` (
  
  `subject` varchar(50) NOT NULL,
  
  `date_entered` datetime NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `restrict` (
  
  `session` varchar(50) NOT NULL,
  `term` varchar(255) NOT NULL,
  `regid` varchar(50) NOT NULL,
  `full_name` varchar(50) NOT NULL,
  `date_entered` datetime NOT NULL DEFAULT current_timestamp()
);

CREATE TABLE `remark` (
  `remark` varchar(50) NULL,
  `mini` INT(11) NOT NULL,
  `maxi` int(11) NOT NULL,
  `date_entered` datetime NOT NULL DEFAULT current_timestamp()
);