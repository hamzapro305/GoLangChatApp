import type { Metadata } from "next";
import "@/sass/global.scss";
import StoreProvider from "@/Redux/StoreProvider";

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
            <StoreProvider>
                <body>{children}</body>
            </StoreProvider>
        </html>
    );
}
