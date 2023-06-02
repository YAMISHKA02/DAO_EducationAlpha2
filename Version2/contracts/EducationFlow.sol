// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//  Interface for ERC20 stablecoins as USDT, DAI, BUSD etc.
//  In this version i used only USDT for payments. In next versions it will be possible to
//  pay by various tokens.
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";






// Start of the smart contract for DAO education platform
// This version supprots only one round of quadraticFounring
contract EducationPlatform is Ownable {

    using Counters for Counters.Counter;
    

    // Here you can see main data strucure of round system
    // enums using for emit events and later using them onback-end
    Counters.Counter private _expertId;
    enum Register { None, Pending, Done }
    enum CourseStatus {Pending, Done, Canceled}
    IERC20 USDT;
    Round public round;
    //address withdrawAddr;

    mapping (uint => Expert) public expertById;
    mapping (address => bool) public isExpertRegistered;
    mapping (address => mapping (uint => DonatingInfo)) public userDonation;
    mapping (address => RegistrationRequest) public registrationRequests;
    mapping (address => bool) public isUserRegistered;
    
    // Data about our experts like ADDRESS, NAME, BALANCE and VOTES for this expert

    struct Expert { //this is Expert
        address expertAddress;
        string expertName;
        uint expertId;
        uint votes;
        uint balance;
        uint rewardPoints;
        CourseStatus status;
    }

    // Donating info using in mapping, to know is user donated for current expert
    // and how much
    struct DonatingInfo{
        bool isDonated;
        uint amountOfDonations;
    }

    // RegistrationRequest also using in mapping and used for register our experts in system
    struct RegistrationRequest { 
        address userAddress;
        string name;
        Register registrationStatus;
    }

    // Info about round
    struct Round{
        uint budget;
        uint startTime;
        uint endTime;
        uint totalVotes;
        bool roundPlanned;
        mapping(address => mapping (uint => bool)) isUserDonatedToExpertInRound;
    }
    
    
    constructor(address _USDT) {
        USDT = IERC20(_USDT);
    }
    
    function register() external{
        isUserRegistered[_msgSender()] = true;
    }

    // Here function get string "Name of Expert" and scan its addres, then make request to register
    // after some requrements checks 
    function registerAsExpert(string memory _name) external {

        require(!isExpertRegistered[_msgSender()], "You already registered");
        require(registrationRequests[_msgSender()].registrationStatus == Register.None, 'Your request already created');
        address _expertAddr = _msgSender();
        registrationRequests[_expertAddr].name = _name;
        registrationRequests[_expertAddr].userAddress = _expertAddr;
        registrationRequests[_expertAddr].registrationStatus = Register.Pending;
        emit RegistrationRequested(_name, _expertAddr);
    }
    
    // Deployer of smart-contract can approve any of the users request and register him as Expert
    function approveExpert(address _expertAddr) external onlyOwner {
        require(!isExpertRegistered[_expertAddr], "This Expert already registered");
        require(registrationRequests[_expertAddr].registrationStatus != Register.None, "This request not exist");
        
        uint expertId = _expertId.current();
        
        isExpertRegistered[_expertAddr] = true;
        registrationRequests[_expertAddr].registrationStatus = Register.Done;

        expertById[expertId].expertAddress = _expertAddr;
        expertById[expertId].expertId = expertId;
        expertById[expertId].expertName = registrationRequests[_expertAddr].name;
        _expertId.increment();
        emit RegistrationApproved(expertById[expertId].expertName, _expertAddr, expertId);
    }
    
    // After all experts registration, contract Owner should to start round by giving function latency in days
    function startRound(uint _startTimeStapm,uint _timeInHours, uint _roundRevardsPoints) external onlyOwner {
        uint _hourInMillisecconds = 1000*60*60;
        require(!round.roundPlanned, "Round already planned");
        require(block.timestamp <= _startTimeStapm && (_startTimeStapm - block.timestamp)<= _hourInMillisecconds*24*31);
        uint _endTime = _startTimeStapm + _timeInHours * _hourInMillisecconds;
        
        round.roundPlanned = true;
        round.endTime = _endTime;
        round.budget = _roundRevardsPoints;
        round.startTime = _startTimeStapm;
        emit RoundStarted(round.startTime, round.endTime, round.budget);
    }
    
    // Native users allow to donate any existing expert some funds
    // in USDT, then some votes adding for expert in this round if he 
    // not voted for this expert in this round yet
    function donateInUSDT(uint _id, uint _amount) external{
        require(isUserRegistered[_msgSender()], "You not registered");
        require(USDT.balanceOf(_msgSender()) >= _amount, "You havent enougth USDT");
        require(USDT.allowance(_msgSender(), address(this)) >= _amount, "You need to approve mote USDT to donate this");
        require(expertById[_id].expertAddress != address(0), "Expert not exist");
        bool _isVoteAdded;
        USDT.transferFrom(_msgSender(), address(this), _amount);
        if(round.startTime < block.timestamp && block.timestamp < round.endTime && !round.isUserDonatedToExpertInRound[_msgSender()][_id]){
            round.totalVotes++;
            expertById[_id].votes++;
            round.isUserDonatedToExpertInRound[_msgSender()][_id] = true;
            _isVoteAdded = true;
        }
        expertById[_id].balance+= _amount;
        userDonation[_msgSender()][_id].isDonated = true;
        userDonation[_msgSender()][_id].amountOfDonations+= _amount;
        emit Donate(_msgSender(), _id, _amount, _isVoteAdded);
    }
    


    // After round ending and expert produced his course, 
    // contract Owner can approve that and transfer his donation and
    // funding revard to experts wallet
    function transferTokensToExpert(uint _id) external onlyOwner{
        //require(round.endTime < block.timestamp, "Round not finished yet");
        require(round.totalVotes > 0, "Panic! Please add votes");
        require(expertById[_id].expertAddress != address(0), "Expert not exist");
        require(expertById[_id].status == CourseStatus.Pending, "This is already not actual");
        expertById[_id].status = CourseStatus.Done;
        uint balance = expertById[_id].balance;
        uint reward = round.budget * expertById[_id].votes / round.totalVotes;
        expertById[_id].balance = 0;
        USDT.transfer(expertById[_id].expertAddress, balance);
        expertById[_id].rewardPoints+=reward;
        emit TransferDonationsToExpert(_id, balance, reward);
    }
    
    function OnMoneyBack(uint _id) external onlyOwner{
        //require(round.endTime < block.timestamp, "Round not finished yet");
        require(expertById[_id].expertAddress != address(0), "Expert not exist");
        require(expertById[_id].status == CourseStatus.Pending, "This is already not actual");
        expertById[_id].status = CourseStatus.Canceled;
        emit EnableMoneyBack(_id);
    }
    
    function getMoneyBack(uint _id) external {
        //require(round.endTime < block.timestamp, "Round not finished yet");
        require(expertById[_id].expertAddress != address(0), "Expert not exist");
        require(expertById[_id].status == CourseStatus.Canceled, "This course not canceled");
        require(0 < userDonation[_msgSender()][_id].amountOfDonations, "Nothing to withdraw");
        uint donated = userDonation[_msgSender()][_id].amountOfDonations;
        userDonation[_msgSender()][_id].amountOfDonations = 0;
        expertById[_id].balance -= donated;
        USDT.transfer(_msgSender(), donated);
        emit GotMoneyBack(_id, donated, _msgSender());
    }

    event EnableMoneyBack (uint _expertId);
    event GotMoneyBack (uint _expertId, uint _amount, address _user);
    event RegistrationRequested(string _name, address _expertAddress);
    event RoundStarted(uint _startTime, uint _endTime, uint _revardsAmount );
    event RegistrationApproved(string _name, address _expertAddress, uint _id );
    event TransferDonationsToExpert (uint _expertId, uint _transfered, uint _rewardPoints);
    event Donate(address _sender, uint _expertId, uint _revardsAmount, bool _isVoteAdded );
    
}



