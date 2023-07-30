// function deployFunc(){
//     console.log("Hi")
// }

// module.exports.default = deployFunc

//使用匿名函数：
//输入参数来自 hardhat runtime environment (hre) object, 相当于从hre中取出两个objects使用

//表示调用该匿名函数,并且箭头指向函数内容
//这个调用函数和上面调用函数几乎一摸一样，只是该函数没有名字
//module.exports = async (hre) => {
//从hre中获得这两个objects，相当于 hre.getNameAccounts()以及 hre.deployments()
//    const {getNameAccounts, deployments} = hre;
//}

//引入helper-hardhat-config文件，{}表示 只需要networkConfig这个变量
const { networkConfig } = require("../helper-hardhat-config");
const { network } = require("hardhat"); //与hardhat.config.js进行交互
// const helperConfig = require("../helper-hardhat-config"); //获取 helper-hardhat-config 整个文件
// const networkConfig = helperConfig.networkConfig; //获取文件中的变量

//使用语法糖，使语句更简短。
module.exports = async ({ getNameAccounts, deployments }) => {
    //从deployments object 中获得两个functions: deploy, log
    const { deploy, log } = deployments;
    //从 getNamneAccounts object中获得 deployer function
    //然后从中获得deployer account ---- 来自 hardhat.config.js指定的deployer
    const { deployer } = await getNameAccounts();
    //获得chainID
    const chainId = network.config.chainId;

    //因为networkConfig 相当于是 key-value 形式，所以根据chianId就可以得到对应的priceFeed
    const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];

    //Mock contract
    //if the contract doesn't exsit, we deploy the minimal version of
    //for our local testing

    //what happens when we want to change chains?
    //when going for localhost or hardhat network we want to use a mock.
    const fundMe = await deploy("FundMe", {
        from: deployer, //谁deploy这个合约
        args: [], //输入一些参数，比如price feed address,
        log: true,
    });
};
