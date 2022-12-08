export const VOTE_OPTIONS = {
    VOTE_OPTION_YES: 'Yes',
    VOTE_OPTION_ABSTAIN: 'Abstain',
    VOTE_OPTION_NO: 'No',
    VOTE_OPTION_NO_WITH_VETO: 'NoWithVeto',
};

export const VOTE_OPTIONS_NUMBERS = {
    VOTE_OPTION_YES: 1,
    VOTE_OPTION_ABSTAIN: 2,
    VOTE_OPTION_NO: 3,
    VOTE_OPTION_NO_WITH_VETO: 4,
};

export const VOTE_COLORS = {
    VOTE_OPTION_YES: '#00B933',
    VOTE_OPTION_ABSTAIN: '#A8C3E1',
    VOTE_OPTION_NO: '#CC3030',
    VOTE_OPTION_NO_WITH_VETO: '#6354B4',
};

export const PROPOSAL_STATUSES = {
    PROPOSAL_STATUS_PASSED: 'Passed',
    PROPOSAL_STATUS_REJECTED: 'Rejected',
    PROPOSAL_STATUS_DEPOSIT_PERIOD: 'Deposit period',
    PROPOSAL_STATUS_VOTING_PERIOD: 'Voting period',
    PROPOSAL_STATUS_FAILED: 'Failed',
};

export const PROPOSAL_TYPES = {
    TEXT: 'TextProposal',
    COMMUNITY_POOL_SPEND: 'CommunityPoolSpendProposal',
    PARAMETER_CHANGE: 'ParameterChangeProposal',
    CLIENT_UPDATE: 'ClientUpdateProposal',
    SOFTWARE_UPGRADE: 'SoftwareUpgradeProposal',
    SET_SUPERFLUID_ASSETS: 'SetSuperfluidAssetsProposal',
    REMOVE_SUPERFLUID_ASSETS: 'RemoveSuperfluidAssetsProposal ',
    UPDATE_POOL_INCENTIVES: 'UpdatePoolIncentivesProposal',
    UPDATE_FEE_TOKEN_PROPOSAL: 'UpdateFeeTokenProposal',
    STORE_CODE: 'StoreCodeProposal',
    INSTANTIATE_CONTRACT: 'InstantiateContractProposal',
    MIGRATE_CONTRACT: 'MigrateContractProposal',
    SUDO_CONTRACT: 'SudoContractProposal',
    EXECUTE_CONTRACT: 'ExecuteContractProposal',
    UPDATE_ADMIN: 'UpdateAdminProposal',
    CLEAR_ADMIN: 'ClearAdminProposal',
    PIN_CODES: 'PinCodesProposal',
    UNPIN_CODES: 'UnpinCodesProposal',
};

export const PROPOSAL_TYPES_TEXTS = {
    [PROPOSAL_TYPES.TEXT]: 'Text',
    [PROPOSAL_TYPES.COMMUNITY_POOL_SPEND]: 'Community Pool Spend',
    [PROPOSAL_TYPES.PARAMETER_CHANGE]: 'Parameter Change',
    [PROPOSAL_TYPES.CLIENT_UPDATE]: 'Client Update',
    [PROPOSAL_TYPES.SOFTWARE_UPGRADE]: 'Software Upgrade',
    [PROPOSAL_TYPES.SET_SUPERFLUID_ASSETS]: 'Set Superfluid Assets',
    [PROPOSAL_TYPES.REMOVE_SUPERFLUID_ASSETS]: 'Remove Superfluid Assets',
    [PROPOSAL_TYPES.UPDATE_POOL_INCENTIVES]: 'Update Pool Incentives',
    [PROPOSAL_TYPES.UPDATE_FEE_TOKEN_PROPOSAL]: 'Update Fee Token',
    [PROPOSAL_TYPES.STORE_CODE]: 'Store Code',
    [PROPOSAL_TYPES.INSTANTIATE_CONTRACT]: 'Instantiate Contract',
    [PROPOSAL_TYPES.MIGRATE_CONTRACT]: 'Migrate Contract',
    [PROPOSAL_TYPES.SUDO_CONTRACT]: 'Sudo Contract',
    [PROPOSAL_TYPES.EXECUTE_CONTRACT]: 'Execute Contract',
    [PROPOSAL_TYPES.UPDATE_ADMIN]: 'Update Admin',
    [PROPOSAL_TYPES.CLEAR_ADMIN]: 'Clear Admin',
    [PROPOSAL_TYPES.PIN_CODES]: 'Pin Codes',
    [PROPOSAL_TYPES.UNPIN_CODES]: 'Unpin Codes',
};

export const PROPOSAL_TYPES_PARAMS = {
    [PROPOSAL_TYPES.TEXT]: [],
    [PROPOSAL_TYPES.COMMUNITY_POOL_SPEND]: ['recipient', 'amount'],
    [PROPOSAL_TYPES.PARAMETER_CHANGE]: ['changes'],
    [PROPOSAL_TYPES.CLIENT_UPDATE]: ['subject_client_id','substitute_client_id'],
    [PROPOSAL_TYPES.SOFTWARE_UPGRADE]: ['plan'],
    [PROPOSAL_TYPES.SET_SUPERFLUID_ASSETS]: ['assets'],
    [PROPOSAL_TYPES.REMOVE_SUPERFLUID_ASSETS]: ['superfluidAssetDenoms'],
    [PROPOSAL_TYPES.UPDATE_POOL_INCENTIVES]: ['records'],
    [PROPOSAL_TYPES.UPDATE_FEE_TOKEN_PROPOSAL]: ['feetoken'],
    [PROPOSAL_TYPES.STORE_CODE]: ['run_as', 'instantiate_permission', 'wasm_byte_code'],
    [PROPOSAL_TYPES.INSTANTIATE_CONTRACT]: ['code_id', 'label', 'msg', 'run_as', 'admin', 'funds'],
    [PROPOSAL_TYPES.MIGRATE_CONTRACT]: ['codeId', 'contract', 'msg'],
    [PROPOSAL_TYPES.SUDO_CONTRACT]: ['contract', 'msg'],
    [PROPOSAL_TYPES.EXECUTE_CONTRACT]: ['run_as', 'contract', 'msg', 'funds'],
    [PROPOSAL_TYPES.UPDATE_ADMIN]: ['contract', 'newAdmin'],
    [PROPOSAL_TYPES.CLEAR_ADMIN]: ['contract'],
    [PROPOSAL_TYPES.PIN_CODES]: ['codeIds'],
    [PROPOSAL_TYPES.UNPIN_CODES]: ['codeIds'],
};