DROP DATABASE IF EXISTS DB_RSIC_Echoes;

CREATE DATABASE DB_RSIC_Echoes;
USE DB_RSIC_Echoes;



CREATE TABLE Usuarios (
    IdUsuario BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    Alias VARCHAR(50) NOT NULL UNIQUE,
    Nombre VARCHAR(50) NOT NULL,
    Apellido VARCHAR(50) NOT NULL,
    Email VARCHAR(80) UNIQUE,
    Contrasena VARCHAR(30) NOT NULL,
    RutaAvatar VARCHAR(255),
    RgStatus BIT NOT NULL DEFAULT 1,
    DtCreado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DtAct TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



CREATE TABLE Publicaciones (
    IdPublicacion INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario BINARY(16) NOT NULL,
    Contenido VARCHAR(255) NOT NULL,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CantComentarios INT DEFAULT 0,
    RgStatus BIT NOT NULL DEFAULT 1,
    DtCreado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DtAct TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_Publicaciones_Usuario FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);

CREATE TABLE PublicacionComentarios (
    IdComentario INT AUTO_INCREMENT PRIMARY KEY,
    IdPublicacion INT NOT NULL,
    IdUsuario BINARY(16) NOT NULL,
    Contenido VARCHAR(150) NOT NULL,
    RgStatus BIT NOT NULL DEFAULT 1,
    DtCreado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DtAct TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_Comentarios_Publicacion FOREIGN KEY (IdPublicacion) REFERENCES Publicaciones(IdPublicacion),
    CONSTRAINT FK_Comentarios_Usuario FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);

CREATE TABLE TipoReacciones (
    IdTipoReaccion INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(20) NOT NULL,
    Icono VARCHAR(255) NOT NULL,
    RgStatus BIT NOT NULL DEFAULT 1,
    DtCreado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DtAct TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE CantReacciones (
    IdPublicacion INT NOT NULL,
    IdTipoReaccion INT NOT NULL,
    Cant INT DEFAULT 0,
    PRIMARY KEY(IdPublicacion, IdTipoReaccion),
    CONSTRAINT FK_CantReacciones_Publicacion FOREIGN KEY (IdPublicacion) REFERENCES Publicaciones(IdPublicacion),
    CONSTRAINT FK_CantReacciones_TipoReaccion FOREIGN KEY (IdTipoReaccion) REFERENCES TipoReacciones(IdTipoReaccion)
);

CREATE TABLE PublicacionReacciones (
    IdPublicacion INT NOT NULL,
    IdUsuario BINARY(16) NOT NULL,
    IdTipoReaccion INT NOT NULL,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    RgStatus BIT NOT NULL DEFAULT 1,
    DtCreado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DtAct TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY(IdPublicacion, IdUsuario),
    CONSTRAINT FK_Reacciones_Publicacion FOREIGN KEY (IdPublicacion) REFERENCES Publicaciones(IdPublicacion),
    CONSTRAINT FK_Reacciones_Usuario FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario),
    CONSTRAINT FK_Reacciones_TipoReaccion FOREIGN KEY (IdTipoReaccion) REFERENCES TipoReacciones(IdTipoReaccion)
);

CREATE TABLE Chats (
    IdChat INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50),
    RgStatus BIT NOT NULL DEFAULT 1,
    DtCreado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DtAct TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ChatsMiembros (
    IdChat INT NOT NULL,
    IdUsuario BINARY(16) NOT NULL,
    RgStatus BIT NOT NULL DEFAULT 1,
    DtCreado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DtAct TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(IdChat, IdUsuario),
    CONSTRAINT FK_ChatsMiembros_Chat FOREIGN KEY (IdChat) REFERENCES Chats(IdChat),
    CONSTRAINT FK_ChatsMiembros_Usuario FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);

CREATE TABLE Mensajes (
    IdMensaje INT AUTO_INCREMENT PRIMARY KEY,
    IdChat INT NOT NULL,
    IdUsuarioRemitente BINARY(16) NOT NULL,
    Contenido VARCHAR(255) NOT NULL,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    RgStatus BIT NOT NULL DEFAULT 1,
    DtCreado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DtAct TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FK_Mensajes_Chat FOREIGN KEY (IdChat) REFERENCES Chats(IdChat),
    CONSTRAINT FK_Mensajes_Usuario FOREIGN KEY (IdUsuarioRemitente) REFERENCES Usuarios(IdUsuario)
);


-- TRIGGERS : PublicacionReacciones / INSERT
DELIMITER //
CREATE TRIGGER AddCantReacciones
AFTER INSERT ON PublicacionReacciones
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT IdPublicacion, IdTipoReaccion FROM CantReacciones WHERE IdPublicacion = NEW.IdPublicacion AND IdTipoReaccion = NEW.IdTipoReaccion) THEN
        UPDATE CantReacciones SET Cant = Cant + 1 WHERE IdPublicacion = NEW.IdPublicacion AND IdTipoReaccion = NEW.IdTipoReaccion;
    ELSE
        INSERT INTO CantReacciones (IdPublicacion, IdTipoReaccion, Cant) VALUES (NEW.IdPublicacion, NEW.IdTipoReaccion, 1);
    END IF;
