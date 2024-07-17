CREATE TABLE estudiantes (
	nombre VARCHAR(50) NOT NULL,
	rut VARCHAR(13) PRIMARY KEY, 
	curso VARCHAR(50) NOT NULL,
	nivel SMALLINT NOT NULL CHECK(nivel>0 AND nivel<=10)
);

INSERT INTO estudiantes VALUES
('Juan Perez', '1.111.111-1', 'Guitarra', 1);