import { Inter } from 'next/font/google'
import styles from './page.module.scss'

import Header from './components/Header';
import { Profiler, Suspense } from 'react';
import { Main } from '.';
import { Governor } from './components/Governor';



const inter = Inter({ subsets: ['latin'] })

export default async function Page() {



  return (
    <main className={styles.main}>


     
      <div>
        Select type of token to create
        <ul className={styles.list}>
          <Governor />
        </ul>
      </div>



    </main>
  )
}
