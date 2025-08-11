"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Globe, ArrowRight } from "lucide-react";



/**
 * SuitcaseWithTag
 * A travel-themed contact section with suitcase and luggage tag design.
 * - Suitcase contains background/inspiration story
 * - Luggage tag contains contact information
 * - Fully responsive
 * - Accessible
 * - Travel-themed animations
 *
 * Usage:
 * <SuitcaseWithTag
 *   name="Chloe Meuse"
 *   email="chloemeuse@gmail.com"
 *   phone="(555) 123-4567"
 *   location="San Francisco, CA"
 *   website="https://chloemeuse.dev"
 *   linkedin="https://linkedin.com/in/chloemeuse"
 *   github="https://github.com/cmeuse"
 * />
 */

export type SuitcaseWithTagProps = {
  name: string;
  tagline?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  qrSrc?: string; // optional QR code image URL
};

function SuitcaseWithTag({
  name,
  tagline,
  email,
  phone,
  location,
  website,
  linkedin,
  github,
  qrSrc,
}: SuitcaseWithTagProps) {
  return (
    <div className="w-full grid place-items-center py-10">
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
          
        {/* Suitcase with Background */}
            <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
          className="relative flex-1 max-w-lg"
        >
          {/* Suitcase Body */}
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative card-surface rounded-lg shadow-2xl"
            style={{ aspectRatio: "4/3" }}
          >
            {/* Suitcase corners */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-slate-200 border border-slate-400 rounded-sm shadow-inner" />
            <div className="absolute top-2 right-2 w-3 h-3 bg-slate-200 border border-slate-400 rounded-sm shadow-inner" />
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-slate-200 border border-slate-400 rounded-sm shadow-inner" />
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-slate-200 border border-slate-400 rounded-sm shadow-inner" />
            
            {/* Handle */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-3 bg-slate-200 border border-slate-400 rounded-full shadow-lg" />
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-200 rounded-full" />
            
            {/* Suitcase straps */}
            <div className="absolute left-4 top-0 bottom-0 w-1 bg-slate-200 border-l border-slate-400" />
            <div className="absolute right-4 top-0 bottom-0 w-1 bg-slate-200 border-l border-slate-400" />
            
            {/* Content */}
            <div className="p-6 lg:p-8 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center rounded px-2 py-1 text-xs font-mono font-bold bg-primary-600 text-white">BACKGROUND & INSPIRATION 

</span>
          </div>

              <div className="space-y-3 body-text leading-relaxed text-sm flex-1">
                <p>
                  I grew up chasing adrenaline—downhill ski racing and playing goalie in lacrosse—and 
                  I get that same rush from shipping products that connect music and people.
                </p>
                <p>
                  Studying in Copenhagen shaped my obsession with thoughtful, human-centered design. 
                  There's something magical about how Danish design principles focus on simplicity 
                  and functionality while never losing sight of delight.
                </p>
                <p>
                  This portfolio is a tour through the places and ideas that made me who I am today. 
                  Each city represents not just a location, but a chapter in my journey toward building 
                  technology that brings people together through the universal language of music.
                </p>
              </div>
            </div>
            
            {/* Suitcase zipper */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-300/50" />
          </motion.div>
              </motion.div>
              
        {/* Luggage Tag with Contact */}
              <motion.div
          initial={{ y: 20, opacity: 0, rotate: 3 }}
          whileInView={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
          className="relative w-[280px] shrink-0"
          aria-label="Contact luggage tag"
        >
          {/* String/Strap connecting to suitcase */}
          <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 select-none">
            <div className="w-0.5 h-12 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full shadow-sm" />
          </div>

          {/* Tag body */}
          <motion.div
            whileHover={{ rotate: -1, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative card-surface text-slate-800 shadow-xl"
            style={{
              clipPath: "polygon(0 10%, 20% 0, 100% 0, 100% 90%, 80% 100%, 0 100%)",
              minHeight: "350px"
            }}
          >
            {/* Reinforced hole (grommet) */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="h-6 w-6 rounded-full bg-slate-300 shadow-inner" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-slate-100 border border-slate-400" />
                <div className="absolute top-0.5 left-0.5 h-1.5 w-1.5 rounded-full bg-white/50" />
              </div>
            </div>

            {/* Tag content */}
            <div className="pt-12 pb-6 px-6">
              {/* Header */}
              <div className="text-center border-b border-slate-300/30 pb-3 mb-4">
                <span className="inline-flex items-center rounded px-2 py-1 text-xs font-mono font-bold bg-primary-600 text-white">CONTACT</span>
                <div className="text-xs uppercase tracking-wide text-slate-500 font-mono mt-1">Personal Info</div>
              </div>

              {/* Name */}
              <div className="text-center mb-6">
                <h2 className="text-xl heading-lg font-mono">{name}</h2>
                <div className="h-px bg-slate-300/40 w-16 mx-auto mt-2" />
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-xs">
                {email && (
                  <a className="group flex items-center gap-2 body-text hover:text-slate-900 transition-colors duration-300" href={`mailto:${email}`}>
                    <Mail className="h-3 w-3 shrink-0" />
                    <span className="font-mono truncate">{email}</span>
                  </a>
                )}
                {phone && (
                  <a className="group flex items-center gap-2 body-text hover:text-slate-900 transition-colors duration-300" href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
                    <Phone className="h-3 w-3 shrink-0" />
                    <span className="font-mono">{phone}</span>
                  </a>
                )}
                {location && (
                  <div className="flex items-center gap-2 body-text">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="font-mono">{location}</span>
                  </div>
                )}
                {website && (
                  <a className="group flex items-center gap-2 body-text hover:text-slate-900 transition-colors duration-300" href={website} target="_blank" rel="noreferrer">
                    <Globe className="h-3 w-3 shrink-0" />
                    <span className="font-mono truncate">{website.replace(/^https?:\/\//, "")}</span>
                  </a>
                )}
              </div>

              {/* Social links */}
              <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
                {linkedin && (
                  <a className="inline-flex items-center gap-1 chip hover:bg-slate-100 px-2 py-1 text-xs transition-all duration-300 font-mono" href={linkedin} target="_blank" rel="noreferrer">
                    <Linkedin className="h-3 w-3" /> LI
                  </a>
                )}
                {github && (
                  <a className="inline-flex items-center gap-1 chip hover:bg-slate-100 px-2 py-1 text-xs transition-all duration-300 font-mono" href={github} target="_blank" rel="noreferrer">
                    <Github className="h-3 w-3" /> GH
                  </a>
                )}
              </div>
            </div>

            {/* Bottom barcode */}
            <div className="absolute bottom-2 left-4 right-4">
              <div className="h-4 w-full bg-[repeating-linear-gradient(90deg,#1e293b_0px,#1e293b_1px,transparent_1px,transparent_4px)] rounded opacity-80" />
            </div>
          </motion.div>
              </motion.div>
              
      </div>
    </div>
  );
}

export default function RouteLineSection() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="relative min-h-[90vh] bg-gradient-to-b from-slate-50 via-sky-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-0">
        <div className="flex justify-center mb-12">
          <SuitcaseWithTag
            name="Chloe Meuse"
            email="chloemeuse@gmail.com"
            phone="(415) 999-5301"
            location="San Francisco, CA"
            website="https://chloemeuse.dev"
            linkedin="https://linkedin.com/in/chloemeuse"
            github="https://github.com/cmeuse"
          />
        </div>
      </div>
    </div>
  );
}
