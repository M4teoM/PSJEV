import { Router } from 'express'
import crypto from 'crypto'

const router = Router()

// POST /api/wompi/firma
// Genera la firma de integridad SHA-256 para el widget de Wompi.
// La llave de integridad NUNCA debe exponerse al cliente en producción.
router.post('/firma', (req, res) => {
  const { referencia, amountInCents } = req.body

  if (!referencia || !amountInCents) {
    return res.status(400).json({ error: 'referencia y amountInCents son requeridos' })
  }

  const secreto = process.env.WOMPI_INTEGRITY_SECRET
  const publicKey = process.env.WOMPI_PUBLIC_KEY

  if (!secreto || !publicKey) {
    return res.status(500).json({ error: 'Credenciales de Wompi no configuradas en el servidor' })
  }

  const cadena = `${referencia}${amountInCents}COP${secreto}`
  const firma = crypto.createHash('sha256').update(cadena).digest('hex')

  res.json({ firma, publicKey })
})

// POST /api/wompi/webhook
// Recibe eventos de Wompi (transaction.updated, etc.).
// En producción: verificar la firma del webhook con el secreto de eventos.
router.post('/webhook', (req, res) => {
  const { event, data } = req.body ?? {}
  console.log(`[PSJ Webhook] ${event ?? 'evento desconocido'}`, data?.transaction?.id ?? '')
  res.json({ received: true })
})

export default router
