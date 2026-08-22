/**
 * The one place the studio's contact details live.
 *
 * They were previously a `const WHATSAPP_NUMBER` copy-pasted into five
 * separate components, which is precisely why the launch placeholder
 * (628000000000) survived into production on every call-to-action on the
 * site: README told whoever launched it to update "all three" files, there
 * were five, and none was changed. A number duplicated across five files is
 * a number that will be wrong in at least one of them.
 */

/** Digits only, no "+" and no leading zero — the format wa.me requires. */
export const WHATSAPP_NUMBER = '6282292215299';

/** How the number is written for a human to read. */
export const WHATSAPP_DISPLAY = '+62 822-9221-5299';

/**
 * Builds a wa.me link with the message pre-filled.
 *
 * The prefilled text is the point: a prospect who taps through with context
 * already typed ("saya mau konsultasi soal landing page") is far more likely
 * to actually send it than one facing an empty chat box.
 */
export function whatsappLink(pesan: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(pesan)}`;
}
