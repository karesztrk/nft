import React, { useEffect, useState } from 'react';
import './App.css';
import Web3 from 'web3';
import Color from '../abis/Color.json';

const App = () => {

  const [account, setAccount] = useState();
  const [contract, setContract] = useState();
  const [colors, setColors] = useState([]);

  useEffect(() => {
    loadWeb3();
    loadBlockChainData();
  }, [])

   const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      alert('Non-Ethereum browser detected');
    }
  }

  const loadBlockChainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    if (!accounts) {
      alert('Failed to get Account');
    }
    setAccount(accounts[0]);
  
    const networkId = await web3.eth.net.getId();
    const networkData = Color.networks[networkId];
    if (networkData) {
      const abi = Color.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi, address);
      setContract(contract);
  
      const totalSupply = await contract.methods.totalSupply().call();
  
      const clrs = [];
      for (let i = 1; i <= totalSupply; i++) {
        const color = await contract.methods.colors(i - 1).call();
        clrs.push(color)
      }
      setColors(clrs);

    } else {
      alert('Smart contract not deployed yet')
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    mint(e.target[0].value);
  }

  const mint = (color) => {
    if (account) {
      contract.methods.mint(color).send({ from: account })
      .once('receipt', (receipt) => {
        setColors([...colors, color]);
      });
    } else {

    }
  }

  return (
    <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-smnone d-sm-block">
              <small className="text-white"><span id="account">{account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Issue Token</h1>
                <form onSubmit={onSubmit}>
                  <input type="text" name="color" className="form-control mb-1" placeholder="e.g. #FFFFFF"></input>
                  <input type="submit" className="btn btn-block btn-primary" value="MINT"></input>
                </form>
              </div>
            </main>
          </div>
          <hr />
          <div className="row text-center">
            {colors && colors.map((color) => 
              <div key={color} className="col-md-3 mb-3">
                <div className="token" style={{
                  backgroundColor: color
                }}></div>
                <div>
                  {color}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  )
}

export default App;
