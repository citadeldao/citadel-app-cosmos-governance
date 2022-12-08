import React, { useEffect } from 'react';
import {
    Content,
    Header,
    Tabbar,
    Loader,
    ProposalCard,
    Pagination,
} from '@citadeldao/apps-ui-kit/dist/main';
import { Config } from '../config/config';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { appActions, proposalsActions, proposalActions, walletActions } from '../../store/actions';
import '../styles/panels/proposals.css';
import ROUTES from '../../routes';
import { getProposalDateString } from '../helpers/dateFormatter';

import '../styles/helpers.css';

const ProposalsPanel = () => {
    const config = new Config();
    const { activeWallet, wallets } = useSelector((state) => state.wallet);
    const { proposals, pagination, isLoading } = useSelector((state) => state.proposals);
    const { bottomInset } = useSelector(state => state.panels)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (wallets.length && !activeWallet) {
            dispatch(walletActions.setActiveWallet(wallets[0]));
            dispatch(appActions.getValidators());
        }
        // eslint-disable-next-line 
    }, [wallets]);

    const fetchProposals = async (page = 1) => {
        await dispatch(proposalsActions.getProposals(page));
        await dispatch(proposalsActions.getProposalsVotes());
        dispatch(proposalsActions.setLoader(false));
    };

    const goToProposal = (proposal) => {
        dispatch(proposalActions.setCurrentProposal(proposal));
        navigate(ROUTES.PROPOSAL_DETAILS);
    };

    const getDate = (proposal) => {
        return getProposalDateString(
            proposal.status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD'
                ? proposal.depositEnd
                : proposal.votingEnd,
            proposal.status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD'
                ? null
                : proposal.votingStart,
        );
    }

    return (
        <div className="panel">
            <Header config={config}/>
            <Content>
                {isLoading
                    ? <Loader/>
                    : <>
                        {proposals.map(proposal => (
                            <ProposalCard
                                key={proposal.id}
                                network={activeWallet.network}
                                id={proposal.id}
                                title={proposal.title}
                                status={proposal.status}
                                date={getDate(proposal)}
                                votes={proposal.votes}
                                userVote={proposal.userVote}
                                onClick={() => goToProposal(proposal)}
                            />
                        ))}
                        {!!proposals.length &&
                            <Pagination
                                current={pagination.page}
                                items={pagination.total}
                                limit={pagination.limit}
                                onChange={fetchProposals}
                            />
                        }
                    </>
                }
            </Content>
            <Tabbar config={config} bottomInset={bottomInset}/>
        </div>
    );
};

export default ProposalsPanel;