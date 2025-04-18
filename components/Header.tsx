'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Logo + Titre + Burger */}
        <div className="flex items-center justify-between md:justify-start gap-4 w-full">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="PMU Logo" width={100} height={50} />
            <h1 className="text-2xl font-bold text-[#00553A] text-center md:text-left">
              PMU - Activités Sportives
            </h1>
          </div>

          {/* Burger menu - visible en mobile */}
          <button
            className="md:hidden text-[#00553A] text-3xl focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Ouvrir le menu"
          >
            ☰
          </button>
        </div>

        {/* Menu navigation */}
        <nav
          className={`flex-col md:flex md:flex-row gap-2 ${
            isOpen ? 'flex' : 'hidden'
          } md:gap-4 md:justify-end w-full md:w-auto`}
        >
          <Link
            href="/"
            className="text-[#00553A] px-6 py-2 w-full text-left md:w-auto md:text-center hover:underline"
            onClick={() => setIsOpen(false)}
          >
            Accueil
          </Link>
          <Link
            href="/propose"
            className="bg-[#00553A] hover:bg-[#007C55] text-white font-semibold text-base px-6 py-3 rounded-md whitespace-nowrap text-left md:text-center w-full md:w-auto"
            onClick={() => setIsOpen(false)}
          >
            Proposer une activité
          </Link>
        </nav>
      </div>
    </header>
  );
}
