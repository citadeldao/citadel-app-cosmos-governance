import React, { useState } from 'react';
import { AddressBlock, Content, Header, Input } from '@citadeldao/apps-ui-kit/dist/main';
import { useSelector, useDispatch } from 'react-redux';
import { walletActions } from '../../store/actions';
import { useNavigate } from 'react-router-dom';
import { prettyNumber } from '../helpers/numberFormatter';

const SelectAddressPanel = () => {
    const { wallets, activeWallet } = useSelector((state) => state.wallet);
    const [walletList, setWalletList] = useState(wallets);
    const previousPanel = useSelector(state => state.panels.previousPanel);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const back = () => navigate(previousPanel);
    const searchWallet = (wallet) => {
        let arr = wallets.filter((item) =>
            item.code.substr(0, wallet.length).toLowerCase() === wallet.toLowerCase()
                || item.name.substr(0, wallet.length).toLowerCase() === wallet.toLowerCase()
                || item.address.substr(0, wallet.length).toLowerCase() === wallet.toLowerCase(),
        );

        setWalletList(arr);

        if (wallet.length < 1) {
            setWalletList(wallets);
        }
    };

    const isWalletActive = (wallet, activeWallet) => {
        return activeWallet?.network === wallet.network
            && activeWallet?.address === wallet?.address;
    };

    const setActiveWallet = (wallet) => {
        if (!isWalletActive(activeWallet, wallet)) {
            dispatch(walletActions.setActiveWallet(wallet));
        }

        back();
    };

    return (
        <div className="panel">
            <Content>
                <Header
                    border
                    title="Select an address"
                    style={{ margin: '8px 0 16px 0' }}
                    back={true}
                    onClick={() => back()}
                />
                <Input
                    type="search"
                    style={{ marginBottom: '10px' }}
                    placeholder="Start typing.."
                    onChange={searchWallet}
                />
                {walletList?.map((wallet, i) => (
                    <AddressBlock
                        key={i}
                        active={isWalletActive(activeWallet, wallet)}
                        style={{ marginBottom: '10px' }}
                        data={{ ...wallet, balance: prettyNumber(wallet?.balance) }}
                        onClick={() => setActiveWallet(wallet)}
                    />
                ))}
            </Content>
        </div>
    );
};

export default SelectAddressPanel;