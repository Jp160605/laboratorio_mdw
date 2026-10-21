import type { Metadata } from "next";
import { DotGothic16, VT323 } from "next/font/google";
import { ReservasProvider } from "@/context/ReservasContext";
import NotificationDrawer from "@/components/NotificationDrawer";
import PixelSkyBackground from "@/components/PixelSkyBackground";
import "./globals.css";

const dotGothic = DotGothic16({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LabReserva // Sistema de Reservas y Laboratorios",
  description: "Sistema de reservas y control de concurrencia optimista para salas de estudio y laboratorios universitarios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${dotGothic.variable} ${vt323.variable}`}>
      <body className="font-body text-neo-dark antialiased selection:bg-neo-yellow selection:text-neo-dark relative min-h-screen">
        <PixelSkyBackground />
        <ReservasProvider>
          {children}
          <NotificationDrawer />
        </ReservasProvider>
      </body>
    </html>
  );
}
