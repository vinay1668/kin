export {};

declare global {
  interface Window {
    Clerk?: {
      load: () => Promise<void>;
      client?: {
        signIn?: {
          authenticateWithRedirect: (options: {
            strategy: string;
            redirectUrl: string;
            redirectUrlComplete: string;
          }) => Promise<void>;
        };
      };
      session?: { getToken: () => Promise<string | null> };
      signOut?: () => Promise<void>;
      handleRedirectCallback?: () => Promise<void>;
    };
  }
}
