require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@typechain/hardhat");
require("solidity-coverage");
require("hardhat-gas-reporter");
require("hardhat-deploy");

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
//需要修改
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

//一定要设置网关，要不然无法进行verify
const proxyUrl = "http://127.0.0.1:15236"; // change to yours, With the global proxy enabled, change the proxyUrl to your own proxy link. The port may be different for each client.
const { ProxyAgent, setGlobalDispatcher } = require("undici");
const proxyAgent = new ProxyAgent(proxyUrl);
setGlobalDispatcher(proxyAgent);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    //compile mutiple solidity version
    solidity: {
        compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },
    networks: {
        hardhat: {
            chainId: 31337,
        },
        sepolia: {
            url: SEPOLIA_RPC_URL,
            //这个位置上的account可以有很多个，我们需要用namedAccounts来指定不同角色的account
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
            blockConfirmations: 6, //how many blocks we want to wait
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        coinmarketcap: COINMARKETCAP_API_KEY,
        token: "MATIC",
    },
    namedAccounts: {
        //可以根据不同链不同account来指定deployer
        deployer: {
            default: 0, //给deployer指定account,默认第一个account为deployer account
            11155111: 0, //指定sepolia testnet的deployer account为第一个account
        },
        //当我们需要测试时，我们也可以设置user account, 比如
        user: {
            default: 2, //默认第三个account为user
        },
    },
};
