import { Cosmos } from '@citadeldao/apps-sdk';
import { getDelegatorFromValidator } from '../../components/helpers/addressFormatter';
import { types } from './types';
import { VOTE_OPTIONS, VOTE_OPTIONS_NUMBERS } from '../../const';
import { store } from '../store';
import { errorActions } from '../actions';

export const setCurrentProposal = (proposal) => (dispatch) => {
    dispatch({
        type: types.SET_CURRENT_PROPOSAL,
        payload: proposal,
    });
};

export const getProposalValidatorsVotes = (proposalId) => async (dispatch, getState) => {
    const { netSDK, validators } = getState().app;
    const { activeWallet } = getState().wallet;

    const queries = (validators[activeWallet.network] || [])
        .map((validator) => {
            const delegatorAddress = getDelegatorFromValidator(
                validator.address,
                netSDK.config.bech32_prefix,
            );

            return netSDK.getProposalVotesByVoter(proposalId, delegatorAddress);
    });

    Promise.allSettled(queries).then((responses) => {
        const validatorsVotes = responses
            .map(((res, index) => ({
                ...res,
                value: {
                    ...res.value,
                    validatorAddress: validators[activeWallet.network][index].address,
                },
            })))
            .filter(res => res.status === 'fulfilled')
            .map(res => res.value);

        dispatch({
            type: types.SET_PROPOSAL_VALIDATORS_VOTES,
            payload: validatorsVotes
        });
    });
};

export const setSelectedVoteOption = (vote) => async (dispatch) => {
    const voteOption = Object
        .entries(VOTE_OPTIONS)
        .filter(([, value]) => value === vote)
        [0][0];

    dispatch({
        type: types.SET_SELECTED_VOTE,
        payload: voteOption,
    });
};

export const prepareVoteTx = () => async (dispatch, getState) => {
    const { currentProposal, selectedVote } = getState().proposal;
    const { activeWallet } = getState().wallet;
    const { auth_token } = store.getState().user;

    const cosmos = new Cosmos.Cosmos();

    await cosmos.init({
        ...activeWallet,
        net: activeWallet.network,
        authToken: auth_token,
    });

    try {
        await cosmos.prepareVoteTransaction(currentProposal.id, VOTE_OPTIONS_NUMBERS[selectedVote].toString())
    } catch (e) {
        dispatch(errorActions.setCustomErrors({ text: e.response.data.error.message }));
    }
};

export const clearProposal = () => (dispatch) => {
    dispatch({
        type: types.SET_CURRENT_PROPOSAL,
        payload: {},
    });
    dispatch({
        type: types.SET_SELECTED_VOTE,
        payload: '',
    });
    dispatch({
        type: types.SET_PROPOSAL_VALIDATORS_VOTES,
        payload: [],
    });
}

export const proposalActions = {
    setCurrentProposal,
    getProposalValidatorsVotes,
    setSelectedVoteOption,
    prepareVoteTx,
    clearProposal,
}