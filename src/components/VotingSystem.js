"use client";

import { useState } from 'react';

const VotingSystem = () => {
  const [votes, setVotes] = useState({
    teamA: { for: 0, against: 0 },
    teamB: { for: 0, against: 0 }
  });

  const [userVote, setUserVote] = useState({ team: null, type: null });

  const handleVote = (team, type) => {
    // Reverse vote if the same team and type is clicked again
    if (userVote.team === team && userVote.type === type) {
      setVotes((prevVotes) => ({
        ...prevVotes,
        [team]: {
          ...prevVotes[team],
          [type]: prevVotes[team][type] - 1,
        },
      }));
      setUserVote({ team: null, type: null });
    } else {
      // If user had a previous vote, reverse that first
      if (userVote.team) {
        setVotes((prevVotes) => ({
          ...prevVotes,
          [userVote.team]: {
            ...prevVotes[userVote.team],
            [userVote.type]: prevVotes[userVote.team][userVote.type] - 1,
          },
        }));
      }

      // Cast new vote
      setVotes((prevVotes) => ({
        ...prevVotes,
        [team]: {
          ...prevVotes[team],
          [type]: prevVotes[team][type] + 1,
        },
      }));
      setUserVote({ team, type });
    }
  };

  return (
    <div className="container has-text-centered">
      <h1 className="title is-2 mt-5">Vote for Your Team's Argument</h1>
      <div className="columns is-centered mt-6">
        <div className="column is-narrow">
          <h2 className="title is-4">Team A</h2>
          <button
            onClick={() => handleVote('teamA', 'for')}
            className={`button is-large ${userVote.team === 'teamA' && userVote.type === 'for' ? 'is-success' : 'is-primary'}`}
          >
            For
          </button>
          <button
            onClick={() => handleVote('teamA', 'against')}
            className={`button is-large ${userVote.team === 'teamA' && userVote.type === 'against' ? 'is-danger' : 'is-primary'}`}
          >
            Against
          </button>
        </div>
        <div className="column is-narrow">
          <h2 className="title is-4">Team B</h2>
          <button
            onClick={() => handleVote('teamB', 'for')}
            className={`button is-large ${userVote.team === 'teamB' && userVote.type === 'for' ? 'is-success' : 'is-primary'}`}
          >
            For
          </button>
          <button
            onClick={() => handleVote('teamB', 'against')}
            className={`button is-large ${userVote.team === 'teamB' && userVote.type === 'against' ? 'is-danger' : 'is-primary'}`}
          >
            Against
          </button>
        </div>
      </div>
      <div className="box mt-6">
        <p className="subtitle is-4">Team A: <strong>{votes.teamA.for}</strong> For | <strong>{votes.teamA.against}</strong> Against</p>
        <p className="subtitle is-4">Team B: <strong>{votes.teamB.for}</strong> For | <strong>{votes.teamB.against}</strong> Against</p>
      </div>
    </div>
  );
};

export default VotingSystem;
