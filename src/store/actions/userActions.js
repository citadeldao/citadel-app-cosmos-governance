import { types } from './types';
import { store } from '../store';
import { getRequest } from '../../networking/requests/getRequest';
import { utils } from '@citadeldao/apps-sdk';
import { errorActions } from './errorsActions';

const requestManager = new utils.RequestManager();
const userRequest = getRequest('user');

const setAuthToken = (token) => ({
    type: types.SET_OPENED_TRANSACTION,
    payload: token,
});

const loadSocketToken = () => (dispatch) => {
    try {
        requestManager.send(userRequest.getSocketToken()).then((res) => {
            dispatch({
                type: types.SET_SOCKET_TOKEN,
                payload: res.data?.data,
            });
        });
    } catch (e) {
        store.dispatch(errorActions.checkErrors(e));
    }
};

const loadUserConfig = async () => {
    const { auth_token } = store.getState().user;
    try {
        let result = await requestManager.send(userRequest.getUserConfig(auth_token));

        store.dispatch({
            type: types.SET_USER_CONFIG,
            payload: result.data || JSON.parse(result.data),
        });
        return result.data || JSON.parse(result.data);
    } catch (error) {
        store.dispatch(errorActions.checkErrors(error));
        return null;
    }
};

const setUserConfig = (config = null) => {
    const { auth_token } = store.getState().user;
    const data = { data: { config } };

    try {
        requestManager.send(userRequest.setUserConfig(auth_token, data));
    } catch (error) {
        store.dispatch(errorActions.checkErrors(error));
    }
};

export const usersActions = {
    setAuthToken,
    loadSocketToken,
    loadUserConfig,
    setUserConfig,
};