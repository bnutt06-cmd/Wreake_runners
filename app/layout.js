import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Wreake Runners — Running Club, Syston, Leicester",
  description:
    "A friendly, inclusive running club based in Syston, Leicester. Running better together since 1981.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body>
        <StoreProvider>
          <Nav />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
