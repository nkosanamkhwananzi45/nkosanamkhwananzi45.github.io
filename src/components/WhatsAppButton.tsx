import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/27760884005"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 group"
    aria-label="Chat with us on WhatsApp"
  >
    <span className="absolute inset-0 rounded-full bg-whatsapp animate-pulse-ring" />
    <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-whatsapp shadow-lg transition-transform group-hover:scale-110">
      <MessageCircle className="w-7 h-7 text-accent-foreground fill-current" />
    </span>
    <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-foreground text-primary-foreground text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      Chat with us on WhatsApp
    </span>
  </a>
);

export default WhatsAppButton;
