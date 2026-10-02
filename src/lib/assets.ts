import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const publicDir = fileURLToPath(new URL('../../public', import.meta.url));

// True when a root-relative path like "/images/x.png" exists in public/.
// Lets components fall back gracefully until a photo is added.
export const hasPublicFile = (path: string) => existsSync(publicDir + path);

export const initials = (name: string) =>
  name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
