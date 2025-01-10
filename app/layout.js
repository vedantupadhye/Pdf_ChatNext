import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner"


export const metadata = {
  title: "AI Powered Notes taker",
  description: "AI Powered Notes taker and in built text editor ",
};



export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        <Provider>
          {children}
        </Provider>
        <Toaster />
      </body>
    </html>
    </ClerkProvider>
  );
}
