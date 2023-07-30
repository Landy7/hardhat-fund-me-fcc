require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@typechain/hardhat");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-deploy");

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
//需要修改
const SEPOLIA_RPC_URL =
    process.env.SEPOLIA_RPC_URL ||
    "https://eth-sepolia.g.alchemy.com/v2/xk5MLCNT4UM9gHEeeJ2WGD71iIkurDFe";

const PRIVATE_KEY =
    process.env.PRIVATE_KEY ||
    "d2a4c2e63bb8b04c64178c4adf41e6ef6062a9f14ba64e93d357a924445882b5";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    solidity: "0.8.8",
    networks: {
        hardhat: {
            chainId: 31337,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            //这个位置上的account可以有很多个，我们需要用namedAccounts来指定不同角色的account
            accounts: [],
            chainId: 11155111,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
    },
    namedAccounts: {
        //可以根据不同链不同account来指定deployer
        deployer: {
            default: 0, //给deployer指定account,默认第一个account为deployer account
            11155111: 1, //指定sepolia testnet的deployer account为第二个account
        },
        //当我们需要测试时，我们也可以设置user account, 比如
        user: {
            default: 2, //默认第三个account为user
        },
    },
};
