import { Cosmos, utils, constants } from '@citadeldao/apps-sdk';
import { types } from './types';
import { errorActions } from './errorsActions';
import {
    VOTE_OPTIONS,
    PROPOSAL_STATUSES,
    VOTE_COLORS,
    PROPOSAL_TYPES_TEXTS,
} from '../../const';

const { RequestManager, CosmosRequest } = utils;

export const setLoader = (status) => (dispatch) => {
    dispatch({
        type: types.SET_PROPOSALS_LOADER,
        payload: status,
    });
};

export const getProposals = (page) => async (dispatch, getState) => {
    dispatch(setLoader(true));

    const { pagination } = getState().proposals;
    const { activeWallet } = getState().wallet;
    const cosmos = new Cosmos.Cosmos(activeWallet.network);
    const requestManager = new RequestManager();
    let proposals = [];

    await requestManager.init(constants.MODULES.cosmos, activeWallet.network);
    await cosmos.init();

    // get proposals
    await cosmos.getProposals({
        timeout: 10000,
        params: {
            'pagination.limit': pagination.limit,
            'pagination.offset': (page - 1) * pagination.limit,
            'pagination.reverse': pagination.reverse,
            'pagination.count_total': true,
        },
    })
        .then((data) => {
            proposals = data.proposals;
            dispatch({
                type: types.SET_PROPOSALS_PAGINATION,
                payload: data.pagination,
            });
        })
        .catch((error) => {
            dispatch(errorActions.checkErrors(error));
        });


    const proposalsVotingPeriod = proposals
        .filter(proposal => proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD');

    // get tally results for status VOTING_PERIOD proposals (default are empty)
    const voteResults = proposalsVotingPeriod.map(proposal => {
        return cosmos.call('gov', `/proposals/${proposal.proposal_id}/tally`, {
            timeout: 5000,
            attempts: 10,
        });
    });

    // get tallies and user votes
    await Promise.all(voteResults)
        .then(responses => {
            proposalsVotingPeriod.forEach(({ proposal_id }, index) => {
                const proposalIndex = proposals.findIndex(p => p.proposal_id === proposal_id);
                const newProposal = proposals[proposalIndex];

                newProposal.final_tally_result = responses[index].tally;
                proposals.splice(proposalIndex, 1, newProposal);
            });
        })
        .catch((error) => {
            dispatch(errorActions.checkErrors(error));
        });


    // prepare and set finally data
    const convertedData = dataConverter(proposals, getState);

    dispatch({
        type: types.SET_PROPOSALS,
        payload: convertedData,
    });

    dispatch({
        type: types.SET_PROPOSALS_PAGINATION,
        payload: {
            page,
        },
    });
};

export const getProposalsVotes = () => async (dispatch, getState) => {
    const { netSDK } = getState().app;
    const { activeWallet } = getState().wallet;
    const { proposals } = getState().proposals;
    const requestManager = new RequestManager();
    let userVotes = [];

    const proposalsVotingPeriodIDs = proposals
        .filter(proposal => proposal.status === 'PROPOSAL_STATUS_VOTING_PERIOD')
        .map(prop => prop.id);

    // get user votes
    const userVotesQueries = proposals.map(proposal => {
        const id = proposal.id;

        return proposalsVotingPeriodIDs.includes(id)
            ? netSDK.call('gov', `/proposals/${id}/votes/${activeWallet.address}`)
            // old api
            : requestManager.send(new CosmosRequest(
                'get',
                activeWallet.network,
                `/gov/proposals/${id}/votes/${activeWallet.address}`, {
                    timeout: 5000,
                },
            ));
    })
    .reduce((acc, q) => acc.concat(q), []);

    await Promise.allSettled(userVotesQueries)
        .then((responses) => {
            userVotes = responses
                .filter(res => res.status === 'fulfilled')
                .map(vote => vote.value.vote || vote.value.result);
        })
        .catch((error) => {
            dispatch(errorActions.checkErrors(error));
        });

    // set votes for proposals
    const proposalsWithVotes = proposals.map((proposal) => {
        let userVote = userVotes.find(vote => vote.proposal_id === proposal.id);

        delete proposal.userVote;

        return userVote
            ? {
                ...proposal,
                userVote: {
                    option: userVote.options[0].option,
                    voter: userVote.voter.toLowerCase(),
                    vote: VOTE_OPTIONS[userVote.options[0].option],
                    color: VOTE_COLORS[userVote.options[0].option],
                },
            }
            : proposal;
    });

    dispatch({
        type: types.SET_PROPOSALS,
        payload: proposalsWithVotes,
    });
}

const dataConverter = (data, getState) => {
    const { netSDK } = getState().app;

    return data.map((proposal) => {
        const total = Object
            .values(proposal.final_tally_result)
            .reduce((acc, votes) => acc + Number(votes), 0);
        const votes = Object
            .entries(proposal.final_tally_result)
            .map(([key, value]) => ({
                option: VOTE_OPTIONS[`VOTE_OPTION_${key.toUpperCase()}`],
                votes: netSDK.getAmountByDenom(value),
                percent: ((value / total) * 100).toFixed(2),
                color: VOTE_COLORS[`VOTE_OPTION_${key.toUpperCase()}`],
            }))
            .sort((a, b) => b.votes - a.votes);
        const type = proposal.content['@type'].split('.').at(-1);

        return {
            id: proposal.proposal_id,
            type,
            typeText: PROPOSAL_TYPES_TEXTS[type],
            title: proposal.content.title,
            description: proposal.content.description,
            status: proposal.status,
            statusText: PROPOSAL_STATUSES[proposal.status],
            content: proposal.content,
            votes,
            total_deposit: proposal.total_deposit,
            votingStart: proposal.voting_end_time,
            votingEnd: proposal.voting_start_time,
            depositEnd: proposal.deposit_end_time,
        };
    });
};

export const proposalsActions = {
    getProposals,
    getProposalsVotes,
    setLoader,
};