END //
DELIMITER ;

/*
-- TRIGGERS : PublicacionReacciones / UPDATE
DELIMITER //
CREATE TRIGGER UpdateCantReacciones
AFTER UPDATE ON PublicacionReacciones 
FOR EACH ROW
BEGIN
    UPDATE CantReacciones SET Cant = Cant - 1 
    WHERE IdPublicacion = OLD.IdPublicacion AND IdTipoReaccion = OLD.IdTipoReaccion;

    DELETE FROM CantReacciones 
    WHERE IdPublicacion = OLD.IdPublicacion AND IdTipoReaccion = OLD.IdTipoReaccion AND Cant = 0;

    IF EXISTS (SELECT IdPublicacion, IdTipoReaccion FROM CantReacciones WHERE IdPublicacion = NEW.IdPublicacion AND IdTipoReaccion = NEW.IdTipoReaccion) THEN
        UPDATE CantReacciones SET Cant = Cant + 1
        WHERE IdPublicacion = NEW.IdPublicacion AND IdTipoReaccion = NEW.IdTipoReaccion;
    ELSE
        INSERT INTO CantReacciones (IdPublicacion, IdTipoReaccion, Cant)
        VALUES
        (NEW.IdPublicacion, NEW.IdTipoReaccion, 1);
    END IF;
END //
DELIMITER;


-- TRIGGERS : PublicacionReacciones / DELETE
DELIMITER //
CREATE TRIGGER RemoveCantReacciones
AFTER DELETE ON PublicacionReacciones
FOR EACH ROW
BEGIN
    UPDATE CantReacciones SET Cant = Cant - 1 
    WHERE IdPublicacion = OLD.IdPublicacion AND IdTipoReaccion = OLD.IdTipoReaccion;

    DELETE FROM CantReacciones 
    WHERE IdPublicacion = OLD.IdPublicacion AND IdTipoReaccion = OLD.IdTipoReaccion AND Cant = 0;
END //
DELIMITER;
*/


-- TRIGGERS : PublicacionComentarios / INSERT
DELIMITER //
CREATE TRIGGER AddCantComentarios
AFTER INSERT ON PublicacionComentarios 
FOR EACH ROW
BEGIN 
    UPDATE Publicaciones
    SET CantComentarios = CantComentarios + 1
    WHERE IdPublicacion = NEW.IdPublicacion;
END //
DELIMITER;

/*
-- TRIGGERS : PublicacionComentarios / UPDATE
DELIMITER //
CREATE TRIGGER RemoveCantComentarios
AFTER UPDATE ON PublicacionComentarios
FOR EACH ROW
BEGIN
    IF OLD.RgStatus = 1 AND NEW.RgStatus = 0 THEN
        UPDATE Publicaciones
        SET CantComentarios = CantComentarios - 1
        WHERE IdPublicacion = OLD.IdPublicacion;
    END IF;
END //
DELIMITER;

*/


