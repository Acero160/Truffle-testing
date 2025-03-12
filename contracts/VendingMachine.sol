// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

contract VendingMachine  {

     address payable private owner;

    struct Snack {
        uint32 id;
        string name;
        uint32 quantity;
        uint8 price;
    }

    
    //Variables
    Snack [] stock;
    mapping(uint32 => Snack) stock1;


    uint32 totalSnacks;


    //Events
    event newSnackAdded (string _name, uint8 _price);
    event snackRestocked (string _name, uint32 _quantity);
    event snackSold(string _name, uint32 _amount);


    constructor () {
        owner = payable(msg.sender);
        totalSnacks = 0;
    }

    
    modifier onlyOwner () {
        require(msg.sender == owner);
        _;  
    }
    

    // Functions

    function getAllSnacks () external view returns (Snack [] memory _stock) {
        return stock;
    }


    //Function add new snacks
    function addNewSnacks (string memory _name, uint32 _quantity, uint8 _price) external onlyOwner {

        //Checking
        require (bytes(_name).length != 0, "Null name");
        require(_price!=0, "Null price");
        require(_quantity != 0, "Null quantity");

        for (uint8 i = 0; i<stock.length; i++){
            require(!compareStrings (_name, stock[i].name));
            require(!compareStrings (_name, stock1[i].name));
        }


        Snack memory newSnack = Snack (totalSnacks, _name, _quantity, _price*10^8);
        stock.push(newSnack);
        stock1[totalSnacks] = newSnack;
        totalSnacks++;


        emit newSnackAdded (_name, _price);

    }


    //Funcion restock products
    function restock (uint32 _id, uint32 _quantity) external onlyOwner {
        require(_quantity != 0, "Null quantity");
        require (_id < stock.length);

        stock [_id].quantity+=_quantity;
        stock1[_id].quantity+=_quantity;

        emit snackRestocked(stock[_id].name, stock[_id].quantity);
    }


    // The owner access to see the machine´s balance
    function getMachineBalance () external view onlyOwner returns(uint){
        return address(this).balance;
    }

    //balance machine is transferred to the owner
    function withdraw() external onlyOwner {
        owner.transfer (address(this).balance);
    } 


    //Anyone can buy on the machine
    function buySnack (uint32 _id, uint32 _amount) external payable {
        require(_amount > 0, "Incorrect amount");
        require (stock[_id].quantity >= _amount, "Insufficient quantity");
        require (msg.value >= _amount*stock[_id].price, "No money");

        stock[_id].quantity -= _amount; 
        stock1[_id].quantity -= _amount;


        emit snackSold(stock[_id].name, _amount);
    }



    function compareStrings (string memory a, string memory b) internal pure returns (bool)
    {
        return(keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b)));
    }

    
}