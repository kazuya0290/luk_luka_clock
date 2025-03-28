import "@/styles/globals.css";
import "@/styles/vclock.css";
import "@/styles/vclock2.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="app-container">
      <Component {...pageProps} />
    </div>
  );
}