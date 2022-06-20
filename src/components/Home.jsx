import WalletBalance from "./WalletBalance";
import { useEffect, useState } from "react";

import { ethers } from "ethers";
import PokemonClub from "../artifacts/contracts/MyNFT.sol/PokemonClub.json";
import DappName from "../artifacts/contracts/MyDapp.sol/DappName.json";

const contractAddress = "0xcD599725c15572107d8084913B06c4C9AFf44248";
const dappContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, PokemonClub.abi, signer);
const dappContract = new ethers.Contract(
  dappContractAddress,
  DappName.abi,
  signer
);
console.log(dappContract);

function Home() {
  const [totalMinted, setTotalMinted] = useState(0);
  const [appName, setAppName] = useState("");
  useEffect(() => {
    getCount();
  }, []);

  (async () => {
    let name = await dappContract.readName();
    console.log(name);
    setAppName(name);
  })();

  const getCount = async () => {
    const count = await contract.count();
    console.log(parseInt(count));
    setTotalMinted(parseInt(count));
  };

  const changeHandler = () => {
    // let str = "LalusDapp";
    // let name = await dappContract.setName(str);
    // setAppName(name);
  };

  return (
    <div>
      <WalletBalance />
      <h1>Your welcome to {appName}</h1>
      <button className="btn-secondary" onClick={changeHandler}>
        Change Dapp Name
      </button>

      <h1>Pokemon Club NFT Collection</h1>
      <div className="container">
        <div className="row">
          {Array(totalMinted + 1)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="col-sm">
                <NFTImage tokenId={i} getCount={getCount} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function NFTImage({ tokenId, getCount }) {
  const contentId = "QmcynGm4545JYM7hg75hbz6g3r94iVdsbZTgbqYNysehtP";
  const metadataURI = `${contentId}/${tokenId}.json`;
  // const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`;
  const imageURI = `img/${tokenId}.png`;

  const [isMinted, setIsMinted] = useState(false);
  useEffect(() => {
    getMintedStatus();
  }, [isMinted]);

  const getMintedStatus = async () => {
    const result = await contract.isContentOwned(metadataURI);
    console.log(result);
    setIsMinted(result);
  };

  const mintToken = async () => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    const result = await contract.payToMint(addr, metadataURI, {
      value: ethers.utils.parseEther("0.05"),
    });

    await result.wait();
    getMintedStatus();
    getCount();
  };

  async function getURI() {
    const uri = await contract.tokenURI(tokenId);
    alert(uri);
  }
  return (
    <div className="card" style={{ width: "18rem" }}>
      <img
        className="card-img-top"
        src={isMinted ? imageURI : "img/placeholder.png"}
      ></img>
      <div className="card-body">
        <h5 className="card-title">ID #{tokenId}</h5>
        {!isMinted ? (
          <button className="btn btn-primary" onClick={mintToken}>
            Mint
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={getURI}>
            Taken! Show URI
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
