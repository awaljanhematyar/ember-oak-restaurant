/**
 * Downloads the documented stock images into public assets; rerunning replaces those local image files.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { imageSources } from '../src/data/menu.js';

// ========================================
// ASSET DOWNLOADS
// ========================================
await mkdir('public/images', { recursive: true });
for (const [name, url] of Object.entries(imageSources)) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
    throw new Error(`Could not download ${name}: HTTP ${response.status}`);
  }
  const image = Buffer.from(await response.arrayBuffer());
  await writeFile(`public/images/${name}.jpg`, image);
  console.log(`${name}: ${image.length} bytes`);
}
