import moment from 'moment';

export const getProposalDateString = (end, start) => {
    return moment().isBefore(moment(start || end))
        ? `${moment().to(end, true)} left`
        : moment(start || end).fromNow();
}
