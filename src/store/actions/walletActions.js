import { types } from './types';
import { WalletList } from '../../networking/models/WalletList';
import { ValidationError } from '../../networking/models/Errors';
import { appActions, errorActions, proposalsActions, usersActions } from './index';
import { store } from '../store';
import models from '../../networking/models';
import Wallet from '../../networking/models/Wallet';


const getWalletConstructor = (address) => {
    try {
        const { activeWallet } = store.getState().wallet;
        const currentWallet = address || activeWallet;
        const WalletConstructor = models[currentWallet.network.toUpperCase()];

        if (WalletConstructor) {
            return new WalletConstructor(currentWallet);
        }

        return new Wallet(currentWallet);
    } catch {
        new Error('Wallet doesn\'t exists ');
    }
};

const loadWalletWithBalances = () => async (dispatch) => {
    const walletList = new WalletList();
    walletList.loadWalletsWithBalances().then(wallets => {
        if (wallets instanceof ValidationError) {
            dispatch(errorActions.checkErrors(wallets));
            stopSplashLoader();
            return;
        }
        dispatch({
            type: types.SET_WALLETS,
            payload: wallets,
        });
        usersActions.loadUserConfig().then(user_configs => {
            let flag = false;
            wallets?.forEach((item) => {
                if (item.address === user_configs?.lastWalletInfo?.address) {
                    flag = true;
                    setTimeout(() => {
                        dispatch(setActiveWallet(item));
                    }, 1000);
                }
            });
            if (!flag) {
                dispatch(setActiveWallet(wallets[0]));
            }
            setTimeout(() => {
                stopSplashLoader();
            }, 1000);
        }).catch(() => {
            dispatch(setActiveWallet(wallets[0]));
            setTimeout(() => {
                stopSplashLoader();
            }, 1000);
        });
    });
};

const stopSplashLoader = () => {
    setTimeout(() => {
        document.getElementById('root').style.display = 'block';
        document.getElementById('splash').style.display = 'none';
    }, 3000);
};

const setActiveWallet = (wallet) => async (dispatch, getState) => {
    const { activeWallet } = getState().wallet;
    const isNetworkChanged = activeWallet?.network !== wallet.network
    const config = {
        lastWalletInfo: {
            address: wallet.address,
            network: wallet.network,
        },
    };

    dispatch(proposalsActions.setLoader(true));

    dispatch({
        type: types.SET_ACTIVE_WALLET,
        payload: wallet,
    });

    usersActions.setUserConfig(config);
    // get votes for selected address

    if (isNetworkChanged) {
        await dispatch(appActions.setNetSDK(wallet.network));
        await dispatch(proposalsActions.getProposals(1));
    }

    await dispatch(proposalsActions.getProposalsVotes());
    dispatch(proposalsActions.setLoader(false));
};


const updateWalletList = async(wallet) => {
    let { wallets, activeWallet, networks } = store.getState().wallet
    let metaMaskWallet = wallets && wallets.find(elem => elem.from === 'metamask')
    if(metaMaskWallet){
        let updateActiveWallet = false
        if(metaMaskWallet.network === wallet.net && wallet.address){
            if(metaMaskWallet.address === activeWallet.address){
                updateActiveWallet = true
            }
            metaMaskWallet.address = wallet.address
            const walletInstance = getWalletConstructor(metaMaskWallet)
            const response = await walletInstance.getWalletBalance()
            metaMaskWallet.balance = response.data.mainBalance
            if(updateActiveWallet){
                store.dispatch(setActiveWallet(metaMaskWallet))
            }
        }else{
            wallets = wallets.filter(elem => elem.from !== 'metamask')
            if(wallets.length === 0){
                store.dispatch(setActiveWallet(null))
                store.dispatch(errorActions.checkErrors(new ValidationError())) 
            }
        }
    }else{
        const walletList = new WalletList()
        wallet.network = wallet.net
        wallet.name = networks[wallet?.net]?.name
        wallet.code = networks[wallet?.net]?.code
        wallet.decimals = networks[wallet?.net]?.decimals
        wallet.from = 'metamask'
        wallet.getTxUrl = walletList.getTxUrl(wallet?.net)
        const walletInstance = getWalletConstructor(wallet)
        const response = await walletInstance.getWalletBalance()
        wallet.balance = response.data.mainBalance
        wallets = wallets.concat([wallet])
        if(!activeWallet){
            store.dispatch(setActiveWallet(wallet))
        }
        store.dispatch(errorActions.clearErrors())
    }
    store.dispatch({
        type: types.SET_WALLETS,
        payload: wallets
    })
}

export const walletActions = {
    getWalletConstructor,
    loadWalletWithBalances,
    stopSplashLoader,
    updateWalletList,
    setActiveWallet,
};