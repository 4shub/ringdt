import ring from './ring.json';

const {members} = ring;

export default {
  /**
   * This is the standard fetch handler for a Cloudflare Worker
   *
   * @param request - The request submitted to the Worker from the client
   * @param env - The interface to reference bindings declared in wrangler.jsonc
   * @param ctx - The execution context of the Worker
   * @returns The response to be sent back to the client
   */
  async fetch(request, env, ctx): Promise<Response> {
    const pathname = new URL(request.url).pathname;
    // get referrer

    const referrer = new URL(request.url).searchParams.get('from') || request.headers.get('referer') || request.headers.get('referrer') || '';
    const currentMember = members.find(member => member.url === referrer);

    if (!currentMember) {
      return new Response('Member not found', {status: 404});
    }

    switch (pathname) {
      case '/':
        return new Response('Zadu');
      case '/next':
        const nextMember = members[(members.indexOf(currentMember) + 1) % members.length];

        // redirect to the next member's URL
        return Response.redirect(nextMember.url, 302);
      case '/prev':
        const prevMember = members[(members.indexOf(currentMember) - 1 + members.length) % members.length];

        // redirect to the previous member's URL
        return Response.redirect(prevMember.url, 302);
      case '/random':
        const randomMember = members[Math.floor(Math.random() * members.length)];

        // redirect to a random member's URL
        return Response.redirect(randomMember.url, 302);
      default:
        // If the pathname does not match any known routes, return a 404 response
        return new Response('Not Found', {status: 404});
    }
  },
} satisfies ExportedHandler<Env>;
