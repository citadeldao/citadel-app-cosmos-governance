import { ReactComponent as UserIcon } from '../../assets/icons/user.svg';
import { prettyNumber } from '../../helpers/prettyNumber';
import '../styles/containers/proposal-vote.css';

const ProposalVotes = ({ votes, className }) => {
    return (
        <div className={`proposal-votes ${className}`}>
            {votes.map(vote => (
                <figure key={vote.option} className="proposal-vote">
                    <div className="proposal-vote__icon" style={{ backgroundColor: vote.color }}>
                        <img src={`img/icons/votes/${vote.option}.svg`}  alt='guide'/>
                    </div>
                    <figcaption className="proposal-vote__info">
                        <div className="proposal-vote__text">
                            {vote.option}
                        </div>
                        <div className="proposal-vote__numbers">
                            <div className="proposal-vote__users">
                                <UserIcon/>
                                {prettyNumber(vote.votes)}
                            </div>
                            <div
                                className="proposal-vote__percent"
                                style={{ color: vote.color }}
                            >
                                {Number(vote.percent) || 0}%
                            </div>
                        </div>
                    </figcaption>
                </figure>
            ))}
        </div>
    );
};

export default ProposalVotes;