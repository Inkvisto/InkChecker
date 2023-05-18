"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectRevert = void 0;
const chai_1 = require("chai");
async function expectException(promise, expectedError) {
    try {
        await promise;
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.indexOf(expectedError) === -1) {
                const actualError = error.message.replace(/Returned error: VM Exception while processing transaction: (revert )?/, '');
                (0, chai_1.expect)(actualError).to.equal(expectedError, 'Wrong kind of exception received');
            }
            return;
        }
    }
    chai_1.expect.fail('Expected an exception but none was received');
}
const expectRevert = async (promise, expectedError) => {
    promise.catch(() => { });
    if (!expectedError) {
        throw Error('No revert reason specified: call expectRevert with the reason string, or use expectRevert.unspecified \
  if your \'require\' statement doesn\'t have one.');
    }
    await expectException(promise, expectedError);
};
exports.expectRevert = expectRevert;
