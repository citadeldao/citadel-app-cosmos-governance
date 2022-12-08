import React, { useEffect, useState } from 'react';
import {
    Button,
    Content,
    Header,
    Radio,
    FormGroup,
} from '@citadeldao/apps-ui-kit';
import { VOTE_OPTIONS } from '../../const';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../routes';

import { proposalActions } from '../../store/actions';

const SelectVotePanel = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const back = () => navigate(ROUTES.PROPOSAL_DETAILS);
    const { currentProposal: proposal } = useSelector((state) => state.proposals);
    const [selectedVote, setSelectedVote] = useState('');

    useEffect(() => {
        selectedVote && dispatch(proposalActions.setSelectedVoteOption(selectedVote));
        // eslint-disable-next-line 
    }, [selectedVote]);

    const handleSelectVote = async () => {
        await dispatch(proposalActions.prepareVoteTx());
        navigate(ROUTES.PROPOSAL_DETAILS);
    };

    return (
        <div className="panel">

            <Content>
                <Header
                    border
                    title={`Proposal #${proposal.id} select vote option`}
                    style={{ margin: '8px 0 16px 0' }}
                    back={true}
                    onClick={() => back()}
                />
                <div className="select-vote-modal">
                    <main className="select-vote-modal__content">
                        <div className="select-vote-modal__description">
                            {proposal.title}
                        </div>
                        {Object.values(VOTE_OPTIONS).map((option) => (
                            <FormGroup key={option}>
                                <Radio
                                    value={option}
                                    selected={selectedVote}
                                    onChange={setSelectedVote}
                                >{option}</Radio>
                            </FormGroup>
                        ))}
                    </main>
                    <footer className="select-vote-modal__footer">
                        <Button
                            style={{
                                minWidth: 'auto',
                                display: 'inline-flex',
                            }}
                            disabled={!selectedVote}
                            onClick={handleSelectVote}
                        >Vote</Button>
                    </footer>
                </div>
            </Content>
        </div>
    );
};

export default SelectVotePanel;