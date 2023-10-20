/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request, env) {

    const origin = request.headers.get('Origin');
    const allowedOrigins = ['http://localhost:3000', 'https://l1mine.com'];

    if (request.method === 'OPTIONS' && allowedOrigins.includes(origin)) {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    if (request.method === 'POST') {
      try {
        // Parse the request body as JSON to extract the email
        let requestBody;
        try {
          requestBody = await request.json();
        } catch (error) {
          return new Response('Invalid or empty JSON data in the request body', { status: 400 });
        }

        const email = requestBody.email;
        const user = env.LISTMONK_USER;
        const pass = env.LISTMONK_PASS;

        // Create the basic authentication header
        const authHeader = 'Basic ' + btoa(user + ':' + pass);

        // Prepare the request to Listmonk API
        const response = await fetch('https://listmonk.l1mine.com/api/subscribers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          body: JSON.stringify({
            email,
            name: email,
            status: "enabled"
          }),
        });

        if (response.ok) {
          return new Response('Successfully joined the waitlist', { status: 200 });
        } else {
          return new Response('Something went wrong. Please try again later', { status: 500 });
        }
      } catch (error) {
        console.error(error);
        return new Response('Error processing the request', { status: 500 });
      }
    } else {
      return new Response('Invalid request method', { status: 400 });
    }
  }
};
