import express from 'express';
import pool from './db.js';

//instancia de express
const app = express();

//llamado del servidor
app.listen(3000, () => {
    console.log("Servidor escuchando en http://localhost:3000")
})

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Agregar nuevo estudiante
app.post("/api/estudiantes", async (req, res) => {
    try {
        //capturar datos del body
        let { nombre, rut, curso, nivel } = req.body;
        //validar datos
        if (!nombre || !rut || !curso || !nivel) {
            return res.status(400).json({
                message: "Debe ingresar todos los datos solicitados"
            })
        }
        //consulta parametrizada
        let consulta = {
            text: "INSERT INTO estudiantes (nombre, rut, curso, nivel) VALUES ($1, $2, $3, $4) RETURNING nombre, rut, curso, nivel",
            values: [nombre, rut, curso, nivel],
            rowMode: "array"
        }
        //resultados
        let results = pool.query(consulta);
        console.log(results.rows);

        res.status(201).json({
            message: "Estudiante agregado con éxito"
        })
        //manejo de errores
    } catch (error) {
        console.log("Error al agregar estudiante:", error);
        if (error.code == "23505") {
            return res.status(400).json({
                message: "Ya existe un estudiante registrado con el rut proporcionado"
            })
        }
        res.status(500).json({
            message: "Ha ocurrido un error con el servidor"
        })
    }
})

//Consultar estudiantes registrados
app.get("/api/estudiantes", async (req, res) => {
    try {
        //consulta parametrizada
        let consulta = {
            text: "SELECT nombre, rut, curso, nivel FROM estudiantes",
            values: []
        };
        //resultados
        let results = await pool.query(consulta);
        //validar resultados
        if (results.rowCount > 0) {
            res.json({
                estudiantes: results.rows,
                cantidad: results.rowCount,
                message: "OK"
            })
        } else {
            res.json({
                message: "No existen estudiantes registrados",
                estudiantes: results.rows,
                cantidad: results.rowCount
            })
        }
        //manejo de error
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los datos de estudiantes"
        })
    }
})

//Consultar estudiantes por rut
app.get("/api/estudiantes/:rut", async (req, res) => {
    try {
        //captura del rut por params
        let rut = req.params.rut;
        //consulta parametrizada
        let consulta = {
            text: "SELECT nombre, rut, curso, nivel FROM estudiantes WHERE rut = $1",
            values: [rut]
        };
        //resultados
        let results = await pool.query(consulta);
        //validacion de resultados
        if (results.rowCount > 0) {
            res.json({
                estudiantes: results.rows,
                message: "OK"
            })
        } else {
            res.status(404).json({
                message: "Estudiante no encontrado"
            })
        }
        //manejo de error con catch
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los datos del estudiante"
        })
    }
})

//Actualizar la información de un estudiante
app.put("/api/estudiantes", async (req, res) => {

    try {
        // extraer datos del cuerpo de la solicitud
        let { nombre, rut, curso, nivel } = req.body;
        // validar los datos ingresados
        if (!nombre || !rut || !curso || !nivel) {
            return res.status(400).json({
                message: "Debe ingresar todos los datos solicitados"
            })
        }
        // parametrización de la consulta
        let consulta = {
            text: "UPDATE estudiantes SET nombre = $1, curso = $2, nivel = $3 WHERE rut = $4 RETURNING nombre, rut, curso, nivel",
            values: [nombre, curso, nivel, rut],
            rowMode: "array" 
        }
        // ejecutar consulta
        let results = await pool.query(consulta);
        console.log(results.rows);
        // validación de resultados
        if (results.rowCount > 0) {
            res.status(200).json({
                message: "Estudiante actualizado con éxito",
                estudiante: results.rows[0]
            })
        } else {
            res.status(404).json({
                message: "Estudiante no encontrado"
            })
        }
    } catch (error) {
        // manejar error
        console.log("Error al actualizar estudiante:", error);
        res.status(500).json({
            message: "Ha ocurrido un error con el servidor"
        })
    }
}) 

//Eliminar el registro de un estudiante
app.delete("/api/estudiantes/:rut", async (req, res) => {
    try {
        //capturar rut con params
        let rut = req.params.rut;
        //consulta parametrizada
        let consulta = {
            text: "DELETE FROM estudiantes WHERE rut = $1 RETURNING nombre, rut",
            values: [rut]
        };
        //resultados
        let results = await pool.query(consulta);
        //validar resultados
        if (results.rowCount > 0) {
            res.json({
                estudiantes: results.rows[0],
                message: "Estudiante eliminado correctamente"
            })
        } else {
            res.status(404).json({
                message: "Error al eliminar estudiante"
            })
        }
        //manejo de error con catch
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los datos del estudiante"
        })
    }
});
