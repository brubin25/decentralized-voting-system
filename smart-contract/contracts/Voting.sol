// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    // ----------Structure ----------
    struct Candidate {
        uint256 id;         // Candidate ID
        string name;
        string party;
        uint256 voteCount;
    }

    struct CandidateInput {
        string name;
        string party;
    }

    struct Election {
        uint256 id;              // Only electionId
        string title;
        Candidate[] candidates;
        uint64 startTs;
        uint64 endTs;
        address admin;
        bool exists;
    }

    // ---------- state variable ----------
    Election[] public elections; 
    mapping(uint256 => mapping(address => bool)) public hasVoted; // electionId => voter => bool

    // ---------- event ----------
    event ElectionCreated(uint256 indexed electionId, address indexed admin, string title);
    event Voted(uint256 indexed electionId, uint256 indexed candidateId, address indexed voter);

    // ---------- Create voting ----------
    function createElection(
        string memory title,
        CandidateInput[] memory _candidates,
        uint64 startTs,
        uint64 endTs
    ) external {
        require(bytes(title).length > 0, "Title required");
        require(_candidates.length >= 2, "At least 2 candidates required");
        require(endTs > startTs, "End must be after start");

        uint256 newElectionId = elections.length; 
        elections.push();
        Election storage e = elections[newElectionId];
        e.id = newElectionId;
        e.title = title;
        e.startTs = startTs;
        e.endTs = endTs;
        e.admin = msg.sender;
        e.exists = true;

        // Initialize the candidate, candidate id = array index
        for (uint i = 0; i < _candidates.length; i++) {
            e.candidates.push(
                Candidate({
                    id: i,
                    name: _candidates[i].name,
                    party: _candidates[i].party,
                    voteCount: 0
                })
            );
        }

        emit ElectionCreated(newElectionId, msg.sender, title);
    }

    // ---------- Voting ----------
    function vote(uint256 electionId, uint256 candidateId) external {
        //require(electionId < elections.length, "Election not found");
        Election storage e = elections[electionId];

        require(block.timestamp >= e.startTs, "Voting not started");
        require(block.timestamp <= e.endTs, "Voting ended");
        require(!hasVoted[electionId][msg.sender], "Already voted");

        // Traverse the candidate array to search candidate.id
        bool found = false;
        for (uint i = 0; i < e.candidates.length; i++) {
            if (e.candidates[i].id == candidateId) {
                e.candidates[i].voteCount += 1;
                found = true;
                break;
            }
        }
        require(found, "Candidate not found");

        hasVoted[electionId][msg.sender] = true;

        emit Voted(electionId, candidateId, msg.sender);
    }


    // ---------- Query ----------
    function getElection(uint256 electionId)
        external
        view
        returns (
            uint256 id,
            string memory title,
            Candidate[] memory candidates,
            uint64 startTs,
            uint64 endTs,
            address admin
        )
    {
        require(electionId < elections.length, "Election not found");
        Election storage e = elections[electionId];
        return (e.id, e.title, e.candidates, e.startTs, e.endTs, e.admin);
    }

    function getCandidatesCount(uint256 electionId) external view returns (uint256) {
        require(electionId < elections.length, "Election not found");
        return elections[electionId].candidates.length;
    }

    function getCandidate(uint256 electionId, uint256 candidateId)
        external
        view
        returns (uint256 id, string memory name, string memory party, uint256 voteCount)
    {
        require(electionId < elections.length, "Election not found");
        Election storage e = elections[electionId];
        require(candidateId < e.candidates.length, "Invalid candidate id");
        Candidate storage c = e.candidates[candidateId];
        return (c.id, c.name, c.party, c.voteCount);
    }

    function getElectionCount() external view returns (uint256) {
        return elections.length;
    }
}
