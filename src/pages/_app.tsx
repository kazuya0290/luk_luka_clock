// import "@/styles/globals.css";
import type { AppProps } from "next/app";
import '../styles/vclock.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
