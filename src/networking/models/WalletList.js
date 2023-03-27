import { ValidationError } from './Errors';
import { errorActions, walletActions } from '../../store/actions';
import { utils } from '@citadeldao/apps-sdk';
import { store } from '../../store/store';
import { getRequest } from '../requests/getRequest.js';

const { getWallets, getNetworks } = getRequest('wallet');
const { RequestManager } = utils;

const rm = new RequestManager();

export class WalletList {
    getTxUrl(net) {
        if (net === 'eth') {
            return (txHash) => `https://etherscan.io/tx/${txHash}`;
        } else if (net === 'bsc') {
            return (txHash) => `https://bscscan.com/tx/${txHash}`;
        } else if (net === 'orai') {
            return (txHash) => `https://scan.orai.io/txs/${txHash}`;
        } else if (net === 'cheqd') {
            return (txHash) => `https://explorer.cheqd.io/transactions/${txHash}`;
        } else {
            return (txHash) => `https://www.mintscan.io/${net}/txs/${txHash}`;
        }
    }

    async getWallets() {
        const { auth_token } = store.getState().user;

        try {
            const { data: wallets } = await rm.send(getWallets(auth_token));
            const networks = await rm.send(getNetworks(auth_token));

            // eslint-disable-next-line
            return wallets.length
                ? wallets.map(item => ({
                    address: item?.address,
                    network: item.net,
                    name: networks[item.net]?.name,
                    code: networks[item.net]?.code,
                    decimals: networks[item.net]?.decimals,
                    publicKey: item.publicKey,
                }))
                : new ValidationError();
        } catch (e) {
            return new ValidationError(e);
        }
    }

    async loadWalletsWithBalances() {
        const wallets = await this.getWallets();
        if (wallets instanceof ValidationError) {
            return wallets;
        }
        try {
            if (wallets.length > 0) {
                wallets.forEach(async (item) => {
                    const wallet = walletActions.getWalletConstructor(item);

                    if (wallet) {
                        let response = await wallet.getWalletBalance();
                        if (response.ok) {
                            item.balance = response.data.mainBalance;
                        } else {
                            response = await wallet.getWalletBalance();
                            item.balance = response?.data?.mainBalance;
                        }
                    }
                });
            }
        } catch (e) {
            store.dispatch(errorActions.checkErrors(e));
        }
        return wallets;
    }

}

