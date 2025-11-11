import { mountGlossaryPopover } from './GlossaryPopover';

if (typeof window !== 'undefined') {
  const globalWindow = /** @type {Window & { __GLOSSARY_POP_MOUNTED__?: boolean }} */ (window);

  if (!globalWindow.__GLOSSARY_POP_MOUNTED__) {
    try {
      mountGlossaryPopover();
    } catch (error) {
      console.error('[GlossaryPopover] mount failed:', error);
    }
  }
}
