import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import wompiRouter from './routes/wompi.js'
import authRouter from './routes/auth.js'

dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
}))
app.use(express.json())

app.use('/api/wompi', wompiRouter)
app.use('/api/auth', authRouter)

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`[PSJ Backend] escuchando en http://localhost:${PORT}`)
})
