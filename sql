docker run --name demo-postgres -e POSTGRES_PASSWORD=secret -d -p 5432:5432 postgres:alpine
docker exec -it demo-postgres psql -U postgres
\l;
CREATE DATABASE _;
\c _;
create table _ ();
\dt;
insert into _() values ()();
\q;
