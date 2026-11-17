const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = "tu_clave_secreta_super_segura"; // En producción usa variables de entorno

// --- CONFIGURACIÓN DE LA BASE DE DATOS ---
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error("Error al abrir la BD", err.message);
    else console.log("Conectado a la base de datos SQLite.");
});

// Crear tabla de usuarios con soporte para roles y recuperación de contraseña
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'user', 'auxiliar', 'conductor')) NOT NULL,
    reset_token TEXT,
    reset_token_expires DATETIME
)`);

// --- RUTA DE PRUEBA / REGISTRO RÁPIDO ---
// Útil para crear un usuario de prueba inicial fácilmente
app.post('/api/register', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
            `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`,
            [email, hashedPassword, role],
            function(err) {
                if (err) return res.status(400).json({ error: "El correo ya está registrado o datos inválidos." });
                res.json({ message: "Usuario registrado con éxito", userId: this.lastID });
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// --- BLOQUE 2: INICIO DE SESIÓN CON DOBLE CHECK DE ROL ---
app.post('/api/login', (req, res) => {
    const { email, password, selectedRole } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: "Credenciales inválidas." });
        }

        // 1. Verificar la contraseña encriptada
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Credenciales inválidas." });
        }

        // 2. Doble check de rol (Evita que cambien el rol desde el frontend)
        if (user.role !== selectedRole) {
            return res.status(403).json({ error: "El rol seleccionado no coincide con este usuario." });
        }

        // 3. Generar token de sesión (JWT)
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '2h' });

        res.json({
            message: "Inicio de sesión exitoso",
            token,
            role: user.role,
            redirectTo: getRedirectPath(user.role)
        });
    });
});

// Función auxiliar para redirección por rol
function getRedirectPath(role) {
    switch (role) {
        case 'admin': return '/dashboard-admin';
        case 'user': return '/inicio-usuario';
        case 'auxiliar': return '/panel-auxiliar';
        case 'conductor': return '/rutas-conductor';
        default: return '/home';
    }
}

// --- BLOQUE 3: RECUPERACIÓN DE CONTRASEÑA ---

// 1. Solicitar recuperación (Generar Token)
app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        // Medida de seguridad: Siempre respondemos éxito aunque el correo no exista (evita enumeración)
        if (err || !user) {
            return res.json({ message: "Si el correo está registrado, recibirás las instrucciones." });
        }

        // Generar token aleatorio seguro y fecha de expiración (15 minutos)
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

        db.run(
            `UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?`,
            [resetToken, expiresAt, email],
            (updateErr) => {
                if (updateErr) return res.status(500).json({ error: "Error al procesar la solicitud" });

                // EN LA VIDA REAL: Aquí enviarías el correo con Nodemailer
                // Ejemplo de enlace que iría en el correo:
                console.log(`🔗 Enlace de recuperación para ${email}: http://localhost:3000/reset-password?token=${resetToken}`);

                res.json({ message: "Si el correo está registrado, recibirás las instrucciones." });
            }
        );
    });
});

// 2. Restablecer la contraseña usando el token
app.post('/api/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    db.get(
        `SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?`,
        [token, new Date().toISOString()],
        async (err, user) => {
            if (err || !user) {
                return res.status(400).json({ error: "El enlace es inválido o ha expirado." });
            }

            try {
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                // Actualizar contraseña y limpiar el token usado
                db.run(
                    `UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?`,
                    [hashedPassword, user.id],
                    (updateErr) => {
                        if (updateErr) return res.status(500).json({ error: "Error al actualizar la contraseña" });
                        res.json({ message: "Contraseña actualizada exitosamente. Ya puedes iniciar sesión." });
                    }
                );
            } catch (hashError) {
                res.status(500).json({ error: "Error en el servidor" });
            }
        }
    );
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});