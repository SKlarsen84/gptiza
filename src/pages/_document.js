// In `pages/_document.js`
import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.1/gsap.min.js"
          strategy="beforeInteractive"
        ></Script>
      </body>
    </Html>
  );
}
