import { types } from '../actions/types';

const initialState = {
    currentProposal: {},
    selectedVote: '',
    validatorsVotes: [],
};

export default function ProposalReducer(state = initialState, action) {
    switch (action.type) {
        case types.SET_CURRENT_PROPOSAL:
            return {
                ...state,
                currentProposal: action.payload,
            };
    case types.SET_SELECTED_VOTE:
            return {
                ...state,
                selectedVote: action.payload,
            };
    case types.SET_PROPOSAL_VALIDATORS_VOTES:
            return {
                ...state,
                validatorsVotes: action.payload,
            };

        default:
            return state;
    }
}