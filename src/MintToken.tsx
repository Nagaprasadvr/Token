
import {
    clusterApiUrl,
    Connection,
    PublicKey,
    Keypair,
    LAMPORTS_PER_SOL,
    Signer,
    sendAndConfirmTransaction
} from "@solana/web3.js";

import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    transfer,
    Account,
    getMint,
    getAccount
} from "@solana/spl-token";

window.Buffer = window.Buffer || require("buffer").Buffer;


function MintToken() {
    const connection = new Connection(clusterApiUrl('devnet'),'confirmed');
    let fromWallet = Keypair.generate();
    
    const toWallet = new PublicKey("6nJx4mGq9z5FTCT4jyRxk3eBMdBY61q4w9n7haYZGCCx");
    let fromTokenAccount: Account;
    let mint: PublicKey;
   
    async function createToken() 
        {
        
        
        let sig = await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
        await connection.confirmTransaction(sig);
        
        mint = await createMint(
            connection,
            fromWallet,
            fromWallet.publicKey,
            null,
            9 // 10000000000 = 10 SOL
        )
        console.log("Mint account Token address:"+mint.toBase58());
    

        fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint,
            fromWallet.publicKey
        );

        console.log("Create Token Account:"+fromTokenAccount.address.toBase58());
    }

    async function mintToken() {
        const signature = await mintTo(
            connection,
            fromWallet as Signer,
            mint,
            fromTokenAccount.address as PublicKey,
            fromWallet.publicKey,
            1000000000 //1 billion
        );
        console.log("Mint Signature:"+signature);
    }

   
    async function checkBalance() {
        const mintInfo = await getMint(connection, mint);
        console.log('Supply : '+mintInfo.supply);

        const tokenAccountInfo = await getAccount(connection, fromTokenAccount.address as PublicKey);
        console.log('Amount in token account : '+tokenAccountInfo.amount);
    }

    async function sendToken() {
        await connection.requestAirdrop(fromWallet.publicKey, LAMPORTS_PER_SOL);
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            fromWallet,
            mint,
            toWallet,
        );
        console.log("Receiver's address: "+toTokenAccount.address);

        const signature = await transfer(
            connection,
            fromWallet,
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            1000000000
        );
        console.log('Transfer completed with signature:'+signature);
    }

   
   
    return (
  
      <div className="App" style={{marginLeft:"280px", backgroundImage:"url(/sol.png)",backgroundRepeat:"no-repeat",width:"1000px",justifyContent:"center",alignItems:"center", height:"100vh"}}>
             {/* <img src={sol}  alt="backgroundImage" style={{height:"100vh",width:"100hh",backgroundSize:"cover",fontSize:"50px",backgroundRepeat:"no-repeat",justifyContent:"center"}}/> */}
            <h1 style = {{fontSize:20,color:"white",alignItems:"center",textAlign:"center", fontWeight:"bold",background:"teal",height:"100"}}>MInt TOken </h1>
           
            <div  style={{display:"flex",justifyContent:"center",alignItems:"center",height:"50vh"}} className="App">
                <button style = {{fontSize:20,fontWeight:"bold"}} className="btn btn-info btn m-3" onClick={createToken} >Create Token</button>
                <button style = {{fontSize:20,fontWeight:"bold"}} className="btn btn-primary btn m-3" onClick={mintToken} > Mint Token </button>
                <button style = {{fontSize:20,fontWeight:"bold"}} className="btn btn-success btn m-3" onClick={checkBalance}>Check Balance</button>
                <button style = {{fontSize:20,fontWeight:"bold"}} className="btn btn-warning btn m-3" onClick={sendToken} >Send Token</button>
            </div>
       </div>
      
    );
  }
  

export default MintToken;