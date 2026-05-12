import { Router } from 'express'

const router = Router()

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body ?? {}

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' })
  }

  // Validación contra variables de entorno
  let role = null

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    role = 'admin'
  } else if (username === process.env.RESIDENT_USERNAME && password === process.env.RESIDENT_PASSWORD) {
    role = 'resident'
  }

  if (!role) {
    return res.status(401).json({ error: 'Credenciales incorrectas' })
  }

  // En producción: retornar un JWT firmado, no el objeto de usuario.
  res.json({ ok: true, username, role })
})

export default router
