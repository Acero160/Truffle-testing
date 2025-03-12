//SPDX-License-Identifier: GPL-3.0


pragma solidity 0.8.20;

contract Ganache {
    address public owner;
    string message;

    constructor(){
        owner = msg.sender;
    }

    event NewMsg (address indexed sender, string _message ) ;

    function newMessage (string memory _message) public {
        message = _message;
        emit NewMsg (msg.sender,  _message);
    }

    function getMessage() public view returns (string memory){
        return message;
    }

}