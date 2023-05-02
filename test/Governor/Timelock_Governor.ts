/*import { expect } from 'chai';
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time, mine, loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expectRevert } from '../utils/expectRevert';
import { expectEvent, inTransaction, notEmitted } from '../utils/ExpectEvent';
import { Address, fromRpcSig } from 'ethereumjs-util'
import { eip712 } from '../utils/eip712';
import { CANCELLER_ROLE, EXECUTOR_ROLE, MAX_UINT256, MINDELAY, nonce, ProposalState, PROPOSER_ROLE, TIMELOCK_ADMIN_ROLE, tokenSupply, VoteType, votingDelay, votingPeriod, ZERO_ADDRESS, ZERO_BYTES32 } from '../utils/constants'
import { CallReceiverMock, Ink_Governor, Ink_Timelock_Governor, Ink_Votes, TimelockController } from '../../typechain-types';
import GovernorHelper from './GovernorHelper'
import { toEthersBN } from '../utils/typeConverters';


describe('Timelock_Governor', () => {

  const value = toEthersBN(1);


  const deployGovernorFixture = async () => {
    const [owner, deployer, voter1, voter2, voter3, voter4, other] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Governor_Token");
    const token = await Token.deploy();
    await token.deployed();

    const TimeLock = await ethers.getContractFactory("TimelockController");

    const timelock = await TimeLock.deploy(MINDELAY, [owner.address], [owner.address], deployer.address)
    await timelock.deployed();


    const Governor = await ethers.getContractFactory("Timelock_Governor");
    const gov = await Governor.deploy(token.address, timelock.address);
    await gov.deployed();

    const helper = GovernorHelper(gov, 'blocknumber');

    await owner.sendTransaction({ to: timelock.address, value });

    // normal setup: governor is proposer, everyone is executor, timelock is its own admin
    await timelock.connect(deployer).grantRole(PROPOSER_ROLE, gov.address);
    await timelock.connect(deployer).grantRole(PROPOSER_ROLE, owner.address);
    await timelock.connect(deployer).grantRole(CANCELLER_ROLE, gov.address);
    await timelock.connect(deployer).grantRole(CANCELLER_ROLE, owner.address);
    await timelock.connect(deployer).grantRole(EXECUTOR_ROLE, ZERO_ADDRESS);
    await timelock.connect(deployer).revokeRole(TIMELOCK_ADMIN_ROLE, deployer.address);

    await token.mint(owner.address, tokenSupply);

    await helper.delegate(token, voter1, voter1.address, 10);
    await helper.delegate(token, voter2, voter2.address, 7);
    await helper.delegate(token, voter3, voter3.address, 5);
    await helper.delegate(token, voter4, voter4.address, 2);

    return { helper, gov, token, timelock, owner, deployer, voter1, voter2, voter3, voter4, other }
  };

  const proposer = async () => {
    const { helper } = await loadFixture(deployGovernorFixture);

    const CallReceiverMock = await ethers.getContractFactory("CallReceiverMock");
    const mock = await CallReceiverMock.deploy()
    await mock.deployed();


    // default proposal
    const proposal = helper.setProposal(
      {
        targets: [mock.address],
        calldatas: [mock.interface.encodeFunctionData("mockFunction")],
        values: [value],
      },
      '<proposal description>',
    );



    //   proposal.timelockid = await timelock.hashOperationBatch(
    //       ...proposal.shortProposal.slice(0, 3),
    //       ZERO_BYTES32,
    //        proposal.shortProposal[3],
    //    );

    return { mock, proposal }
  }


  describe('initial', () => {
    it("doesn't accept ether transfers", async function () {
      const { gov, owner } = await loadFixture(deployGovernorFixture);
      await expectRevert(owner.sendTransaction({ from: owner.address, to: gov.address, value: 1 }), 'revert');
    });

    it('post deployment check', async function () {
      const { gov, token, timelock } = await loadFixture(deployGovernorFixture);
      expect(await gov.name()).to.be.equal("Ink_Timelock_Governor");
      expect(await gov.token()).to.be.equal(token.address);
      expect(await gov.votingDelay()).to.be.equal(votingDelay);
      expect(await gov.votingPeriod()).to.be.equal(votingPeriod);
      expect(await gov.quorum(0)).to.be.equal('0');
      expect(await gov.timelock()).to.be.equal(timelock.address);
    });

    it('nominal', async function () {
      const { helper, voter1, voter2, voter3, voter4 } = await loadFixture(deployGovernorFixture);
      const { proposal } = await loadFixture(setProposalFixture);

      await helper.propose();
      await helper.waitForSnapshot();
      await helper.vote({ support: VoteType.For, voter: voter1 });
      await helper.vote({ support: VoteType.For, voter: voter2 });
      await helper.vote({ support: VoteType.Against, voter: voter3 });
      await helper.vote({ support: VoteType.Abstain, voter: voter4 });
      await helper.waitForDeadline();
      const queueTx = await helper.queue();
      const queueReceipt = await (queueTx).wait();
      await helper.waitForEta();
      const executeTx = await helper.execute();
      const executeReceipt = await (executeTx).wait()

      expectEvent(queueReceipt, 'ProposalQueued', { proposalId: proposal.id });

      expectEvent(executeReceipt, 'ProposalExecuted', { proposalId: proposal.id });

    });



    describe('cancel', () => {

      it('cancel before queue prevents scheduling', async function () {
        const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);

        await helper.propose();
        await helper.waitForSnapshot();
        await helper.vote({ support: VoteType.For, voter: voter1 });
        await helper.waitForDeadline();

        expectEvent(await (await helper.cancel('internal')).wait(), 'ProposalCanceled', { proposalId: proposal.id });

        expect(await gov.state(proposal.id)).to.be.equal(ProposalState.Canceled);
        await expectRevert(helper.queue(), 'Governor: proposal not successful');
      });

      it('cancel after queue prevents executing', async function () {
        const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);

        await helper.propose();
        await helper.waitForSnapshot();
        await helper.vote({ support: VoteType.For, voter: voter1 });
        await helper.waitForDeadline();
        await helper.queue();

        expectEvent(await (await helper.cancel('internal')).wait(), 'ProposalCanceled', { proposalId: proposal.id });

        expect(await gov.state(proposal.id)).to.be.equal(ProposalState.Canceled);
        await expectRevert(helper.execute(), 'Governor: proposal not successful');
      });

    });


    describe('should revert', function () {
      describe('on queue', function () {
        it('if already queued', async function () {
          const { helper, voter1 } = await loadFixture(deployGovernorFixture);

          await helper.propose();
          await helper.waitForSnapshot();
          await helper.vote({ support: VoteType.For, voter: voter1 });
          await helper.waitForDeadline();
          await helper.queue();
          await expectRevert(helper.queue(), 'Governor: proposal not successful');
        });
      });

      describe('on execute', function () {
        it('if not queued', async function () {
          const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
          const { proposal } = await loadFixture(setProposalFixture);
          await helper.propose();
          await helper.waitForSnapshot();
          await helper.vote({ support: VoteType.For, voter: voter1 });
          await helper.waitForDeadline(+1);
          expect(await gov.state(proposal.id)).to.be.equal(ProposalState.Succeeded);
          await expectRevert(helper.execute(), 'TimelockController: operation is not ready');
        });

        it('if too early', async function () {
          const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
          const { proposal } = await loadFixture(setProposalFixture);
          await helper.propose();
          await helper.waitForSnapshot();
          await helper.vote({ support: VoteType.For, voter: voter1 });
          await helper.waitForDeadline();
          await helper.queue()
          expect(await gov.state(proposal.id)).to.be.equal(ProposalState.Queued);
          await expectRevert(helper.execute(), 'TimelockController: operation is not ready');
        });

        it('if already executed', async function () {
          const { helper, voter1 } = await loadFixture(deployGovernorFixture);
          await helper.propose();
          await helper.waitForSnapshot();
          await helper.vote({ support: VoteType.For, voter: voter1 });
          await helper.waitForDeadline();
          await helper.queue();
          await helper.waitForEta();
          await helper.execute()
          await expectRevert(helper.execute(), 'Governor: proposal not successful');
        });

      });
    });

    describe('onlyGovernance', function () {
      describe('relay', function () {

        it('is protected', async function () {
          const { gov, token, other } = await loadFixture(deployGovernorFixture);
          await expectRevert(
            gov.relay(token.address, 0, token.interface.encodeFunctionData("transfer", [other.address, 1])),
            'Governor: onlyGovernance',
          );
        });

        it('can be executed through governance', async function () {
          const { helper, gov, token, timelock, owner, deployer, voter1, other } = await loadFixture(deployGovernorFixture);

          await token.mint(gov.address, 1);

          helper.setProposal(
            {
              targets: [gov.address],
              calldatas: [gov.interface.encodeFunctionData('relay', [token.address, 0, token.interface.encodeFunctionData("transfer", [owner.address, 1])])]
            },
            '<proposal description>',
          );


          expect(await token.balanceOf(gov.address), '1');
          expect(await token.balanceOf(voter1.address), '0');

          await helper.propose()
          await helper.waitForSnapshot();
          await helper.vote({ support: VoteType.For, voter: voter1 });
          await helper.waitForDeadline();
          await helper.queue();
          await helper.waitForEta();


          const txExecute = await helper.execute();

          expect(await token.balanceOf(gov.address), '0');
          expect(await token.balanceOf(voter1.address), '1');


        });

        it('protected against other proposers', async function () {
          const { gov, timelock, owner } = await loadFixture(deployGovernorFixture);
          await timelock.connect(owner).schedule(
            gov.address,
            '0',
            gov.interface.encodeFunctionData('relay', [ZERO_ADDRESS, '0', '0x']),
            ZERO_BYTES32,
            ZERO_BYTES32,
            3600,
          );
  
          await time.increase(3600);
  
          await expectRevert(
            timelock.connect(owner).execute(
              gov.address,
              '0',
              gov.interface.encodeFunctionData('relay', [ZERO_ADDRESS, '0', '0x']),
              ZERO_BYTES32,
              ZERO_BYTES32
            ),
            'TimelockController: underlying transaction reverted',
          );
        });
      });
    });



    describe('updateTimelock', function () {

      const newTimelockFixture = async () => {
        const { helper, gov, timelock, voter1 } = await loadFixture(deployGovernorFixture);
        const TimeLock = await ethers.getContractFactory("TimelockController");

        const newTimelock = await TimeLock.deploy(3600, [gov.address], [gov.address], ZERO_ADDRESS)
        await timelock.deployed();

        return { newTimelock, helper, gov, timelock, voter1 }
      }


      it('is protected', async function () {
        const { newTimelock, gov } = await loadFixture(newTimelockFixture);
        await expectRevert(gov.updateTimelock(newTimelock.address), 'Governor: onlyGovernance');
      });

      it('can be executed through governance to', async function () {
        const { newTimelock, helper, gov, timelock, voter1 } = await loadFixture(newTimelockFixture);
        helper.setProposal(
          {
            targets: [gov.address],
            calldatas: [gov.interface.encodeFunctionData("updateTimelock", [newTimelock.address])],
          },
          '<proposal description>',
        );

        await helper.propose();
        await helper.waitForSnapshot();
        await helper.vote({ support: VoteType.For, voter: voter1 });
        await helper.waitForDeadline();
        await helper.queue();
        await helper.waitForEta();
        const executeReceipt = await (await helper.execute()).wait();

        expectEvent(executeReceipt, 'TimelockChange', {
          oldTimelock: timelock.address,
          newTimelock: newTimelock.address,
        });

        expect(await gov.timelock()).to.be.equal(newTimelock.address);
      });
    });


    it('clear queue of pending governor calls', async function () {
      const { helper, gov, timelock, voter1 } = await loadFixture(deployGovernorFixture);
      helper.setProposal(
        {
          targets: [gov.address],
          calldatas: [gov.interface.encodeFunctionData("nonGovernanceFunction")],
        },
        '<proposal description>',
      );

      await helper.propose();
      await helper.waitForSnapshot();
      await helper.vote({ support: VoteType.For, voter: voter1 });
      await helper.waitForDeadline();
      await helper.queue();
      await helper.waitForEta();
      await helper.execute();

      // This path clears _governanceCall as part of the afterExecute call,
      // but we have not way to check that the cleanup actually happened other
      // then coverage reports.
    });

  });

});

*/