import type { Metadata } from "next";
import "@/sass/global.scss"

export const metadata: Metadata = {
    title: "Go Lang Chat App",
    description: "Created By Hamza Siddiqui",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
