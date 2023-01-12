import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header, Content, Icon, InfoCardBlock, InfoCardItem } from '@citadeldao/apps-ui-kit';
import moment from 'moment';

import { Config } from '../config/config';
import { prettyNumber } from '../helpers/numberFormatter';
import { formatAddress } from '../helpers/addressFormatter';
import { panelActions } from '../../store/actions';
import ROUTES from '../../routes';
import text from '../../text.json';

import '../styles/panels/transactions.css';

const TransactionDetails = () => {
  const config = new Config();
  const location = useLocation();
  const dispatch = useDispatch();
  const { activeWallet } = useSelector(state => state.wallet);
  const { openedTransaction: tx } = useSelector(state => state.transaction);
  const navigate = useNavigate();
  const back = () => navigate(ROUTES.TRANSACTIONS);
  useEffect(() => {
    dispatch(panelActions.setCurrentPanel(location.pathname));
    // eslint-disable-next-line
  }, []);
  return (
      <div className="panel">
        <Content>
          <Header
              config={config}
              border
              title={text.TRANSACTIONS_DETAILS}
              back={true}
              style={{ margin: '8px 0 24px 0' }}
              onClick={() => back()}
          />
          <InfoCardBlock className="transactions-details-block">
            <InfoCardItem text="Amount">
                        <span className="transactions-amount">
                            {prettyNumber(tx.amount?.text)}
                          <span className="transaction-ticker">{tx.amount?.symbol}</span>
                        </span>
            </InfoCardItem>
            <InfoCardItem text="Fee">
                        <span className="transactions-details-fee">
                            {tx.fee?.text}
                          <span className="transaction-ticker">
                                {tx.fee?.symbol}
                            </span>
                        </span>
            </InfoCardItem>
            <InfoCardItem text="Status">
                        <span
                            className={tx.error ? 'transactions-status-failed' : 'transactions-status'}
                        >
                            {tx?.error ? 'Failed' : 'Success'}
                        </span>
            </InfoCardItem>
            <InfoCardItem text="Data & time">
              <p className="transaction-datetime">{moment(tx.date).from(new Date())}</p>
            </InfoCardItem>

            {tx?.meta_info && tx?.meta_info?.map((item, i) => (
                item?.title !== 'Amount'
                    ? <InfoCardItem text={item?.title} key={i}>
                      <div className="row">
                        {item.type === 'text' &&
                            <span>{item?.value?.text || item?.value} </span>
                        }
                        {item.type === 'amount' &&
                            <span className="transactions-amount">
                                            {prettyNumber(item.value?.text)}
                              <span className="transaction-ticker">{item.value?.symbol}</span>
                                        </span>
                        }
                        {item.type === 'text_collection' &&
                            <div className="row">
                              {item.value?.map((elem, i) => (
                                  <span className="row"> {elem} {i !== item.value.length - 1 &&
                                      <Icon name={'angle-right-thin'} color="#8ca2bb" width="14px"/>}
                                                </span>
                              ))}
                            </div>
                        }
                        {item?.value?.url &&
                            <a
                                href={item?.value?.url}
                                target="_blank"
                                className="transactions-link"
                                rel="noreferrer"
                            >
                              <span className="web-link">{item?.value?.text}</span>
                              <span className="mobile-link">{formatAddress(item?.value?.text)}</span>
                            </a>
                        }
                      </div>
                    </InfoCardItem>
                    : ''
            ))}
            <InfoCardItem text={text.VIEW_TRANSACTION}>
              <a
                  href={activeWallet.getTxUrl(tx?.hash)}
                  className="transaction-link"
                  target="_blank"
                  rel="noreferrer"
              >
                <Icon
                    name="arrow-from-square-up-right"
                    color="#0091A6"
                    width={16}
                />
              </a>
            </InfoCardItem>
          </InfoCardBlock>
        </Content>
      </div>
  );
};

export default TransactionDetails;