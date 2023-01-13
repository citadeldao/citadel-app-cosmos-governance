import React, { useState, useEffect } from 'react';
import './components/styles/panels/index.css';
import GuidesPanel from './components/panels/GuidesPanel';
import ROUTES from './routes';
import ProposalsPanel from './components/panels/ProposalsPanel';
import ProposalDetailsPanel from './components/panels/ProposalDetailsPanel';
import TransactionsPanel from './components/panels/TransactionsPanel';
import TransactionsDetailsPanel from './components/panels/TransactionDetails';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { errorActions } from './store/actions';
import text from './text.json';
import { useNavigate } from 'react-router-dom';
import { prettyNumber } from './helpers/prettyNumber';
import {
    AddressSectionCard,
    StatusPopup,
    PopupWindow,
    TipCard,
    Alert,
    Panel,
    Modal,
    View,
} from '@citadeldao/apps-ui-kit/dist/main';
import InfoPanel from './components/panels/InfoPanel';
import { Config } from './components/config/config';
import SelectAddressPanel from './components/panels/SelectAddressPanel';
import SelectVotePanel from './components/panels/SelectVotePanel';

const MainView = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const showModal = useSelector(state => state.errors.openErrorModal);
    const { isLoading } = useSelector(state => state.proposals);
    const { validationErrors, errors } = useSelector(state => state.errors);
    const { activeWallet } = useSelector(state => state.wallet);
    const { borderRadius } = useSelector(state => state.panels)
    const [showSuccess, setShowSuccess] = useState(errors);
    let wallet = activeWallet;
    const config = new Config();

    useEffect(() => {
        setShowSuccess(errors);
    }, [errors]);

    const clearErrors = () => {
        setShowSuccess(false);
        dispatch(errorActions.clearErrors());
    };

    const handleClickAddress = () => {
        if (!isLoading) {
            navigate(ROUTES.SELECT_ADDRESS)
        }
    }

    if (activeWallet) {
      wallet = {...activeWallet,balance: prettyNumber(activeWallet?.balance)}
    }

    const showSelectAddress = !location.pathname.includes('/proposal')
        && !location.pathname.includes('/select_vote');
    
    return (
        <View>
            <Panel config={config} style={{borderRadius: `${borderRadius}px`}}>
                {showSelectAddress &&
                    <AddressSectionCard
                        onClick={handleClickAddress}
                        data={wallet}
                        id='/show'
                    />
                }
                <PopupWindow show={showSuccess} id="/show">
                    <StatusPopup text={errors?.text} type="error" showPopup={clearErrors} />
                </PopupWindow>
                <TransactionsPanel id={ROUTES.TRANSACTIONS} />
                <GuidesPanel id={ROUTES.INFO_MENU_GUIDE} />
                <SelectAddressPanel id={ROUTES.SELECT_ADDRESS} />
                <TransactionsDetailsPanel id={ROUTES.TRANSACTION_DETAILS} />
                <ProposalsPanel id={ROUTES.PROPOSALS} />
                <ProposalDetailsPanel id={ROUTES.PROPOSAL_DETAILS} />
                <SelectVotePanel id={ROUTES.SELECT_VOTE} />
                <Modal
                    title={<Alert title={text.ADDRESS_ERROR_HEADER} iconColor="#00B2FE" boldText/>}
                    description={text.ADDRESS_ERROR_DESCRIPTION}
                    id={ROUTES.PROPOSALS}
                    show={showModal}
                    borderRadius={borderRadius}
                    canClose={false}
                >
                    <TipCard text={text.ADDRESS_ERROR_TIP}/>
                </Modal>
            </Panel>
            <InfoPanel config={config} />
        </View>
    );
};

export default MainView;