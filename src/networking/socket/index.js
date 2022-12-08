import io from 'socket.io-client';
import { store } from '../../store/store';
import { types } from '../../store/actions/types';
import { Cosmos } from '@citadeldao/apps-sdk';
import { VOTE_COLORS, VOTE_OPTIONS } from '../../const';

export class SocketManager {
    // contains a socket connection
    static socket;

    static async connect() {
        const { auth_token } = store.getState().user;
        try {
            this.socket = io(process.env.REACT_APP_SOCKET_URL, {
                transports: ['websocket'],
                upgrade: false,
                query: {
                    token: auth_token
                },
                reconnection: true
            });
            this.startListeners();
        } catch (err) {
            console.error(`Error on initSocketConnection: `, err);
        }
    }

    static async disconnect() {
        await this.socket.disconnect();
        this.socket = null;
    }

    static async reconnect() {
        await this.disconnect();
        await this.connect();
    }

	static startListeners() {
        try {
			this.socket.on('connect',()=>{
				console.log('socket is connected')
			})

			this.socket.on('message-from-front',async(data)=>{
				console.log('message-from-front in app', data)
				if(data.type === 'view-scrt-balance'){
					// update secret token balance
				}
			})
			this.socket.on('address-balance-updated-app',async(data)=>{
				const { wallets } = store.getState().wallet;
				if (data.address && data.balance && data.net) {
					wallets.forEach(item => {
						if (item.address === data.address && item.network === data.net) {
							item.balance = data.balance?.mainBalance;
						}
					});
					store.dispatch({
						type: types.SET_WALLETS,
						payload: wallets,
					});
				}
			})
			this.socket.on('mempool-add-tx-app', (data) => {
				console.log('mempool-add-tx-app', data)
			})

			this.socket.on('mempool-remove-tx-app',async (tx) => {
				const { wallets } = store.getState().wallet;
				const { proposals } = store.getState().proposals;
				const hasWallet = wallets.some(w => w.address === tx.from);

				if (tx.type === 'vote' && hasWallet) {
					const cosmos = new Cosmos.Cosmos(tx.net);
					const [proposalID] = tx.comment.split(' - ');
					const proposalIndex = proposals.findIndex(p => Number(p.id) === Number(proposalID));

					await cosmos.init();
					const { vote } = await cosmos.getProposalVotesByVoter(proposalID, tx.from);

					if (proposalIndex < 0) {
						return;
					}

					const newProposals = [...proposals];


					newProposals[proposalIndex].userVote = {
						vote: VOTE_OPTIONS[vote.options[0].option],
						voter: tx.from,
						option: vote.options[0].option,
						color: VOTE_COLORS[vote.options[0].option]
					};

					store.dispatch({
						type: types.SET_PROPOSALS,
						payload: newProposals,
					});
				}
			})
		}catch (err) {
            console.error(`Error starting listeners: `, err);
        }
	}
}
