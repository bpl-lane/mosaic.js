"use strict";

/**
 * Approve OpenSTValue contract for starting the stake and mint process.
 */

const BigNumber = require('bignumber.js')
;

const rootPrefix = '../..'
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , logger = require(rootPrefix + '/helpers/custom_console_logger')
  , simpleTokenContractInteract = require(rootPrefix + '/lib/contract_interact/simple_token')
;

const openSTValueContractName = 'openSTValue'
  , openSTValueContractAddress = coreAddresses.getAddressForContract(openSTValueContractName)
;

/**
 * Get ST balance
 *
 * @param {String} address - Address to get the ST balance
 *
 * @return {Promise<BigNumber>}
 */
const getSTBalance = function (address) {
  logger.step("Getting ST Balance of Staker account: ", address);
  return simpleTokenContractInteract.balanceOf(address)
    .then(function (result) {
      const stBalance = result.data['balance'];

      logger.win("ST Balance of Staker account: ", address, " obtained.");

      return new BigNumber(stBalance);
    })
};

/**
 * Check allowance and approve if needed
 *
 * @param {String} stakerAddress - Staker address
 * @param {String} passphrase - Staker address passphrase
 * @param {Number} toApproveAmount - to approve amount
 *
 * @return {Promise}
 */
const approve = function (stakerAddress, passphrase, toApproveAmount) {
  return simpleTokenContractInteract.approve(
    stakerAddress,
    passphrase,
    openSTValueContractAddress,
    toApproveAmount,
    true // we need this to be done in async and not to wait for the tx to get mined.
  );
};

const approveOpenStValueContract = function () {

  const stakerAddress = coreAddresses.getAddressForUser('staker')
    , stakerPassphrase = coreAddresses.getPassphraseForUser('staker');

  return getSTBalance(stakerAddress)
    .then(function (bigSTBalance) {
      return approve(
        stakerAddress,
        stakerPassphrase,
        bigSTBalance
      );
    })

};

module.exports = approveOpenStValueContract;