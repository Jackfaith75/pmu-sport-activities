'use client';

import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-md p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* Logo + Titre */}
        <div className="flex items-center gap-4 w-full justify-center md:justify-start">
          <Image src="/logo.png" alt="PMU Logo" width={100} height={50} />
          <h1 className="text-2xl font-bold text-[#00553A] text-center md:text-left">
            PMU - Activités Sportives
          </h1>
        </div>

      </div>
    </header>
  );
}
