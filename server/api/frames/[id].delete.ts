export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  // @ts-expect-error
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB || !env.BUCKET || !id) {
    return { success: false, error: 'Invalid context' };
  }

  const adminPassword = getHeader(event, 'x-admin-password');
  if (!env.ADMIN_PASSWORD || adminPassword !== env.ADMIN_PASSWORD) {
    setResponseStatus(event, 401);
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const frame: any = await env.DB.prepare('SELECT image_key FROM frames WHERE id = ?').bind(id).first();
    if (frame && frame.image_key) {
      await env.BUCKET.delete(frame.image_key);
    }
    
    await env.DB.prepare('DELETE FROM frames WHERE id = ?').bind(id).run();
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete frame' };
  }
});
