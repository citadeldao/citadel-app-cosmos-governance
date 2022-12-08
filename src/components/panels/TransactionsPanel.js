import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { TransactionCard, Loader, Content, Tabbar } from '@citadeldao/apps-ui-kit/dist/main';
import text from '../../text.json';
import { transactionActions, panelActions } from '../../store/actions';
import ROUTES from '../../routes';
import { Config } from '../config/config';

const TransactionsPanel = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const config = new Config();
    const { activeWallet } = useSelector((state) => state.wallet);
    const { transactions, transactionsLoaded: loader } = useSelector((state) => state.transaction);
    const { bottomInset } = useSelector(state => state.panels)

    useEffect(() => {
        dispatch(transactionActions.loadTransactions());
        dispatch(panelActions.setPreviousPanel(location.pathname));
        // eslint-disable-next-line
    }, [activeWallet]);

    const setOpenedTransaction = (data) => {
        dispatch(transactionActions.setOpenedTransaction(data));
        navigate(ROUTES.TRANSACTION_DETAILS);
    };

    return (
        <div className="panel">
            <Content>
                {(loader && transactions?.length > 0) && transactions?.map((item, i) => (
                    <TransactionCard
                        data={item}
                        key={i}
                        onClick={setOpenedTransaction}
                    />
                ))}
                {(loader && transactions?.length === 0) &&
                    <div className="no-transactions-block">
                        {/*<CustomIcon icon="noTransactions"/>*/}
                        <h3>{text.NO_TRANSACTIONS}</h3>
                        <p>{text.NO_TRANSACTIONS_DESCRIPTION}</p>
                    </div>
                }
                {!loader && <Loader/>}
            </Content>
            <Tabbar config={config} bottomInset={bottomInset}/>
        </div>
    );
};

export default TransactionsPanel;