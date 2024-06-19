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
    IdUsuario INT NOT NULL,
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
    IdUsuario INT NOT NULL,
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
    IdUsuario INT NOT NULL,
    IdTipoReaccion INT NOT NULL,
    Fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    RgStatus BIT NOT NULL DEFAULT 1,
    DtCreado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DtAct TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY(IdPublicacion, IdUsuario, IdTipoReaccion),
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
    IdUsuario INT NOT NULL,
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
    IdUsuarioRemitente INT NOT NULL,
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




-- Datos iniciales para TipoReacciones
INSERT INTO TipoReacciones (Nombre, Icono) VALUES
('Like', '<i class="fa-regular fa-thumbs-up"></i>'),
('Me encanta', '<i class="fa-solid fa-heart"></i>'),
('Me divierte', '<i class="fa-solid fa-face-laugh-squint"></i>'),
('Me entristece', '<i class="fa-regular fa-face-sad-tear"></i>'),
('Me enoja', '<i class="fa-regular fa-face-angry"></i>');
COMMIT;


-- Datos iniciales para Usuarios
INSERT INTO Usuarios (Nombre, Apellido, Alias, Email, Contrasena, RutaAvatar) VALUES
('Luis Bryan', 'Cabello Ortiz', 'bryan-co', 'lcabelloo@isise.edu.pe', '12345', 'https://rutaxd/avatars/bryan-co.webp'),
('Diego Martínez', 'López Pérez', 'diego-martinez', 'diegomartinez@gmail.com', 'XyZ12345', 'https://rutaxd/avatars/diego-martinez.webp'),
('Sofía López', 'González Martínez', 'sofia-lopez', 'sofialopez@yahoo.com', 'AbC67890', 'https://rutaxd/avatars/sofia-lopez.webp'),
('Carlos Ramírez', 'Hernández García', 'carlos-ramirez', 'carlosramirez@hotmail.com', '123456ab', 'https://rutaxd/avatars/carlos-ramirez.webp'),
('Ana García', 'Martínez López', 'ana-garcia', 'anagarcia@outlook.com', 'password123', 'https://rutaxd/avatars/ana-garcia.webp');
COMMIT;


-- Datos iniciales para Publicaciones
INSERT INTO Publicaciones (IdUsuario, Contenido) VALUES
(1, 'Holaaaaa, bienvenidos 😄'),
(1, 'Probando publicaciones 🚀'),
(2, '¡Hola a todos! 👋'),
(3, '¡Buenos días! ☀️'),
(4, '¿Cómo están? 😊'),
(5, '¡Feliz día! 🎉'),
(2, '¡Estoy emocionado por compartir esto! 🎉'),
(3, '¡Hola mundo! 👋'),
(4, '¡Qué día tan hermoso! ☀️'),
(5, '¡Listo para comenzar el día! 💪'),
(1, '¡Feliz jueves! 😊'),
(2, '¡Nuevo día, nuevas oportunidades! 💼');
COMMIT;

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
COMMIT;


-- Datos iniciales para PublicacionComentarios
INSERT INTO PublicacionComentarios (IdPublicacion, IdUsuario, Contenido) VALUES
(1, 3, '¡Gracias por la bienvenida! 😄'),
(1, 4, 'Hola, ¡qué lindo empezar el día así! 🚀'),
(2, 5, '¡Me encanta tu entusiasmo! 👋'),
(2, 1, '¡Genial! ¡Pronto tendremos más publicaciones emocionantes! ☀️'),
(3, 2, '¡Hola Diego! ¿Cómo estás? 😊'),
(4, 3, '¡Buenos días, Sofía! ☀️'),
(5, 4, '¡Estoy muy bien, gracias! ¿Y tú? 😄'),
(6, 5, '¡Feliz día para ti también, Ana! 🎉'),
(7, 1, '¡Qué emoción! ¡Comparte más detalles! 👋'),
(8, 2, '¡Hola mundo! ¿Qué tal tu día? 🌍');
COMMIT;


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



-- Datos iniciales para PublicacionReacciones
INSERT INTO PublicacionReacciones (IdPublicacion, IdUsuario, IdTipoReaccion) VALUES 
(3, 1, 1),
(3, 2, 2),
(3, 3, 2),
(3, 4, 3),
(1, 1, 1),
(2, 2, 1),
(2, 4, 1),
(13, 1, 5),
(13, 2, 2),
(13, 4, 2),
(13, 5, 1);
COMMIT;


-- Datos iniciales para Chats
INSERT INTO Chats (Nombre) VALUES 
('Chat General'),
('Chat de Programación'),
('Chat de Deportes'),
('Chat de Películas'),
('Chat de Música'),
('Chat de Viajes');
COMMIT;

INSERT INTO Chats(IdChat) Values (null),
(null),
(null),
(null),
(null);


-- Datos iniciales para ChatsMiembros
INSERT INTO ChatsMiembros (IdChat, IdUsuario) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 4),
(3, 5),
(3, 1),
(4, 2),
(4, 3),
(5, 4),
(5, 5);
COMMIT;


-- Datos iniciales para Mensajes
INSERT INTO Mensajes (IdChat, IdUsuarioRemitente, Contenido) VALUES
(1, 2, 'Bueno, este es mi chat privado xd'),
(2, 3, '¿Cuál es tu lenguaje de programación favorito?'),
(2, 4, 'Me gusta Python, ¿y tú?'),
(3, 5, '¿Has visto la última película de Marvel?'),
(3, 1, '¡Sí, me encantó!'),
(4, 2, '¿Qué tipo de música te gusta?'),
(4, 3, 'Escucho de todo, pero prefiero rock.'),
(5, 4, '¿Cuál es tu destino de viaje soñado?'),
(5, 5, 'Me encantaría ir a Japón.');

SELECT * FROM usuarios;
SELECT * FROM publicaciones;
SELECT * FROM cantreacciones;
SELECT * FROM chats;
SELECT * FROM chatsmiembros;
SELECT * FROM publicacioncomentarios;
SELECT * FROM mensajes;
SELECT * FROM publicacionreacciones;
SELECT * FROM tiporeacciones;