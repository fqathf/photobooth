export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  // @ts-expect-error
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB || !id) return { success: false };

  try {
    const body = await readBody(event);
    if (body.name) {
      await env.DB.prepare('UPDATE frames SET name = ? WHERE id = ?').bind(body.name, id).run();
    }
    return { success: true };
  } catch(e) {
    return { success: false };
  }
});
