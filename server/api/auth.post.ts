export default defineEventHandler(async (event) => {
  // @ts-expect-error
  const env = event.context.cloudflare?.env;
  if (!env || !env.ADMIN_PASSWORD) {
    return { success: false, error: 'Server misconfiguration: ADMIN_PASSWORD not set.' };
  }
  
  const body = await readBody(event);
  if (body?.password === env.ADMIN_PASSWORD) {
    return { success: true };
  } else {
    setResponseStatus(event, 401);
    return { success: false, error: 'Invalid password' };
  }
});
