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
		const allowedMethods = ['OPTIONS', 'POST'];
		const headers = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		};

		if (!allowedOrigins.includes(origin)) {
			return new Response('Invalid origin', { status: 403 });
		}

		if (!allowedMethods.includes(request.method)) {
			return new Response('Invalid request method', { headers, status: 400 });
		} else if (request.method === 'OPTIONS') {
			return new Response(null, { headers, status: 200 });
		}

		try {
			// Parse the request body as JSON to extract the email
			let requestBody;
			try {
				requestBody = await request.json();
			} catch (error) {
				return new Response('Invalid or empty JSON data in the request body', { headers, status: 400 });
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
					Authorization: authHeader,
				},
				body: JSON.stringify({
					email,
					name: email,
					status: 'enabled',
				}),
			});

			if (response.ok) {
				return new Response('Successfully joined the waitlist', { headers, status: 200 });
			} else {
				console.error(response);
				return new Response('Something went wrong. Please try again later', { headers, status: 500 });
			}
		} catch (error) {
			console.error(error);
			return new Response('Error processing the request', { headers, status: 500 });
		}
	},
};
