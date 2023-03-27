import { utils } from '@citadeldao/apps-sdk';

const getWalletBalance = (data) => {
    return new utils.Request(
        'get',
        `${process.env.REACT_APP_BACKEND_URL}/${data.network}/${data.address}/wallets/balance`,
        {
            params: {
                token: data.token,
            },
        },
    );
};

const prepareBaseTransfer = (data) => {
    return new utils.Request(
        'post',
        `${process.env.REACT_APP_BACKEND_URL}/${data.network}/${data.from}/prepareCustomTransaction`,
        {
            data: data.transaction,
        },
    );
};

const getStakeNodes = (net) => {
    return new utils.Request(
        'get',
        `${process.env.REACT_APP_MAIN_SERVER_URL}/staking-node`,
        {
            params: {
                net,
                version: '1.0.4',
            },
        },
    );
};
const getStakeList = (net, address, config) => {
    return new utils.Request(
        'get',
        `${process.env.REACT_APP_BACKEND_URL_2}/blockchain/${net}/${address}/stake-list`,
        config,
    );
};

const getNetworks = () => {
    return new utils.Request('get',
        process.env.REACT_APP_MAIN_SERVER_URL + '/networks.json');
};

const getWallets = (token) => {
    return new utils.Request(
        'get',
        `${process.env.REACT_APP_BACKEND_URL}/configs/wallets`,
        {
            params: { token },
        });
};

export const wallet = {
    getWalletBalance,
    prepareBaseTransfer,
    getStakeNodes,
    getStakeList,
    getNetworks,
    getWallets,
};