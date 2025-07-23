import localFont from "next/font/local";

/**
 * Euclide UI Display
 */
export const PoppinsUiDisplay = localFont({
  src: [
    {
      path: "../fonts/Poppins-Regular.ttf",
      weight: "300",
      style: "light",
    },
    {
      path: "../fonts/Poppins-Regular.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Poppins-Bold.ttf",
      weight: "800",
      style: "bold",
    },
  ],
  display: "swap",
  variable: "--font-poppins-ui-display",
  preload: true,
});
