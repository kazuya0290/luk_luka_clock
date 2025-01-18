import { AppProps } from 'next/app';
import '../styles/vclock.css'; // vclock.cssのインポートをここに移動

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;