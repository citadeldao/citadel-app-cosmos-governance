import { types } from './types';
import { Cosmos, utils } from '@citadeldao/apps-sdk';
import { getRequest } from '../../networking/requests/getRequest';

const { RequestManager } = utils;

const setNetSDK = (network) => async (dispatch) => {
    const sdk = new Cosmos.Cosmos(network);

    await sdk.init();

    dispatch({
        type: types.SET_NET_SDK,
        payload: sdk,
    });
};

const getValidators = () => async (dispatch, getState) => {
    const walletRequest = getRequest('wallet');
    const validators = [];
    const requestManager = new RequestManager();
    const { wallets } = getState().wallet;

    const networks = wallets && wallets.reduce((acc, wallet) => {
        return !acc.some(w => w === wallet.network)
            ? [
                ...acc,
                wallet.network,
            ]
            : acc;
    }, []);

    // get list of validators for each net
    const stakingNodeQueries = networks.map(net => requestManager.send(
        walletRequest.getStakeNodes(net),
    ));

    await Promise.all(stakingNodeQueries)
        .then((responses) => {
            responses.forEach(({ data }, index) => {
                validators[networks[index]] = data[networks[index]]
            });
        });

    // set validators for each wallet
    const validatorsQueries = wallets.map(w => (
        requestManager.send(walletRequest.getStakeList(w.network, w.address))
    ));

    await Promise.all(validatorsQueries)
        .then((responses) => {
            const nodes = responses.reduce((acc, response, index) => {
                const net = wallets[index].network;
                const nodeList = response.data.reduce((nodeAcc, node) => {
                    const hasInAcc = acc.hasOwnProperty(net)
                        && acc[net].find(n => n.address === node.current);

                    return hasInAcc
                        ? nodeAcc
                        : [
                            ...nodeAcc,
                            (validators[net].find(v => v.address === node.current) || node),
                        ];
                }, []);

                const nodes = acc.hasOwnProperty(net)
                    ? [...acc[net], ...nodeList]
                    : [...nodeList];

                return {
                    ...acc,
                    [net]: nodes.sort((a, b) => {
                        const hasInA = a.tags.some(t => t.name === 'Recommended');
                        const hasInB = b.tags.some(t => t.name === 'Recommended');

                        return (hasInA === hasInB)
                            ? 0
                            : hasInA ? -1 : 1;
                    }),
                };
            }, {});

            dispatch({
                type: types.SET_VALIDATORS,
                payload: nodes,
            });
        });
};

export const appActions = {
    setNetSDK,
    getValidators,
};