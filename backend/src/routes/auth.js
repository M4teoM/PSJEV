import { Router } from 'express'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const router = Router()
const __dir = dirname(fileURLToPath(import.meta.url))

function getUsers() {
  const path = join(__dir, '../data/usuarios.json')
  return JSON.parse(readFileSync(path, 'utf8'))
}

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body ?? {}

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' })
  }

  const users = getUsers()
  const user = users.find(u => u.username === username && u.password === password)

  if (!user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' })
  }

  // En producción: retornar un JWT firmado, no el objeto de usuario.
  res.json({ ok: true, username: user.username, role: user.role })
})

export default router
