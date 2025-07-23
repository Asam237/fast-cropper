import { PoppinsUiDisplay } from "@/lib/fonts";
import cn from "clsx";
import Document, { Head, Html, Main, NextScript } from "next/document";

export default class Blog extends Document {
  render() {
    return (
      <Html>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Head />
        <body
          className={cn(PoppinsUiDisplay.variable, PoppinsUiDisplay.className)}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