-- Datos iniciales para TipoReacciones
INSERT INTO TipoReacciones (Nombre, Icono) VALUES
('Like', '<i class="fa-regular fa-thumbs-up"></i>'),
('Me encanta', '<i class="fa-solid fa-heart"></i>'),
('Me divierte', '<i class="fa-solid fa-face-laugh-squint"></i>'),
('Me entristece', '<i class="fa-regular fa-face-sad-tear"></i>'),
('Me enoja', '<i class="fa-regular fa-face-angry"></i>');
COMMIT;


-- Datos iniciales para Usuarios
INSERT INTO Usuarios (IdUsuario, Nombre, Apellido, Alias, Email, Contrasena, RutaAvatar) VALUES
(UUID_TO_BIN('b126cb40-2e39-11ef-8238-50ebf6283cbf'), 'Luis Bryan', 'Cabello Ortiz', 'bryan-co', 'lcabelloo@isise.edu.pe', '12345', 'https://rutaxd/avatars/bryan-co.webp'),
(UUID_TO_BIN('b126eb5b-2e39-11ef-8238-50ebf6283cbf'), 'Diego Martínez', 'López Pérez', 'diego-martinez', 'diegomartinez@gmail.com', 'XyZ12345', 'https://rutaxd/avatars/diego-martinez.webp'),
(UUID_TO_BIN('b126ecb7-2e39-11ef-8238-50ebf6283cbf'), 'Sofía López', 'González Martínez', 'sofia-lopez', 'sofialopez@yahoo.com', 'AbC67890', 'https://rutaxd/avatars/sofia-lopez.webp'),
(UUID_TO_BIN('b126ed7c-2e39-11ef-8238-50ebf6283cbf'), 'Carlos Ramírez', 'Hernández García', 'carlos-ramirez', 'carlosramirez@hotmail.com', '123456ab', 'https://rutaxd/avatars/carlos-ramirez.webp'),
(UUID_TO_BIN('b126ee51-2e39-11ef-8238-50ebf6283cbf'), 'Ana García', 'Martínez López', 'ana-garcia', 'anagarcia@outlook.com', 'password123', 'https://rutaxd/avatars/ana-garcia.webp');
COMMIT;


-- Datos iniciales para Publicaciones
INSERT INTO Publicaciones (IdUsuario, Contenido) VALUES
/* 1 */(UUID_TO_BIN('b126cb40-2e39-11ef-8238-50ebf6283cbf'), 'Holaaaaa, bienvenidos 😄'),
/* 1 */(UUID_TO_BIN('b126cb40-2e39-11ef-8238-50ebf6283cbf'), 'Probando publicaciones 🚀'),
/* 2 */(UUID_TO_BIN('b126eb5b-2e39-11ef-8238-50ebf6283cbf'), '¡Hola a todos! 👋'),
/* 3 */(UUID_TO_BIN('b126ecb7-2e39-11ef-8238-50ebf6283cbf'), '¡Buenos días! ☀️'),
/* 4 */(UUID_TO_BIN('b126ed7c-2e39-11ef-8238-50ebf6283cbf'), '¿Cómo están? 😊'),
/* 5 */(UUID_TO_BIN('b126ee51-2e39-11ef-8238-50ebf6283cbf'), '¡Feliz día! 🎉'),
/* 2 */(UUID_TO_BIN('b126eb5b-2e39-11ef-8238-50ebf6283cbf'), '¡Estoy emocionado por compartir esto! 🎉'),
/* 3 */(UUID_TO_BIN('b126ecb7-2e39-11ef-8238-50ebf6283cbf'), '¡Hola mundo! 👋'),
/* 4 */(UUID_TO_BIN('b126ed7c-2e39-11ef-8238-50ebf6283cbf'), '¡Qué día tan hermoso! ☀️'),
/* 5 */(UUID_TO_BIN('b126ee51-2e39-11ef-8238-50ebf6283cbf'), '¡Listo para comenzar el día! 💪'),
/* 1 */(UUID_TO_BIN('b126cb40-2e39-11ef-8238-50ebf6283cbf'), '¡Feliz jueves! 😊'),
/* 2 */(UUID_TO_BIN('b126eb5b-2e39-11ef-8238-50ebf6283cbf'), '¡Nuevo día, nuevas oportunidades! 💼');
COMMIT;
/*
INSERT INTO Publicaciones (IdUsuario, Contenido) VALUES
(1, '¿Quién está emocionado por el fin de semana? 🎉'),
(2, '¡Acabo de terminar un nuevo proyecto! 🚀'),
(3, '¡Hoy es un gran día para aprender algo nuevo! 📚'),
(4, '¿Alguien quiere salir a correr mañana? 🏃‍♂️'),
(5, '¡No puedo esperar para ver la nueva película! 🎬'),
(1, '¡Feliz cumpleaños a todos los que celebran hoy! 🎂'),
(2, '¡La vida es bella! 🌸'),
(3, '¿Algún consejo para mejorar en programación? 💻'),
(4, '¡Amo los días soleados! ☀️'),
(5, '¡El café de la mañana es lo mejor! ☕');
COMMIT;*/


