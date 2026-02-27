import { createClient, OAuthStrategy } from '@wix/sdk';
import { items } from '@wix/data';
import { media } from '@wix/media';

export const wixClient = createClient({
  modules: { 
    items,
    media 
  },
  auth: OAuthStrategy({
    clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID || '',
  }),
});
