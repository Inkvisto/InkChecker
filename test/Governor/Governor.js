"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
describe("Governor", () => {

  const value = toEthersBN(1);


  const deployGovernorFixture = async () => {
    const [owner, proposer, voter1, voter2, voter3, voter4] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Ink_Votes");
    const token = await Token.deploy();
    await token.deployed();

    const Governor = await ethers.getContractFactory("Ink_Governor");
    const gov = await Governor.deploy(token.address);
    await gov.deployed();

    const helper = GovernorHelper(gov, 'blocknumber');


    await owner.sendTransaction({ to: gov.address, from: owner.address, value })
    await token.mint(owner.address, tokenSupply);

    await helper.delegate(token, voter1, voter1.address, 10);
    await helper.delegate(token, voter2, voter2.address, 7);
    await helper.delegate(token, voter3, voter3.address, 5);
    await helper.delegate(token, voter4, voter4.address, 2);


    return { helper, gov, token, owner, proposer, voter1, voter2, voter3, voter4 }

  };



  const setProposalFixture = async () => {
    const { helper } = await loadFixture(deployGovernorFixture);

    const CallReceiverMock = await ethers.getContractFactory("CallReceiverMock");
    const mock = await CallReceiverMock.deploy()
    await mock.deployed();

    // default proposal
    const proposal = helper.setProposal(
      {
        targets: [mock.address],
        calldatas: [mock.interface.encodeFunctionData("mockFunction")],
        values: [value]
      },
      '<proposal description>',
    );

    return { mock, proposal }
  }




  it('deployment check', async function () {
    const { gov, token } = await loadFixture(deployGovernorFixture);
    expect(await gov.name()).to.be.equal('Ink_Governor');
    expect(await gov.token()).to.be.equal(token.address);
    expect(await gov.votingDelay()).to.be.equal(votingDelay);
    expect(await gov.votingPeriod()).to.be.equal(votingPeriod);
    expect(await gov.quorum(0)).to.be.equal('0');
    expect(await gov.COUNTING_MODE()).to.be.equal('support=bravo&quorum=for,abstain');
  });


  it('nominal workflow', async function () {
    const { gov, owner, proposer, voter1, voter2, voter3, voter4, helper } = await loadFixture(deployGovernorFixture);
    const { mock, proposal } = await loadFixture(setProposalFixture);

    expect(await gov.hasVoted(proposal.id, owner.address)).to.be.equal(false);
    expect(await gov.hasVoted(proposal.id, voter1.address)).to.be.equal(false);
    expect(await gov.hasVoted(proposal.id, voter2.address)).to.be.equal(false);
    expect(await gov.provider.getBalance(gov.address)).to.be.equal(toEthersBN(1));
    expect(await gov.provider.getBalance(mock.address)).to.be.equal('0');

    const receipt = await helper.propose(proposer);


    // console.log(receipt.events.find((event:any) => event.event === 'ProposalCreated').args);



    expectEvent(receipt, 'ProposalCreated', {
      proposalId: proposal.id,
      proposer: proposer.address,
      targets: proposal.targets,
      //values: proposal.values,
      calldatas: proposal.calldatas,
      voteStart: toEthersBN(receipt.blockNumber).add(votingDelay),
      voteEnd: toEthersBN(receipt.blockNumber)
        .add(votingDelay)
        .add(votingPeriod),
      description: proposal.description,
    });


    await helper.waitForSnapshot();

    const vote1Receipt = await (await gov.connect(voter1).castVoteWithReason(proposal.id, VoteType.For, "is nice")).wait();
    const vote2Receipt = await (await gov.connect(voter2).castVote(proposal.id, VoteType.For)).wait();
    const vote3Receipt = await (await gov.connect(voter3).castVote(proposal.id, VoteType.Against)).wait();
    const vote4Receipt = await (await gov.connect(voter4).castVote(proposal.id, VoteType.Abstain)).wait();

    expectEvent(
      vote1Receipt,
      'VoteCast',
      {
        voter: voter1.address,
        support: VoteType.For,
        reason: 'is nice',
        weight: 10,
      },
    );

    expectEvent(
      vote2Receipt,
      'VoteCast',
      {
        voter: voter2.address,
        support: VoteType.For,
        weight: 7,
      },
    );

    expectEvent(
      vote3Receipt,
      'VoteCast',
      {
        voter: voter3.address,
        support: VoteType.Against,
        weight: 5,
      },
    );

    expectEvent(
      vote4Receipt,
      'VoteCast',
      {
        voter: voter4.address,
        support: VoteType.Abstain,
        weight: 2,
      },
    );

    await helper.waitForDeadline();



    const executeTx = helper.execute();


    const executeReceipt = await (await executeTx).wait();



    expectEvent(executeReceipt, 'ProposalExecuted', { proposalId: proposal.id });

    //  await inTransaction(executeReceipt,executeTx, receiver, 'MockFunctionCalled');


    expect(await gov.hasVoted(proposal.id, owner.address)).to.be.equal(false);
    expect(await gov.hasVoted(proposal.id, voter1.address)).to.be.equal(true);
    expect(await gov.hasVoted(proposal.id, voter2.address)).to.be.equal(true);
    expect(await gov.provider.getBalance(gov.address)).to.be.equal('0');
    expect(await gov.provider.getBalance(mock.address)).to.be.equal(toEthersBN(1));

  });



  it('vote with signature', async function () {
    const { helper, gov, token, owner, voter1, voter2 } = await loadFixture(deployGovernorFixture);
    const { proposal } = await loadFixture(setProposalFixture);

    const chainId = (await gov.provider.getNetwork()).chainId;

    const [delegator, signature] = await eip712(owner, gov, chainId, 'Ballot', { proposalId: proposal.id, support: VoteType.For });


    const delegatorAddress = ethers.utils.getAddress(delegator.address);

    const { v, r, s } = fromRpcSig(signature);

    await (await token.connect(voter1).delegate(delegator.address)).wait();


    // Run proposal
    await helper.propose();
    await helper.waitForSnapshot();

    const receipt = await (await gov.connect(delegator).castVoteBySig(proposal.id, VoteType.For, v, r, s)).wait();
    expectEvent(receipt, 'VoteCast', {
      voter: delegator.address,
      support: VoteType.For,
    });

    await helper.waitForDeadline();
    await helper.execute();

    // After
    expect(await gov.hasVoted(proposal.id, voter1.address)).to.be.equal(false);
    expect(await gov.hasVoted(proposal.id, voter2.address)).to.be.equal(false);
    expect(await gov.hasVoted(proposal.id, delegatorAddress)).to.be.equal(true);
  });

  it('send ethers', async function () {
    const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);

    const proposal = helper.setProposal(
      {
        targets: [ZERO_ADDRESS],
        values: [value],
      },
      '<proposal description>',
    );

    // Before
    expect(await gov.provider.getBalance(gov.address)).to.be.equal(value);
    expect(await gov.provider.getBalance(ZERO_ADDRESS)).to.be.equal('0');

    // Run proposal
    await helper.propose();
    await helper.waitForSnapshot();
    await (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
    await helper.waitForDeadline();
    await helper.execute();

    // After
    expect(await gov.provider.getBalance(gov.address)).to.be.equal('0');
    expect(await gov.provider.getBalance(ZERO_ADDRESS)).to.be.equal(value);
  });


  describe('should revert', () => {
    describe('on propose', () => {
      it('if proposal already exists', async () => {
        const { helper } = await loadFixture(deployGovernorFixture);
        await helper.propose();
        await expectRevert(helper.propose(), 'Governor: proposal already exists');
      });
    });


    describe('on vote', () => {
      it('if proposal does not exist', async () => {
        const { gov, voter1 } = await loadFixture(deployGovernorFixture);
        const receipt = gov.connect(voter1).castVote(toEthersBN(0), VoteType.For);
        await expectRevert(receipt,
          'Governor: unknown proposal id',
        );
      });

      it('if voting has not started', async () => {
        const { gov, voter1, helper } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);
        await helper.propose();
        const receipt = gov.connect(voter1).castVote(proposal.id, VoteType.For);
        await expectRevert(receipt,
          'Governor: vote not currently active',
        );
      });

      it('if support value is invalid', async () => {
        const { gov, voter1, helper } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);
        await helper.propose();
        await helper.waitForSnapshot();
        const receipt = gov.connect(voter1).castVote(proposal.id, toEthersBN(255));
        await expectRevert(receipt,
          'GovernorVotingSimple: invalid value for enum VoteType',
        );
      });
      it('if vote was already casted', async () => {
        const { gov, voter1, helper } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);
        await helper.propose();
        await helper.waitForSnapshot();
        (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
        await expectRevert(gov.connect(voter1).castVote(proposal.id, VoteType.For),
          'GovernorVotingSimple: vote already cast',
        );
      });

      it('if voting is over', async () => {
        const { gov, voter1, helper } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);
        await helper.propose();
        await helper.waitForDeadline();
        const receipt = gov.connect(voter1).castVote(proposal.id, VoteType.For);
        await expectRevert(
          receipt,
          'Governor: vote not currently active',
        );
      });
    });
    describe('on execute', () => {
      it('if proposal does not exist', async () => {
        const { gov, voter1, helper } = await loadFixture(deployGovernorFixture);
        await expectRevert(helper.execute(), 'Governor: unknown proposal id');
      });

      it('if quorum is not reached', async () => {
        const { helper, gov, voter3 } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);
        await helper.propose();
        await helper.waitForSnapshot();
        (await gov.connect(voter3).castVote(proposal.id, VoteType.For)).wait();
        await expectRevert(helper.execute(), 'Governor: proposal not successful');
      });

      it('if score not reached', async function () {
        const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);
        await helper.propose();
        await helper.waitForSnapshot();
        (await gov.connect(voter1).castVote(proposal.id, VoteType.Against)).wait();
        await expectRevert(helper.execute(), 'Governor: proposal not successful');
      });

      it('if voting is not over', async function () {
        const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);
        await helper.propose();
        await helper.waitForSnapshot();
        await (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
        await expectRevert(helper.execute(), 'Governor: proposal not successful');
      });

      it('if mock revert without reason', async function () {
        const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
        const { mock } = await loadFixture(setProposalFixture);
        const proposal = helper.setProposal(
          {
            targets: [mock.address],
            calldatas: [mock.interface.encodeFunctionData("mockFunctionRevertsNoReason")],
          },
          '<proposal description>',
        );

        await helper.propose();
        await helper.waitForSnapshot();
        (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
        await helper.waitForDeadline();
        await expectRevert(helper.execute(), 'Governor: call reverted without message');
      });

      it('if proposal was already executed', async function () {
        const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);
        await helper.propose();
        await helper.waitForSnapshot();
        (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
        await helper.waitForDeadline();
        await helper.execute();
        await expectRevert(helper.execute(), 'Governor: proposal not successful');
      });

    });
  });
  describe('state', function () {
    it('Unset', async function () {
      const { gov } = await loadFixture(deployGovernorFixture);
      const { proposal } = await loadFixture(setProposalFixture);
      await expectRevert(gov.state(proposal.id), 'Governor: unknown proposal id');
    });

    it('Pending & Active', async function () {
      const { helper, gov } = await loadFixture(deployGovernorFixture);
      const { proposal } = await loadFixture(setProposalFixture);
      await helper.propose();
      expect(await gov.state(proposal.id)).to.be.equal(ProposalState.Pending);
      await helper.waitForSnapshot();
      expect(await gov.state(proposal.id)).to.be.equal(ProposalState.Pending);
      await helper.waitForSnapshot(+1);
      expect(await gov.state(proposal.id)).to.be.equal(ProposalState.Active);
    });

    it('Defeated', async function () {
      const { helper, gov } = await loadFixture(deployGovernorFixture);
      const { proposal } = await loadFixture(setProposalFixture);
      await helper.propose();
      await helper.waitForDeadline();
      expect(await gov.state(proposal.id)).to.be.equal(ProposalState.Active);
      await helper.waitForDeadline(+1);
      expect(await gov.state(proposal.id)).to.be.equal(ProposalState.Defeated);
    });

    it('Succeeded', async function () {
      const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
      const { proposal } = await loadFixture(setProposalFixture);
      await helper.propose();
      await helper.waitForSnapshot();
      (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
      await helper.waitForDeadline();
      expect(await gov.state(proposal.id)).to.be.equal(ProposalState.Active);
      await helper.waitForDeadline(+1);
      expect(await gov.state(proposal.id)).to.be.equal(ProposalState.Succeeded);
    });

    it('Executed', async function () {
      const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
      const { proposal } = await loadFixture(setProposalFixture);
      await helper.propose();
      await helper.waitForSnapshot();
      (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
      await helper.waitForDeadline();
      await helper.execute();
      expect(await gov.state(proposal.id)).to.be.equal(ProposalState.Executed);
    });
  });

  describe('cancel', function () {
    describe('internal', function () {
      it('before proposal', async function () {
        const { helper } = await loadFixture(deployGovernorFixture);
        await expectRevert(helper.cancel("internal"), 'Governor: unknown proposal id');
      });


      it('after proposal', async function () {
        const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);
        await helper.propose();


        await helper.cancel("internal");
        expect(await gov.state(proposal.id)).to.be.equal(ProposalState.Canceled);

        await helper.waitForSnapshot();
        await expectRevert(
          gov.connect(voter1).castVote(proposal.id, VoteType.For),
          'Governor: vote not currently active',
        );
      });

      it('after vote', async function () {
        const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);
        await helper.propose();
        await helper.waitForSnapshot();
        (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
        await helper.cancel('internal');
        expect(await gov.state(proposal.id)).to.be.equal(ProposalState.Canceled);

        await helper.waitForDeadline();

        await expectRevert(helper.execute(), 'Governor: proposal not successful');
      });

      it('after deadline', async function () {
        const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);
        await helper.propose();
        await helper.waitForSnapshot();
        (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
        await helper.waitForDeadline();

        await helper.cancel('internal');
        expect(await gov.state(proposal.id)).to.be.equal(ProposalState.Canceled);

        await expectRevert(helper.execute(), 'Governor: proposal not successful');
      });

      it('after execution', async function () {
        const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);
        await helper.propose();
        await helper.waitForSnapshot();
        (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
        await helper.waitForDeadline();
        await helper.execute();

        await expectRevert(helper.cancel('internal'), 'Governor: proposal not active');
      });
    });

    describe('public', function () {
      it('before proposal', async function () {
        const { helper } = await loadFixture(deployGovernorFixture);
        await expectRevert(helper.cancel('external'), 'Governor: unknown proposal id');
      });

      it('after proposal', async function () {
        const { helper } = await loadFixture(deployGovernorFixture);
        await helper.propose();

        await helper.cancel('external');
      });

      it('after vote started', async function () {
        const { helper } = await loadFixture(deployGovernorFixture);
        await helper.propose();
        await helper.waitForSnapshot(1); // snapshot + 1 block

        await expectRevert(helper.cancel('external'), 'Governor: too late to cancel');
      });

      it('after vote', async function () {
        const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);
        await helper.propose();
        await helper.waitForSnapshot();
        (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();

        await expectRevert(helper.cancel('external'), 'Governor: too late to cancel');
      });

      it('after deadline', async function () {
        const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);
        await helper.propose();
        await helper.waitForSnapshot();
        (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
        await helper.waitForDeadline();

        await expectRevert(helper.cancel('external'), 'Governor: too late to cancel');
      });

      it('after execution', async function () {
        const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
        const { proposal } = await loadFixture(setProposalFixture);
        await helper.propose();
        await helper.waitForSnapshot();
        (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
        await helper.waitForDeadline();
        await helper.execute();

        await expectRevert(helper.cancel('external'), 'Governor: too late to cancel');
      });
    });
  });

  describe('proposal length', function () {
    it('empty', async function () {

      const { helper } = await loadFixture(deployGovernorFixture);
      helper.setProposal({ targets: [], values: [], calldatas: [] }, '<proposal description>');
      await expectRevert(helper.propose(), 'Governor: empty proposal');
    });

    it('mismatch #1', async function () {
      const { helper } = await loadFixture(deployGovernorFixture);
      const { mock } = await loadFixture(setProposalFixture);
      helper.setProposal(
        {
          targets: [],
          values: [toEthersBN(0)],
          calldatas: [mock.interface.encodeFunctionData("mockFunction")],
        },
        '<proposal description>',
      );
      await expectRevert(helper.propose(), 'Governor: invalid proposal length');
    });

    it('mismatch #2', async function () {
      const { helper } = await loadFixture(deployGovernorFixture);
      const { mock } = await loadFixture(setProposalFixture);
      helper.setProposal(
        {
          targets: [mock.address],
          values: [],
          calldatas: [mock.interface.encodeFunctionData("mockFunction")],
        },
        '<proposal description>',
      );
      await expectRevert(helper.propose(), 'Governor: invalid proposal length');
    });

    it('mismatch #3', async function () {
      const { helper } = await loadFixture(deployGovernorFixture);
      const { mock } = await loadFixture(setProposalFixture);
      helper.setProposal(
        {
          targets: [mock.address],
          values: [toEthersBN(0)],
          calldatas: []
        },
        '<proposal description>',
      );
      await expectRevert(helper.propose(), 'Governor: invalid proposal length');
    });
  });

  describe('onlyGovernance updates', function () {
    it('setVotingDelay is protected', async function () {
      const { gov } = await loadFixture(deployGovernorFixture);
      await expectRevert(gov.setVotingDelay('0'), 'Governor: onlyGovernance');
    });

    it('setVotingPeriod is protected', async function () {
      const { gov } = await loadFixture(deployGovernorFixture);
      await expectRevert(gov.setVotingPeriod('32'), 'Governor: onlyGovernance');
    });

    it('setProposalThreshold is protected', async function () {
      const { gov } = await loadFixture(deployGovernorFixture);
      await expectRevert(gov.setProposalThreshold('1000000000000000000'), 'Governor: onlyGovernance');
    });

    it('can setVotingDelay through governance', async function () {
      const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
      const proposal = helper.setProposal(
        {
          targets: [gov.address],
          calldatas: [gov.interface.encodeFunctionData("setVotingDelay", ["0"])],
        },
        '<proposal description>',
      );

      await helper.propose();
      await helper.waitForSnapshot();
      (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
      await helper.waitForDeadline();

      expectEvent(await (await helper.execute()).wait(), 'VotingDelaySet', { oldVotingDelay: '4', newVotingDelay: '0' });

      expect(await gov.votingDelay()).to.be.equal('0');
    });

    it('can setVotingPeriod through governance', async function () {
      const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
      const proposal = helper.setProposal(
        {
          targets: [gov.address],
          calldatas: [gov.interface.encodeFunctionData("setVotingPeriod", ["32"])],
        },
        '<proposal description>',
      );

      await helper.propose();
      await helper.waitForSnapshot();
      (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
      await helper.waitForDeadline();

      expectEvent(await (await helper.execute()).wait(), 'VotingPeriodSet', { oldVotingPeriod: '300', newVotingPeriod: '32' });

      expect(await gov.votingPeriod()).to.be.equal('32');
    });

    it('cannot setVotingPeriod to 0 through governance', async function () {
      const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
      const proposal = helper.setProposal(
        {
          targets: [gov.address],
          calldatas: [gov.interface.encodeFunctionData("setVotingPeriod", ["0"])],
        },
        '<proposal description>',
      );

      await helper.propose();
      await helper.waitForSnapshot();
      (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
      await helper.waitForDeadline();




      await expectRevert(helper.execute(), 'GovernorSettings: voting period too low');
    });

    it('can setProposalThreshold to 1000000000000000000 through governance', async function () {
      const { helper, gov, voter1 } = await loadFixture(deployGovernorFixture);
      const proposal = helper.setProposal(
        {
          targets: [gov.address],
          calldatas: [gov.interface.encodeFunctionData("setProposalThreshold", ["1000000000000000000"])],
        },
        '<proposal description>',
      );

      await helper.propose();
      await helper.waitForSnapshot();
      (await gov.connect(voter1).castVote(proposal.id, VoteType.For)).wait();
      await helper.waitForDeadline();

      expectEvent(await (await helper.execute()).wait(), 'ProposalThresholdSet', {
        oldProposalThreshold: '0',
        newProposalThreshold: '1000000000000000000',
      });
      expect(await gov.proposalThreshold()).to.be.equal('1000000000000000000');
    });

  });
});
*/ 
