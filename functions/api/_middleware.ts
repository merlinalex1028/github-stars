const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
}

function handleOptions(request: Request): Response | null {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }
  return null
}

function addCorsHeaders(response: Response): Response {
  const newResponse = new Response(response.body, response)
  for (const [key, value] of Object.entries(corsHeaders)) {
    newResponse.headers.set(key, value)
  }
  return newResponse
}

export const onRequest: PagesFunction = async (context) => {
  const optionsResponse = handleOptions(context.request)
  if (optionsResponse) {
    return optionsResponse
  }

  try {
    const response = await context.next()
    return addCorsHeaders(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return addCorsHeaders(
      new Response(JSON.stringify({ success: false, error: message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    )
  }
}
