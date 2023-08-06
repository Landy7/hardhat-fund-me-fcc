//模拟本地部署调用PriceFeed, 非上链
const { network } = require("hardhat"); //与hardhat.config.js进行交互
const {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    //从deployments object 中获得两个functions: deploy, log
    const { deploy, log } = deployments;
    //从 getNamneAccounts object中获得 deployer function
    //然后从中获得deployer account ---- 来自 hardhat.config.js指定的deployer
    const { deployer } = await getNamedAccounts();

    //includes function: 去检查是否输入的变量包括在定义的array里面
    //看network.name是否包括在我们定义的变量developmentChains array里面
    if (developmentChains.includes(network.name)) {
        //看当前网络名称
        log("local network detected!Deploying mocks.....");
        //部署MockV3Aggregator(部署这个contract需要输入两个参数)
        //Decimals and initial_answer
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true, //会显示详细部署信息
            //部署该contract的时候,constructor需要输入这两个参数
            args: [DECIMALS, INITIAL_ANSWER],
        });
        log("Mocks deployed!");
        //the end of deploy scripts
        log("-----------------------------------------");
    }
};

module.exports.tags = ["all", "mocks"]; //only run the deploy scripts with special tags
