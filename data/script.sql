-- create database attractions;
-- show databases;
-- use attractions;

-- create table site(
-- 	-- id INT primary key auto_increment, 
-- 	rate INT,
--     direction longtext,
--     name VARCHAR(255),
--     date VARCHAR(255),
--     longitude VARCHAR(255),
--     REF_WP VARCHAR(255),
--     avBegin VARCHAR(255),
--     langinfo VARCHAR(255),
--     MRT VARCHAR(255),
--     SERIAL_NO VARCHAR(255),
--     RowNumber VARCHAR(255),
--     CAT VARCHAR(255),
--     MEMO_TIME longtext,
--     POI VARCHAR(255),
--     file longtext,
--     idpt VARCHAR(255),
--     latitude VARCHAR(255),
--     description longtext,
--     _id INT UNSIGNED ,
--     avEnd VARCHAR(255),
--     address VARCHAR(255)
-- );
-- show databases
-- select *from site where CAT="台北"  or name like "%台北%" limit 0, 12;
-- explain select count(*) from site where CAT="台北"  or name like "%台北%" ;

-- create table mrt(
-- 	id INT primary key auto_increment, 
--     MRT VARCHAR(255) NOT NULL
-- );

-- create table category(
-- 	id INT primary key auto_increment, 
--     CAT VARCHAR(255) NOT NULL
-- );





-- create table attraction(
-- 	id INT primary key auto_increment, 
--     MRT_id INT NOT NULL,
--     CAT_id INT NOT NULL,
--     _id INT UNSIGNED ,
--     name VARCHAR(255),
-- 	rate INT,
--     direction longtext,    
--     date VARCHAR(255),
--     longitude VARCHAR(255),
--     REF_WP VARCHAR(255),
--     avBegin VARCHAR(255),
--     langinfo VARCHAR(255),    
--     SERIAL_NO VARCHAR(255),
--     RowNumber VARCHAR(255),    
--     MEMO_TIME longtext,
--     POI VARCHAR(255),
--     idpt VARCHAR(255),
--     latitude VARCHAR(255),
--     description longtext,    
--     avEnd VARCHAR(255),
--     address VARCHAR(255),
--     foreign key (MRT_id) references mrt(id),
--     foreign key (CAT_id) references category(id)
-- );


-- create table image(
-- 	id INT primary key auto_increment, 
--     attr_id INT NOT NULL,
--     file VARCHAR(255) NOT NULL,
--     foreign key (attr_id) references attraction(id)
-- );

SELECT a._id, a.name, c.CAT, a.description, a.address, a.direction, m.MRT, a.latitude, a.longitude, i.file
FROM attraction as a 
INNER JOIN mrt as m on m.id=a.MRT_id
INNER JOIN category as c on c.id = a.CAT_id
INNER JOIN image as i on i.attr_id = a.id
WHERE a._id="1"


-- select a._id, a.name, c.CAT, a.description, a.direction, m.MRT, a.latitude, a.longitude, i.file
-- from attraction as a 
-- inner join mrt as m on m.id=a.MRT_id
-- inner join category as c on c.id = a.CAT_id
-- inner join image as i on i.attr_id = a.id
-- where a._id=10

-- SELECT *
-- FROM (select * from attraction as a 
-- INNER JOIN mrt as m on m.id=a.MRT_id
-- INNER JOIN category as c on c.id = a.CAT_id
-- INNER JOIN image as i on i.attr_id = a.id
-- where a.id in (select a.id from attraction as a limit 12 )
-- WHERE c.CAT= "台北" or a.name LIKE "%台北%";

-- SELECT *
-- FROM attraction as a
-- INNER JOIN category as c on c.id = a.CAT_id
-- WHERE c.CAT= "台北" or a.name LIKE "%台北%"
-- limit 12;

-- select s._id, s.name, s.CAT, s.description, s.direction, m.MRT, s.latitude, s.longitude, i.file
-- from (SELECT a._id, a.id, a.MRT_id, a.name, c.CAT, a.description, a.direction, a.latitude, a.longitude 
-- 	FROM attraction as a
-- 	INNER JOIN category as c on c.id = a.CAT_id
-- 	WHERE c.CAT= "台北" or a.name LIKE "%台北%"
-- 	limit 12) as s
-- INNER JOIN mrt as m on m.id=s.MRT_id
-- INNER JOIN image as i on i.attr_id = s.id




-- select CAT from site group by CAT
-- SET SQL_SAFE_UPDATES = 0;
-- delete from site;

-- alter table site
-- modify column MEMO_TIME longtext;

-- describe site