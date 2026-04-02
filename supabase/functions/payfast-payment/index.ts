const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function md5(input: string): Promise<string> {
  const { createHash } = await import('https://deno.land/std@0.177.0/node/crypto.ts')
  const hash = createHash('md5')
  hash.update(input)
  return hash.digest('hex') as string
}

async function generateSignature(data: Record<string, string>, passphrase?: string): Promise<string> {
  const params = Object.keys(data)
    .filter(key => data[key] !== '' && data[key] !== undefined)
    .sort()
    .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}`)
    .join('&')

  const signatureString = passphrase ? `${params}&passphrase=${encodeURIComponent(passphrase)}` : params
  return await md5(signatureString)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { bookingId, amount, itemName, email, firstName } = await req.json()

    if (!bookingId || !amount || !itemName) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const merchantId = Deno.env.get('PAYFAST_MERCHANT_ID') || '10000100'
    const merchantKey = Deno.env.get('PAYFAST_MERCHANT_KEY') || '46f0cd694581a'
    const passphrase = Deno.env.get('PAYFAST_PASSPHRASE') || ''
    const siteUrl = Deno.env.get('SITE_URL') || 'https://asanteandi.co.za'
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''

    const paymentData: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${siteUrl}/book/success`,
      cancel_url: `${siteUrl}/book/cancel`,
      notify_url: `${supabaseUrl}/functions/v1/payfast-ipn`,
      email_address: email || '',
      m_payment_id: bookingId,
      amount: parseFloat(amount).toFixed(2),
      item_name: itemName.substring(0, 100),
      name_first: firstName || '',
    }

    const signature = await generateSignature(paymentData, passphrase || undefined)
    paymentData.signature = signature

    const queryString = Object.entries(paymentData)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&')

    return new Response(
      JSON.stringify({
        redirectUrl: `https://www.payfast.co.za/eng/process?${queryString}`,
        paymentData,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
