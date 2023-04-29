import Header from './components/Header'
import { Web3ContextProvider } from './context/Web3ContextProvider'
import { inter } from './fonts'
import './globals.css'
import './reset.css'



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {




  return (

    <html lang="en" className={inter.className}>
      <body>
       <Web3ContextProvider>
       <Header />
        {children}
       </Web3ContextProvider>
      </body>
    </html>

  )
}
