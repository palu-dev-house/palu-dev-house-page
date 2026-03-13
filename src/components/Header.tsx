"use client";

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { NavLink } from "@/components/ui/NavLink";

interface NavigationData {
  brand: {
    name: string;
    tagline: string;
  };
  links: Array<{
    href: string;
    label: string;
  }>;
}

const defaultNavigation: NavigationData = {
  brand: {
    name: "Palu Dev House",
    tagline: "Tech House dari Indonesia",
  },
  links: [
    { href: "/", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#focus", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/articles", label: "Articles" },
    { href: "#contact", label: "Contact" },
  ],
};

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [navigation, setNavigation] =
    useState<NavigationData>(defaultNavigation);

  useEffect(() => {
    async function fetchNavigation() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/copywriting?section=navigation`,
        );
        if (response.ok) {
          const data = await response.json();
          if (data.data?.brand && data.data?.links) {
            setNavigation({
              brand: data.data.brand,
              links: data.data.links,
            });
          }
        }
      } catch {
        // Keep default navigation on error
      }
    }

    fetchNavigation();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/icons/logo.svg"
                alt="Palu Dev House"
                width={36}
                height={36}
                className="w-16 h-16 transition-all duration-300 group-hover:scale-105 group-hover:rotate-1"
                style={{ filter: "none" }}
              />
              <div className="absolute inset-0 w-16 h-16 bg-blue-500/10 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 -z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {navigation.brand.name}
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wider">
                {navigation.brand.tagline}
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-200 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </NavLink>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center">
            <NavLink
              href="/#contact"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 hover:shadow-lg shadow-blue-500/25"
            >
              Hubungi Kami
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-6 border-t border-gray-200/50 bg-white/95 backdrop-blur-md">
            <div className="flex flex-col gap-2">
              {navigation.links.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200 flex items-center justify-between"
                >
                  {link.label}
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </NavLink>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-200/50 mt-4">
              <NavLink
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 text-center block"
              >
                Hubungi Kami
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
