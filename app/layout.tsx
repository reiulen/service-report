import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider"
import AppLayout from "@/components/Layouts/AppLayout";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";

export const metadata: Metadata = {
  title: 'Service Report Generator',
  description: 'Generate service reports for your clients',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>
          <ReactQueryClientProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </ReactQueryClientProvider>
        </Provider>
      </body>
    </html>
  )
}