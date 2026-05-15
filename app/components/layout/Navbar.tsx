"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

// --- DATA MENU ---
const NAV_LINKS = [
  { label: 'Films', href: '/films', icon: 'fa-film' },
  { label: 'Lists', href: '/lists', icon: 'fa-table-cells' },
  { label: 'Members', href: '/members', icon: 'fa-users' },
];

const SECTION_LINKS = [
  { label: 'Trending', href: '#trending', icon: 'fa-fire' },
  { label: 'Popular', href: '#popular', icon: 'fa-trophy' },
];

export default function Navbar() {
  // --- STATE 
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- SESSION dari Auth.js (menggantikan localStorage) ---
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const username = session?.user?.name ?? '';

  // Fungsi logout menggunakan Auth.js signOut()
  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await signOut({ callbackUrl: '/' });
  };

  // --- ALAT NAVIGASI ---
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';

  // --- EFEK SCROLL ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- FUNGSI KLIK ---
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const scrollToSection = (hashHref: string) => {
    if (!isHome) return router.push('/' + hashHref);
    document.querySelector(hashHref)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/films?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setIsOpen(false);
    } else {
      scrollToSection('#search');
    }
  };

  // --- TAMPILAN HALAMAN (UI) ---
  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${
        scrolled ? 'bg-[#14181c]/95 border-b border-[#2c3440] shadow-lg shadow-black/40' : 'bg-[#14181c]/80 border-b border-[#2c3440]/40'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-15 flex items-center justify-between">
        
        {/*  BAGIAN KIRI: LOGO & MENU DESKTOP  */}
        <div className="flex items-center gap-8">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            <i className="fa-solid fa-clapperboard text-[#00e054]" />
            3D<span className="text-[#00e054]">FLIX</span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#9ab] hover:text-white hover:bg-[#2c3440]/60 transition-all"
              >
                <i className={`fa-solid ${link.icon} text-xs`} /> {link.label}
              </Link>
            ))}

            <div className="mx-2 w-px h-4 bg-[#2c3440]" /> {/* Garis Pemisah */}

            {SECTION_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#9ab] hover:text-[#00e054] hover:bg-[#00e054]/10 transition-all"
              >
                <i className={`fa-solid ${link.icon} text-xs`} /> {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* === BAGIAN KANAN: SEARCH & AKUN === */}
        <div className="flex items-center gap-3">
          
          {/* Form Search */}
          <form onSubmit={handleSearch} className="relative hidden md:block group">
            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#9ab] group-focus-within:text-white" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Cari film..."
              className="bg-[#1c2228] border border-[#2c3440] text-[#9ab] text-sm rounded-full pl-8 pr-4 py-1.5 w-[160px] focus:w-[220px] focus:outline-none focus:border-[#00e054] focus:text-white transition-all duration-300"
            />
          </form>

          {/* Menu Akun Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Tampilkan skeleton saat session sedang loading */}
            {status === 'loading' ? (
              <div className="w-20 h-7 rounded-lg bg-[#2c3440] animate-pulse" />
            ) : isLoggedIn ? (
              <div className="relative">
                {/* Tombol Nama Profile */}
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#9ab] hover:text-white hover:bg-[#2c3440]/60 transition-all"
                >
                  {username} <i className={`fa-solid fa-chevron-down text-[10px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-40 bg-[#2c3440] border border-[#455568] rounded-lg shadow-xl overflow-hidden z-50">
                    <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2.5 text-xs font-bold text-white hover:bg-[#40bcf4] hover:text-black">Profile</Link>
                    <Link href="/settings" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2.5 text-xs font-bold text-white hover:bg-[#40bcf4] hover:text-black">Settings</Link>
                    <div className="h-px bg-[#455568]" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-xs font-bold uppercase tracking-wider text-[#9ab] hover:text-white transition-colors">Sign In</Link>
                <Link href="/register" className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide bg-[#00e054] text-black hover:bg-[#00c04b] hover:-translate-y-px hover:shadow-[0_0_16px_rgba(0,224,84,0.4)] transition-all">Sign Up</Link>
              </>
            )}
          </div>

          {/* Tombol Hamburger Mobile */}
          <button aria-label='toggle-mobile-menu'
            onClick={toggleMenu}
            className={`md:hidden flex items-center justify-center w-9 h-9 rounded-lg border transition-all ${isOpen ? 'bg-[#00e054]/10 border-[#00e054] text-[#00e054]' : 'bg-[#2c3440]/40 border-[#2c3440] text-[#9ab]'}`}
          >
            <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'} text-sm`} />
          </button>
        </div>
      </div>

      {/* === MENU MOBILE (Tampil kalau Hamburger diklik) === */}
      {isOpen && (
        <div className="md:hidden border-t border-[#2c3440] p-4 bg-[#14181c]">
          <form onSubmit={handleSearch} className="relative mb-4">
            <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#9ab]" />
            <input type="text" value={searchVal} onChange={(e) => setSearchVal(e.target.value)} placeholder="Cari film..." className="w-full bg-[#1c2228] border border-[#2c3440] text-sm rounded-lg pl-8 pr-4 py-2.5 text-white focus:outline-none" />
          </form>

          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={toggleMenu} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold uppercase text-[#9ab] hover:text-white hover:bg-[#2c3440]/60"><i className={`fa-solid ${link.icon} text-xs w-4`} /> {link.label}</Link>
            ))}
            
            <div className="my-1 h-px bg-[#2c3440]" />
            
            {SECTION_LINKS.map((link) => (
              <button key={link.href} onClick={() => scrollToSection(link.href)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold uppercase text-left text-[#9ab] hover:text-[#00e054] hover:bg-[#00e054]/10"><i className={`fa-solid ${link.icon} text-xs w-4`} /> {link.label}</button>
            ))}

            <div className="my-1 h-px bg-[#2c3440]" />

            {isLoggedIn ? (
              <>
                <Link href="/profile" onClick={toggleMenu} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold uppercase text-white bg-[#2c3440]/60 sm:hidden"><i className="fa-solid fa-user text-xs w-4 text-[#00e054]" /> {username}</Link>
                <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold uppercase text-left text-red-400 sm:hidden"><i className="fa-solid fa-arrow-right-from-bracket text-xs w-4" /> Sign Out</button>
              </>
            ) : (
                <>
                  <Link href="/login" onClick={toggleMenu} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold uppercase text-[#9ab] sm:hidden"><i className="fa-solid fa-right-to-bracket text-xs w-4" /> Sign In</Link>
                  <Link href="/register" onClick={toggleMenu} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold uppercase bg-[#00e054] text-black hover:bg-[#00c04b] hover:-translate-y-px hover:shadow-[0_0_16px_rgba(0,224,84,0.4)] transition-all sm:hidden"><i className="fa-solid fa-user-plus text-xs w-4" /> Sign Up</Link>
                </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}