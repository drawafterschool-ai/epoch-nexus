// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CivicsMasteryBadge
 * @dev Soulbound (non-transferable) ERC-5192 compliant educational credential contract
 * issued upon completing Tri-Pillar History + Civics + STEM tracks in ChronosCode.
 */
contract CivicsMasteryBadge {
    string public name = "Epoch Nexus Academy Civics & STEM Credential";
    string public symbol = "ENA-MASTERY";

    address public admin;

    struct Credential {
        uint256 tokenId;
        address student;
        uint8 trackId; // 1: Antiquity, 2: Discovery, 3: Industrial, 4: Modern Governance
        string trackTitle;
        uint256 score;
        uint256 timestamp;
        string verificationHash;
        string ipfsMetadataUri;
    }

    uint256 private _tokenCounter;
    mapping(uint256 => Credential) private _credentials;
    mapping(address => mapping(uint8 => bool)) public hasCompletedTrack;
    mapping(address => uint256[]) private _studentTokens;

    // ERC-5192 Soulbound Events
    event Locked(uint256 tokenId);
    event CredentialMinted(
        uint256 indexed tokenId,
        address indexed student,
        uint8 indexed trackId,
        string trackTitle,
        uint256 score,
        string verificationHash
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can execute");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function mintMasteryBadge(
        address student,
        uint8 trackId,
        string calldata trackTitle,
        uint256 score,
        string calldata verificationHash,
        string calldata ipfsUri
    ) external onlyAdmin returns (uint256) {
        require(student != address(0), "Invalid student address");
        require(trackId >= 1, "Track ID must be at least 1");
        require(!hasCompletedTrack[student][trackId], "Track already completed and minted");

        _tokenCounter++;
        uint256 newTokenId = _tokenCounter;

        _credentials[newTokenId] = Credential({
            tokenId: newTokenId,
            student: student,
            trackId: trackId,
            trackTitle: trackTitle,
            score: score,
            timestamp: block.timestamp,
            verificationHash: verificationHash,
            ipfsMetadataUri: ipfsUri
        });

        hasCompletedTrack[student][trackId] = true;
        _studentTokens[student].push(newTokenId);

        emit CredentialMinted(newTokenId, student, trackId, trackTitle, score, verificationHash);
        emit Locked(newTokenId);

        return newTokenId;
    }

    function getCredential(uint256 tokenId) external view returns (Credential memory) {
        require(_credentials[tokenId].student != address(0), "Token does not exist");
        return _credentials[tokenId];
    }

    function getStudentCredentials(address student) external view returns (uint256[] memory) {
        return _studentTokens[student];
    }

    function locked(uint256 /* tokenId */) external pure returns (bool) {
        return true; // Soulbound: permanently locked to student address
    }

    function totalSupply() external view returns (uint256) {
        return _tokenCounter;
    }
}
