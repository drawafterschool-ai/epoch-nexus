// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DecentralizedTreatyVoting
 * @dev Implements Quadratic Voting & Multi-Party Consensus for historical & modern
 * multilateral treaties (e.g. Geneva Conventions, Outer Space Treaty, Climate Protocols).
 * 
 * Cost to cast 'V' votes on a clause is V^2 voice credits.
 */
contract DecentralizedTreatyVoting {
    struct TreatyProposal {
        uint256 id;
        string title;
        string description;
        uint256 ratificationDeadline;
        uint256 requiredQuorum;
        uint256 totalVotesInFavor;
        uint256 totalVotesAgainst;
        bool isRatified;
    }

    struct Delegate {
        string nationName;
        uint256 voiceCredits;
        uint256 creditsSpent;
        bool isRegistered;
    }

    address public secretaryGeneral;
    uint256 public proposalCount;
    
    mapping(uint256 => TreatyProposal) public proposals;
    mapping(address => Delegate) public delegates;
    // proposalId => delegateAddress => votesCast (signed: positive for favor, negative for against)
    mapping(uint256 => mapping(address => int256)) public delegateVotes;

    event DelegateRegistered(address indexed delegateAddress, string nationName, uint256 credits);
    event VoteCast(
        uint256 indexed proposalId,
        address indexed delegateAddress,
        int256 votes,
        uint256 creditsCost
    );
    event TreatyRatified(uint256 indexed proposalId, string title, uint256 votesInFavor);

    modifier onlySecretary() {
        require(msg.sender == secretaryGeneral, "Only Secretary General permitted");
        _;
    }

    constructor() {
        secretaryGeneral = msg.sender;
    }

    function registerDelegate(address delegateAddress, string calldata nationName, uint256 voiceCredits) external onlySecretary {
        require(!delegates[delegateAddress].isRegistered, "Delegate already registered");
        delegates[delegateAddress] = Delegate({
            nationName: nationName,
            voiceCredits: voiceCredits,
            creditsSpent: 0,
            isRegistered: true
        });
        emit DelegateRegistered(delegateAddress, nationName, voiceCredits);
    }

    function createTreatyProposal(
        string calldata title,
        string calldata description,
        uint256 votingDurationSeconds,
        uint256 requiredQuorum
    ) external onlySecretary returns (uint256) {
        proposalCount++;
        uint256 id = proposalCount;
        proposals[id] = TreatyProposal({
            id: id,
            title: title,
            description: description,
            ratificationDeadline: block.timestamp + votingDurationSeconds,
            requiredQuorum: requiredQuorum,
            totalVotesInFavor: 0,
            totalVotesAgainst: 0,
            isRatified: false
        });
        return id;
    }

    /**
     * @notice Cast quadratic votes for/against a treaty proposal
     * @param proposalId The treaty ID
     * @param votes Number of votes (+ for in favor, - for against)
     */
    function voteQuadratic(uint256 proposalId, int256 votes) external {
        Delegate storage delegate = delegates[msg.sender];
        require(delegate.isRegistered, "Caller is not a registered delegate");
        
        TreatyProposal storage proposal = proposals[proposalId];
        require(block.timestamp <= proposal.ratificationDeadline, "Voting deadline has passed");
        require(!proposal.isRatified, "Treaty already finalized");
        require(votes != 0, "Votes cannot be zero");

        uint256 absVotes = votes > 0 ? uint256(votes) : uint256(-votes);
        uint256 creditCost = absVotes * absVotes; // Quadratic formula: Cost = V^2

        require(delegate.creditsSpent + creditCost <= delegate.voiceCredits, "Insufficient voice credits");

        delegate.creditsSpent += creditCost;
        delegateVotes[proposalId][msg.sender] += votes;

        if (votes > 0) {
            proposal.totalVotesInFavor += absVotes;
        } else {
            proposal.totalVotesAgainst += absVotes;
        }

        emit VoteCast(proposalId, msg.sender, votes, creditCost);

        // Check ratification condition
        if (proposal.totalVotesInFavor >= proposal.requiredQuorum && proposal.totalVotesInFavor > proposal.totalVotesAgainst) {
            proposal.isRatified = true;
            emit TreatyRatified(proposalId, proposal.title, proposal.totalVotesInFavor);
        }
    }
}
