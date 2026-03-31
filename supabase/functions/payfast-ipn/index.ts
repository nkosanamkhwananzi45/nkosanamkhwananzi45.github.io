import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

async function md5(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const { createHash } = await import('https://deno.land/std@0.177.0/node/crypto.ts')
  const hash = createHash('md5')
  hash.update(data)
  return hash.digest('hex') as string
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const body = await req.text()
    const params = new URLSearchParams(body)
    const data: Record<string, string> = {}
    params.forEach((value, key) => {
      data[key] = value
    })

    // Verify signature
    const receivedSignature = data.signature
    delete data.signature

    const passphrase = Deno.env.get('PAYFAST_PASSPHRASE') || ''

    const paramString = Object.keys(data)
      .filter(key => data[key] !== '')
      .sort()
      .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}`)
      .join('&')

    const signatureString = passphrase
      ? `${paramString}&passphrase=${encodeURIComponent(passphrase)}`
      : paramString

    const expectedSignature = await md5(signatureString)

    if (receivedSignature !== expectedSignature) {
      console.error('Invalid PayFast signature')
      return new Response('Invalid signature', { status: 400 })
    }

    // Verify with PayFast server
    const verifyResponse = await fetch('https://www.payfast.co.za/eng/query/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body,
    })
    const verifyResult = await verifyResponse.text()

    if (verifyResult !== 'VALID') {
      console.error('PayFast validation failed:', verifyResult)
      return new Response('Validation failed', { status: 400 })
    }

    // Update booking in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const bookingId = data.m_payment_id
    const paymentStatus = data.payment_status === 'COMPLETE' ? 'paid' : data.payment_status?.toLowerCase() || 'unknown'

    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: paymentStatus,
        payment_reference: data.pf_payment_id || null,
        status: paymentStatus === 'paid' ? 'confirmed' : 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId)

    if (error) {
      console.error('Database update error:', error)
      return new Response('Database error', { status: 500 })
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('IPN error:', error)
    return new Response('Server error', { status: 500 })
  }
})
