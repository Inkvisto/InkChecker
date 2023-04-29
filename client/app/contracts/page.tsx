import { getAddress } from '@/web3/main/createContracts';
import { Contracts } from '.'
import { readdir } from 'fs/promises';



export default async function Page() {

    const names = await readdir('./contracts/artifacts')

    const addresses = await Promise.all(names.map((name) => {
        return getAddress(name)
    }));


    const contractInfo = names.map((e, i) => ({ [e.slice(0, -5)]: addresses[i] }));


    return (
        <div>


            <Contracts info={contractInfo} />




        </div>
    )
}
