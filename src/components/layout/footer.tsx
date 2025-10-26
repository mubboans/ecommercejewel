import Link from "next/link";
import {
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { SEO, CONTACT_INFO, SOCIAL_LINKS } from "@/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
    customer: [
      { name: "Help Center", href: "/help" },
      { name: "Returns", href: "/returns" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Size Guide", href: "/size-guide" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Refund Policy", href: "/refund" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  };

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="xs:col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <span className="font-bold text-lg sm:text-xl">
                {SEO.SITE_NAME}
              </span>
            </div>
            <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base max-w-md">
              {SEO.SITE_DESCRIPTION}. We offer high-quality products at
              competitive prices with excellent customer service.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground break-words">
                  {CONTACT_INFO.ADDRESS}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <a
                  href={`tel:${CONTACT_INFO.PHONE}`}
                  className="text-muted-foreground hover:text-foreground transition-colors break-all"
                >
                  {CONTACT_INFO.PHONE}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <a
                  href={`mailto:${CONTACT_INFO.EMAIL}`}
                  className="text-muted-foreground hover:text-foreground transition-colors break-all"
                >
                  {CONTACT_INFO.EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">
              Company
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">
              Customer Service
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.customer.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">
              Legal
            </h3>
            <ul className="space-y-1 sm:space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">
                Subscribe to our newsletter
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Get the latest updates on new products and upcoming sales
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto max-w-md sm:max-w-none">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 sm:px-4 py-2 border border-input bg-background text-foreground rounded-md flex-1 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              />
              <button className="px-4 sm:px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors whitespace-nowrap text-sm sm:text-base min-h-[44px] min-touch-target">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} {SEO.SITE_NAME}. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex space-x-3 sm:space-x-4">
              <a
                href={SOCIAL_LINKS.FACEBOOK}
                className="text-muted-foreground hover:text-foreground transition-colors min-touch-target flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.TWITTER}
                className="text-muted-foreground hover:text-foreground transition-colors min-touch-target flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.INSTAGRAM}
                className="text-muted-foreground hover:text-foreground transition-colors min-touch-target flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.LINKEDIN}
                className="text-muted-foreground hover:text-foreground transition-colors min-touch-target flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
