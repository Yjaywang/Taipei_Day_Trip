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


-- create table member(
-- 	id INT primary key auto_increment, 
--     username VARCHAR(255) NOT NULL CHECK(username <> ""),
--     email VARCHAR(255) NOT NULL CHECK(email <> ""),
--     password VARCHAR(255) NOT NULL CHECK(password <> "")
-- );

-- truncate table member;
-- select * from member
-- INSERT INTO member(username, email, password)
--             SELECT "", "", ""
--             WHERE NOT EXISTS(
--             SELECT * FROM member WHERE BINARY email="");


-- create table mrt(
-- 	id INT primary key auto_increment, 
--     MRT VARCHAR(255) NOT NULL
-- );

-- create table category(
-- 	id INT primary key auto_increment, 
--     CAT VARCHAR(255) NOT NULL
-- );


-- create table price(
-- 	id INT primary key auto_increment, 
--     time VARCHAR(255) NOT NULL,
--     price INT NOT NULL
-- );



-- INSERT INTO price(time, price)
-- values ("morning", 2000),
-- ("afternoon", 2500)

-- create table booking(
-- 	id INT primary key auto_increment, 
--     user_id INT NOT NULL,
--     attraction_id INT NOT NULL,
--     date date NOT NULL,
--     time_id INT NOT NULL,
--     foreign key (user_id) references member(id),
--     foreign key (time_id) references price(id),
--     foreign key (attraction_id) references attraction(id)
-- );


-- create table transaction(
-- 	id INT primary key auto_increment, 
--     order_number VARCHAR(255) NOT NULL,
--     total_money INT NOT NULL,
--     transaction_time DATETIME NOT NULL,
--     user_id INT NOT NULL,
--     phone VARCHAR(255) NOT NULL,
--     rec_trade_id VARCHAR(255),
--     tappay_msg VARCHAR(255),
--     status INT NOT NULL,    
--     foreign key (user_id) references member(id)
-- );

-- create table order_details(
-- 	id INT primary key auto_increment, 
--     order_id INT NOT NULL,
--     attraction_id INT NOT NULL,
--     date date NOT NULL,
--     time_id INT NOT NULL,
--     foreign key (order_id) references transaction(id),
--     foreign key (attraction_id) references attraction(id),
--     foreign key (time_id) references price(id)
-- );



-- INSERT INTO 
-- 	order_details(
-- 		order_id,
-- 		attraction_id,
-- 		date,
-- 		time_id
-- 	)
-- SELECT 3, 1, "20221202", 1
-- WHERE NOT EXISTS(
-- 	SELECT * 
-- 	FROM 
-- 		order_details
-- 	WHERE 
-- 		order_id=3 and 
-- 		attraction_id=1 and 
-- 		date="20221202" and time_id=1
-- )

-- select 
-- 	trans.order_number as number,
-- 	trans.total_money as price,
--     m.username as username,
--     m.email as email,
--     trans.phone as phone,
--     trans.status as status,
--     ods.attraction_id as attraction_id,
--     a.name as attraction_name,
--     a.address as address,
--     i.file as image,
--     ods.date as date,
--     p.time as time
-- from (
-- select id, order_number, total_money, user_id, phone, status from transaction where order_number="rsgdgsd") as trans
-- inner join order_details as ods on ods.order_id=trans.id
-- inner join price as p on p.id=ods.time_id
-- inner join member as m on m.id=trans.user_id
-- inner join attraction as a on a.id=ods.attraction_id
-- inner join image as i on i.attr_id=ods.attraction_id
-- group by ods.attraction_id, ods.date, ods.time_id
-- ORDER BY ods.date

-- UPDATE transaction
-- SET rec_trade_id = 'das', tappay_msg="dffse", status=1
-- WHERE id=1;



-- INSERT INTO 
-- 	transaction(
-- 		order_number,
-- 		total_money,
-- 		transaction_time,
-- 		user_id,
-- 		phone,
-- 		status  
-- 	)
-- SELECT "rsgdgsd", 2500, "2022-12-19 13:54:56.901354", "4", "0911123", 0
-- WHERE NOT EXISTS(
-- 	SELECT * 
-- 	FROM 
-- 		transaction 
-- 	WHERE 
-- 		order_number="rsgdgsd"
-- )




-- insert into transaction(order_number, total_money, transaction_time, user_id, phone, status)
-- values("asdasd", 2500, NOW(), 4, 0911111111, 0)

-- insert into booking(user_id, attraction_id, date, time_id)
-- values(1, 11, "2022-12-12", 1);


-- select * from price
-- select b.attraction_id, ANY_VALUE(a.name), ANY_VALUE(a.address), ANY_VALUE(i.file), b.date, p.time, ANY_VALUE(p.price) from(
-- select attraction_id, date, time_id from booking 
-- where user_id=1) as b
-- inner join image as i on b.attraction_id=i.attr_id
-- inner join attraction as a on b.attraction_id=a._id
-- inner join price as p on b.time_id=p.id
-- group by b.attraction_id, b.date, p.time
-- order by b.date





-- select * from booking

-- INSERT INTO booking(user_id, attraction_id, date, time_id)
--                 SELECT 1, 12, "2022-12-12", 1
--                 WHERE NOT EXISTS(
--                 SELECT * FROM booking WHERE user_id=1 and attraction_id=12 and date="2022-12-12" and time_id=1)
                
-- select * from booking
-- delete from booking
-- where user_id=1 and attraction_id=12 and date="2022-12-12" and time_id=1


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

-- SELECT a._id, a.name, c.CAT, a.description, a.address, a.direction, m.MRT, a.latitude, a.longitude, i.file
-- FROM attraction as a 
-- INNER JOIN mrt as m on m.id=a.MRT_id
-- INNER JOIN category as c on c.id = a.CAT_id
-- INNER JOIN image as i on i.attr_id = a.id
-- WHERE a._id="1"


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