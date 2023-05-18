"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*

describe("Votes", function () {
  let votes: Ink_Votes;
  let owner: SignerWithAddress;
  let account1: SignerWithAddress;
  let account2: SignerWithAddress;
  let holder: SignerWithAddress;
  let chainId: any;



  beforeEach(async () => {
    [owner, holder, account1, account2] = await ethers.getSigners();
    const Votes = await ethers.getContractFactory("Ink_Votes", owner);
    votes = await Votes.deploy();
    await votes.deployed();
    chainId = (await votes.provider.getNetwork()).chainId;
  });

  describe('initial', () => {

    it('starts with zero votes', async function () {
      expect(await votes.totalSupply()).to.be.equal('0');
    });

    it("votes mint", async () => {
      const [to, amount] = [account1.address, 20];
      const mint = await votes.mint(to, amount);
      await mint.wait();
      const tokenNum = (await votes.balanceOf(account1.address))
      expect(tokenNum).to.eq(amount);
      await expect(mint).to.emit(votes, "Mint").withArgs(to, amount);
    })

    it('minting restriction', async function () {
      const amount = ethers.BigNumber.from('2').pow(224);
      await expectRevert(votes.mint(holder.address, amount), 'ERC20Votes: total supply risks overflowing votes');
    });

    it('initial nonce is 0', async () => {
      expect(await votes.nonces(account1.address)).to.be.equal('0');
    });

    it('recent checkpoints', async function () {
      await votes.connect(holder).delegate(holder.address);
      for (let i = 0; i < 6; i++) {
        await votes.mint(holder.address, 1);
      }
      expect(await votes.numCheckpoints(holder.address)).to.be.equal(6);
      // recent
      expect(await votes.getPastVotes(holder.address, await time.latestBlock() - 1)).to.be.equal('5');
      // non-recent
      expect(await votes.getPastVotes(holder.address, await time.latestBlock() - 6)).to.be.equal('0');
    });

  });

  describe('delegation', () => {
    it('delegation with tokens', async () => {

      await votes.mint(account1.address, 1);

      expect(await votes.totalSupply()).to.be.equal('1');
      expect(await votes.delegates(account1.address)).to.be.equal(ZERO_ADDRESS);

      const receipt = await (await votes.connect(account1).delegate(account1.address)).wait();

      expectEvent(receipt, 'DelegateChanged', {
        delegator: account1.address,
        fromDelegate: ZERO_ADDRESS,
        toDelegate: account1.address,
      });

      expectEvent(receipt, 'DelegateVotesChanged', {
        delegate: account1.address,
        previousBalance: '0',
        newBalance: '1',
      });

      expect(await votes.delegates(account1.address)).to.be.equal(account1.address);
      expect(await votes.getVotes(account1.address)).to.be.equal('1');
      expect(await votes.getPastVotes(account1.address, await time.latestBlock() - 1)).to.be.equal('0');
      await mine();
      expect(await votes.getPastVotes(account1.address, await time.latestBlock() - 1)).to.be.equal('1');

    });

    it('delegation without tokens', async function () {
      expect(await votes.delegates(account1.address)).to.be.equal(ZERO_ADDRESS);

      const receipt = await (await votes.connect(account1).delegate(account1.address)).wait();
      expectEvent(receipt, 'DelegateChanged', {
        delegator: account1.address,
        fromDelegate: ZERO_ADDRESS,
        toDelegate: account1.address,
      });


      expect(await votes.delegates(account1.address)).to.be.equal(account1.address);
    });

    describe('change delegation', function () {
      beforeEach(async function () {
        await votes.mint(account1.address, 1);
        await votes.connect(account1).delegate(account1.address);
      });

      it('call', async function () {
        expect(await votes.delegates(account1.address)).to.be.equal(account1.address);

        const receipt = await (await votes.connect(account1).delegate(account2.address)).wait();

        expectEvent(receipt, 'DelegateChanged', {
          delegator: account1.address,
          fromDelegate: account1.address,
          toDelegate: account2.address,
        });

        expectEvent(receipt, 'DelegateVotesChanged', {
          delegate: account1.address,
          previousBalance: '1',
          newBalance: '0',
        });

        expectEvent(receipt, 'DelegateVotesChanged', {
          delegate: account2.address,
          previousBalance: '0',
          newBalance: '1',
        });

        expect(await votes.delegates(account1.address)).to.be.equal(account2.address);
        expect(await votes.getVotes(account1.address)).to.be.equal('0');
        expect(await votes.getVotes(account2.address)).to.be.equal('1');

        expect(await votes.getPastVotes(account1.address, await time.latestBlock() - 1)).to.be.equal('1');
        expect(await votes.getPastVotes(account2.address, await time.latestBlock() - 1)).to.be.equal('0');
        await mine();
        expect(await votes.getPastVotes(account1.address, await time.latestBlock() - 1)).to.be.equal('0');
        expect(await votes.getPastVotes(account2.address, await time.latestBlock() - 1)).to.be.equal('1');
      });
    });

    describe('transfers', () => {
      let account1Votes: string;
      let account2Votes: string;
      beforeEach(async() => {
        await votes.mint(account1.address, 1);
      })

      it('no delegation', async () => {
        const receipt = await (await votes.connect(account1).transfer(account2.address, 1)).wait();
        expectEvent(receipt, 'Transfer', { from: account1.address, to: account2.address, value: '1' });
        notEmitted(receipt, 'DelegateVotesChanged');

        account1Votes = '0';
        account2Votes = '0';
      });

      it('sender delegation', async () => {
        await votes.connect(account1).delegate(account1.address);

        const receipt = await (await votes.connect(account1).transfer(account2.address, 1)).wait();

        expectEvent(receipt, 'Transfer', {
          from: account1.address,
          to: account2.address,
          value: '1'
        });

        expectEvent(receipt, 'DelegateVotesChanged', {
          delegate: account1.address,
          previousBalance: '1',
          newBalance: '0',
        });

        const { logIndex: transferLogIndex }: any = receipt.events?.find(({ event }: any) => event == 'Transfer');
        expect(
          receipt.logs
            .filter(({ event }: any) => event == 'DelegateVotesChanged')
            .every(({ logIndex }) => transferLogIndex < logIndex),
        ).to.be.equal(true);

        account1Votes = '0';
        account2Votes = '0';
      });

      it('receiver delegation', async () => {
        await votes.connect(account2).delegate(account2.address);

        const receipt = await (await votes.connect(account1).transfer(account2.address, 1)).wait();

        expectEvent(receipt, 'Transfer', {
          from: account1.address,
          to: account2.address,
          value: '1'
         });

        expectEvent(receipt, 'DelegateVotesChanged', {
          delegate: account2.address,
          previousBalance: '0',
          newBalance: '1',
        });

        const { logIndex: transferLogIndex }: any = receipt.events?.find(({ event }: any) => event == 'Transfer');
        expect(
          receipt.logs
            .filter(({ event }: any) => event == 'DelegateVotesChanged')
            .every(({ logIndex }) => transferLogIndex < logIndex),
        ).to.be.equal(true);

        account1Votes = '0';
        account2Votes = '1';
      });


      it('full delegation', async () => {
        await votes.connect(account1).delegate(account1.address);
        await votes.connect(account2).delegate(account2.address);

        const receipt = await (await votes.connect(account1).transfer(account2.address, 1)).wait();


        expectEvent(receipt, 'Transfer', {
          from: account1.address,
          to: account2.address,
          value: '1'
         });

        expectEvent(receipt, 'DelegateVotesChanged', {
          delegate: account1.address,
          previousBalance: '1',
          newBalance: '0',
        });

        expectEvent(receipt, 'DelegateVotesChanged', {
          delegate: account2.address,
          previousBalance: '0',
          newBalance: '1',
        });

        const { logIndex: transferLogIndex }: any = receipt.events?.find(({ event }: any) => event == 'Transfer');
        expect(
          receipt.logs
            .filter(({ event }: any) => event == 'DelegateVotesChanged')
            .every(({ logIndex }) => transferLogIndex < logIndex),
        ).to.be.equal(true);

        account1Votes = '0';
        account2Votes = '1';
      });

      afterEach(async () => {
        expect(await votes.getVotes(account1.address)).to.be.equal(account1Votes);
        expect(await votes.getVotes(account2.address)).to.be.equal(account2Votes);

        // need to mine 2 blocks to see the effect of a transfer on "getPastVotes"
        await mine();
        expect(await votes.getPastVotes(account1.address, await time.latestBlock()-1)).to.be.equal(account1Votes);
        expect(await votes.getPastVotes(account2.address, await time.latestBlock()-1)).to.be.equal(account2Votes);
      });

    });
  });

  describe('time', () => {
    describe('getPastTotalSupply', () => {
      beforeEach(async () => {
        await votes.connect(account1).delegate(account1.address);
      });

      it('reverts if block number >= current block', async function () {
        await expectRevert(votes.getPastVotes(account2.address, 5e10), 'future lookup');
        await expectRevert(votes.getPastTotalSupply(5e10), 'future lookup');
      });

      it('returns 0 if there are no checkpoints', async function () {
        expect(await votes.getPastVotes(account2.address, 0)).to.be.equal('0');
        expect(await votes.getPastTotalSupply(0)).to.be.equal('0');
      });


      it('returns the latest block if >= last checkpoint block', async function () {
        const { blockNumber } = await (await votes.mint(account2.address, 1)).wait();
        await mine();
        await mine();


        expect(await votes.getPastVotes(account2.address, blockNumber - 1)).to.be.equal('0');
        expect(await votes.getPastVotes(account2.address, blockNumber + 1)).to.be.equal('0');
        expect(await votes.getPastTotalSupply(blockNumber - 1)).to.be.equal('0');
        expect(await votes.getPastTotalSupply(blockNumber + 1)).to.be.equal('1');
      });

      it('returns only initial minted if < first checkpoint block', async function () {
        await mine();
        const { blockNumber } = await (await votes.mint(account2.address, 1)).wait();
        await mine();
        await mine();


        expect(await votes.getPastVotes(account2.address, blockNumber - 1)).to.be.equal('0');
        expect(await votes.getPastTotalSupply(blockNumber - 1)).to.be.equal('0');
        expect(await votes.getPastTotalSupply(blockNumber + 1)).to.be.equal('1');
      });

      it('generally returns the voting balance at the appropriate checkpoint', async () => {
        const t1 = await (await votes.mint(account1.address, 10)).wait();
        await mine();
        await mine();
        const t2 = await (await votes.burn(account1.address, 10)).wait()
        await mine();
        await mine();
        const t3 = await (await votes.mint(account1.address, 20)).wait();
        await mine();
        await mine();
        const t4 = await (await votes.burn(account1.address, 20)).wait()
        await mine();
        await mine();
        const t5 = await (await votes.mint(account1.address, 30)).wait()
        await mine();
        await mine();


        expect(await votes.getPastTotalSupply(t1.blockNumber - 1)).to.be.equal('0');
        expect(await votes.getPastTotalSupply(t1.blockNumber)).to.be.equal('10');
        expect(await votes.getPastTotalSupply(t1.blockNumber + 1)).to.be.equal('10');
        expect(await votes.getPastTotalSupply(t2.blockNumber)).to.be.equal('0');
        expect(await votes.getPastTotalSupply(t2.blockNumber + 1)).to.be.equal('0');
        expect(await votes.getPastTotalSupply(t3.blockNumber)).to.be.equal('20');
        expect(await votes.getPastTotalSupply(t3.blockNumber + 1)).to.be.equal('20');
        expect(await votes.getPastTotalSupply(t4.blockNumber)).to.be.equal('0');
        expect(await votes.getPastTotalSupply(t4.blockNumber + 1)).to.be.equal('0');
        expect(await votes.getPastTotalSupply(t5.blockNumber)).to.be.equal('30');
        expect(await votes.getPastTotalSupply(t5.blockNumber + 1)).to.be.equal('30');
      });
    });

  })


  describe('delegation with signature', () => {
    let delegator: any;
    let signature: string;

    beforeEach(async () => {
      [delegator, signature] = await eip712(owner, votes, chainId,"Delegate", null);
      await votes.mint(delegator.address, 1);
    });

    it('accept signed delegation', async () => {
      const { v, r, s } = fromRpcSig(signature);
      expect(await votes.delegates(delegator.address)).to.be.equal(ZERO_ADDRESS);

      const receipt = await (await votes.delegateBySig(delegator.address, nonce, MAX_UINT256, v, r, s)).wait();


      expectEvent(receipt, 'DelegateChanged', {
        delegator: delegator.address,
        fromDelegate: ZERO_ADDRESS,
        toDelegate: delegator.address,
      });

      expectEvent(receipt, 'DelegateVotesChanged', {
        delegate: delegator.address,
        previousBalance: '0',
        newBalance: '1',
      });

      expect(await votes.delegates(delegator.address)).to.be.equal(delegator.address);

      expect(await votes.getVotes(delegator.address)).to.be.equal('1');

      expect(await votes.getPastVotes(delegator.address, await time.latestBlock() - 1)).to.be.equal('0');
      await mine();
      expect(await votes.getPastVotes(delegator.address, await time.latestBlock() - 1)).to.be.equal('1');

    });

    it('rejects reused signature', async () => {
      const { v, r, s } = fromRpcSig(signature);

      await votes.delegateBySig(delegator.address, nonce, MAX_UINT256, v, r, s);

      await expectRevert(
        votes.delegateBySig(delegator.address, nonce, MAX_UINT256, v, r, s),
        'Votes: invalid nonce',
      );
    });



    it('rejects bad signature', async () => {
      const { v, r, s } = fromRpcSig(signature);

      const receipt = await (await votes.delegateBySig(account1.address, nonce, MAX_UINT256, v, r, s)).wait();


      const { args }: any = receipt.events?.find(({ event }: any) => event === 'DelegateChanged');

      expect(args.delegator).to.not.be.equal(delegator.address);
      expect(args.fromDelegate).to.be.equal(ZERO_ADDRESS);
      expect(args.toDelegate).to.be.equal(account1.address);

    });

    it('rejects bad nonce', async () => {
      const { v, r, s } = fromRpcSig(signature);

      await expectRevert(
        votes.delegateBySig(delegator.address, nonce + 1, MAX_UINT256, v, r, s),
        'Votes: invalid nonce',
      );
    });


    it('rejects expired permit', async () => {
      const expiry = (await time.latest()) - time.duration.weeks(1);

      const { v, r, s } = fromRpcSig(signature);

      await expectRevert(
        votes.delegateBySig(delegator.address, nonce, expiry, v, r, s),
        'Votes: signature expired',
      );
    });
  });

  describe('should implement EIP6372(blocknumber mode)', function () {
    it('clock is correct', async function () {
      expect(await votes.clock()).to.be.equal(await time.latestBlock());
    });

    it('CLOCK_MODE is correct', async function () {
      const params = new URLSearchParams(await votes.CLOCK_MODE());
      expect(params.get('mode')).to.be.equal('blocknumber');
      expect(params.get('from')).to.be.equal('default');
    });
  });


});

*/ 
