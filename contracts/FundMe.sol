//allows people actually fund a collective good
// people can send the Ethereum, Polygon, Avalanche,
//Phantom or other blockchain native token into this contract.

//payable ---- fund function (allows users to send money to the contract)
//withdraw -----withdraw the funding
//fund this contract with a certain amount of eth or wei

//we can send money into our deployed contract
//the person who deployed this contract can withdraw the funds back out.
//once the fund was withdrawn, the amount of all the funds is reset back to zero.

//Get funds from users
//Withdraw funds
//Set a minimal funding value in USD

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FundMe {
    //每个人都能访问，所以是public
    //payable keyword 会让这个function的button颜色变红，而普通function的颜色是橘色的
    //绿色的function表示状态state。

    //using the chainlink and oralces
    //这里是usd
    uint256 public minimumUsd = 50 * 1e18; //global variables

    //必须要花钱才能启动该function
    function Fund() public payable {
        //want to be able to set the minimum fund amount in USD
        //How do we send Eth to this contract
        //发送的value必须大于1 ether
        //If this require is false, this function will be reverted: 如果下面的值为false, 那么剩余的gas fee will be returned
        //比如这一行require为false，那么上面的代码会正常执行(并且会正常的花费一定数额的gas fee)，但是前面代码的结果不会返回给用户，
        //但是因为revert, 下面的代码不会执行, 所以会返回剩余的gas fee.
        //And send the error message.
        //eth转换成usd
        require(
            getConversionRate(msg.value) > minimumUsd,
            "Didn't send enough"
        ); // 1 ether = 1*10**18 = 1000000000000000000 wei
    }

    // need to get the Chainlink price feeds.
    // to get the contract outside of our project, we need two things:
    // 1. ABI, 2. contract address
    function getPrice() public view returns (uint256) {
        //可以通过contract的interface来获得对应的ABI
        //然后通过 interface(contract address).function()来获得对应contract里的功能。
        //ABI
        //Address: 0x694AA1769357215DE4FAC081bf1f309aDC325306 ---Speoli testnet
        //返回值不止一个参数
        AggregatorV3Interface PriceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        //(uint80 roundId, int256 answer, uint256 startAt, uint256 updatedAt, uint80 answeredInRound)
        //只需要这一个变量
        //int256
        (, int256 answer, , , ) = PriceFeed.latestRoundData();
        //Eth in terms of USD
        //8 decimals in priceFeed
        //这里的priceFeed需要和上面的Fund()的msg.value相match
        //msg.value为uint256, 所以这里需要类型转换
        //这里的answer为8位，而eth的位数为18位，所以需要再乘以1e10
        return uint256(answer * 1e10); //1e10 = 1*10000000000
    }

    //与chainlink oracle相连
    function getVersion() public view returns (uint256) {
        //该contract address是在 Sepolia Testnet,所以部署的链需要选择为speolia testnet
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        ); //call this version function on the contracts
        return priceFeed.version();
    }

    //ether转成dollars
    function getConversionRate(
        uint256 ethAmount
    ) public view returns (uint256) {
        uint256 ethPrice = getPrice(); //1eth为多少美元的价格
        //如果不除以1e18，就会有36位
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd; //返回的decimal为18位
    }

    // function Withdraw(){

    // }
}
