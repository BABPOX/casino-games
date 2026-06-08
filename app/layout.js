import './globals.css'

export const metadata = {
  title: 'Casino Games',
  description: 'Play multiple casino games',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
