import React from 'react';

import '../styles/containers/proposal-vote.css';
import { PROPOSAL_TYPES_PARAMS } from '../../const';

const ProposalTypeInfo = ({ proposal }) => {
    const pickParams = (object = {}, params = []) => {
        return Object.keys(object).reduce((acc, prop) => {
            return params.includes(prop) && object.hasOwnProperty(prop)
                ? {
                    ...acc,
                    [prop]: object[prop],
                }
                : acc;
        }, {});
    };

    const getProposalTypeTemplate = (type) => {
        let params = pickParams(proposal.content, PROPOSAL_TYPES_PARAMS[type]);

        return JSON.stringify(params, null, 4);
    };

    return (
        <div className="proposal-details__type-info">
            {getProposalTypeTemplate(proposal.type)}
        </div>
    );
};

export default ProposalTypeInfo;