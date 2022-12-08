import { utils } from '@citadeldao/apps-sdk';

const sendCustomMessage = (params) => {
    const request = new utils.Request('post', process.env.REACT_APP_BACKEND_URL + `/customMsg`, {
        data: params.data,
        params: {
            token: params.token,
        },
    });

    return request;
};

export const socket = {
    sendCustomMessage,
};
