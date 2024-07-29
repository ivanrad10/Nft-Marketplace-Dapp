import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState, useEffect } from "react";
import "./style.css";
import ListedNft from "./ListedNft";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function App() {
  const account = useAccount();
  const { connectors, connect, status, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [nfts, setNfts] = useState<any[]>([]);
  const [nftsForSale, setNftsForSale] = useState<any[]>([]);
  const [price, setPrice] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [listModalVisible, setListModalVisible] = useState(false);
  const [currentTokenUri, setCurrentTokenUri] = useState("");

  const handlePriceChange = (event: any) => {
    setPrice(event.target.value);
  };

  const handleMint = async () => {
    setModalVisible(true);
  };

  const handleList = (tokenUri: string) => {
    setCurrentTokenUri(tokenUri);
    setListModalVisible(true);
  };

  useEffect(() => {
    if (account) {
      fetchNFTs();
      fetchNftsForSale();
    }
  }, [account.address]);

  const fetchNFTs = async () => {
    const response = await fetch(
      `http://localhost:3000/nfts/${account.address}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    setNfts(data);
  };

  const fetchNftsForSale = async () => {
    const response = await fetch(
      `http://localhost:3000/nfts/forsale/${account.address}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    setNftsForSale(data);
  };

  const handleModalSubmit = async () => {
    await fetch("http://localhost:3000/nfts/pinToPinata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: account.address,
        name,
        description,
        imgUrl,
      }),
    });

    fetchNFTs();
    setModalVisible(false);
  };

  const handleBuy = async (tokenUri: string, price: number, owner: string) => {
    const respone = await fetch("http://localhost:3000/nfts/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokenUri: tokenUri,
        price: price,
        buyer: account.address,
        owner: owner,
      }),
    });

    fetchNFTs();
    fetchNftsForSale();
  };

  const handleListSubmit = async () => {
    const response = await fetch("http://localhost:3000/nfts/listnft", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokenUri: currentTokenUri,
        price: price,
        address: account.address,
      }),
    });

    const data = await response.json();
    console.log(data);
    setListModalVisible(false);
    fetchNFTs();
  };

  return (
    <>
      <div>
        {account.status === "connected" ? (
          <div className="container">
            <div className="section">
              <div className="section-title">Mint NFT</div>
              <button className="btn" onClick={handleMint}>
                Mint
              </button>
            </div>
            <h3>My NFTs</h3>
            <div className="nft-grid">
              {nfts.length > 0 ? (
                nfts.map((nft, index) => (
                  <div key={index} className="nft-card">
                    <img
                      src={"https://ipfs.io/ipfs/" + nft.imageUrl}
                      alt={nft.name}
                    />
                    <h2>{nft.name}</h2>
                    <p>{nft.description}</p>
                    {nft.isListed ? (
                      <p>Listed for sale</p>
                    ) : (
                      <button
                        className="list-btn"
                        onClick={() => handleList(nft.tokenUri)}
                      >
                        List for Sale
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p>No NFTs found for this address.</p>
              )}
            </div>

            <h3>Marketplace</h3>
            <div className="nft-grid">
              {nftsForSale.length > 0 ? (
                nftsForSale.map((nft, index) => (
                  <div key={index} className="nft-card">
                    <img
                      src={"https://ipfs.io/ipfs/" + nft.imageUrl}
                      alt={nft.name}
                    />
                    <h2>{nft.name}</h2>
                    <p>{nft.description}</p>
                    <p>{nft.price} Eth</p>
                    <button
                      className="list-btn"
                      onClick={() =>
                        handleBuy(nft.tokenUri, nft.price, nft.owner)
                      }
                    >
                      Buy
                    </button>
                  </div>
                ))
              ) : (
                <p>No NFTs for sale found for this address.</p>
              )}
            </div>
          </div>
        ) : (
          <p>Please connect your account to see your NFTs and mint new ones.</p>
        )}
      </div>

      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setModalVisible(false)}>
              &times;
            </span>
            <div className="modal-title">Mint NFT</div>
            <input
              type="text"
              className="input"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              className="input"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="text"
              className="input"
              placeholder="Image URL"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
            />
            <button className="btn" onClick={handleModalSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}

      {listModalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close-btn"
              onClick={() => setListModalVisible(false)}
            >
              &times;
            </span>
            <div className="modal-title">List NFT for Sale</div>
            <input
              type="number"
              step="0.01"
              className="input"
              placeholder="Enter price in ETH"
              value={price}
              onChange={handlePriceChange}
            />
            <button className="btn" onClick={handleListSubmit}>
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