-- Datos iniciales para PublicacionComentarios
INSERT INTO PublicacionComentarios (IdPublicacion, IdUsuario, Contenido) VALUES
(1, /* 3 */UUID_TO_BIN('b126ecb7-2e39-11ef-8238-50ebf6283cbf'), '¡Gracias por la bienvenida! 😄'),
(1, /* 4 */UUID_TO_BIN('b126ed7c-2e39-11ef-8238-50ebf6283cbf'), 'Hola, ¡qué lindo empezar el día así! 🚀'),
(2, /* 5 */UUID_TO_BIN('b126ee51-2e39-11ef-8238-50ebf6283cbf'), '¡Me encanta tu entusiasmo! 👋'),
(2, /* 1 */UUID_TO_BIN('b126cb40-2e39-11ef-8238-50ebf6283cbf'), '¡Genial! ¡Pronto tendremos más publicaciones emocionantes! ☀️'),
(3, /* 2 */UUID_TO_BIN('b126eb5b-2e39-11ef-8238-50ebf6283cbf'), '¡Hola Diego! ¿Cómo estás? 😊'),
(4, /* 3 */UUID_TO_BIN('b126ecb7-2e39-11ef-8238-50ebf6283cbf'), '¡Buenos días, Sofía! ☀️'),
(5, /* 4 */UUID_TO_BIN('b126ed7c-2e39-11ef-8238-50ebf6283cbf'), '¡Estoy muy bien, gracias! ¿Y tú? 😄'),
(6, /* 5 */UUID_TO_BIN('b126ee51-2e39-11ef-8238-50ebf6283cbf'), '¡Feliz día para ti también, Ana! 🎉'),
(7, /* 1 */UUID_TO_BIN('b126cb40-2e39-11ef-8238-50ebf6283cbf'), '¡Qué emoción! ¡Comparte más detalles! 👋'),
(8, /* 2 */UUID_TO_BIN('b126eb5b-2e39-11ef-8238-50ebf6283cbf'), '¡Hola mundo! ¿Qué tal tu día? 🌍');
COMMIT;

/*
INSERT INTO PublicacionComentarios (IdPublicacion, IdUsuario, Contenido) VALUES
(13, 2, '¡Yo también! 🎉'),
(14, 3, '¡Felicidades por tu proyecto! 🚀'),
(15, 4, '¡Siempre es un buen día para aprender! 📚'),
(16, 5, '¡Me apunto! 🏃‍♂️'),
(17, 1, '¡Yo también quiero ver esa película! 🎬'),
(18, 2, '¡Feliz cumpleaños! 🎂'),
(19, 3, '¡Sí, la vida es bella! 🌸'),
(20, 4, '¡Practica todos los días! 💻'),
(21, 5, '¡Los días soleados son los mejores! ☀️'),
(22, 1, '¡El café es lo mejor para empezar el día! ☕');
COMMIT;
*/


