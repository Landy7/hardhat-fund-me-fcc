const { network } = require("hardhat"); //与hardhat.config.js进行交互

module.exports = async ({ getNameAccounts, deployments }) => {
    //从deployments object 中获得两个functions: deploy, log
    const { deploy, log } = deployments;
    //从 getNamneAccounts object中获得 deployer function
    //然后从中获得deployer account ---- 来自 hardhat.config.js指定的deployer
    const { deployer } = await getNameAccounts();
    //获得chainID
    const chainId = network.config.chainId;
};
