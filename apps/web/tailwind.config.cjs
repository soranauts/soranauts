import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          400: 'var(--color-brand-400)',
          500: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
          soft: 'var(--color-brand-soft)',
        },
        page: 'var(--color-bg-page)',
        surface: 'var(--color-bg-surface)',
        soft: 'var(--color-bg-soft)',
        border: {
          subtle: 'var(--color-border-subtle)',
        },
        text: {
          main: 'var(--color-text-main)',
          muted: 'var(--color-text-muted)',
          soft: 'var(--color-text-soft)',
        },
        link: {
          DEFAULT: 'var(--color-link)',
          hover: 'var(--color-link-hover)',
          muted: 'var(--color-link-muted)',
        },
        overlay: {
          subtle: 'var(--overlay-subtle)',
          strong: 'var(--overlay-strong)',
          focus: 'var(--overlay-focus)',
        },
        status: {
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          error: 'var(--color-error)',
          info: 'var(--color-info)',
        },
      },
      fontFamily: {
        sans: ['var(--aw-font-sans)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aw-font-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading)', ...defaultTheme.fontFamily.sans],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.text.muted'),
            '--tw-prose-headings': theme('colors.text.main'),
            '--tw-prose-lead': theme('colors.text.soft'),
            '--tw-prose-links': theme('colors.link.DEFAULT'),
            '--tw-prose-bold': theme('colors.text.main'),
            '--tw-prose-counters': theme('colors.text.soft'),
            '--tw-prose-bullets': theme('colors.text.soft'),
            '--tw-prose-hr': theme('colors.border.subtle'),
            '--tw-prose-quotes': theme('colors.text.main'),
            '--tw-prose-quote-borders': theme('colors.border.subtle'),
            '--tw-prose-captions': theme('colors.text.soft'),
            '--tw-prose-code': theme('colors.text.main'),
            '--tw-prose-pre-code': theme('colors.text.muted'),
            '--tw-prose-pre-bg': theme('colors.soft'),
            '--tw-prose-th-borders': theme('colors.border.subtle'),
            '--tw-prose-td-borders': theme('colors.border.subtle'),
            a: {
              color: 'var(--color-link)',
              textDecoration: 'underline',
              textDecorationColor: 'var(--color-link)',
              textUnderlineOffset: '0.18em',
              textDecorationThickness: '1px',
              transitionProperty: 'color, text-decoration-color',
              transitionDuration: '150ms',
              transitionTimingFunction: 'ease',
              '&:hover': {
                color: 'var(--color-link-hover)',
                textDecorationColor: 'var(--color-link-hover)',
              },
            },
          },
        },
        // Dark mode prose styles
        invert: {
          css: {
            '--tw-prose-body': theme('colors.text.muted'),
            '--tw-prose-headings': theme('colors.text.main'),
            '--tw-prose-lead': theme('colors.text.soft'),
            '--tw-prose-links': theme('colors.link.DEFAULT'),
            '--tw-prose-bold': theme('colors.text.main'),
            '--tw-prose-counters': theme('colors.text.soft'),
            '--tw-prose-bullets': theme('colors.text.soft'),
            '--tw-prose-hr': theme('colors.border.subtle'),
            '--tw-prose-quotes': theme('colors.text.main'),
            '--tw-prose-quote-borders': theme('colors.border.subtle'),
            '--tw-prose-captions': theme('colors.text.soft'),
            '--tw-prose-code': theme('colors.text.main'),
            '--tw-prose-pre-code': theme('colors.text.muted'),
            '--tw-prose-pre-bg': theme('colors.soft'),
            '--tw-prose-th-borders': theme('colors.border.subtle'),
            '--tw-prose-td-borders': theme('colors.border.subtle'),
            a: {
              color: 'var(--color-link)',
              textDecoration: 'underline',
              textDecorationColor: 'var(--color-link)',
              '&:hover': {
                color: 'var(--color-link-hover)',
                textDecorationColor: 'var(--color-link-hover)',
              },
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
  darkMode: 'class',
};