-- Datos iniciales para PublicacionReacciones
INSERT INTO PublicacionReacciones (IdPublicacion, IdUsuario, IdTipoReaccion) VALUES 
(1, /* 1 */UUID_TO_BIN('b126cb40-2e39-11ef-8238-50ebf6283cbf'), 3),
(3, /* 2 */UUID_TO_BIN('b126eb5b-2e39-11ef-8238-50ebf6283cbf'), 2),
(3, /* 3 */UUID_TO_BIN('b126ecb7-2e39-11ef-8238-50ebf6283cbf'), 2),
(3, /* 4 */UUID_TO_BIN('b126ed7c-2e39-11ef-8238-50ebf6283cbf'), 3),
(2, /* 2 */UUID_TO_BIN('b126eb5b-2e39-11ef-8238-50ebf6283cbf'), 1),
(2, /* 4 */UUID_TO_BIN('b126ed7c-2e39-11ef-8238-50ebf6283cbf'), 1),
(8, /* 1 */UUID_TO_BIN('b126cb40-2e39-11ef-8238-50ebf6283cbf'), 5),
(1, /* 2 */UUID_TO_BIN('b126ecb7-2e39-11ef-8238-50ebf6283cbf'), 2),
(10, /* 4 */UUID_TO_BIN('b126ed7c-2e39-11ef-8238-50ebf6283cbf'), 2),
(12, /* 5 */UUID_TO_BIN('b126ee51-2e39-11ef-8238-50ebf6283cbf'), 1);
COMMIT;



-- Datos iniciales para Chats
-- INSERT INTO Chats (Nombre) VALUES 
-- ('Chat General'),
-- ('Chat de Programación'),
-- ('Chat de Deportes'),
-- ('Chat de Películas'),
-- ('Chat de Música'),
-- ('Chat de Viajes');
-- COMMIT;

INSERT INTO Chats (`IdChat`, `Nombre`) VALUES
(null, null),
(null, null),
(null, null),
(null, null),
(null, null)



-- Datos iniciales para ChatsMiembros
INSERT INTO ChatsMiembros (IdChat, IdUsuario) VALUES
(1, /* Usuario 1 */ UUID_TO_BIN('b126cb40-2e39-11ef-8238-50ebf6283cbf')),
(1, /* Usuario 2 */ UUID_TO_BIN('b126ed7c-2e39-11ef-8238-50ebf6283cbf')),
(2, /* Usuario 3 */ UUID_TO_BIN('b126ee51-2e39-11ef-8238-50ebf6283cbf')),
(2, /* Usuario 4 */ UUID_TO_BIN('b126eb5b-2e39-11ef-8238-50ebf6283cbf')),
(3, /* Usuario 5 */ UUID_TO_BIN('b126ecb7-2e39-11ef-8238-50ebf6283cbf')),
(3, /* Usuario 1 */ UUID_TO_BIN('b126cb40-2e39-11ef-8238-50ebf6283cbf')),
(4, /* Usuario 2 */ UUID_TO_BIN('b126ed7c-2e39-11ef-8238-50ebf6283cbf')),
(4, /* Usuario 3 */ UUID_TO_BIN('b126ee51-2e39-11ef-8238-50ebf6283cbf')),
(5, /* Usuario 4 */ UUID_TO_BIN('b126eb5b-2e39-11ef-8238-50ebf6283cbf')),
(5, /* Usuario 5 */ UUID_TO_BIN('b126ecb7-2e39-11ef-8238-50ebf6283cbf'));
COMMIT;


