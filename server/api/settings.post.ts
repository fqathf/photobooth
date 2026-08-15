export default defineEventHandler(async (event) => {
  // @ts-expect-error
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) {
    return { success: false, error: 'DB binding missing' };
  }
  
  const adminPassword = getHeader(event, 'x-admin-password');
  if (!env.ADMIN_PASSWORD || adminPassword !== env.ADMIN_PASSWORD) {
    setResponseStatus(event, 401);
    return { success: false, error: 'Unauthorized' };
  }
  try {
    const body = await readBody(event);
    const { active, maintenanceMessage, activeEventName } = body;
    
    await env.DB.prepare('UPDATE settings SET active = ?, maintenanceMessage = ?, activeEventName = ? WHERE id = ?')
      .bind(active ? 1 : 0, maintenanceMessage || '', activeEventName || '', 'global')
      .run();
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Database error' };
  }
});
