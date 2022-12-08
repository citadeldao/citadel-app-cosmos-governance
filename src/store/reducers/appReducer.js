import { types } from '../actions/types';

const initialState = {
    currentWallet: null,
    netSDK: null,
};

export default function AppReducer(state = initialState, action) {
    switch (action.type) {
        case types.SET_CURRENT_WALLET:
            return {
                ...state,
                currentWallet: action.payload,
            };
        case types.SET_NET_SDK:
            return {
                ...state,
                netSDK: action.payload,
            };
        case types.SET_VALIDATORS:
            return {
                ...state,
                validators: action.payload,
            };
        default:
            return state;
    }
}