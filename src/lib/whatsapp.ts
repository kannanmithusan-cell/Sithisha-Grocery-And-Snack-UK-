import { IOrder } from '@/types';

/**
 * Formats order object into a clean WhatsApp text message receipt.
 */
export function generateWhatsAppMessage(order: IOrder): string {
  let message = `🛒 *NEW ORDER — SITHISHA MASALA&SNACKS*\n`;
  message += `📍 120 Parsons Hill, Birmingham B30 3QP, UK\n`;
  message += `------------------------------------\n`;
  message += `📋 *Order Number:* #${order.orderNumber}\n`;
  message += `👤 *Customer Name:* ${order.customerName}\n`;
  message += `📞 *Phone Number:* ${order.phone}\n`;
  message += `✉️ *Email:* ${order.email}\n`;
  message += `📍 *Delivery Address:* ${order.address}, ${order.city}${order.postcode ? `, ${order.postcode}` : ''}\n`;
  if (order.deliveryInstructions) {
    message += `📝 *Instructions:* ${order.deliveryInstructions}\n`;
  }
  message += `------------------------------------\n`;
  message += `📦 *ORDER ITEMS:*\n\n`;

  order.items.forEach((item, idx) => {
    message += `${idx + 1}. *${item.productName}*\n`;
    message += `   Quantity: ${item.quantity}\n`;
    message += `   Unit Price: £${item.price.toFixed(2)}\n`;
    message += `   Subtotal: £${(item.quantity * item.price).toFixed(2)}\n\n`;
  });

  message += `------------------------------------\n`;
  message += `💵 *Subtotal:* £${order.subtotal?.toFixed(2) || '0.00'}\n`;
  message += `🚚 *Delivery Fee:* ${order.deliveryFee === 0 ? 'FREE' : `£${order.deliveryFee?.toFixed(2)}`}\n`;
  message += `💰 *TOTAL AMOUNT:* £${order.total?.toFixed(2)}\n`;
  message += `------------------------------------\n`;
  message += `Thank you for shopping with Sithisha Masala&snacks! 🙏`;

  return message;
}

/**
 * Encodes text message and builds wa.me deep-link URL.
 */
export function buildWhatsAppUrl(phoneNumber: string, messageText: string): string {
  let cleanPhone = (phoneNumber || '').trim().replace(/[^0-9+]/g, '');

  // Strip leading + (wa.me links use digits only)
  if (cleanPhone.startsWith('+')) {
    cleanPhone = cleanPhone.slice(1);
  }

  // NOTE: Do NOT auto-convert local numbers — the WhatsApp number must be stored
  // in full international format in the admin settings (e.g. 94741530377 or 447415303770).

  const encodedText = encodeURIComponent(messageText);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
