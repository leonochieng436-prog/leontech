const defaultWhatsAppNumber = "254757308631";

export function getSiteContact() {
  const phone = process.env.CONTACT_PHONE || "+254757308631";
  const whatsappNumber = (process.env.WHATSAPP_BUSINESS_NUMBER || defaultWhatsAppNumber).replace(/\D/g, "");

  return {
    email: process.env.CONTACT_EMAIL || "lronochieng436@gmail.com",
    phone,
    whatsappNumber,
  };
}
