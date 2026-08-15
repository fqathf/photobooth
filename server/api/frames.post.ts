export default defineEventHandler(async (event) => {
  // @ts-expect-error
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB || !env.BUCKET) {
    return { success: false, error: 'Cloudflare bindings not found' };
  }

  const adminPassword = getHeader(event, 'x-admin-password');
  if (!env.ADMIN_PASSWORD || adminPassword !== env.ADMIN_PASSWORD) {
    setResponseStatus(event, 401);
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const body = await readBody(event);
    const { id, name, canvasWidth, canvasHeight, slots, thumbnail } = body;
    
    // thumbnail contains the base64 string
    const base64Data = thumbnail.replace(/^data:image\/\w+;base64,/, '');
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const image_key = `frame-${Date.now()}-${crypto.randomUUID().slice(0,6)}.png`;

    await env.BUCKET.put(image_key, bytes.buffer, {
      httpMetadata: { contentType: 'image/png' }
    });

    await env.DB.prepare('INSERT INTO frames (id, name, canvasWidth, canvasHeight, slots, image_key) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(id, name, canvasWidth, canvasHeight, JSON.stringify(slots), image_key)
      .run();

    return { success: true, image_key };
  } catch (error) {
    return { success: false, error: 'Failed to save frame' };
  }
});
