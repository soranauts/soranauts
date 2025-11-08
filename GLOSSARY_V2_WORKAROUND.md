# Glossary V2 Preview Workaround

## Current Status
The Astro compiler (v5.15.3) is experiencing a panic when processing Layout.astro with Glossary V2 components enabled. The error is: `panic: html: bad parser state: originalIM was set twice`.

## Temporary Workaround

To preview Glossary V2 functionality, you have two options:

### Option 1: Use the Legacy Mode (Current State)
The site loads successfully with `GLOSSARY_V2=false` (or unset). The glossary terms will use the legacy tooltip behavior.

### Option 2: Manual Testing in Browser Console
1. Start the dev server with glossary components commented out:
   ```bash
   pnpm --filter @soranauts/web dev
   ```
2. Open browser DevTools console
3. Manually inject the popover HTML and script:
   ```javascript
   // Inject popover HTML
   document.body.insertAdjacentHTML('beforeend', `
     <div id="g-pop" class="g-pop" role="dialog" aria-modal="false" aria-hidden="true" aria-labelledby="g-pop-title">
       <div class="g-pop__card" role="document">
         <button class="g-pop__close" aria-label="Close">×</button>
         <div class="g-pop__title" id="g-pop-title"></div>
         <div class="g-pop__body"></div>
         <a class="g-pop__cta" href="#" rel="nofollow">Open full entry ↗</a>
       </div>
       <div class="g-pop__backdrop"></div>
     </div>
   `);
   
   // Load the script
   import('/src/components/glossary/GlossaryPopover.client.ts');
   ```

## Root Cause
The Astro compiler appears to have issues with:
- Conditional rendering of components in Layout.astro
- Inline scripts in conditional blocks
- Component imports that contain scripts

## Next Steps
1. File an issue with Astro maintainers at https://astro.build/issues/compiler
2. Try upgrading to Astro 5.16+ when available
3. Consider using a different approach (e.g., client-side only initialization)





