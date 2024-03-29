import { utils } from '@citadeldao/apps-sdk';

const getTransactions = (data) => {
    return new utils.Request('get',
        `${process.env.REACT_APP_BACKEND_URL}/transactions/${data.net}/${data.address}`,
        {
            params: {
                token: data.auth_token,
                version: 'v2',
                limit: 10,
                offset: data.offset,
            },
        },
    );
};

export const transactions = {
    getTransactions,
};
