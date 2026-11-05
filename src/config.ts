import type { CartItem } from './context/CartContext';

export const WHATSAPP_NUMBER = '918610866523';
export const INSTAGRAM_HANDLE = 'gokul_sjg47';
export const INSTAGRAM_URL = 'https://www.instagram.com/gokul_sjg47/';

export interface OrderCustomerInfo {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
}

function formatCustomerDetails(info?: OrderCustomerInfo): string {
  if (!info || !info.name) {
    return [
      '📍 *DELIVERY DETAILS:*',
      '• Name: ',
      '• Phone: ',
      '• Address: ',
      '• City & State: ',
      '• Pincode: ',
    ].join('\n');
  }

  return [
    '📍 *DELIVERY DETAILS:*',
    `• Name: ${info.name}`,
    `• Phone: ${info.phone || ''}`,
    `• Address: ${info.address || ''}`,
    `• City: ${info.city || ''}`,
    `• Pincode: ${info.pincode || ''}`,
  ].join('\n');
}

export function getWhatsAppProductLink(
  name: string,
  size: string,
  price?: string,
  customer?: OrderCustomerInfo
): string {
  const lines = [
    '🌿 *INBANATURALS — ORDER REQUEST* 🌿',
    '━━━━━━━━━━━━━━━━━━━━',
    '📦 *PRODUCT ORDERED:*',
    `• 1x ${name} (${size})${price ? ` — ${price}` : ''}`,
    '',
    `💰 *TOTAL AMOUNT:* ${price || 'Standard'}`,
    '🚚 *Delivery:* FREE',
    '━━━━━━━━━━━━━━━━━━━━',
    formatCustomerDetails(customer),
    '━━━━━━━━━━━━━━━━━━━━',
    '💳 *Please confirm my order and share UPI / payment details.*',
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function getWhatsAppComboLink(
  comboName: string,
  items: string[],
  total?: number,
  customer?: OrderCustomerInfo
): string {
  const lines = [
    '🌿 *INBANATURALS — COMBO BUNDLE ORDER* 🌿',
    '━━━━━━━━━━━━━━━━━━━━',
    `📦 *BUNDLE:* ${comboName}`,
    '*Included Products:*',
    ...items.map((it) => `• ${it}`),
    '',
    `💰 *TOTAL AMOUNT:* ₹${(total || 0).toLocaleString('en-IN')}`,
    '🚚 *Delivery:* FREE',
    '━━━━━━━━━━━━━━━━━━━━',
    formatCustomerDetails(customer),
    '━━━━━━━━━━━━━━━━━━━━',
    '💳 *Please confirm my order and share UPI / payment details.*',
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function getWhatsAppCartLink(
  cart: CartItem[],
  total: number,
  customer?: OrderCustomerInfo
): string {
  const itemsText = cart
    .map(
      (item) =>
        `• ${item.quantity}x ${item.name}${item.size ? ` (${item.size})` : ''} — ${item.price}`
    )
    .join('\n');
  const lines = [
    '🌿 *INBANATURALS — CART ORDER REQUEST* 🌿',
    '━━━━━━━━━━━━━━━━━━━━',
    '📦 *ITEMS ORDERED:*',
    itemsText,
    '',
    `💰 *TOTAL AMOUNT:* ₹${total.toLocaleString('en-IN')}`,
    '🚚 *Delivery:* FREE',
    '━━━━━━━━━━━━━━━━━━━━',
    formatCustomerDetails(customer),
    '━━━━━━━━━━━━━━━━━━━━',
    '💳 *Please confirm my order and share UPI / payment details.*',
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}
