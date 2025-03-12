const Ganache = artifacts.require("VendingMachine");

module.exports = function (deployer) {
    deployer.deploy(VendingMachine);
};