// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MintableERC20 {
    string public name;
    string public symbol;
    uint8 public decimals;
    address public minter;
    uint256 public totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    constructor(string memory name_, string memory symbol_) {
        name = name_;
        symbol = symbol_;
        decimals = 18;
        minter = msg.sender;
    }

    error InsufficientBalance(uint256 requested, uint256 available);
    event Transfer(address indexed sender, address indexed receiver, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function mint(address receiver, uint256 amount) public {
        require(msg.sender == minter, 'Only the owner is authorized to mint tokens');
        totalSupply += amount;
        _balances[receiver] += amount;
        emit Transfer(address(0), receiver, amount);
    }

    function approve(address spender, uint256 amount) public returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) public returns (bool) {
        require(owner != address(0), 'Transfer from zero address is not permitted');
        require(spender != address(0), 'Transfer to zero address is not permitted');
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function transfer(address receiver, uint256 amount) public returns (bool) {
        _transfer(msg.sender, receiver, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address receiver,
        uint256 amount
    ) public returns (bool) {
        _transfer(sender, receiver, amount);
        uint256 _allowance = _allowances[sender][msg.sender];
        require(_allowance >= amount, 'There is no allowance to transfer this amount');
        _approve(sender, msg.sender, _allowance - amount);
        return true;
    }

    function _transfer(
        address sender,
        address receiver,
        uint256 amount
    ) internal {
        require(sender != address(0), 'Transfer from zero address is not permitted');
        require(receiver != address(0), 'Transfer to zero address is not permitted');
        if (amount > balanceOf(sender))
            revert InsufficientBalance({ requested: amount, available: balanceOf(msg.sender) });
        _balances[sender] -= amount;
        _balances[receiver] += amount;
        emit Transfer(sender, receiver, amount);
    }
}
