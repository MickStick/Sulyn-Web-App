create database sulynbooking;
use sulynbooking;

create table reservations (
id tinyint not null auto_increment,
guest varchar(60) not null,
seatnum varchar(5) not null,
restime varchar(10) not null,
resdate varchar(20) not null,
datetimefig datetime not null,
createdat timestamp not null,
updatedat timestamp
);

create table seatings (
id tinyint not null auto_increment,
num varchar(5) not null,
status boolean not null
);

create table menuItems (
id tinyint not null auto_increment,
name varchar(60) not null,
image text not null,
price double not null,
description longtext not null,
addons json not null,
status boolean not null
);

create table menuItemAddons (
id tinyint not null auto_increment,
name varchar(60) not null,
description longtext not null,
status boolean not null
);

create table users (
id tinyint not null auto_increment,
username varchar(60) not null,
name varchar(60) not null,
password text not null
);