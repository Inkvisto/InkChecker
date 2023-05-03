
import { ethers } from "hardhat";
import { time } from '@nomicfoundation/hardhat-network-helpers'


const genOperation = (target: string, value: string, data: string, predecessor: string, salt: string) => {

  const id = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode([
    'address',
    'uint256',
    'bytes',
    'uint256',
    'bytes32',
  ], [
    target,
    value,
    data,
    predecessor,
    salt,
  ]));
  return { id, target, value, data, predecessor, salt };
}

const TIMELOCK_ADMIN_ROLE = ethers.utils.solidityKeccak256(['string'], ['TIMELOCK_ADMIN_ROLE']);
const PROPOSER_ROLE = ethers.utils.solidityKeccak256(['string'], ['PROPOSER_ROLE']);
const EXECUTOR_ROLE = ethers.utils.solidityKeccak256(['string'], ['EXECUTOR_ROLE']);
const CANCELLER_ROLE = ethers.utils.solidityKeccak256(['string'], ['CANCELLER_ROLE']);


const timelockSimulations = async() => {


    // deploy TimelockController with default properties 
    const [admin, proposer, canceller, executor, other] = await ethers.getSigners()

    
    const TimeLock = await ethers.getContractFactory("TimelockController");

    const timelock = await TimeLock.deploy(100, [proposer.address], [executor.address], admin.address)
    await timelock.deployed()
    

   const minDelaySim = async () => {
    const { target, value, data, predecessor, salt } = genOperation(
      timelock.address,
      '0',
      timelock.interface.encodeFunctionData('updateDelay', ['0']),
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      '0xf8e775b2c5f4d66fb5c7fa800f35ef518c262b6014b3c0aee6ea21bff157f108',
    )

    await timelock.connect(proposer).schedule(
      target,
      value,
      data,
      predecessor,
      salt,
      100,
    );


    await time.increase(100);

    const tx = await (await timelock.connect(executor).execute(
      target,
      value,
      data,
      predecessor,
      salt
    )).wait();
   }

   const grantRoleSim = async () => {
    await timelock.connect(admin).grantRole(CANCELLER_ROLE, executor.address);
   }


 // await minDelaySim()
  await grantRoleSim();


    
  }

  timelockSimulations()
