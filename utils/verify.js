const { run } = require("hardhat");

//调用verify函数
const verify = async (contractAddress, args) => {
    console.log("Verifying contract....");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("alreay verified")) {
            console.log("Already Verified!"); // 已经验证过了
        } else {
            console.log(e); //输出异常原因
        }
    }
};

module.exports = { verify };
