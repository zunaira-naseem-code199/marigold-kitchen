import nodemailer from 'nodemailer';
import { restaurant } from '../config/restaurant.js';

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
  } else {
    // Dev mode: don't send anything, just print the email to the console.
    transporter = nodemailer.createTransport({ jsonTransport: true });
  }
  return transporter;
}

async function send({ to, subject, text, html }) {
  try {
    const info = await getTransporter().sendMail({
      from: process.env.MAIL_FROM || `"${restaurant.name}" <${restaurant.email}>`,
      to,
      subject,
      text,
      html,
    });
    if (!process.env.SMTP_HOST) {
      console.log(`\n[email:dev] To: ${to}\n[email:dev] Subject: ${subject}\n${text}\n`);
    }
    return info;
  } catch (err) {
    // Never fail a booking because an email failed.
    console.error('Email failed:', err.message);
    return null;
  }
}

const prettyDate = (dateStr) =>
  new Date(`${dateStr}T12:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

const wrap = (title, body) => `
<div style="font-family:Georgia,serif;background:#faf3e3;padding:24px;color:#2b2623">
  <div style="max-width:560px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #eadfc5">
    <div style="background:#6b1d2a;color:#f6b21b;padding:20px 28px;font-size:22px;letter-spacing:.04em">${restaurant.name}</div>
    <div style="padding:28px;font-family:Arial,sans-serif;line-height:1.6;font-size:15px">
      <h2 style="font-family:Georgia,serif;margin-top:0">${title}</h2>
      ${body}
      <p style="margin-top:28px;color:#6b625b;font-size:13px">
        ${restaurant.address.street}, ${restaurant.address.city} ${restaurant.address.postcode} &middot; ${restaurant.phone}
      </p>
    </div>
  </div>
</div>`;

const bookingLines = (r) =>
  `<p><strong>${prettyDate(r.date)}</strong> at <strong>${r.time}</strong><br/>
   Party of <strong>${r.partySize}</strong><br/>Reference: <strong>${r.reference}</strong></p>
   ${r.notes ? `<p>Your note: <em>${escapeHtml(r.notes)}</em></p>` : ''}`;

function escapeHtml(s = '') {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export async function sendReservationReceived(r) {
  await send({
    to: r.email,
    subject: `We've received your booking request (${r.reference})`,
    text: `Hi ${r.name}, thanks for booking Marigold Kitchen.\n${prettyDate(r.date)} at ${r.time}, party of ${r.partySize}.\nReference: ${r.reference}\nWe'll confirm shortly.`,
    html: wrap(
      `Thank you, ${escapeHtml(r.name.split(' ')[0])}`,
      `<p>We've received your booking request and will confirm it shortly.</p>${bookingLines(r)}
       <p>Need to change something? Call us on ${restaurant.phone} and quote your reference.</p>`
    ),
  });
  await send({
    to: process.env.RESTAURANT_EMAIL || restaurant.email,
    subject: `New booking: ${r.name}, ${r.partySize} on ${r.date} ${r.time}`,
    text: `New booking ${r.reference}\n${r.name} (${r.email}, ${r.phone})\n${r.date} ${r.time}, party of ${r.partySize}\nNotes: ${r.notes || '-'}`,
    html: wrap(
      'New booking request',
      `${bookingLines(r)}<p>${escapeHtml(r.name)}<br/>${escapeHtml(r.email)}<br/>${escapeHtml(r.phone)}</p>`
    ),
  });
}

export async function sendReservationStatus(r) {
  const confirmed = r.status === 'confirmed';
  await send({
    to: r.email,
    subject: confirmed ? `Your table is confirmed (${r.reference})` : `Your booking was cancelled (${r.reference})`,
    text: confirmed
      ? `Great news ${r.name}, your table is confirmed: ${prettyDate(r.date)} at ${r.time}, party of ${r.partySize}.`
      : `Hi ${r.name}, your booking for ${prettyDate(r.date)} at ${r.time} has been cancelled. Call ${restaurant.phone} if you'd like to rebook.`,
    html: wrap(
      confirmed ? 'Your table is confirmed' : 'Your booking has been cancelled',
      confirmed
        ? `<p>We look forward to welcoming you.</p>${bookingLines(r)}`
        : `<p>We're sorry we couldn't host you this time. Call us on ${restaurant.phone} to find another date.</p>${bookingLines(r)}`
    ),
  });
}

export async function sendEnquiryEmails(e) {
  await send({
    to: e.email,
    subject: 'Thanks for your private dining enquiry',
    text: `Hi ${e.name}, thanks for your enquiry for ${e.guestCount} guests (${e.eventType}). Our events team will reply within one working day.`,
    html: wrap(
      `Thank you, ${escapeHtml(e.name.split(' ')[0])}`,
      `<p>Our events team will be in touch within one working day to talk through menus and availability for your <strong>${escapeHtml(e.eventType)}</strong> for <strong>${e.guestCount}</strong> guests.</p>`
    ),
  });
  await send({
    to: process.env.RESTAURANT_EMAIL || restaurant.email,
    subject: `New private dining enquiry: ${e.eventType}, ${e.guestCount} guests`,
    text: `${e.name} (${e.email}, ${e.phone}) ${e.company ? '- ' + e.company : ''}\n${e.eventType}, ${e.guestCount} guests, date: ${e.date || 'flexible'}\n\n${e.message || ''}`,
    html: wrap(
      'New private dining enquiry',
      `<p><strong>${escapeHtml(e.name)}</strong><br/>${escapeHtml(e.email)} &middot; ${escapeHtml(e.phone)}${e.company ? `<br/>${escapeHtml(e.company)}` : ''}</p>
       <p>${escapeHtml(e.eventType)} &middot; ${e.guestCount} guests &middot; ${e.date || 'flexible date'}</p>
       <p>${escapeHtml(e.message || '')}</p>`
    ),
  });
}
