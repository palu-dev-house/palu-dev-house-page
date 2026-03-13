import { NavLink } from "@/components/ui/NavLink";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Briefcase,
  Users,
} from "lucide-react";
import { getCopywriting } from "@/lib/copywriting-client";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const copywriting = getCopywriting();
  const { email, phone, location } = copywriting.landingPage.contact;
  const footer = copywriting.landingPage.footer;

  // Icon mapping
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Users,
    Briefcase,
    Globe,
    Settings: () => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 4 L8 0 L14 4 L12 4 L12 12 L4 12 L4 4 L2 4 Z"
          fill="currentColor"
        />
        <rect x="6" y="8" width="4" height="4" fill="white" />
      </svg>
    ),
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <NavLink href="/" className="flex items-center gap-3 mb-4">
              <div className="shrink-0">
                <Image
                  src="/icons/logo-white.svg"
                  alt="Palu Dev House Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12"
                  style={{ filter: "none" }}
                />
              </div>
              <span className="text-xl font-bold">{footer.brand.name}</span>
            </NavLink>
            <p className="text-gray-400 max-w-sm">{footer.brand.description}</p>
            <div className="flex gap-4 mt-6">
              <a
                href={footer.social.github}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={footer.social.linkedin}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={footer.social.twitter}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{footer.quickLinks.title}</h3>
            <ul className="space-y-2">
              {footer.quickLinks.links.map(
                (
                  link: { label: string; href: string; icon: string },
                  index: number,
                ) => {
                  const IconComponent = iconMap[link.icon];
                  return (
                    <li key={index}>
                      <NavLink
                        href={link.href}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <IconComponent className="w-4 h-4" />
                        {link.label}
                      </NavLink>
                    </li>
                  );
                },
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">{footer.contact.title}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 shrink-0" />
                <span>{location}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-white transition-colors"
                >
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 shrink-0" />
                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>{footer.copyright.replace("{year}", currentYear.toString())}</p>
        </div>
      </div>
    </footer>
  );
}
