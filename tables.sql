create table fruit_basket_item( 
  id serial not null primary key,
  fruit_name text not null, 
  quantity int not null, 
  price decimal (10,2) not null,
  basket_id int not null,
  foreign key (basket_id) references multi_fruit_basket(id)
);

create table multi_fruit_basket(
	id serial not null primary key,
	name text not null
	
);

insert into multi_fruit_basket(name) values('Citrus');
insert into multi_fruit_basket(name) values('Berries');
insert into multi_fruit_basket(name) values('Tropical');
