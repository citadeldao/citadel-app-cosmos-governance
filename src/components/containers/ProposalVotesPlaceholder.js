import React from 'react';
import { ReactComponent as Placeholder } from '../../assets/votes-placeholder.svg';
import '../styles/containers/proposal-vote-placeholder.css'

const ProposalVotesPlaceholder = () => {
    return (
        <div className='proposal-vote-placeholder'>
            <Placeholder/>
            <h2 className='proposal-vote-placeholder__header'>
                You haven’t voted yet
            </h2>
            <p className='proposal-vote-placeholder__text'>
                You voting history will appear here once you cast your vote.
            </p>
        </div>
    );
};

export default ProposalVotesPlaceholder;