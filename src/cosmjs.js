// src/cosmjs.js
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";

const ANDROMEDA_RPC_ENDPOINT = "https://rpc.andromeda.testnet.aquarius.highstakes.ch"; 
const ANDROMEDA_CHAIN_ID = "andromeda-1"; 
const DEFAULT_GAS_PRICE = "0.025uandr"; 
const NFT_CONTRACT_ADDRESS = "YOUR_NFT_TICKET_CONTRACT_ADDRESS"; 

export const getSigningClient = async () => {
  if (!window.keplr) throw new Error("Keplr wallet not found.");
  await window.keplr.enable(ANDROMEDA_CHAIN_ID);
  const offlineSigner = window.keplr.getOfflineSigner(ANDROMEDA_CHAIN_ID);
  return SigningCosmWasmClient.connectWithSigner(ANDROMEDA_RPC_ENDPOINT, offlineSigner, {
    gasPrice: GasPrice.fromString(DEFAULT_GAS_PRICE),
  });
};

export const mintNftTicket = async (recipientAddress, eventId, metadataUrl) => {
  if (!window.keplr) throw new Error("Please connect your Keplr wallet.");

  const client = await getSigningClient();
  const [account] = await (await window.keplr.getOfflineSigner(ANDROMEDA_CHAIN_ID)).getAccounts();
  const senderAddress = account.address;

  const mintMsg = {
    mint: {
      token_id: `${eventId}-${Date.now()}`,
      owner: recipientAddress,
      token_uri: metadataUrl, 
    },
  };

  const fee = { amount: [{ denom: "uandr", amount: "5000" }], gas: "200000" };

  try {
    console.log(`Executing mint on contract ${NFT_CONTRACT_ADDRESS} for ${recipientAddress}`);
    const result = await client.execute(senderAddress, NFT_CONTRACT_ADDRESS, mintMsg, fee, "Minting NFT ticket");
    console.log("Minting transaction successful:", result);
    return result; 
  } catch (error) {
    console.error("Error minting NFT ticket:", error);
    throw new Error(error.message || "Failed to mint ticket. The transaction may have been rejected or failed.");
  }
};