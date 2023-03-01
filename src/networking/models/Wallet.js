import { getRequest } from '../requests/getRequest';
import { ImplementationError } from './Errors';
import { store } from '../../store/store';
import * as Sentry from '@sentry/react';
import { utils } from '@citadeldao/apps-sdk';
import { errorActions } from '../../store/actions';

const walletRequest = getRequest('wallet');
const transactionsRequest = getRequest('transactions');
const requestManager = new utils.RequestManager();

export default class Wallet {
    constructor(opts) {
        this.net = opts.network;
        this.name = opts.name;
        this.code = opts.code;
        this.address = opts.address;
        this.publicKey = opts.publicKey;
        this.from = opts.from
    }

    async prepareTransfer(params) {
        const { auth_token } = store.getState().user;

        try {
            const data = await requestManager.send(walletRequest.prepareBaseTransfer({
                network: this.net,
                from: this.address,
                transaction: { ...params, token: auth_token, publicKey: this.publicKey },
            }));

            if (data.ok) {
                return data;
            }
        } catch (e) {
            store.dispatch(errorActions.checkErrors(e.response?.data?.error));
            Sentry.captureException(e.response?.data?.error);

            return new Error(e.response?.data?.error);
        }
    }

    async getTransactions(page, auth_token) {
        const params = {
            auth_token,
            address: this.address,
            net: this.net,
            offset: page - 1,
        };

        try {
            const data = await requestManager.send(transactionsRequest.getTransactions(params));

            if (data.ok) {
                return data;
            }
        } catch (e) {
            store.dispatch(errorActions.checkErrors(e.response?.data?.error));
            Sentry.captureException(e.response?.data?.error);
            return new Error(e.response?.data?.error);
        }
    }

    prepareClaimRewards() {
        return new ImplementationError('Method not implemented!');
    }

    async getWalletBalance() {
        const { auth_token } = store.getState().user;

        try {
            const data = await requestManager.send(walletRequest.getWalletBalance({
                network: this.net,
                address: this.address,
                token: auth_token,
            }));
            if (data?.ok) {
                return data;
            }
        } catch (e) {
            store.dispatch(errorActions.checkErrors(e));
            return null;
        }
    }
}