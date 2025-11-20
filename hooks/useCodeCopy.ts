import { useEffect } from 'react';

export function useCodeCopy() {
  useEffect(() => {
    // Znajdź wszystkie bloki kodu
    const codeBlocks = document.querySelectorAll('pre');

    codeBlocks.forEach((pre) => {
      // Sprawdź czy już ma przycisk (żeby nie duplikować)
      if (pre.querySelector('.copy-button')) return;

      // Stwórz wrapper dla relative positioning
      pre.style.position = 'relative';

      // Stwórz przycisk
      const button = document.createElement('button');
      button.className = 'copy-button';
      button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;
      button.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 0.25rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s, background 0.2s;
        color: #9ca3af;
      `;

      // Pokaż przycisk na hover
      pre.addEventListener('mouseenter', () => {
        button.style.opacity = '1';
      });
      pre.addEventListener('mouseleave', () => {
        button.style.opacity = '0';
      });

      // Hover na przycisku
      button.addEventListener('mouseenter', () => {
        button.style.background = 'rgba(255, 255, 255, 0.2)';
        button.style.color = '#ffffff';
      });
      button.addEventListener('mouseleave', () => {
        button.style.background = 'rgba(255, 255, 255, 0.1)';
        button.style.color = '#9ca3af';
      });

      // Kopiowanie do schowka
      button.addEventListener('click', async () => {
        const code = pre.querySelector('code');
        if (!code) return;

        try {
          await navigator.clipboard.writeText(code.textContent || '');

          // Feedback - zmiana ikony na checkmark
          button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
          button.style.color = '#10b981'; // zielony

          // Przywróć ikonę po 2 sekundach
          setTimeout(() => {
            button.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            `;
            button.style.color = '#9ca3af';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });

      pre.appendChild(button);
    });

    // Cleanup nie jest potrzebny - przyciski są w DOM
  }, []);
}
