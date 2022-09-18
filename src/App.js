import React, { useEffect, useState } from 'react';
import './App.css';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from './utils/load-contracts';

function App() {
	const [web3Api, setWeb3Api] = useState({
		provider: null,
		isProviderLoded: false,
		web3: null,
		contract: null,
	});
	const [account, setAccount] = useState([]);
	const [balance, setBalance] = useState(null);
	const [shouldReload, setShouldReload] = useState(false);

	const canConnectToContract = account && web3Api.contract;
	const reload = () => setShouldReload(!shouldReload);

	const setAccountListener = (provider) => {
		// provider.on('accountsChanged', (accounts) => setAccount(accounts[0]));
		provider.on('accountsChanged', (_) => window.location.reload());
		provider.on('chainChanged', (_) => window.location.reload());

		// provider._jsonRpcConnection.events.on('notification', (payload) => {
		// 	const { method } = payload;

		// 	if (method === 'metamask_unlockStateChanged') {
		// 		setAccount(null);
		// 	}
		// });
	};

	useEffect(() => {
		const loadProvider = async () => {
			const provider = await detectEthereumProvider();

			if (provider) {
				const contract = await loadContract('Faucet', provider);
				setAccountListener(provider);
				setWeb3Api({
					web3: new Web3(provider),
					provider,
					contract,
					isProviderLoded: true,
				});
			} else {
				setWeb3Api((api) => ({ ...api, isProviderLoded: true }));
				console.error('Please install metamask!');
			}
		};

		loadProvider();
	}, []);

	useEffect(() => {
		const loadBalance = async () => {
			const { contract, web3 } = web3Api;
			const balance = await web3.eth.getBalance(contract.address);
			const balanceInEther = web3.utils.fromWei(balance, 'ether');
			setBalance(balanceInEther);
		};

		web3Api.contract && loadBalance();
	}, [web3Api, shouldReload]);

	useEffect(() => {
		const getAccount = async () => {
			const accounts = await web3Api.web3.eth.getAccounts();
			setAccount(accounts[0]);
		};

		web3Api.web3 && getAccount();
	}, [web3Api.web3]);

	// const enableEthereumHandler = async () => {
	//   const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
	//   console.log(accounts);
	// }

	const connectToWalletHandler = () => {
		web3Api.provider.request({ method: 'eth_requestAccounts' });
	};

	const addFunds = async () => {
		const { contract, web3 } = web3Api;
		await contract.addFunds({
			from: account,
			value: web3.utils.toWei('1', 'ether'),
		});

		reload();
	};

	const withdrawFunds = async () => {
		const { contract, web3 } = web3Api;
		const withdrawAmount = web3.utils.toWei('0.1', 'ether');
		await contract.withdraw(withdrawAmount, {
			from: account,
		});

		reload();
	};

	return (
		<>
			<div className='faucet-wrapper'>
				<div className='faucet'>
					{web3Api.isProviderLoded ? (
						<div className='is-flex is-align-items-center'>
							<span className='mr-2'>
								<strong>Account: </strong>
							</span>
							<div>
								{account && !!account.length ? (
									<div>{account}</div>
								) : !web3Api.provider ? (
									<>
										<div className='notification is-warning is-small is-rounded'>
											Wallet is not detected!
											<a
												rel='noreferrer'
												target='_blanck'
												href='https://docs.metamask.io'
											>
												Install metamask
											</a>
										</div>
									</>
								) : (
									<button
										className='button is-small ml-2'
										onClick={connectToWalletHandler}
									>
										Connect wallet
									</button>
								)}
							</div>
						</div>
					) : (
						<div>Looking for web3...</div>
					)}
					<div className='balance-view is-size-2 my-2'>
						Current Balance: <strong>{balance}</strong> ETH
					</div>
					{!canConnectToContract && (
						<i className='is-block'>Connect to Ganache</i>
					)}
					<button
						disabled={!canConnectToContract}
						onClick={addFunds}
						className='button mr-2 is-primary is-small'
					>
						Donate 1eth
					</button>
					<button
						disabled={!canConnectToContract}
						onClick={withdrawFunds}
						className='button is-link is-small'
					>
						Withdraw
					</button>
				</div>
			</div>
		</>
	);
}

export default App;
