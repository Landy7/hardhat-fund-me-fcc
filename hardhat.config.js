require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@typechain/hardhat");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.8",
};
