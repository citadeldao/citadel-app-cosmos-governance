import { types } from '../actions/types';

const initialPagination = {
    page: 1,
    total: 0,
    limit: 10,
    reverse: true,
}

const initialState = {
    isLoading: false,
    proposals: [],
    pagination: { ...initialPagination },
    currentProposal: {},
};
export default function ProposalsReducer(state = initialState, action) {
    switch (action.type) {
        case types.SET_PROPOSALS_LOADER:
            return {
                ...state,
                isLoading: action.payload,
            };

        case types.SET_PROPOSALS:
            return {
                ...state,
                proposals: action.payload,
            };

        case types.SET_PROPOSALS_PAGINATION:
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    ...action.payload,
                },
            };

        case types.CLEAR_PROPOSALS_PAGINATION:
            return {
                ...state,
                pagination: { ...initialPagination },
            };

        case types.SET_CURRENT_PROPOSAL:
            return {
                ...state,
                currentProposal: action.payload,
            };

        default:
            return state;
    }
}