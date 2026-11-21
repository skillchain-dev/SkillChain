// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SkillChainCredential {
    address public immutable owner;

    struct Credential {
        bytes32 certificateHash;
        bytes32 studentHash;
        uint64 issuedAt;
        bool revoked;
    }

    mapping(bytes32 => Credential) private credentials;

    event CredentialIssued(bytes32 indexed credentialId, bytes32 certificateHash, bytes32 studentHash);
    event CredentialRevoked(bytes32 indexed credentialId);

    error NotOwner();
    error InvalidCredential();
    error CredentialAlreadyExists();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    function issueCredential(bytes32 credentialId, bytes32 certificateHash, bytes32 studentHash) external onlyOwner {
        if (credentialId == bytes32(0) || certificateHash == bytes32(0) || studentHash == bytes32(0)) {
            revert InvalidCredential();
        }
        if (credentials[credentialId].issuedAt != 0) revert CredentialAlreadyExists();
        credentials[credentialId] = Credential(certificateHash, studentHash, uint64(block.timestamp), false);
        emit CredentialIssued(credentialId, certificateHash, studentHash);
    }

    function revokeCredential(bytes32 credentialId) external onlyOwner {
        Credential storage credential = credentials[credentialId];
        if (credential.issuedAt == 0) revert InvalidCredential();
        credential.revoked = true;
        emit CredentialRevoked(credentialId);
    }

    function verifyCredential(bytes32 credentialId)
        external
        view
        returns (bool exists, bytes32 storedCertificateHash, uint64 issuedAt, bool revoked)
    {
        Credential memory credential = credentials[credentialId];
        exists = credential.issuedAt != 0;
        return (exists, credential.certificateHash, credential.issuedAt, credential.revoked);
    }
}