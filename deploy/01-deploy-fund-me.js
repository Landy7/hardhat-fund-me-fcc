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
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat"); //与上链的network进行交互，主要就是和hardhat.config.js中配置的network进行交流
// const helperConfig = require("../helper-hardhat-config"); //获取 helper-hardhat-config 整个文件
// const networkConfig = helperConfig.networkConfig; //获取文件中的变量

const { verify } = require("../utils/verify"); //引入verify文件

//使用语法糖，使语句更简短。
module.exports = async ({ getNamedAccounts, deployments }) => {
    //从deployments object 中获得两个functions: deploy, log
    //get用于获取已经deployed的contract
    const { deploy, log, get } = deployments;
    //从 getNamneAccounts object中获得 deployer function
    //然后从中获得deployer account ---- 来自 hardhat.config.js指定的deployer
    const { deployer } = await getNamedAccounts();
    //获得chainID
    const chainId = network.config.chainId;

    //因为networkConfig 相当于是 key-value 形式，所以根据chianId就可以得到对应的priceFeed
    //const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];

    //需要update ethUsdPriceFeedAddress参数
    let ethUsdPriceFeedAddress;
    //network是否为本地网络
    if (developmentChains.includes(network.name)) {
        //获得最新deployed的MockV3Aggregator contract
        const ethUsdAggregator = await get("MockV3Aggregator");
        //获取deploy contract 地址
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        //是否为sepolia or polygon 网络
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    //Mock contract
    //if the contract doesn't exsit, we deploy the minimal version of
    //for our local testing

    //what happens when we want to change chains?
    //when going for localhost or hardhat network we want to use a mock.
    //部署fundMe contract时需要传递参数 priceFeedAddress
    const args = [ethUsdPriceFeedAddress];

    const fundMe = await deploy("FundMe", {
        from: deployer, //谁deploy这个合约
        args: args, //输入price feed address,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1, //得到network中配置的的blockConfirmations
    });

    //本地网络不需要进行verify, 只有上链的时候需要verify
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args); //验证fundme contract, 需要输入address以及使用的参数 ethUsdPriceFeedAddress
    }
    log("-------------------------------"); //the end of Scripts
};

module.exports.tags = ["all", "fundMe"]; //给上面的scirpts打上标签
