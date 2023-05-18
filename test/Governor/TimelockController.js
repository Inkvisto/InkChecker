"use strict";
/*

import { expect } from 'chai';
import { ethers } from "hardhat";
import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers'
import { Address } from 'hardhat-deploy/types';
import { expectRevert } from '../utils/expectRevert';
import { MINDELAY, random_salt, ZERO_ADDRESS, ZERO_BYTES32 } from '../utils/constants';
import { expectEvent, notEmitted } from '../utils/ExpectEvent';
import { toEthersBN } from '../utils/typeConverters';


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

const genOperationBatch = (targets: string[], values: string[], payloads: string[], predecessor: string, salt: string) => {
  const id = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode([
    'address[]',
    'uint256[]',
    'bytes[]',
    'uint256',
    'bytes32',
  ], [
    targets,
    values,
    payloads,
    predecessor,
    salt,
  ]));
  return { id, targets, values, payloads, predecessor, salt };
}

const TIMELOCK_ADMIN_ROLE = ethers.utils.solidityKeccak256(['string'], ['TIMELOCK_ADMIN_ROLE']);
const PROPOSER_ROLE = ethers.utils.solidityKeccak256(['string'], ['PROPOSER_ROLE']);
const EXECUTOR_ROLE = ethers.utils.solidityKeccak256(['string'], ['EXECUTOR_ROLE']);
const CANCELLER_ROLE = ethers.utils.solidityKeccak256(['string'], ['CANCELLER_ROLE']);

const deployTimelockFixture = async () => {
  const [admin, proposer, canceller, executor, other] = await ethers.getSigners()

  const TimeLock = await ethers.getContractFactory("TimelockController");

  const timelock = await TimeLock.deploy(MINDELAY, [proposer.address], [executor.address], admin.address)
  await timelock.deployed()

  expect(await timelock.hasRole(CANCELLER_ROLE, proposer.address)).to.be.equal(true);
  await timelock.connect(admin).revokeRole(CANCELLER_ROLE, proposer.address);
  await timelock.connect(admin).grantRole(CANCELLER_ROLE, canceller.address);

  return { timelock, admin, proposer, canceller, executor, other };
}

describe("TimelockController", () => {

  it('initial state', async () => {
    const { timelock, proposer, canceller, executor } = await loadFixture(deployTimelockFixture);
    expect(await timelock.getMinDelay()).to.be.equal(MINDELAY);
    expect(await timelock.TIMELOCK_ADMIN_ROLE()).to.be.equal(TIMELOCK_ADMIN_ROLE);
    expect(await timelock.PROPOSER_ROLE()).to.be.equal(PROPOSER_ROLE);
    expect(await timelock.EXECUTOR_ROLE()).to.be.equal(EXECUTOR_ROLE);
    expect(await timelock.CANCELLER_ROLE()).to.be.equal(CANCELLER_ROLE);

    expect(await Promise.all([PROPOSER_ROLE, CANCELLER_ROLE, EXECUTOR_ROLE].map(role =>
      timelock.hasRole(role, proposer.address),
    ))).to.be.deep.equal([true, false, false]);

    expect(await Promise.all([PROPOSER_ROLE, CANCELLER_ROLE, EXECUTOR_ROLE].map(role =>
      timelock.hasRole(role, canceller.address),
    ))).to.be.deep.equal([false, true, false]);

    expect(await Promise.all([PROPOSER_ROLE, CANCELLER_ROLE, EXECUTOR_ROLE].map(role =>
      timelock.hasRole(role, executor.address),
    ))).to.be.deep.equal([false, false, true]);
  });

  it('optional admin', async () => {
    const { timelock, admin, proposer, executor, other } = await loadFixture(deployTimelockFixture);
    const TimeLock = await ethers.getContractFactory("TimelockController");

    const optional_timelock = await TimeLock.connect(other).deploy(MINDELAY, [proposer.address], [executor.address], ZERO_ADDRESS)
    await timelock.deployed()

    expect(await optional_timelock.hasRole(TIMELOCK_ADMIN_ROLE, admin.address)).to.be.equal(false);
    expect(await optional_timelock.hasRole(TIMELOCK_ADMIN_ROLE, other.address)).to.be.equal(false);
  });

  describe('methods', () => {


    describe('operation hashing', () => {
      it('hashOperation', async () => {
        const { timelock } = await loadFixture(deployTimelockFixture);
        const { id, target, value, data, predecessor, salt } = genOperation(
          '0x29cebefe301c6ce1bb36b58654fea275e1cacc83',
          '0xf94fdd6e21da21d2',
          '0xa3bc5104',
          '0xba41db3be0a9929145cfe480bd0f1f003689104d275ae912099f925df424ef94',
          '0x60d9109846ab510ed75c15f979ae366a8a2ace11d34ba9788c13ac296db50e6e',
        );
        expect(await timelock.hashOperation(
          target,
          value,
          data,
          predecessor,
          salt,
        )).to.be.equal(id);
      });

      it('hashOperationBatch', async () => {
        const { timelock } = await loadFixture(deployTimelockFixture)
        const { id, targets, values, payloads, predecessor, salt } = genOperationBatch(
          Array(8).fill('0x2d5f21620e56531c1d59c2df9b8e95d129571f71'),
          Array(8).fill('0x2b993cfce932ccee'),
          Array(8).fill('0xcf51966b'),
          '0xce8f45069cc71d25f71ba05062de1a3974f9849b004de64a70998bca9d29c2e7',
          '0x8952d74c110f72bfe5accdf828c74d53a7dfb71235dfa8a1e8c75d8576b372ff',
        );
        expect(await timelock.hashOperationBatch(
          targets,
          values,
          payloads,
          predecessor,
          salt,
        )).to.be.equal(id);
      });
    });

    describe('simple', () => {
      describe('schedule', () => {

        const { id, target, value, data, predecessor, salt } = genOperation(
          '0x31754f590B97fD975Eb86938f18Cc304E264D2F2',
          '0',
          '0x3bf92ccc',
          ZERO_BYTES32,
          random_salt,
        );

        it('proposer can schedule', async () => {
          const { timelock, proposer } = await loadFixture(deployTimelockFixture);

          const receipt = await (await timelock.connect(proposer).schedule(
            target,
            value,
            data,
            predecessor,
            salt,
            MINDELAY,
          )).wait();

          expectEvent(receipt, 'CallScheduled', {
            id: id,
            index: toEthersBN(0),
            target: target,
            value: toEthersBN(value),
            data: data,
            predecessor: predecessor,
            delay: MINDELAY,
          });

          expectEvent(receipt, 'CallSalt', {
            id: id,
            salt: salt,
          });

          const block = await ethers.provider.getBlock(receipt.blockHash);

          expect(await timelock.getTimestamp(id))
            .to.be.equal(ethers.BigNumber.from(block.timestamp).add(MINDELAY));
        });

        it('prevent overwriting active operation', async () => {
          const { timelock, proposer } = await loadFixture(deployTimelockFixture);

          await timelock.connect(proposer).schedule(
            target,
            value,
            data,
            predecessor,
            salt,
            MINDELAY,
          );

          await expectRevert(
            timelock.connect(proposer).schedule(
              target,
              value,
              data,
              predecessor,
              salt,
              MINDELAY,
            ),
            'TimelockController: operation already scheduled',
          );
        });


        it('prevent non-proposer from committing', async () => {
          const { timelock, other } = await loadFixture(deployTimelockFixture);

          await expectRevert(
            timelock.connect(other).schedule(
              target,
              value,
              data,
              predecessor,
              salt,
              MINDELAY,
            ),
            `AccessControl: account ${other.address.toLowerCase()} is missing role ${PROPOSER_ROLE}`,
          );
        });

        it('enforce minimum delay', async () => {
          const { timelock, proposer } = await loadFixture(deployTimelockFixture);


          await expectRevert(
            timelock.connect(proposer).schedule(
              target,
              value,
              data,
              predecessor,
              random_salt,
              MINDELAY - 1,
            ),
            'TimelockController: insufficient delay',
          );
        });

        it('schedule operation with salt zero', async () => {
          const { timelock, proposer } = await loadFixture(deployTimelockFixture);


          const receipt = await (await timelock.connect(proposer).schedule(
            target,
            value,
            data,
            predecessor,
            ZERO_BYTES32,
            MINDELAY,
          )).wait();

          notEmitted(receipt, 'CallSalt');
        });

      });


      describe('execute', () => {

        const { id, target, value, data, predecessor, salt } = genOperation(
          '0xAe22104DCD970750610E6FE15E623468A98b15f7',
          '0',
          '0x13e414de',
          ZERO_BYTES32,
          '0xc1059ed2dc130227aa1d1d539ac94c641306905c020436c636e19e3fab56fc7f',
        );

        it('revert if operation is not scheduled', async () => {
          const { timelock, executor } = await loadFixture(deployTimelockFixture);
          await expectRevert(
            timelock.connect(executor).execute(
              target,
              value,
              data,
              predecessor,
              salt,
            ),
            'TimelockController: operation is not ready',
          );
        });

        describe('with scheduled operation', () => {

          const scheduleFixture = async () => {
            const { timelock, proposer } = await loadFixture(deployTimelockFixture);
            await timelock.connect(proposer).schedule(
              target,
              value,
              data,
              predecessor,
              salt,
              MINDELAY
            );
          }



          it('revert if execution comes too early 1/2', async () => {
            const { timelock, executor } = await loadFixture(deployTimelockFixture);
            await loadFixture(scheduleFixture)
            await expectRevert(
              timelock.connect(executor).execute(
                target,
                value,
                data,
                predecessor,
                salt,
              ),
              'TimelockController: operation is not ready',
            );
          });

          it('revert if execution comes too early 2/2', async () => {
            const { timelock, executor } = await loadFixture(deployTimelockFixture);
            await loadFixture(scheduleFixture);
            const timestamp = await timelock.getTimestamp(id);


            await time.increaseTo(timestamp - 5); // -1 is too tight, test sometime fails

            await expectRevert(
              timelock.connect(executor).execute(
                target,
                value,
                data,
                predecessor,
                salt
              ),
              'TimelockController: operation is not ready',
            );
          });

          describe('on time', () => {
            it('executor can reveal', async () => {
              const { timelock, executor } = await loadFixture(deployTimelockFixture);
              await loadFixture(scheduleFixture)

              const timestamp = await timelock.getTimestamp(id);
              await time.increaseTo(timestamp)

              const receipt = await (await timelock.connect(executor).execute(
                target,
                value,
                data,
                predecessor,
                salt
              )).wait();

              expectEvent(receipt, 'CallExecuted', {
                id: id,
                index: toEthersBN(0),
                target: target,
                value: toEthersBN(value),
                data: data,
              });
            });

            it('prevent non-executor from revealing', async () => {
              const { timelock, other } = await loadFixture(deployTimelockFixture);
              await loadFixture(scheduleFixture)

              const timestamp = await timelock.getTimestamp(id);
              await time.increaseTo(timestamp)


              await expectRevert(
                timelock.connect(other).execute(
                  target,
                  value,
                  data,
                  predecessor,
                  salt
                ),
                `AccessControl: account ${other.address.toLowerCase()} is missing role ${EXECUTOR_ROLE}`,
              );
            });
          });
        });
      });
    });



    describe('batch', () => {
      describe('schedule', () => {

        const genOperationBatchFixture = async () => {
          const { id, targets, values, payloads, predecessor, salt } = genOperationBatch(
            Array(8).fill('0xEd912250835c812D4516BBD80BdaEA1bB63a293C'),
            Array(8).fill(0),
            Array(8).fill('0x2fcb7a88'),
            ZERO_BYTES32,
            '0x6cf9d042ade5de78bed9ffd075eb4b2a4f6b1736932c2dc8af517d6e066f51f5',
          );

          return { id, targets, values, payloads, predecessor, salt };
        }


        it('proposer can schedule', async () => {
          const { timelock, proposer } = await loadFixture(deployTimelockFixture);
          const { id, targets, values, payloads, predecessor, salt } = await loadFixture(genOperationBatchFixture);

          const receipt = await (await timelock.connect(proposer).scheduleBatch(
            targets,
            values,
            payloads,
            predecessor,
            salt,
            MINDELAY
          )).wait();


          for (const i in targets) {
            expectEvent(receipt, 'CallScheduled', {
              id: id,
              index: toEthersBN(i),
              target: targets[i],
              value: toEthersBN(values[i]),
              data: payloads[i],
              predecessor: predecessor,
              delay: MINDELAY,
            });

            expectEvent(receipt, 'CallSalt', {
              id: id,
              salt: salt,
            });
          }

          const block = await ethers.provider.getBlock(receipt.blockHash);

          expect(await timelock.getTimestamp(id)).to.be.equal(
            ethers.BigNumber.from(block.timestamp).add(MINDELAY),
          );
        });

        it('prevent overwriting active operation', async () => {
          const { timelock, proposer } = await loadFixture(deployTimelockFixture);
          const { targets, values, payloads, predecessor, salt } = await loadFixture(genOperationBatchFixture);
          await timelock.connect(proposer).scheduleBatch(
            targets,
            values,
            payloads,
            predecessor,
            salt,
            MINDELAY
          );

          await expectRevert(
            timelock.connect(proposer).scheduleBatch(
              targets,
              values,
              payloads,
              predecessor,
              salt,
              MINDELAY
            ),
            'TimelockController: operation already scheduled',
          );
        });

        it('length of batch parameter must match #1', async () => {
          const { timelock, proposer } = await loadFixture(deployTimelockFixture);
          const { targets, payloads, predecessor, salt } = await loadFixture(genOperationBatchFixture);
          await expectRevert(
            timelock.connect(proposer).scheduleBatch(
              targets,
              [],
              payloads,
              predecessor,
              salt,
              MINDELAY
            ),
            'TimelockController: length mismatch',
          );
        });

        it('length of batch parameter must match #2', async () => {
          const { timelock, proposer } = await loadFixture(deployTimelockFixture);
          const { targets, values, predecessor, salt } = await loadFixture(genOperationBatchFixture);
          await expectRevert(
            timelock.connect(proposer).scheduleBatch(
              targets,
              values,
              [],
              predecessor,
              salt,
              MINDELAY
            ),
            'TimelockController: length mismatch',
          );
        });

        it('prevent non-proposer from committing', async () => {
          const { timelock, other } = await loadFixture(deployTimelockFixture);
          const { targets, values, payloads, predecessor, salt } = await loadFixture(genOperationBatchFixture);
          await expectRevert(
            timelock.connect(other).scheduleBatch(
              targets,
              values,
              payloads,
              predecessor,
              salt,
              MINDELAY
            ),
            `AccessControl: account ${other.address.toLowerCase()} is missing role ${PROPOSER_ROLE}`,
          );
        });
        it('enforce minimum delay', async () => {
          const { timelock, proposer } = await loadFixture(deployTimelockFixture);
          const { targets, values, payloads, predecessor, salt } = await loadFixture(genOperationBatchFixture);
          await expectRevert(
            timelock.connect(proposer).scheduleBatch(
              targets,
              values,
              payloads,
              predecessor,
              salt,
              MINDELAY - 1,
            ),
            'TimelockController: insufficient delay',
          );
        });
      });


      describe('execute', () => {

        const genOperationBatchFixture = async () => {
          const { id, targets, values, payloads, predecessor, salt } = genOperationBatch(
            Array(8).fill('0x76E53CcEb05131Ef5248553bEBDb8F70536830b1'),
            Array(8).fill(0),
            Array(8).fill('0x58a60f63'),
            ZERO_BYTES32,
            '0x9545eeabc7a7586689191f78a5532443698538e54211b5bd4d7dc0fc0102b5c7',
          );

          return { id, targets, values, payloads, predecessor, salt };
        }

        it('revert if operation is not scheduled', async () => {
          const { timelock, executor } = await loadFixture(deployTimelockFixture);
          const { targets, values, payloads, predecessor, salt } = await loadFixture(genOperationBatchFixture);
          await expectRevert(
            timelock.connect(executor).executeBatch(
              targets,
              values,
              payloads,
              predecessor,
              salt,
            ),
            'TimelockController: operation is not ready',
          );
        });

        describe('with scheduled operation', () => {

          const scheduleBatchFixture = async () => {
            const { timelock, proposer } = await loadFixture(deployTimelockFixture);
            const { targets, values, payloads, predecessor, salt } = await loadFixture(genOperationBatchFixture);
            await timelock.connect(proposer).scheduleBatch(
              targets,
              values,
              payloads,
              predecessor,
              salt,
              MINDELAY
            );
          };


          it('revert if execution comes too early 1/2', async () => {
            const { timelock, executor } = await loadFixture(deployTimelockFixture);
            const { targets, values, payloads, predecessor, salt } = await loadFixture(genOperationBatchFixture);
            await loadFixture(scheduleBatchFixture);

            await expectRevert(
              timelock.connect(executor).executeBatch(
                targets,
                values,
                payloads,
                predecessor,
                salt
              ),
              'TimelockController: operation is not ready',
            );
          });

          it('revert if execution comes too early 2/2', async () => {
            const { timelock, executor } = await loadFixture(deployTimelockFixture);
            const { targets, values, payloads, predecessor, salt } = await loadFixture(genOperationBatchFixture);
            await loadFixture(scheduleBatchFixture);

            //await time.increaseTo( await time.latest() - 2); // -1 is to tight, test sometime fails
            const tx = timelock.connect(executor).executeBatch(
              targets,
              values,
              payloads,
              predecessor,
              salt
            );



            await expectRevert(
              tx,
              'TimelockController: operation is not ready',
            );
          });

          describe('on time', () => {
            it('executor can reveal', async () => {
              const { timelock, executor } = await loadFixture(deployTimelockFixture);
              const { id, targets, values, payloads, predecessor, salt } = await loadFixture(genOperationBatchFixture);
              await loadFixture(scheduleBatchFixture);

              const timestamp = await timelock.getTimestamp(id);
              await time.increaseTo(timestamp)

              const receipt = await (await timelock.connect(executor).executeBatch(
                targets,
                values,
                payloads,
                predecessor,
                salt,
              )).wait();
              for (const i in targets) {
                expectEvent(receipt, 'CallExecuted', {
                  id: id,
                  index: toEthersBN(i),
                  target: targets[i],
                  value: toEthersBN(values[i]),
                  data: payloads[i],
                });
              }
            })


            it('prevent non-executor from revealing', async () => {
              const { timelock, other } = await loadFixture(deployTimelockFixture);
              const { id, targets, values, payloads, predecessor, salt } = await loadFixture(genOperationBatchFixture);
              await loadFixture(scheduleBatchFixture);

              const timestamp = await timelock.getTimestamp(id);
              await time.increaseTo(timestamp)

              await expectRevert(
                timelock.connect(other).executeBatch(
                  targets,
                  values,
                  payloads,
                  predecessor,
                  salt
                ),
                `AccessControl: account ${other.address.toLowerCase()} is missing role ${EXECUTOR_ROLE}`,
              );
            });

            it('length mismatch #1', async () => {
              const { timelock, executor } = await loadFixture(deployTimelockFixture);
              const { id, values, payloads, predecessor, salt } = await loadFixture(genOperationBatchFixture);
              await loadFixture(scheduleBatchFixture);

              const timestamp = await timelock.getTimestamp(id);
              await time.increaseTo(timestamp)

              await expectRevert(
                timelock.connect(executor).executeBatch(
                  [],
                  values,
                  payloads,
                  predecessor,
                  salt,
                ),
                'TimelockController: length mismatch',
              );
            });

            it('length mismatch #2', async () => {
              const { timelock, executor } = await loadFixture(deployTimelockFixture);
              const { id, targets, payloads, predecessor, salt } = await loadFixture(genOperationBatchFixture);
              await loadFixture(scheduleBatchFixture);

              const timestamp = await timelock.getTimestamp(id);
              await time.increaseTo(timestamp);

              await expectRevert(
                timelock.connect(executor).executeBatch(
                  targets,
                  [],
                  payloads,
                  predecessor,
                  salt,
                ),
                'TimelockController: length mismatch',
              );
            });

            it('length mismatch #3', async () => {
              const { timelock, executor } = await loadFixture(deployTimelockFixture);
              const { id, targets, values, predecessor, salt } = await loadFixture(genOperationBatchFixture);
              await loadFixture(scheduleBatchFixture);

              const timestamp = await timelock.getTimestamp(id);
              await time.increaseTo(timestamp);

              await expectRevert(
                timelock.connect(executor).executeBatch(
                  targets,
                  values,
                  [],
                  predecessor,
                  salt,
                ),
                'TimelockController: length mismatch',
              );
            });

          });
        });


        it('partial execution', async () => {

          const { timelock, proposer, executor } = await loadFixture(deployTimelockFixture);
          const CallReceiverMock = await ethers.getContractFactory("CallReceiverMock");
          const mock = await CallReceiverMock.deploy();

          const { targets, values, payloads, predecessor, salt } = genOperationBatch(
            [mock.address, mock.address, mock.address],
            ['0', '0', '0'],
            [
              mock.interface.encodeFunctionData('mockFunction'),
              mock.interface.encodeFunctionData('mockFunctionThrows'),
              mock.interface.encodeFunctionData('mockFunction'),
            ],
            ZERO_BYTES32,
            '0x8ac04aa0d6d66b8812fb41d39638d37af0a9ab11da507afd65c509f8ed079d3e',
          );

          await timelock.connect(proposer).scheduleBatch(
            targets,
            values,
            payloads,
            predecessor,
            salt,
            MINDELAY
          );

          await time.increase(MINDELAY);
          await expectRevert(
            timelock.connect(executor).executeBatch(
              targets,
              values,
              payloads,
              predecessor,
              salt,
            ),
            'TimelockController: underlying transaction reverted',
          );
        });
      });
    });

    describe('cancel', () => {

      const { id, target, value, data, predecessor, salt } = genOperation(
        '0xC6837c44AA376dbe1d2709F13879E040CAb653ca',
        '0',
        '0x296e58dd',
        ZERO_BYTES32,
        '0xa2485763600634800df9fc9646fb2c112cf98649c55f63dd1d9c7d13a64399d9',
      );


      const scheduleFixture = async () => {
        const { timelock, proposer } = await loadFixture(deployTimelockFixture);
        await timelock.connect(proposer).schedule(
          target,
          value,
          data,
          predecessor,
          salt,
          MINDELAY
        );
      }

      it('canceller can cancel', async () => {
        const { timelock, canceller } = await loadFixture(deployTimelockFixture);
        await loadFixture(scheduleFixture);
        const tx = await (await timelock.connect(canceller).cancel(id)).wait();
        expect(tx).to.emit(timelock, "Cancelled").withArgs(id);
      });

      it('cannot cancel invalid operation', async () => {
        const { timelock, canceller } = await loadFixture(deployTimelockFixture);
        await expectRevert(
          timelock.connect(canceller).cancel(ZERO_BYTES32),
          'TimelockController: operation cannot be cancelled',
        );
      });

      it('prevent non-canceller from canceling', async () => {
        const { timelock, other } = await loadFixture(deployTimelockFixture);
        await expectRevert(
          timelock.connect(other).cancel(id),
          `AccessControl: account ${other.address.toLowerCase()} is missing role ${CANCELLER_ROLE}`,
        );
      });
    });

  });

  describe('maintenance', () => {
    it('prevent unauthorized maintenance', async () => {
      const { timelock, other } = await loadFixture(deployTimelockFixture);
      await expectRevert(timelock.connect(other).updateDelay(0), 'TimelockController: caller must be timelock');
    });

    it('timelock scheduled maintenance', async () => {
      const { timelock, proposer, executor } = await loadFixture(deployTimelockFixture);
      const newDelay = time.duration.hours(6);


      const { target, value, data, predecessor, salt } = genOperation(
        timelock.address,
        '0',
        timelock.interface.encodeFunctionData('updateDelay', [newDelay.toString()]),
        ZERO_BYTES32,
        '0xf8e775b2c5f4d66fb5c7fa800f35ef518c262b6014b3c0aee6ea21bff157f108',
      )

      await timelock.connect(proposer).schedule(
        target,
        value,
        data,
        predecessor,
        salt,
        MINDELAY,
      );
      await time.increase(MINDELAY);
      const tx = await (await timelock.connect(executor).execute(
        target,
        value,
        data,
        predecessor,
        salt
      )).wait();
      expect(tx).to.emit(timelock, "MinDelayChange").withArgs({ newDuration: newDelay.toString(), oldDuration: MINDELAY });

      expect(await timelock.getMinDelay()).to.be.equal(newDelay);
    });
  });

  describe('dependency', () => {

    const operation1 = genOperation(
      '0xdE66bD4c97304200A95aE0AadA32d6d01A867E39',
      '0',
      '0x01dc731a',
      ZERO_BYTES32,
      '0x64e932133c7677402ead2926f86205e2ca4686aebecf5a8077627092b9bb2feb',
    );
    const operation2 = genOperation(
      '0x3c7944a3F1ee7fc8c5A5134ba7c79D11c3A1FCa3',
      '0',
      '0x8f531849',
      operation1.id,
      '0x036e1311cac523f9548e6461e29fb1f8f9196b91910a41711ea22f5de48df07d',
    );


    it('cannot execute before dependency', async () => {
      const { timelock, proposer, executor } = await loadFixture(deployTimelockFixture);

      await timelock.connect(proposer).schedule(
        operation2.target,
        operation2.value,
        operation2.data,
        operation2.predecessor,
        operation2.salt,
        MINDELAY,
      );

      await time.increase(MINDELAY);

      await expectRevert(
        timelock.connect(executor).execute(
          operation2.target,
          operation2.value,
          operation2.data,
          operation2.predecessor,
          operation2.salt,
        ),
        'TimelockController: missing dependency',
      );
    });

    it('can execute after dependency', async () => {
      const { timelock, proposer, executor } = await loadFixture(deployTimelockFixture);

      await timelock.connect(proposer).schedule(
        operation1.target,
        operation1.value,
        operation1.data,
        operation1.predecessor,
        operation1.salt,
        MINDELAY,
      );
      await timelock.connect(proposer).schedule(
        operation2.target,
        operation2.value,
        operation2.data,
        operation2.predecessor,
        operation2.salt,
        MINDELAY,
      );

      await time.increase(MINDELAY);


      await timelock.connect(executor).execute(
        operation1.target,
        operation1.value,
        operation1.data,
        operation1.predecessor,
        operation1.salt,
      );
      await timelock.connect(executor).execute(
        operation2.target,
        operation2.value,
        operation2.data,
        operation2.predecessor,
        operation2.salt,
      );
    });
  });


  describe('usage scenario', () => {



    const deployImplementation2Fixture = async () => {
      const [_addr] = await ethers.getSigners()

      const Implementation2 = await ethers.getContractFactory("Implementation2");

      const impl2 = await Implementation2.deploy()
      const CallReceiverMock = await ethers.getContractFactory("CallReceiverMock");
      const mock = await CallReceiverMock.deploy()

      return { _addr, impl2, mock }
    }


    it('call', async () => {
      const { timelock, proposer, executor } = await loadFixture(deployTimelockFixture);
      const { impl2 } = await loadFixture(deployImplementation2Fixture);

      const { target, value, data, predecessor, salt } = genOperation(
        impl2.address,
        '0',
        impl2.interface.encodeFunctionData('setValue', [42]),
        ZERO_BYTES32,
        '0x8043596363daefc89977b25f9d9b4d06c3910959ef0c4d213557a903e1b555e2',
      );

      await timelock.connect(proposer).schedule(
        target,
        value,
        data,
        predecessor,
        salt,
        MINDELAY
      );
      await time.increase(MINDELAY);
      await timelock.connect(executor).execute(
        target,
        value,
        data,
        predecessor,
        salt,
      );

      expect(await impl2.getValue()).to.be.equal(42);
    });

    it('call reverting', async () => {
      const { timelock, proposer, executor } = await loadFixture(deployTimelockFixture);
      const { mock } = await loadFixture(deployImplementation2Fixture);


      const { target, value, data, predecessor, salt } = genOperation(
        mock.address,
        '0',
        mock.interface.encodeFunctionData('mockFunctionRevertsNoReason'),
        ZERO_BYTES32,
        '0xb1b1b276fdf1a28d1e00537ea73b04d56639128b08063c1a2f70a52e38cba693',
      );

      await timelock.connect(proposer).schedule(
        target,
        value,
        data,
        predecessor,
        salt,
        MINDELAY,
      );

      await time.increase(MINDELAY);

      await expectRevert(
        timelock.connect(executor).execute(target, value, data, predecessor, salt),
        'TimelockController: underlying transaction reverted',
      );
    });

    it('call throw', async () => {
      const { timelock, proposer, executor } = await loadFixture(deployTimelockFixture);
      const { mock } = await loadFixture(deployImplementation2Fixture);
      const operation = genOperation(
        mock.address,
        '0',
        mock.interface.encodeFunctionData('mockFunctionThrows'),
        ZERO_BYTES32,
        '0xe5ca79f295fc8327ee8a765fe19afb58f4a0cbc5053642bfdd7e73bc68e0fc67',
      );

      await timelock.connect(proposer).schedule(
        operation.target,
        operation.value,
        operation.data,
        operation.predecessor,
        operation.salt,
        MINDELAY
      );
      await time.increase(MINDELAY);
      await expectRevert(
        timelock.connect(executor).execute(operation.target, operation.value, operation.data, operation.predecessor, operation.salt),
        'TimelockController: underlying transaction reverted',
      );
    });

    it('call out of gas', async () => {
      const { timelock, proposer, executor } = await loadFixture(deployTimelockFixture);
      const { mock } = await loadFixture(deployImplementation2Fixture);
      const operation = genOperation(
        mock.address,
        '0',
        mock.interface.encodeFunctionData('mockFunctionOutOfGas'),
        ZERO_BYTES32,
        '0xf3274ce7c394c5b629d5215723563a744b817e1730cca5587c567099a14578fd',
      );

      await timelock.connect(proposer).schedule(
        operation.target,
        operation.value,
        operation.data,
        operation.predecessor,
        operation.salt,
        MINDELAY
      );
      await time.increase(MINDELAY);
      await expectRevert(
        timelock.connect(executor).execute(operation.target, operation.value, operation.data, operation.predecessor, operation.salt, { gasLimit: 70000 }),
        'TimelockController: underlying transaction reverted',
      );
    });

    it('call payable with eth', async () => {
      const { timelock, proposer, executor } = await loadFixture(deployTimelockFixture);
      const { mock } = await loadFixture(deployImplementation2Fixture);
      const operation = genOperation(
        mock.address,
        '1',
        mock.interface.encodeFunctionData('mockFunction'),
        ZERO_BYTES32,
        '0x5ab73cd33477dcd36c1e05e28362719d0ed59a7b9ff14939de63a43073dc1f44',
      );

      await timelock.connect(proposer).schedule(
        operation.target,
        operation.value,
        operation.data,
        operation.predecessor,
        operation.salt,
        MINDELAY
      );
      await time.increase(MINDELAY);

      expect(await ethers.provider.getBalance(timelock.address)).to.be.equal(0);
      expect(await ethers.provider.getBalance(mock.address)).to.be.equal(0);


      await timelock.connect(executor).execute(
        operation.target,
        operation.value,
        operation.data,
        operation.predecessor,
        operation.salt,
        { value: 1 },
      );

      expect(await ethers.provider.getBalance(timelock.address)).to.be.equal(0);
      expect(await ethers.provider.getBalance(mock.address)).to.be.equal(1);
    });

    it('call nonpayable with eth', async () => {
      const { timelock, proposer, executor } = await loadFixture(deployTimelockFixture);
      const { mock } = await loadFixture(deployImplementation2Fixture);
      const operation = genOperation(
        mock.address,
        '1',
        mock.interface.encodeFunctionData('mockFunction'),
        ZERO_BYTES32,
        '0xb78edbd920c7867f187e5aa6294ae5a656cfbf0dea1ccdca3751b740d0f2bdf8',
      );

      await timelock.connect(proposer).schedule(
        operation.target,
        operation.value,
        operation.data,
        operation.predecessor,
        operation.salt,
        MINDELAY,
      );
      await time.increase(MINDELAY);

      expect(await ethers.provider.getBalance(timelock.address)).to.be.equal(0);
      expect(await ethers.provider.getBalance(mock.address)).to.be.equal(0);

      await expectRevert(
        timelock.connect(executor).execute(operation.target, operation.value, operation.data, operation.predecessor, operation.salt),
        'TimelockController: underlying transaction reverted',
      );

      expect(await ethers.provider.getBalance(timelock.address)).to.be.equal(0);
      expect(await ethers.provider.getBalance(mock.address)).to.be.equal(0);
    });


    it('call reverting with eth', async () => {
      const { timelock, proposer, executor } = await loadFixture(deployTimelockFixture);
      const { mock } = await loadFixture(deployImplementation2Fixture);
      const operation = genOperation(
        mock.address,
        '1',
        mock.interface.encodeFunctionData('mockFunctionRevertsNoReason'),
        ZERO_BYTES32,
        '0xdedb4563ef0095db01d81d3f2decf57cf83e4a72aa792af14c43a792b56f4de6',
      );

      await timelock.connect(proposer).schedule(
        operation.target,
        operation.value,
        operation.data,
        operation.predecessor,
        operation.salt,
        MINDELAY
      );
      await time.increase(MINDELAY);

      expect(await ethers.provider.getBalance(timelock.address)).to.be.equal(0);
      expect(await ethers.provider.getBalance(mock.address)).to.be.equal(0);

      await expectRevert(
        timelock.connect(executor).execute(operation.target, operation.value, operation.data, operation.predecessor, operation.salt),
        'TimelockController: underlying transaction reverted',
      );

      expect(await ethers.provider.getBalance(timelock.address)).to.be.equal(0);
      expect(await ethers.provider.getBalance(mock.address)).to.be.equal(0);
    });
  });

});

*/
