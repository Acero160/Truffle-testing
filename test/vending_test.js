const VendingMachine = artifacts.require("VendingMachine");


contract("VendingMachine", accounts => {

    let instance;
    let price = 1;
    let name = "Snack 1";
    let quantity = 3;
    let add_quantity = 3;
    

    beforeEach(async () => {
    instance = await VendingMachine.deployed();
    });

    it('Owner', async() => {
        const_owner = await instance.owner();
        assert.equal(_owner, accounts[0]);
    });

    it("Unable to add a snack without name", async() => {
        try {
            await instance.addnewSnack("", quantity, price);
        } catch (e)
        {
            assert(e.message.includes("Null name"));
        }
    });

    it("Unable to add a snack without quantity", async() => {
        try {
            await instance.addnewSnack(name, 0, price);
        } catch (e)
        {
            assert(e.message.includes("Null quantity"));
        }
    });

    it("Unable to add a snack without price", async() => {
        try {
            await instance.addnewSnack(name, quantity, 0);
        } catch (e)
        {
            assert(e.message.includes("Null price"));
        }
    });

    it ("Adding snack", async () => {
        let success = Boolean(await instance.addnewSnack (name, quantity, price));
        assert.equal(success, true);

    });

    it ("getAllSnacks", async () => {
        let snacks = await instance.getAllSnacks();

        assert.equal(snacks[0].name.toString(), name);
        assert.equal(snacks[0].quantity.toString(), quantity);
        assert.equal(snacks[0].price.toString(), price*10^8);
    });

    it("Unable to restock a snack without quantity", async() => {
        try {
            await instance.restock( 0, 0);
        } catch (e)
        {
            assert(e.message.includes("Null quantity"));
        }
    });

    it("Unable to restock a snack with wrong id", async() => {
        try {
            await instance.restock( -1, add_quantity);
        } catch (e)
        {
            assert(e.message.includes(""));
        }
    });

    it ("Restock snack", async () => {
        let success = Boolean(await instance.restock ( 0, add_quantity));
        assert.equal(success, true);

    });

    it ("gettAllSnack after restock", async () => {
        let snacks = await instance.getAllSnacks();

        assert.equal(snacks[0].name.toString(), name);
        assert.equal(snacks[0].quantity.toString(), quantity+add_quantity);
        assert.equal(snacks[0].price.toString(), price*10^8);
    });

    it("Unable to buy 0 snacks", async() => {
        try {
            await instance.buySnack(0, 10);
        } catch (e)
        {
            assert(e.message.includes("Insufficient quantity"));
        }
    });

    it("Unable to buy snacks without money", async() => {
        try {
            await instance.buySnack(0, 2, {from: accounts[1], value: 0});
        } catch (e)
        {
            assert(e.message.includes("No money"));
        }
    });

    it('Buy snack', async() => {
        let success = Boolean (await instance.buySnack(0,1, {from: accounts[1], value: 1*10^8}));
        assert.equal(success, true);
    });

    it ("gettAllSnacks after buy", async () => {
        let snacks = await instance.getAllSnacks();

        assert.equal(snacks[0].name.toString(), name);
        assert.equal(snacks[0].quantity.toString(), quantity+add_quantity);
        assert.equal(snacks[0].price.toString(), price*10^8);
    });

    it("Non-owner tries to get machine balance", async() => {
        try {
            await instance.getMachineValance({from:accounts[1]});
        } catch (e)
        {
            assert (e.message.includes("Ownable: caller is not the owner"));
        }
    });

    it ('Owner gets Machine Balance', async() => {
        let balance = await instance.getMachineBalance();

        assert.equal(balance, 10^8);
    });

    it ('Non-owner tries to withdraw', async() => {
        try {
            await instance.withdraw({from: accounts[1]});
        } catch (e)
        {
            assert (e.message.includes("Ownable: caller is not the owner"));
        }
    });

    it ("Withdraw", async() => {
        let success = Boolean(await instance.withdraw());
        assert.equal(success,true);
    });

})
   