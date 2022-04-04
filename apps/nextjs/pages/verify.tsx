import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import {
	WalletDisconnectButton,
	WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
const enc = new TextEncoder();
const dec = new TextDecoder("utf-8");
function Footer() {
	return (
		<footer className={styles.footer}>
			<a
				href="https://solana-nft-verification.vercel.app/"
				target="_blank"
				rel="noopener noreferrer"
			>
				Powered by {/* TODO:change to solana Logo */}
				<span className={styles.logo}>
					<Image
						src="/vercel.svg"
						alt="Vercel Logo"
						width={72}
						height={16}
					/>
				</span>
			</a>
		</footer>
	);
}

function Header() {
	return (
		<Head>
			<title>NFT verification Bot</title>
			<meta name="description" content="NFT verification Bot" />
			<link rel="icon" href="/favicon.ico" />
		</Head>
	);
}

type encodePayload = {
	userid: string;
	username: string;
	exp:number;
};
const Home: NextPage = () => {
	const router = useRouter();
	const q = router.query;
	const token = q.token as string;

	const wallet = useWallet();
	const [publicKey, setPublicKey] = useState<string>("");
	const [message,setMessage] = useState<string>("");
	useEffect(() => {
		if (wallet.connected && wallet.publicKey) {
			const pubKey = wallet.publicKey?.toString();
			setPublicKey(pubKey);
		}
	}, [wallet.connected, wallet.publicKey]);
	const post = async () => {
		const res = await fetch("/api/verify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				token,
				wallet_address: publicKey,
			}),
		});
		const data = await res.json();
		setMessage(data.message);
		console.log(data);
	};
	const sign = async () => {
		if (wallet && wallet.signMessage) {
			const signed = await wallet?.signMessage(
				enc.encode("Verify Account Ownership")
			)!;
			console.log(dec.decode(signed));
			post();
		}
	};
	if (!token) {
		return (
			<>
				<h1 className="text-5xl">
					Welcome to <a>NFT verifier</a>
				</h1>
				<div className="divider divider-horizontal h-10"></div>
				<p>Looks Like You Came to This Page Without Token</p>
			</>
		);
	} else if (message) {
		return (
			<div className="vstack gap-4 col-md-4 mx-auto my-auto">
				<div className="mx-auto">
					<h1 className="text-center">Message </h1>
					<div className="row">
						<p className="text-center">
							{message}
						</p>
					</div>
				</div>
			</div>
		);
	} else {
		const { userid, username ,exp}: encodePayload = jwt.decode(
			token as string
		) as encodePayload;
		if (new Date().getTime()>exp*1000) {
			setMessage("Token Expired")
		}
		return (
			<div className="vstack gap-4 col-md-4 mx-auto my-auto">
				<div className="mx-auto">
					<h1 className="text-center">Welcome {username}</h1>
					<div className="row">
						{publicKey ? (
							<p className="text-center">
								Your Wallet Address is {publicKey}
							</p>
						) : (
							<p className="text-center">
								You are not connected to wallet
							</p>
						)}
					</div>

					{!publicKey && (
						<div className="container">
							<div className="row">
								<div className="col">
									<WalletMultiButton />
								</div>
								<div className="col">
									<WalletDisconnectButton />
								</div>
							</div>
						</div>
					)}
				</div>
				{publicKey && (
					<div className="vstack gap-2">
						<h3>
							Please sign to Verify your{" "}
							{wallet.wallet?.adapter.name} Wallet
						</h3>
						<button
							className="mx-auto btn btn-outline-dark btn-lg"
							onClick={sign}
						>
							Sign Message
						</button>
					</div>
				)}
			</div>
		);
	}
};

export default function Page() {
	return (
		<div className="container">
			<Header />
			<main className={styles.main}>
				<Home />
			</main>
			<Footer />
		</div>
	);
}

export async function getServerSideProps(context: { query: any }) {
	const q = context.query;
	const token = q.token as string;
	return {
		props: {
			token,
		},
	};
}
