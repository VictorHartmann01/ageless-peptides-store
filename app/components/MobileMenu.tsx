'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/** Mobile-only navigation: native details, closes on navigation, Escape and outside taps. */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuRef.current?.querySelector('summary')?.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <details
      className="alv2-mobile-menu"
      ref={menuRef}
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary aria-label={open ? 'Menü schließen' : 'Menü öffnen'} aria-expanded={open}>
        <span /><span /><span />
      </summary>
      <nav aria-label="Mobile Navigation">
        <a href="#top" onClick={close}>Home</a>
        <Link href="/shop/angebote" onClick={close}>Shop</Link>
        <a href="#wissen" onClick={close}>Produktwelten</a>
        <a href="#qualitaet" onClick={close}>Qualität</a>
        <a href="#ueber" onClick={close}>Über AgeLess</a>
      </nav>
    </details>
  );
}
