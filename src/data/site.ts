// Site-wide settings (booking link, menu, footer, contact embeds) live in
// src/config/site.json; homepage copy lives in src/content/homepage/-index.md.
// Both are editable in Sitepins.
import { getEntry } from 'astro:content';
import site from '../config/site.json';

export { site };
export const BOOKING_URL = site.booking_url;
export const nav = site.nav;
export const trust = site.trust;
export const contactForm = site.contact_form;
export const bookingCalendar = site.booking_calendar;

export async function getHome() {
  const entry = await getEntry('homepage', '-index');
  if (!entry) throw new Error('Missing src/content/homepage/-index.md');
  return entry.data;
}

export type Home = Awaited<ReturnType<typeof getHome>>;
export type ProjectPreview = Home['projects']['items'][number]['preview'];
