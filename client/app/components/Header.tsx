'use client'

import React, { Profiler, Suspense } from "react";

import styles from './Header.module.scss'
import Link from "next/link";
import { getWeb3Context } from "../context/Web3Context";
import { usePathname } from 'next/navigation';


const Header = () => {

    const { account, connectionError } = getWeb3Context();
    const pathname = usePathname()

    type Navigation = {
        name: string,
        path: string
    }

    const navList: Navigation[] = [{ name: 'Home', path: '/' }, { name: 'Contracts', path: '/contracts' }];
    const currentPage = navList.findIndex((e: Navigation) => e.path === pathname);



    return (
        <div className={styles.container}>
            <ul className={styles.nav}>
                {navList.map(({ name, path }: Navigation, i: number) =>

                    <Link href={path} key={i} >
                        <li className={i === currentPage ? styles.selected : ''} >
                            {name}
                        </li></Link>

                )}
                <li key={navList.length}>
                    {connectionError ? connectionError.error?.message : account ?? 'Connecting to wallet...'}
                </li>
            </ul>

        </div>
    )
}

export default Header;