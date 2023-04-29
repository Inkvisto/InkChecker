'use client'

import React from 'react';
import { ethers, Contract } from 'ethers'

import { getWeb3Context } from "../context/Web3Context";
import { getAddress, getContract } from '@/web3/main/createContracts';

import styles from './Contracts.module.scss';
import { Governor_Token } from '@/../typechain-types';
import BasicPopover from '../material/popup';
import { Button } from '@mui/material';
import Link from 'next/link';

type Contracts = { name: string, contract: Contract }

export const Contracts = ({ info }: any) => {


    return (<ul className={styles.main}>
        {info.map((e: string, i: number, a: any) => {
            return (
                <li key={i} >
                    <Link href={'contracts/' + Object.values(e) + '?contractName=' + Object.keys(e)}>
                        <Button>
                            {Object.entries(e)}
                        </Button>
                    </Link>
                </li>
            )
        })}
    </ul >)
}