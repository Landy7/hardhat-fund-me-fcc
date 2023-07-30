//与不同的链进行交互
//key-value形式
const networkConfig = {
    //Sepolia Testnet
    //这里是ChainID
    11155111: {
        name: "sepolia",
        //Chainlink的priceFeed address
        ethUsdPriceFeed: "0x694aa1769357215de4fac081bf1f309adc325306",
    },
    //Polygon,Polygon chainID为137
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    },

    //31337 - hardhat network chainID
};

module.exports = {
    networkConfig,
};
