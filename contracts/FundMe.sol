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

import "./PriceConverter.sol";

//constant and immutable keywords

// deploy 971,870 gas fee ----normal
// deploy 949,404 gas fee --- using constant type

error NotOwner(); //outside of contract

contract FundMe {
    using PriceConverter for uint256;
    //每个人都能访问，所以是public
    //payable keyword 会让这个function的button颜色变红，而普通function的颜色是橘色的
    //绿色的function表示状态state。

    //using the chainlink and oralces
    //这里是usd
    uint256 public constant MINIMUM_USD = 50 * 1e18; //global variables
    // 307 gas fee --using constant variable
    // 2407 gas fee --- non constant

    address[] public funders; //记录donators
    mapping(address => uint256) public addressToAmountFunded; //记录每个donators对应的捐赠多少钱

    //不会修改
    address public immutable i_owner; //谁deploy这个contract,谁就是owner

    //需要去重写constructor中的信息
    //需要和PriceFeed进行interact
    AggregatorV3Interface public priceFeed;

    //传递参数
    constructor(address priceFeedAddress) {
        i_owner = msg.sender; //save gas
        // 444 gas fee --- immutable
        // 2580 gas fee --- non-immutable
        priceFeed = AggregatorV3Interface(priceFeedAddress); //使用传递来的PriceFeedAddress参数作为priceFeed
    }

    //必须要花钱才能启动该function (payable type)
    //记录donators and donating currency
    //people can fund our contract
    function Fund() public payable {
        //want to be able to set the minimum fund amount in USD
        //How do we send Eth to this contract
        //发送的value必须大于1 ether
        //If this require is false, this function will be reverted: 如果下面的值为false, 那么剩余的gas fee will be returned
        //比如这一行require为false，那么上面的代码会正常执行(并且会正常的花费一定数额的gas fee)，但是前面代码的结果不会返回给用户，
        //但是因为revert, 下面的代码不会执行, 所以会返回剩余的gas fee.
        //And send the error message.
        //eth转换成usd

        //msg.value.getConversionRate() 与 getConversionRate(msg.value) 的功能一样，
        //都是传入msg.value进入PriceConverter.sol的getConversionRate()方法。
        //只有getConversionRate()需要传参数，其他的两个方法都不需要传参数。
        //这里的msg.value被library视为getConversionRate()的第一个传入的参数。如果该方法还需要传入多个参数
        //就在该函数括号内添加除需要传入的第一个参数以外的其他参数。

        //现在PriceFeed作为另一个参数传入到getConversionRate()
        require(
            msg.value.getConversionRate(priceFeed) > MINIMUM_USD,
            "Didn't send enough"
        ); // 1 ether = 1*10**18 = 1000000000000000000 wei
        funders.push(msg.sender); //跟踪哪些用户pay了这个function
        addressToAmountFunded[msg.sender] = msg.value;
    }

    //withdraw the funds out of contracts, use the funds to buy something for this project
    //withdraw all the funds: addressToAmountFunded are rested to zero.
    //onlyOwner: 为modifier, 先执行onlyOwner中的语句，再运行该函数中的语句
    function Withdraw() public onlyOwner {
        //只有owner才能开启这个方法
        //require(msg.sender == owner, "only the owner can operate this function");
        for (uint256 i = 0; i < funders.length; i++) {
            address funders_address = funders[i];
            addressToAmountFunded[funders_address] = 0; //所有funder的钱都设置为0
        }
        //reset the array
        //重新定义了一个funders数组来存储funders的address，来替代原来的funders
        funders = new address[](0);
        //actually withdraw the funds from contract (把contract的资金都返回给投资人)

        //transfer (simple one)
        //msg.sender = address
        //payable(msg.sender) = payable address
        //需要进行type转换
        //payable(msg.sender).transfer(address(this).balance);  //获得该sender所捐赠的金额

        //send
        //bool sendSuccess = payable(msg.sender).send(address(this).balance);  //获得该sender所捐赠的金额
        //require(sendSuccess,"send fail");

        //call --- low level command
        //call括号中的“”可以输入information of function
        //需要像map一样通过key:value的形式来获取该sender发送的金额，并且call value会返回两个参数
        //这里返回的两个参数分别是 (bool callSuccess, bytes memory datareturns)
        //datareturns是array, 所以需要memory keyword
        //这里不需要datareturns, 所以删除
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "call fail");
    }

    modifier onlyOwner() {
        //require(msg.sender == i_owner, NotOwner());
        if (msg.sender != i_owner) {
            revert NotOwner(); //直接用error call来进行revert操作
        } // saving a lot gas
        _; // the reset of the code inside of the function.
    }

    receive() external payable {
        Fund(); //不小心发送了ETH但是没有点击Fund()function
    }

    fallback() external payable {
        Fund(); //输入一些无法解析的CALLDATA会调用fallback
    }
}
