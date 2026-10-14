import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * Deployment settings (environment variables, all optional):
 *   BASE_PATH  Public path the site is served from, e.g. "/portfolio/".
 *              Default "./" makes every asset URL relative, so the same build works
 *              at a domain root, under any GitLab project subpath, and from file://.
 *   SITE_URL   Absolute URL of the published site, e.g. "https://name.gitlab.io/portfolio/".
 *              Used for canonical, hreflang and Open Graph URLs. Omitted tags are removed when unset.
 */
export default defineConfig(({ mode }) => {
  const standalone = mode === 'standalone';
  const base = process.env.BASE_PATH || './';
  const siteUrl = process.env.SITE_URL ? process.env.SITE_URL.replace(/\/?$/, '/') : '';

  return {
    base,
    // Static files copied as-is. Not called "public" because GitLab Pages publishes a folder of that name.
    publicDir: 'static',
    plugins: [
      react(),
      tailwindcss(),
      siteUrlPlugin(siteUrl),
      !standalone && preloadPersianFonts(base),
      standalone && viteSingleFile({ removeViteModuleLoader: true }),
    ],
    build: {
      outDir: standalone ? 'dist-standalone' : 'dist',
      // The standalone preview inlines fonts and images into one HTML file.
      assetsInlineLimit: standalone ? 100_000_000 : 4096,
      cssCodeSplit: !standalone,
    },
  };
});

/** Fills %SITE_URL% placeholders in index.html, or drops the tags that need an absolute URL. */
function siteUrlPlugin(siteUrl: string): Plugin {
  return {
    name: 'site-url',
    transformIndexHtml(html) {
      if (siteUrl) return html.replaceAll('%SITE_URL%', siteUrl);
      return html.replace(/^.*%SITE_URL%.*\n/gm, '');
    },
  };
}

/** Persian is the default language, so its two fonts are preloaded. */
function preloadPersianFonts(base: string): Plugin {
  return {
    name: 'preload-persian-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return;
        return Object.keys(ctx.bundle)
          .filter((file) => /vazirmatn-arabic.*\.woff2$/.test(file))
          .map((file) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `${base}${file}`, crossorigin: '' },
            injectTo: 'head' as const,
          }));
      },
    },
  };
}
