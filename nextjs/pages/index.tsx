import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
    const wallet = useWallet();
    const [publicKey, setPublicKey] = useState<string>("");
    useEffect(()=>{
        if (wallet.connected && wallet.publicKey) {
            const pubKey = wallet.publicKey?.toString();
            setPublicKey(pubKey)
        }
    },[wallet.connected, wallet.publicKey])    
    return (
        <div className={styles.container}>
            <Head>
                <title>NFT verification Bot</title>
                <meta name="description" content="NFT verification Bot" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to <a >NFT verifier</a>
                </h1>

                <div className={styles.walletButtons}>
                    <WalletMultiButton />
                    <WalletDisconnectButton />
                </div>

                <p className={styles.description}>
                    {publicKey ||"Get started by connecting the wallet"}
                </p>

                
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://solana-nft-verification.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className={styles.logo}>
                        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </a>
            </footer>
        </div>
    );
};

export default Home;