-- Datos iniciales para Mensajes
INSERT INTO Mensajes (IdChat, IdUsuarioRemitente, Contenido) VALUES
(1, /* Usuario 2 */ UUID_TO_BIN('b126ed7c-2e39-11ef-8238-50ebf6283cbf'), 'Bueno, este es mi chat privado xd'),
(2, /* Usuario 3 */ UUID_TO_BIN('b126ee51-2e39-11ef-8238-50ebf6283cbf'), '¿Cuál es tu lenguaje de programación favorito?'),
(2, /* Usuario 4 */ UUID_TO_BIN('b126eb5b-2e39-11ef-8238-50ebf6283cbf'), 'Me gusta Python, ¿y tú?'),
(3, /* Usuario 5 */ UUID_TO_BIN('b126ecb7-2e39-11ef-8238-50ebf6283cbf'), '¿Has visto la última película de Marvel?'),
(3, /* Usuario 1 */ UUID_TO_BIN('b126cb40-2e39-11ef-8238-50ebf6283cbf'), '¡Sí, me encantó!'),
(4, /* Usuario 2 */ UUID_TO_BIN('b126ed7c-2e39-11ef-8238-50ebf6283cbf'), '¿Qué tipo de música te gusta?'),
(4, /* Usuario 3 */ UUID_TO_BIN('b126ee51-2e39-11ef-8238-50ebf6283cbf'), 'Escucho de todo, pero prefiero rock.'),
(5, /* Usuario 4 */ UUID_TO_BIN('b126eb5b-2e39-11ef-8238-50ebf6283cbf'), '¿Cuál es tu destino de viaje soñado?'),
(5, /* Usuario 5 */ UUID_TO_BIN('b126ecb7-2e39-11ef-8238-50ebf6283cbf'), 'Me encantaría ir a Japón.');


SELECT * FROM usuarios;
SELECT * FROM publicaciones;
SELECT * FROM cantreacciones;
SELECT * FROM chats;
SELECT * FROM chatsmiembros;
SELECT * FROM publicacioncomentarios;
SELECT * FROM mensajes;
SELECT * FROM publicacionreacciones;
SELECT * FROM tiporeacciones;


/* VISTAS Y PROCEDIMIENTOS ALMACENADOS */

/*  ----------------------------------------------------------    
    USU - Usuarios     
    ----------------------------------------------------------
*/


CREATE VIEW VW_USU_SEL_ALL_ACTIVE
AS
    SELECT BIN_TO_UUID(USU.IdUsuario) ID, USU.Alias, USU.Nombre, USU.Apellido, USU.Email, USU.Contrasena, USU.RutaAvatar, USU.RgStatus, USU.DtCreado, USU.DtAct
    FROM Usuarios USU 
    WHERE USU.RgStatus = 1;


/*  #USU.INS1 - Registrar Usuario 
    -- CALL SP_USU_INS1_Registrar ('Ana García', 'Martínez López', 'ana-arcia', 'anagarca@outlook.com', 'password123', 'https://rutaxd/avatars/ana-garcia.webp');
*/

DELIMITER //
CREATE PROCEDURE SP_USU_INS1_Registrar 
( IN pIdUsuario BINARY(16), IN pAlias varchar(50), IN pNombre varchar(50), IN pApellido varchar(50), IN pEmail varchar(80), IN pPass varchar(30), IN pAvatar varchar(255) )
BEGIN
    INSERT INTO Usuarios (IdUsuario, Alias, Nombre, Apellido, Email, Contrasena, RutaAvatar) 
    VALUES (pIdUsuario, pAlias, pNombre, pApellido, pEmail, pPass, pAvatar);
END //
DELIMITER; 



/*  #USU.UPD2 - Actualizar Detalle Usuario
    -- CALL SP_USU_UPD2_ActDetalle ();
*/
DELIMITER //
CREATE PROCEDURE SP_USU_UPD2_ActDetalle 
( IN pId BINARY(16), IN pAlias varchar(50), IN pNombre varchar(50), IN pApellido varchar(50), IN pEmail varchar(80), IN pContrasena varchar(30), IN pAvatar varchar(255) ) 
BEGIN 
    UPDATE Usuarios SET alias = IFNULL(pAlias, alias), nombre = IFNULL(pNombre, nombre), apellido = IFNULL(pApellido, apellido), email = IFNULL(pEmail, email), contrasena = IFNULL(pContrasena, contrasena), rutaAvatar = IFNULL(pAvatar, rutaAvatar) WHERE IDUsuario = pId;
