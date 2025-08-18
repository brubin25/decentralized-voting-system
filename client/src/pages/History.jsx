import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Card, List, Spin } from "antd";
import VotingABI from "../contracts/Voting.json";
import "./history.css";

export default function BlockExplorer() {
    const [provider, setProvider] = useState(null);
    const [latestBlock, setLatestBlock] = useState(null);
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(false);

    const iface = new ethers.Interface(VotingABI.abi);

    useEffect(() => {
        const rpc = "http://127.0.0.1:7545";
        const p = new ethers.JsonRpcProvider(rpc);
        setProvider(p);

        loadRecentBlocks(p);

        // 订阅新区块
        p.on("block", async (blockNumber) => {
            setLatestBlock(blockNumber);
            const block = await fetchBlockWithTx(p, blockNumber);
            setBlocks((prev) => [block, ...prev].slice(0, 100));
        });

        return () => {
            p.removeAllListeners("block");
        };
    }, []);

    const loadRecentBlocks = async (p) => {
        setLoading(true);
        const latestBlockNumber = await p.getBlockNumber();
        setLatestBlock(latestBlockNumber);

        const blockPromises = [];
        for (let i = latestBlockNumber; i > latestBlockNumber - 100 && i >= 0; i--) {
            blockPromises.push(fetchBlockWithTx(p, i));
        }

        const result = await Promise.all(blockPromises);
        console.log('blocks:', result)
        setBlocks(result);
        setLoading(false);
    };

    const fetchBlockWithTx = async (p, blockNumber) => {
        const block = await p.getBlock(blockNumber, false);
        const transactions = [];

        for (let txHash of block.transactions) {
            const tx = await p.getTransaction(txHash);
            transactions.push(tx);
        }

        return { ...block, transactions };
    };

    return (
        <div className="hst-root">
            <div className="hst-cont">
                <h1 className="hst-title">Ganache Block Explorer</h1>
                <p className="hst-subtitle">Latest Block: {latestBlock}</p>

                {loading ? (
                    <Spin />
                ) : (
                    <List
                        dataSource={blocks}
                        itemLayout="vertical"
                        renderItem={(item) => (
                            <List.Item key={item.number}>
                                <Card title={`Block #${item.number}`}>
                                    <p>Hash: {item.hash}</p>
                                    <p>Parent: {item.parentHash}</p>
                                    <p>
                                        Timestamp:{" "}
                                        {new Date(item.timestamp * 1000).toLocaleString()}
                                    </p>
                                    <h2>Transactions</h2>
                                    <ul>
                                        {item.transactions.length === 0 ? (
                                            <li>No transactions</li>
                                        ) : (
                                            item.transactions.map((tx) => {
                                                let decoded = null;
                                                let txType = "Unknown";

                                                try {
                                                    if (!tx.to || tx.to === "0x0000000000000000000000000000000000000000") {
                                                        txType = "Contract Deployment";
                                                    } else if (tx.data && tx.data !== "0x") {
                                                        txType = "Contract Call";
                                                        console.log(`block ${item.number} data：`,tx.data)

                                                        decoded = iface.parseTransaction({ data: tx.data });
                                                        console.log(`block ${item.number} decoded：`,decoded)
                                                    } else {
                                                        txType = "ETH Transfer";
                                                    }
                                                } catch (err) {
                                                    console.warn("Decode failed:", err);
                                                }

                                                // console.log("Transaction type:", txType, "Hash:", tx.hash);

                                                return (
                                                    <li key={tx.hash}>
                                                        <p><b>Type:</b> {txType}</p>
                                                        <p><b>Hash:</b> {tx.hash}</p>
                                                        <p><b>From:</b> {tx.from}</p>
                                                        <p><b>To:</b> {tx.to}</p>
                                                        <p><b>Value:</b> {ethers.formatEther(tx.value)} ETH</p>
                                                        <p><b>Gas:</b> {tx.gasLimit.toString()}</p>

                                                        {decoded && (
                                                            <div className="decoded">
                                                                <h3>Decode Transaction Data：</h3>
                                                                <p><b>Function:</b> {decoded.name}</p>
                                                                <p>
                                                                    <b>Args:</b>{" "}
                                                                    {decoded
                                                                        ? decoded.args.map(arg =>
                                                                            typeof arg === "bigint" ? arg.toString() : arg.toString?.() ?? arg
                                                                        ).join(", ")
                                                                        : ""}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })
                                        )}

                                    </ul>
                                </Card>
                            </List.Item>
                        )}
                    />
                )}
            </div>
        </div>
    );
}
