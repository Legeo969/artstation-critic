import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Artstation Critic - AI 专业作品点评",
    template: "%s | Artstation Critic",
  },
  description: "AI 驱动的美术作品点评工具，从构图、色彩、技法等 6 个维度深度分析你的艺术作品",
  keywords: ["art", "critique", "AI", "美术", "点评", "AI 绘画", "artstation", "作品分析"],
  authors: [{ name: "Artstation Critic" }],
  openGraph: {
    title: "Artstation Critic - AI 专业作品点评",
    description: "AI 驱动的美术作品点评工具，从构图、色彩、技法等 6 个维度深度分析你的艺术作品",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artstation Critic - AI 专业作品点评",
    description: "AI 驱动的美术作品点评工具",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
