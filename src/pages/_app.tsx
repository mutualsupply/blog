import '../styles/globals.css';
import { ConnectKitProvider } from 'connectkit';
import type { AppProps } from 'next/app';
import NextHead from 'next/head';
import * as React from 'react';
import { WagmiConfig } from 'wagmi';
import { client } from '../wagmi';
import { Footer } from '../components';
import { Header } from '../components';
import { CurationDataProvider } from "../providers/CurationDataProvider"
import { ChannelAdminProvider } from "../providers/ChannelAdminProvider"
import { ENSResolverProvider } from '../providers/ENSResolverProvider';
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from '@livepeer/react';
// @ts-ignore
// import favicon from "../public/seo/pink.png"

// determines what curation contract will be used for blog context
const channel = process.env.NEXT_PUBLIC_AP_721_CURATION_CONTRACT;

const channelAdmin_1 = "0xEfFE6b3DBA2E39aA1085f88a93AB8563Ba45bAa6"
const channelAdmin_2 = "0xB00A93fF31217E49c3674e05b525f239a85bb78f"
const channelAdmin_3 = "0x153D2A196dc8f1F6b9Aa87241864B3e4d4FEc170"
// const channelAdmin_3 = "0x784FA0c3C12aEe8f571EF3c91408cb2219B431dC"

const livePeerAPIKey = process.env.NEXT_PUBLIC_STUDIO_API_KEY
if (!livePeerAPIKey) {
  throw new Error("Livepeer API key not found");
}

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: livePeerAPIKey
    // baseUrl: {not sure what goes here}
  }),
});


// SEO
const defaultTitle = "MUTUAL BLOG"
const defaultDescription = "Thoughts from a collective researching design culture inside the emerging internet."
const defaultOGURL = "blog.mutual.supply"
const defaultOGImage = "/seo/mutual-blog-opengraph.png";
const favicon = "/seo/mutual-favicon-32.png"

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <CurationDataProvider curationContract={channel} >
          <ChannelAdminProvider channelAdmin1={channelAdmin_1} channelAdmin2={channelAdmin_2} channelAdmin3={channelAdmin_3}>
            <ENSResolverProvider>
              <LivepeerConfig client={livepeerClient}>
                <NextHead>
                  <title>{defaultTitle}</title>                  
                  <meta name="description" content={defaultDescription} />        
                  <link rel="icon" type="image/png" sizes="32x32" href={favicon} />
                  <meta property="og:url" content={defaultOGURL} />
                  <meta property="og:title" content={defaultTitle} />
                  <meta property="og:description" content={defaultDescription} />
                  <meta name="twitter:creator" content={`@mutualdesign`} />
                  <meta name="twitter:site" content={defaultOGURL} />
                  <meta name="twitter:card" content="summary_large_image" />
                  <meta name="twitter:image" content={defaultOGImage} />
                  <meta property="og:image" content={defaultOGImage} />
                  <meta property="og:image:width" content="1048" />
                  <meta property="og:image:height" content="540" />                
                </NextHead>
                <Header />
                <Footer />
                {mounted && <Component {...pageProps} />}
              </LivepeerConfig>
            </ENSResolverProvider>
          </ChannelAdminProvider>
        </CurationDataProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
