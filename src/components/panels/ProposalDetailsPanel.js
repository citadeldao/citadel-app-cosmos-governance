import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import {
    Content,
    Header,
    Tablist,
    Tab,
    InfoCardBlock,
    InfoCardItem,
    PercentageLine,
    Button,
    NodeValidatorCard,
} from '@citadeldao/apps-ui-kit';


import { getProposalDateString } from '../helpers/dateFormatter';
import { formatAddress } from '../helpers/addressFormatter';
import { proposalActions } from '../../store/actions';
import { PROPOSAL_TYPES, PROPOSAL_STATUSES, VOTE_COLORS, VOTE_OPTIONS } from '../../const';
import routes from '../../routes';
import ProposalVotes from '../containers/ProposalVoteItem';
import ProposalTypeInfo from '../containers/ProposalTypeInfo';

import '../styles/helpers.css';
import '../styles/containers/proposal-description.css';

const ProposalDetailsPanel = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { netSDK, validators } = useSelector(state => state.app);
    const { activeWallet } = useSelector(state => state.wallet);
    const { currentProposal: proposal, validatorsVotes } = useSelector((state) => state.proposal);

    const [activeTab, setActiveTab] = useState('info');
    const symbol = netSDK.config.symbol;
    const totalDeposit = netSDK.getAmountByDenom(proposal.total_deposit.length && proposal.total_deposit[0].amount);
    const isVotingPeriod = proposal.statusText === PROPOSAL_STATUSES.PROPOSAL_STATUS_VOTING_PERIOD;
    const isDepositPeriod = proposal.statusText === PROPOSAL_STATUSES.PROPOSAL_STATUS_DEPOSIT_PERIOD;

    useEffect(() => {
        if (proposal) {
            dispatch(proposalActions.getProposalValidatorsVotes(proposal.id));
        }
        // eslint-disable-next-line 
    }, [proposal]);

    const back = () => navigate(routes.PROPOSALS);

    const goToSelectVotePanel = () => {
        navigate(routes.SELECT_VOTE);
    };

    const validatorsWithVotes = validators[activeWallet.network].map(validator => {
        return {
            ...validator,
            vote: validatorsVotes.find(vote => {
                return vote.validatorAddress === validator.address
            })?.vote,
        };
    });

    return (
        <div className="panel">
            <Content>
                <Header
                    border
                    title={`#${proposal.id} ${proposal.title}`}
                    style={{ margin: '8px 0 16px 0' }}
                    back={true}
                    onClick={() => back()}
                />

                <Tablist
                    active={activeTab}
                    setActive={setActiveTab}
                    type="line"
                    className="proposal-details__info"
                >
                    <Tab id="info" label="Information">
                        <InfoCardBlock style={{ backgroundColor: '#E4F3F5' }}>
                            <InfoCardItem text={'Total Deposit:'}>
                                <p>
                                    <span className="text-bold color-violet">
                                        {totalDeposit}
                                    </span> <span
                                    className="color-black">{symbol}</span>
                                </p>
                            </InfoCardItem>
                            {
                                <InfoCardItem text={`${isDepositPeriod ? 'Deposit' : 'Voting'} Period:`}>
                                    <p className="color-gray">
                                        {isDepositPeriod
                                            ? getProposalDateString(proposal.depositEnd)
                                            : getProposalDateString(proposal.votingEnd, proposal.votingStart)
                                        }
                                    </p>
                                </InfoCardItem>
                            }
                            <InfoCardItem text={'Type:'}>
                                <p className="text-semibold color-dark-violet">{proposal.typeText}</p>
                            </InfoCardItem>
                            {proposal.type === PROPOSAL_TYPES.COMMUNITY_POOL_SPEND &&
                                <>
                                    <InfoCardItem text="Request Amount:">
                                        <p>
                                        <span className="text-bold color-lightblue">
                                            {netSDK.getAmountByDenom(proposal.content.amount[0].amount)}
                                        </span> <span className="color-black">{symbol}</span>
                                        </p>
                                    </InfoCardItem>
                                    <InfoCardItem text='Recipient:'>
                                        <p>
                                            <span className="color-black">
                                                {formatAddress(proposal.content.recipient, 7)}
                                            </span>
                                        </p>
                                    </InfoCardItem>
                                </>
                            }
                            {proposal.type === PROPOSAL_TYPES.SET_SUPERFLUID_ASSETS &&
                                proposal.content.assets.map(asset => (
                                    <>
                                        <InfoCardItem
                                            text="Asset Type:"
                                        >
                                            <p>
                                                <span className="text-bold color-violet">
                                                    {asset.asset_type}
                                                </span>
                                            </p>
                                        </InfoCardItem>
                                        <InfoCardItem
                                            text="Asset Denom:"
                                        >
                                            <p>
                                                <span className="text-bold color-violet">
                                                    {asset.denom}
                                                </span>
                                            </p>
                                        </InfoCardItem>
                                    </>

                                ))
                            }
                            {proposal.type === PROPOSAL_TYPES.UPDATE_POOL_INCENTIVES && (
                                <InfoCardItem text="Records:">
                                    <p>
                                        <span className="text-bold color-violet">
                                            {proposal.content.records.length}
                                        </span>
                                    </p>
                                </InfoCardItem>
                            )}
                        </InfoCardBlock>

                        <div className="proposal-details__percentage-line">
                            <PercentageLine items={proposal.votes}/>
                        </div>

                        {!isDepositPeriod &&
                            <ProposalVotes
                                votes={proposal.votes}
                                className="proposal-details__votes"
                            ></ProposalVotes>
                        }

                        <div className="proposal-details__your-vote">
                            <div className="proposal-details-vote__text">
                                {proposal.userVote
                                    ? <>
                                        <div className="text-bold">
                                            <span>You voted: <span
                                                style={{ color: VOTE_COLORS[proposal.userVote.option] }}
                                            >
                                                {VOTE_OPTIONS[proposal.userVote.option]}
                                            </span></span>
                                        </div>
                                    </>
                                    : <div className="text-bold color-gray">
                                        {(isDepositPeriod || isVotingPeriod)
                                            ? `You haven't voted`
                                            : 'No voting data'
                                        }
                                    </div>
                                }
                            </div>
                            {isVotingPeriod &&
                                <Button
                                    onClick={() => goToSelectVotePanel(true)}
                                >
                                    {proposal.userVote ? 'Revote' : 'Vote'}
                                </Button>
                            }
                        </div>

                        <div>
                            {!isDepositPeriod && !!validatorsWithVotes.length &&
                                <div className="proposal-details__header">Validators</div>
                            }
                            {!isDepositPeriod && validatorsWithVotes.map(validator => (
                                <NodeValidatorCard
                                    key={validator.address}
                                    network={activeWallet.network}
                                    address={validator.address}
                                    fee={validator.fee}
                                    name={validator.name}
                                    logo={validator.imageSource}
                                >
                                    {validator.vote
                                        ? (
                                            <span
                                                style={{ color: VOTE_COLORS[validator.vote.option] }}
                                                className='text-bold mr-1'
                                            >
                                                {VOTE_OPTIONS[validator.vote.option]}
                                            </span>
                                        )
                                        : <span className='text-bold mr-1'>
                                            {isVotingPeriod || isVotingPeriod
                                                ? `Didn't vote`
                                                : 'No voting data'
                                            }
                                        </span>
                                    }
                                </NodeValidatorCard>
                            ))}
                        </div>
                    </Tab>
                    <Tab id="description" label="Description">
                        <div style={{ fontSize: 14 }}>
                            <ReactMarkdown
                                linkTarget="_blank"
                                children={proposal.content.description.replace(/\\n\\n/gi, '\n')}
                                className="proposal_description"
                            ></ReactMarkdown>
                        </div>
                    </Tab>
                    {proposal.type !== PROPOSAL_TYPES.TEXT &&
                        <Tab id="type" label={proposal.typeText}>
                            <ProposalTypeInfo
                                proposal={proposal}
                            />
                        </Tab>
                    }
                </Tablist>
            </Content>
        </div>
    );
};

export default ProposalDetailsPanel;