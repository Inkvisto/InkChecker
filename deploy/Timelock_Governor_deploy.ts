import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction, DeployResult } from 'hardhat-deploy/types'
import path from 'path';
import fs from 'fs';
import { writeFile } from 'fs/promises';

const contractNames = ['Governor_Token','TimelockController','Timelock_Governor'];

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {

  console.warn(
    "You are trying to deploy a contract to the Hardhat Network, which" +
    "gets automatically created and destroyed every time. Use the Hardhat" +
    " option '--network localhost'"
  );

  const { deployments, getNamedAccounts } = hre;

  const { deploy } = deployments;
  const { deployer, proposer, executor } = await getNamedAccounts();


  const token = await deploy('Governor_Token', {
    from: deployer,
    args: [],
    log: true
  });

  const timelock = await deploy('TimelockController', {
    from: deployer,
    args: [100, [proposer], [executor], deployer],
    log: true
  });

  const gov = await deploy('Timelock_Governor', {
    from: deployer,
    args: [token.address, timelock.address],
    log: true
  });


  const deployedContacts = [token,timelock,gov];


  const saveContractsInfo = async (contracts: DeployResult[]) => {
    const contractsDir = path.join(__dirname, '/..', 'client/contracts')
    

    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir)
    }

    contracts.forEach(async (e:DeployResult, i:number) => {
      await writeFile(
        path.join(contractsDir, '/deployed/', contractNames[i] + '.json'),
        JSON.stringify(e, null, 2)
      );


      const ContractArtifact = hre.artifacts.readArtifactSync(contractNames[i])

    await writeFile(
      path.join(contractsDir, '/artifacts/', contractNames[i] + ".json"),
      JSON.stringify(ContractArtifact, null, 2)
    )
    });
  };



  await saveContractsInfo(deployedContacts);
 

  
}

export default func;
func.tags = contractNames;