END //
DELIMITER;



/*  #USU.DEL1 - Inhabilitar Usuario
    -- CALL SP_USU_DEL1_INHABILITAR(1);
*/
DELIMITER //
CREATE PROCEDURE SP_USU_DEL1_Inhabilitar 
( IN pId BINARY(16) ) 
BEGIN 
    UPDATE Usuarios SET RgStatus = 0 
    WHERE IdUsuario = pId;
END //
DELIMITER;


/*  ----------------------------------------------------------    
    PUB - Publicaciones     
    ----------------------------------------------------------
*/

/*  #PUB.SEL1 - Mostrar Publicacion
    -- SELECT * FROM VW_PUB_SEL1_Lista;
*/
CREATE VIEW VW_PUB_SEL1_Lista
AS 
    SELECT PUB.IdPublicacion, PUB.Contenido, PUB.Fecha, PUB.CantComentarios, 
           BIN_TO_UUID(USU.IdUsuario) IdUsuario, USU.Alias, USU.RutaAvatar,
           COUNT(CTR.IdPublicacion) AS Reacciones
    FROM Publicaciones PUB 
    INNER JOIN Usuarios USU ON USU.IdUsuario = PUB.IdUsuario
    LEFT JOIN CantReacciones CTR ON CTR.IdPublicacion = PUB.IdPublicacion
    WHERE PUB.RgStatus = 1 
    GROUP BY PUB.IdPublicacion 
    ORDER BY PUB.Fecha DESC, PUB.IdPublicacion DESC; 


/*  #PUB.INS1 - Registrar Publicacion
    -- CALL SP_PUB_INS1_Registrar (1, 'Tester post');
*/

DELIMITER //
CREATE PROCEDURE SP_PUB_INS1_Registrar
( IN pId BINARY(16), IN pContent VARCHAR(255) )
BEGIN
    INSERT INTO Publicaciones (IdUsuario, Contenido) 
    VALUES (pId, pContent);
END //
DELIMITER;



/*  #PUB.UPD - Actualizar Publicacion
    -- CALL SP_PUB_UPD_Actualizar (1, 'Nuevo post');
*/

DELIMITER //
CREATE PROCEDURE SP_PUB_UPD_Actualizar
( IN pId INT, IN pContent VARCHAR(255) )
BEGIN
    UPDATE Publicaciones SET Contenido = pContent WHERE IdPublicacion = pId;
END //
DELIMITER;


/*  #PUB.DEL1 - Inhabilitar Publicacion 
    -- CALL SP_PUB_DEL1_INHABILITAR (1);
*/
DELIMITER //
CREATE PROCEDURE SP_PUB_DEL1_Inhabilitar
( IN pId INT ) 
BEGIN 
    UPDATE Publicaciones SET RgStatus = 0 
    WHERE IdPublicacion = pId;
END //
DELIMITER;




/*  ----------------------------------------------------------    
    COM - PublicionComentarios     
    ----------------------------------------------------------
*/

/*  #COM.SEL1 - Mostrar Comentarios Publicacion
    -- CALL SP_COM_SEL1_PubComentarios(1);
*/

DELIMITER //
CREATE PROCEDURE SP_COM_SEL1_PubComentarios
( IN pId INT )
BEGIN
    SELECT COM.IdComentario, COM.Contenido, COM.DtCreado,
           BIN_TO_UUID(USU.IdUsuario) IdUsuario, USU.Alias, USU.RutaAvatar
    FROM PublicacionComentarios COM
    INNER JOIN Usuarios USU 
    ON USU.IdUsuario = COM.IdUsuario
    WHERE COM.RgStatus = 1 AND COM.IdPublicacion = pId
    ORDER BY COM.DtCreado DESC; 
END //
DELIMITER;

/*  #COM.SEL1 - Mostrar Comentarios Por ID
    -- CALL SP_COM_SEL1_ByID(1);
*/

