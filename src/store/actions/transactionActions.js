import { types } from './types';
import { walletActions, errorActions } from '.';

const setOpenedTransaction = (flag) => ({
    type: types.SET_OPENED_TRANSACTION,
    payload: flag,
});

const loadTransactions = (page = 1) => async (dispatch, getState) => {
    dispatch({
        type: types.SET_TRANSACTIONS_LOADED,
        payload: false,
    });
    dispatch({
        type: types.SET_TRANSACTIONS_PAGE,
        payload: page,
    });
    dispatch({
        type: types.SET_TRANSACTIONS_LIST,
        payload: [],
    });
    const { activeWallet } = getState().wallet;
    const { auth_token } = getState().user;

    if (activeWallet) {
        const wallet = walletActions.getWalletConstructor(activeWallet);
        wallet.getTransactions(page, auth_token).then(response => {
            dispatch({
                type: types.SET_TRANSACTIONS_LIST,
                payload: response?.data,
            });
            dispatch({
                type: types.SET_TRANSACTIONS_LOADED,
                payload: true,
            });
        }).catch(e => {
            dispatch(errorActions.checkErrors(e));
        });
    }
};

export const transactionActions = {
    setOpenedTransaction,
    loadTransactions,
};