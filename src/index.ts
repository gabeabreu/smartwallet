import { ABI20 } from "./ABIs/erc20ABI";
import { ABI721 } from "./ABIs/erc721ABI";
import { ABI1155 } from "./ABIs/erc1155ABI";

const { PRIVATE_KEY, ALCHEMY_KEY} = process.env;

const Web3 = require('web3');

const web3 = new Web3(
  `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_KEY}`
);

// const web3 = new Web3('http://127.0.0.1:7545');

//token erc20
const erc20Address = '0xe5Ac471206eFC8A0103D57572175FbCc67d31526';
const erc20Contract = new web3.eth.Contract(ABI20, erc20Address);

//erc721
const erc721Address = '0x1fae836C85d4300DB9715e0fFAea486831E8f8E6';
const erc721Contract = new web3.eth.Contract(ABI721, erc721Address);

//erc1155
const erc1155Address = "0xa6e2c0eee1d1b404d8419859dc3da8c41fcb817a";
const erc1155Contract = new web3.eth.Contract(ABI1155, erc1155Address);

//Variáveis
const accountFrom = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);

var count = web3.eth.getTransactionCount(accountFrom.address);

async function sendEth(value: string, destinationAddress: string) {
  const rawTx = {
    nonce: count,
    from: accountFrom.address,
    to: destinationAddress,
    value: web3.utils.toWei(value, 'ether'),
    gas: '1000000',
  }

  const signedTx = await web3.eth.accounts.signTransaction(
    rawTx,
    PRIVATE_KEY
  );

  web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

async function sendERC20(value: string, destinationAddress: string) {
  const rawTx = {
    nonce: count,
    from: accountFrom.address,
    to: erc20Address,
    value: 0x00,
    gas: '10000000',
    data: erc20Contract.methods
      .transfer(destinationAddress, (Number(value) * 10 ** 18).toString())
      .encodeABI(),
    chainId: 0x05,
  };

  const signedTx = await web3.eth.accounts.signTransaction(
    rawTx,
    PRIVATE_KEY
  );

  web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

async function mintERC721(destinationAddress: string) {
  const rawTx = {
    from: accountFrom.address,
    to: erc721Address,
    value: 0x00,
    gas: '1000000',
    data: erc721Contract.methods
      .safeMint(destinationAddress)
      .encodeABI(),
    chainId: 0x05,
  };

  const signedTx = await web3.eth.accounts.signTransaction(
    rawTx,
    PRIVATE_KEY
  );

  web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

async function transferERC721(destinationAdress: string, tokenId: number) {
  const rawTx = {
    from: accountFrom.address,
    to: erc721Address,
    value: 0x00,
    gas: '1000000',
    data: erc721Contract.methods.transferFrom(accountFrom.address, destinationAdress, tokenId).encodeABI(),
    chainId: 0x05,
  }

  const signedTx = await web3.eth.accounts.signTransaction(
    rawTx,
    PRIVATE_KEY
  );

  web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

async function transferERC1155(destinationAddress: string, tokenId: number) {
  const rawTx = {
    from: accountFrom.address,
    to: erc1155Address,
    value: 0x00,
    gas: '1000000',
    data: erc1155Contract.methods.safeTransferFrom(accountFrom.address, destinationAddress, tokenId, 10, "0x").encodeABI(),
    chainId: 0x05,
  };

  const signedTx = await web3.eth.accounts.signTransaction(
    rawTx,
    PRIVATE_KEY
  );

  web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}



//transações. É importante fazer apenas uma de cada vez, caso contrário a evm reverte achando que uma transação está sobrescrevendo a anterior(acontece sempre que uma transação é enviada antes da anterior ser concluída. Já tentei resolver isso junto com o vitor mas não conseguimos)

//se der erro em alguma das transações abaixo, provavelmente é pq não há fundos na carteira ou o token id especificado já não se encontra mais naquela carteira.

// sendEth('0.000001', '0x0DdBfcBF44c94f8D6391CB0E1A537672dCe29ADd');
// sendERC20('8', '0x0DdBfcBF44c94f8D6391CB0E1A537672dCe29ADd');
// mintERC721('0x24A734124E53BDE56703b4213bddd80728F85cDf');
// transferERC721('0x188c09b7A79571b2e02fAe4D9796b01cD8282724', 2);
// transferERC1155('0x188c09b7A79571b2e02fAe4D9796b01cD8282724', 1);

//carteira from
// address: '0x24A734124E53BDE56703b4213bddd80728F85cDf',
// privateKey:'0x92537d56023ad78167486b4b6cf89f87c2e8875d544230c5cf2cb2b0f500def9',
// signTransaction: [Function: signTransaction],
// sign: [Function: sign],
// encrypt: [Function: encrypt]

//carteira to
// address: '0x188c09b7A79571b2e02fAe4D9796b01cD8282724',
// privateKey: '0x6fcfcb81cc9aa20f0a00b83376c14e264d08b3f8846530c49757406b3f8c7df9',
// signTransaction: [Function: signTransaction],
// sign: [Function: sign],
// encrypt: [Function: encrypt]