DELIMITER //
CREATE PROCEDURE SP_COM_SEL1_ByID
( IN pId INT )
BEGIN
    SELECT COM.IdComentario, COM.Contenido, COM.DtCreado,
           BIN_TO_UUID(USU.IdUsuario) IdUsuario, USU.Alias, USU.RutaAvatar
    FROM PublicacionComentarios COM
    INNER JOIN Usuarios USU 
    ON USU.IdUsuario = COM.IdUsuario
    WHERE COM.IdComentario = pId;
END //
DELIMITER;


/*  #COM.INS1 - Registrar Comentario
    -- CALL SP_COM_INS1_Registrar (1, 2, 'Comment Tester');
*/
DELIMITER //
CREATE PROCEDURE SP_COM_INS1_Registrar
( IN pPost INT, IN pUser BINARY(16), IN pContent VARCHAR(255) )
BEGIN
    INSERT INTO PublicacionComentarios (IdPublicacion, IdUsuario, Contenido)
    VALUES (pPost, pUser, pContent);
END //
DELIMITER;


/*  #COM.UPD2 - Actualizar Comentario
    -- CALL SP_COM_UPD2_ACTCOMMET (1, 'New Content! ✅');
*/
DELIMITER //
CREATE PROCEDURE SP_COM_UPD2_ActCommet
( IN pId INT, IN pContent VARCHAR(255) )
BEGIN
    UPDATE PublicacionComentarios SET Contenido = pContent
    WHERE IdComentario = pId;
END //
DELIMITER;


/*  #COM.DEL1 - Inhabilitar Comentario
    -- CALL SP_COM_DEL1_INHABILITAR (20);
*/
DELIMITER //
CREATE PROCEDURE SP_COM_DEL1_Inhabilitar
( IN pId INT )
BEGIN
    UPDATE PublicacionComentarios SET RgStatus = 0
    WHERE IdComentario = pId;
END //
DELIMITER;


/*  ----------------------------------------------------------    
    PRC - PublicacionReacciones    
    ----------------------------------------------------------
*/

/*  #PBR.SEL1 - Mostrar Reaccion Usuario
    -- CALL SP_PBR_SEL1_ReaccionUsuario (3, 3);
*/

DELIMITER //
CREATE PROCEDURE SP_PBR_SEL1_ReaccionUsuario
( IN pPost INT, IN pTypeReact INT )
BEGIN
    SELECT BIN_TO_UUID(USU.IDUsuario) IdUsuario, USU.Alias, USU.RutaAvatar
    FROM PublicacionReacciones PBR
    INNER JOIN Usuarios USU ON USU.IDUsuario = PBR.IDUsuario
    WHERE PBR.IDPublicacion = pPost AND PBR.IDTipoReaccion = pTypeReact;
END //
DELIMITER;

/*  #PBR.INS1 - Agregar Reaccion
    -- CALL SP_PBR_INS1_Agregar (3, 2, 3);
*/

DELIMITER //
CREATE PROCEDURE SP_PBR_INS1_Agregar
( IN pPost INT, IN pUser BINARY(16), IN pTypeReact INT )
BEGIN
    INSERT INTO PublicacionReacciones(IDPublicacion, IDUsuario, IDTipoReaccion) 
    VALUES (pPost, pUser, pTypeReact);
END //
DELIMITER;

SELECT * FROM cantreacciones;

SELECT RCT.IdTipoReaccion, RCT.Nombre, CTRC.Cant FROM cantreacciones CTRC INNER JOIN tiporeacciones RCT ON
CTRC.IdTipoReaccion = RCT.IdTipoReaccion
WHERE CTRC.IdPublicacion = 1;

SELECT BIN_TO_UUID(USU.IdUsuario) IdUsuario, USU.Alias, USU.rutaAvatar, PBRC.IdTipoReaccion, RCT.Nombre from publicacionreacciones PBRC INNER JOIN usuarios USU ON USU.IdUsuario = PBRC.IdUsuario INNER JOIN tiporeacciones RCT ON RCT.IdTipoReaccion = PBRC.IdTipoReaccion WHERE PBRC.IdPublicacion = 1;