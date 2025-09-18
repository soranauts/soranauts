<Fragment>
<style is: inline is: global>{`
  :root {
    --aw-font-sans: 'Inter Variable';
    --aw-font-serif: var(--aw-font-sans);
    --aw-font-heading: var(--aw-font-sans);

    --aw-color-primary: rgb(46, 15, 172);
    --aw-color-secondary: rgb(166, 37, 168);
    --aw-color-accent: rgb(210, 31, 107);

    --aw-color-text-heading: rgb(0 0 0); 
    --aw-color-text-default: rgb(16 16 16);
    --aw-color-text-muted: rgb(16 16 16 / 66%);
    --aw-color-bg-page: rgb(255, 255, 255);

    --aw-color-bg-page-dark: rgb(15, 15, 20);

    ::selection {background-color: lavender;}

  }

  .dark {
    --aw-font-sans: 'Inter Variable';
    --aw-font-serif: var(--aw-font-sans);
    --aw-font-heading: var(--aw-font-sans);

    --aw-color-primary: rgb(46, 15, 172);
    --aw-color-secondary: rgb(166, 37, 168);
    --aw-color-accent: rgb(210, 31, 107);

    --aw-color-text-heading: rgb(0 0 0); 
    --aw-color-text-default: rgb(229 236 246);
    --aw-color-text-muted: rgb(229 236 246 / 66%);
    --aw-color-bg-page: var(--aw-color-bg-page-dark);

    ::selection {background-color: black; color: snow}

  }
`}</style>

</Fragment>;
