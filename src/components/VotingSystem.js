"use client";

import { useState, useEffect } from 'react';

const VotingSystem = () => {
  const [votes, setVotes] = useState({ for: 0, against: 0 });
  const [userVote, setUserVote] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const updatedVotes = JSON.parse(event.data);
      setVotes(updatedVotes);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleVote = (type) => {
    if (userVote === type) {
      setUserVote(null);
    } else {
      setUserVote(type);
    }

    const ws = new WebSocket('ws://localhost:8080');
    ws.onopen = () => {
      ws.send(JSON.stringify({ type }));
    };
  };

  return (
    <div className="container has-text-centered">
      <h1 className="title is-2 mt-5">Vote for the Argument</h1>
      <div className="columns is-centered mt-6">
        <div className="column is-narrow">
          <button
            onClick={() => handleVote('for')}
            className={`button is-large ${userVote === 'for' ? 'is-success' : 'is-primary'} mr-4`}
            style={{ marginRight: '20px', backgroundColor: userVote === 'for' ? '#48c774' : '#7a7a7a' }}
          >
            For
          </button>
          <button
            onClick={() => handleVote('against')}
            className={`button is-large ${userVote === 'against' ? 'is-danger' : 'is-primary'}`}
            style={{ marginLeft: '20px', backgroundColor: userVote === 'against' ? '#f14668' : '#7a7a7a' }}
          >
            Against
          </button>
        </div>
      </div>
      <div className="box mt-6">
        <p className="subtitle is-4">
          <strong>{votes.for}</strong> For | <strong>{votes.against}</strong> Against
        </p>
      </div>
    </div>
  );
};

export default VotingSystem;
