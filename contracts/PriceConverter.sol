//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

//all the function in the library are gonna be internal keywords
//不能声明state variable 以及 发送ether
library PriceConverter {
    // need to get the Chainlink price feeds.
    // to get the contract outside of our project, we need two things:
    // 1. ABI, 2. contract address
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        //可以通过contract的interface来获得对应的ABI
        //然后通过 interface(contract address).function()来获得对应contract里的功能。
        //ABI
        //Address: 0x694AA1769357215DE4FAC081bf1f309aDC325306 ---Speoli testnet
        //返回值不止一个参数
        //https://docs.chain.link/data-feeds/price-feeds/addresses#Sepolia%20Testnet

        //这部分不再需要，因为现在priceFeed已经作为参数来进行调用，而非使用硬编码的形式写入到合约里
        // AggregatorV3Interface PriceFeed = AggregatorV3Interface(
        //     0x694AA1769357215DE4FAC081bf1f309aDC325306
        // );
        //(uint80 roundId, int256 answer, uint256 startAt, uint256 updatedAt, uint80 answeredInRound)
        //只需要这一个变量
        //int256
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        //Eth in terms of USD
        //8 decimals in priceFeed
        //这里的priceFeed需要和上面的Fund()的msg.value相match
        //msg.value为uint256, 所以这里需要类型转换
        //这里的answer为8位，而eth的位数为18位，所以需要再乘以1e10
        return uint256(answer * 1e10); //1e10 = 1*10000000000
    }

    //ether转成dollars
    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed); //1eth为多少美元的价格
        //如果不除以1e18，就会有36位
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd; //返回的decimal为18位
    }
}
