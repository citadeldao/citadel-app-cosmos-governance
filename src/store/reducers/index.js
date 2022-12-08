import { combineReducers } from 'redux';
import TransactionsReducer from './transactionsReducer';
import UserReducer from './userReducer';
import ErrorReducer from './errorsReducer';
import WalletReducer from './walletReducer';
import PanelReducer from './panelReducer';
import ProposalsReducer from './proposalsReducer';
import ProposalReducer from './proposalReducer';
import appReducer from './appReducer';

export const state = combineReducers({
    transaction: TransactionsReducer,
    user: UserReducer,
    errors: ErrorReducer,
    wallet: WalletReducer,
    panels: PanelReducer,
    proposals: ProposalsReducer,
    proposal: ProposalReducer,
    app: appReducer,
});