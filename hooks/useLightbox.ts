import { useEffect } from 'react';

export function useLightbox() {
  useEffect(() => {
    const images = document.querySelectorAll('.prose img');

    const handleClick = (e: Event) => {
      const img = e.target as HTMLImageElement;

      const overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';

      const clone = document.createElement('img');
      clone.src = img.src;
      clone.alt = img.alt;

      overlay.appendChild(clone);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      const close = () => {
        overlay.remove();
        document.body.style.overflow = '';
      };

      overlay.addEventListener('click', close);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      }, { once: true });
    };

    images.forEach(img => {
      img.addEventListener('click', handleClick);
    });

    return () => {
      images.forEach(img => {
        img.removeEventListener('click', handleClick);
      });
    };
  }, []);
}
