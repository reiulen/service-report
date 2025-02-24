import type { Metadata } from 'next'
import { Provider } from "@/components/ui/provider"
import AppLayout from '@/components/Layouts/AppLayout'

export const metadata: Metadata = {
  title: 'Service Report Generator',
  description: 'Generate service reports for your clients',
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <AppLayout>
            {children}
          </AppLayout>
        </Provider>
      </body>
    </html>
  )
}
