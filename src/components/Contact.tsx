"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import { FadeIn, ScaleIn } from "./animations";
import type { CopywritingData } from "@/lib/copywriting-client";
import { useState } from "react";

type ContactData = CopywritingData["landingPage"]["contact"];

interface ContactProps {
  contact: ContactData;
}

export function Contact({ contact }: ContactProps) {
  const { title, subtitle, email, phone, location } = contact;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", message: "" });
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
            <p className="text-lg text-gray-600">{subtitle}</p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <FadeIn direction="left">
            <div className="space-y-8">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-200 transition-all">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <a
                    href={`mailto:${email}`}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-200 transition-all">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                  <a
                    href={`tel:${phone.replace(/\D/g, "")}`}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-200 transition-all">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Lokasi</h3>
                  <p className="text-gray-600">
                    {location}
                    <br />
                    Melayani klien di seluruh Indonesia
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <ScaleIn delay={0.3}>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nama
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-blue-300 text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="Nama Anda"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-blue-300 text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none hover:border-blue-300 text-gray-900 placeholder-gray-400 bg-white"
                    placeholder="Ceritakan tentang proyek Anda..."
                    required
                  />
                </div>
                {isSubmitted && (
                  <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    Pesan Anda telah terkirim! Kami akan segera menghubungi Anda.
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors hover:shadow-lg hover:-translate-y-1 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            </ScaleIn>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
