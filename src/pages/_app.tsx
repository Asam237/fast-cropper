import { appWithTranslation } from "next-i18next";
import cn from "clsx";
import { PoppinsUiDisplay } from "@/lib/fonts";
import type { AppProps } from "next/app";
import "../style.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div
        className={cn(PoppinsUiDisplay.variable, PoppinsUiDisplay.className)}
      >
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default appWithTranslation(App);
