const Ganache = artifacts.require("Ganache");

contract ("Ganache", accounts => {

    let instance;

    beforeEach(async () => {
        instance = await Ganache.deployed();
    });

    it('Owner', async() => {
        const_owner = await instance.owner();
        assert.equal(_owner, accounts[0]);
    });
    
    it("newMessage y getMessage", async() => {
        let msg = "Truffle Project";
        let newMsg = await instance.newMessage(msg, {from: accounts[1]});
        let getMsg = await instance.getMessage();

        assert.equal(msg, getMsg);
    });


})