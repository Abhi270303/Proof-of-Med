// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IZkVerifyAttestation} from "./ZKVerifyContract.sol";

contract ZKMed is AccessControl {

    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant PHARMACY_ROLE = keccak256("PHARMACY_ROLE");
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");

    bytes32 public constant PROVING_SYSTEM_ID = keccak256(abi.encodePacked("ultraplonk"));

    address public zkVerify;
    bytes32 public vkey;

    struct Medicine {
        string name;
        string composition;
        uint256 mg;
        uint256 price;
        uint256 quantityAvailable;
        address pharmacy;
    }

    mapping (uint256 => Medicine) public medicines;
    uint256 public medCount = 0;

    event MedicineOrder(uint256 _medId, uint256 _quantity, string _address);

    constructor(address _zkVerify, bytes32 _vkey) {
        _grantRole(OWNER_ROLE, msg.sender);
        zkVerify = _zkVerify;
        vkey = _vkey;
    }

    function addDoctor(address _doctor) external onlyRole(OWNER_ROLE) {
        _grantRole(DOCTOR_ROLE, _doctor);
    }

    function addPharmacy(address _pharmacy) external onlyRole(OWNER_ROLE) {
        _grantRole(PHARMACY_ROLE, _pharmacy);
    }

    function addMedicine(
        string memory _name,
        string memory _composition,
        uint256 _mg,
        uint256 _price
    ) external onlyRole(PHARMACY_ROLE) {
        medicines[medCount] = Medicine(_name, _composition, _mg, _price, 0, msg.sender);
        medCount++;
    }

    function addInventory(uint256 _medId, uint256 _quantity) external onlyRole(PHARMACY_ROLE) {
        medicines[_medId].quantityAvailable += _quantity;
    }

    function getPrice(uint256[] calldata _details) public view returns (uint256 totalPrice) {
        totalPrice = 0;
        for (uint256 i = 0; i < _details.length; i += 2) {
            totalPrice += medicines[_details[i]].price * _details[i + 1];
        }
    }

    function checkHash(
    bytes32 _hash,
    uint256 _attestationId,
    bytes32[] calldata _merklePath,
    uint256 _leafCount,
    uint256 _index
    ) public {

    bytes32 leaf = keccak256(abi.encodePacked(PROVING_SYSTEM_ID, vkey, keccak256(abi.encodePacked(_hash))));

    require(IZkVerifyAttestation(zkVerify).verifyProofAttestation(
        _attestationId,
        leaf,
        _merklePath,
        _leafCount,
        _index
    ), "Invalid proof");
    }

    function buyMedicine(
        bytes32 _hash,
        uint256 _attestationId,
        bytes32[] calldata _merklePath,
        uint256 _leafCount,
        uint256 _index,
        string calldata _userAddress,
        uint256[] calldata _details
    ) external payable {
        checkHash(_hash, _attestationId, _merklePath, _leafCount, _index);

        require(msg.value >= getPrice(_details), "Insufficient payment!");

        for (uint256 i = 0; i < _details.length; i += 2) {
            uint256 medId = _details[i];
            uint256 quantity = _details[i + 1];

            if (medicines[medId].quantityAvailable >= quantity) {
                medicines[medId].quantityAvailable -= quantity;
                payable(medicines[medId].pharmacy).transfer(medicines[medId].price * quantity);
                emit MedicineOrder(medId, quantity, _userAddress);
            }
        }
    }
}
