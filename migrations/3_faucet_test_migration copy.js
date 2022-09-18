const FaucetTest = artifacts.require("FaucetTest");

module.exports = function (deployer) {
    deployer.deploy(FaucetTest);
};
