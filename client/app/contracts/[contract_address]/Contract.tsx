'use client'

import { ethers, Contract as ContractType } from 'ethers';
import styles from './Contract.module.scss'
import { getWeb3Context } from "@/app/context/Web3Context";
import { getContract, getInterface } from "@/web3/main/createContracts";
import { usePathname } from 'next/navigation';
import React from "react";
import { Governor_Token } from '@/../typechain-types';
import { Button, Snackbar, TextField } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import SimpleSnackbar from '@/app/material/snackbar';
import { Governor_TokenInterface } from '@/../typechain-types/Governor_Token';
import { mint } from '@/app/methods/Timelock_Governor';

export const Contract = ({ name }: any) => {
    const { signer } = getWeb3Context();
    const [contract, setContract] = React.useState<Governor_Token>();

    const [open, setOpen] = React.useState(true);
    const [message, setMessage] = React.useState<any>('Select function to see info');
    const [selected, setSelected] = React.useState<number>(0)
    const [functionValue, setFunctionValue] = React.useState("");
    const [txreceipt, setTxReceipt] = React.useState();

    const address = usePathname().slice(11);

    function handleSubmit(event: any) {
        event.preventDefault();


    };

    type P = keyof Governor_Token

    const tx =  (functionName: string) => {
      
        
if(contract){
    //nameFunction('symbol',contract)['symbol_func']()

        return (
            <>
                <Button onClick={async()=>{await contract[functionName]();
                }}>
                    Make Transaction</Button></>
        )
            }
    }


    React.useEffect(() => {
        (async () => {
            setContract(await getContract(name, signer))
        })()

    }, []);



    const txInput = () => {
        if (contract) {
            const functions = Object.values(contract?.interface.functions);
            functions.sort((a, b) => {
                const inputsA = a.inputs.length;
                const inputsB = b.inputs.length;
                return inputsA - inputsB;
            });



            const toggleSnackbar = (i: number) => {
                setSelected(i)
                setOpen(true);

                const { stateMutability, payable, outputs } = functions[i];

                setMessage({ stateMutability, payable, outputs })
            }

            return (

                <>
                    <ul className={styles.inputs}>
                        <Grid2 container sx={{
                            '--Grid-borderWidth': '1px',
                            borderTop: 'var(--Grid-borderWidth) solid',
                            borderLeft: 'var(--Grid-borderWidth) solid',
                            borderColor: 'divider',
                            '& > div': {
                                borderRight: 'var(--Grid-borderWidth) solid',
                                borderBottom: 'var(--Grid-borderWidth) solid',
                                borderColor: 'divider',
                            },
                        }} spacing={2}>
                            {functions.map((e, i) =>

                                <Grid2 key={i} className={selected === i ? styles.selected : styles.func} xs={2} onClick={() => { toggleSnackbar(i) }} >

                                    <span>{e.name}</span>
                                    {e.inputs.map((inputs,index) => {

                                        return (
                                            <Grid2 key={index}>
                                                <li className={styles.input}>
                                                    <span> {inputs.name}</span>
                                                    <TextField variant="outlined" label={inputs.type} onChange={(e) => {
                                                        setFunctionValue(e.target.value);
                                                    }} />

                                                </li>
                                            </Grid2>
                                        )

                                    }
                                    )}


                                </Grid2>
                            )}
                        </Grid2>
                    </ul>
                    <div>
                        <SimpleSnackbar open={open} message={message} />
                    </div>
                </>

            )
        } else {
            return null
        }
    }


    return (
        <div>
            {address}
            <div>
                <form className={styles.container} onSubmit={handleSubmit} >
                    {txInput()}
                    <SimpleSnackbar open={true} action={tx('symbol')} position={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }} type='buttonBar' />
                </form>

            </div>
        </div>
    )

}