// import "../css/style.css" // Uncomment if needed

const Web3 = require('web3');
const contract = require('@truffle/contract');
const votingArtifacts = require('../../build/contracts/Voting.json');
const VotingContract = contract(votingArtifacts);

window.App = {
  account: null,

  eventStart: async function () {
    if (typeof window.ethereum === 'undefined') {
      alert("Please install MetaMask to use this app.");
      return;
    }

    try {
      // Request account access and set account
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      App.account = accounts[0];

      console.log("Connected MetaMask account:", App.account);

      // Set provider and default account
      VotingContract.setProvider(window.ethereum);
      VotingContract.defaults({ from: App.account, gas: 6654755 });

      $("#accountAddress").html("Your Account: " + App.account);

      const instance = await VotingContract.deployed();
      const countCandidates = await instance.getCountCandidates();

      // Display election dates
      instance.getDates().then(result => {
        const start = new Date(result[0] * 1000);
        const end = new Date(result[1] * 1000);
        $("#dates").text(`${start.toDateString()} - ${end.toDateString()}`);
      }).catch(err => console.error("Date Fetch Error:", err));

      // Display candidates
      for (let i = 0; i < countCandidates; i++) {
        const data = await instance.getCandidate(i + 1);
        const [id, name, party, votes] = data;
        const row = `<tr><td><input class="form-check-input" type="radio" name="candidate" value="${id}" id=${id}>${name}</td><td>${party}</td><td>${votes}</td></tr>`;
        $("#boxCandidate").append(row);
      }

      // Enable voting if not already voted
      const voted = await instance.checkVote();
      if (!voted) {
        $("#voteButton").attr("disabled", false);
      }

    } catch (err) {
      console.error("Initialization Error:", err);
      alert("Failed to load contract or account.");
    }
  },

  vote: async function () {
    const candidateID = $("input[name='candidate']:checked").val();
    if (!candidateID) {
      $("#msg").html("<p>Please vote for a candidate.</p>");
      return;
    }

    try {
      console.log("Voting with account:", App.account);
      const instance = await VotingContract.deployed();
      await instance.vote(parseInt(candidateID), { from: App.account });

      $("#voteButton").attr("disabled", true);
      $("#msg").html("<p>Voted successfully!</p>");
      window.location.reload();
    } catch (err) {
      console.error("Vote Error:", err);
      alert("Voting failed.");
    }
  }
};

// ✅ Click Handlers: safely bound after App.account is set
$(window).on('load', async function () {
  await App.eventStart();

  $('#addCandidate').on('click', async function () {
    const name = $('#name').val();
    const party = $('#party').val();

    try {
      console.log("Adding candidate with account:", App.account);
      const instance = await VotingContract.deployed();
      await instance.addCandidate(name, party, { from: App.account });
      alert("Candidate added successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Add Candidate Error:", err);
      alert("Failed to add candidate.");
    }
  });

  $('#addDate').on('click', async function () {
    const startDate = Date.parse(document.getElementById("startDate").value) / 1000;
    const endDate = Date.parse(document.getElementById("endDate").value) / 1000;

    try {
      console.log("Setting dates with account:", App.account);
      const instance = await VotingContract.deployed();
      await instance.setDates(startDate, endDate, { from: App.account });
      alert("Voting dates set.");
    } catch (err) {
      console.error("Set Date Error:", err);
      alert("Failed to set dates.");
    }
  });
});

// 🔁 Update on MetaMask account switch
if (window.ethereum) {
  window.ethereum.on('accountsChanged', async function (accounts) {
    App.account = accounts[0];
    console.log("Switched MetaMask account to:", App.account);
    $("#accountAddress").html("Your Account: " + App.account);

    // Refresh app logic with new account
    await App.eventStart();
  });
}
