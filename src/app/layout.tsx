import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { StagewiseToolbar } from '@stagewise/toolbar-next';

const inter = Inter({ subsets: ["latin"] })

const metadata = {
  title: "ShopMindAI Chat - Your AI Shopping Assistant",
  description: "Chat with AI to find the perfect products for you.",
  generator: 'ShopMindAI'
}

const stagewiseConfig = {
  plugins: []
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={inter.className}>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <StagewiseToolbar config={stagewiseConfig} />
        )}
      </body>
    </html>
  )
}