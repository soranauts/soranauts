// Global type declarations

declare global {
  interface Window {
    posthog: {
      init: (apiKey: string, config?: any) => void;
      opt_out_capturing: () => void;
      opt_in_capturing: () => void;
      capture: (event: string, properties?: any) => void;
      identify: (userId: string, properties?: any) => void;
      [key: string]: any;
    };
  }
}

export {};
