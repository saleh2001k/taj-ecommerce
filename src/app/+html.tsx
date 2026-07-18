import { ScrollViewStyleReset } from 'expo-router/html';
import type { ReactNode } from 'react';

// Web-only. Configures the root HTML for every page during static rendering.
// Import the Unistyles config so themes are registered during SSR too.
import '@/theme/unistyles';

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <ScrollViewStyleReset />
        {/* First-paint background matches the default (Atelier) theme so there
            is no flash before Unistyles' CSS variables take over. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body { background-color: #F6F3EE; }
@media (prefers-color-scheme: dark) {
  body { background-color: #141210; }
}`;
