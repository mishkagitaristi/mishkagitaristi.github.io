/**
 * Contact form delivery.
 *
 * The form posts to Web3Forms (free, no backend needed):
 * 1. Get a free access key at https://web3forms.com (takes ~1 minute, key
 *    arrives by email — submissions are forwarded to that address).
 * 2. Paste the key below and redeploy.
 *
 * While the key is empty the form falls back to opening the visitor's
 * email client with a prefilled message, so no inquiry is ever lost.
 */
export const CONTACT_FORM = {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: '',
} as const;
