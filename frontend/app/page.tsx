"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3001/api/transactions",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      setTransactions(data.transactions);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchTransactions();
  }, []);

  const handleExtract = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:3001/api/transactions/extract",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Transaction Saved!");
      setText("");
      fetchTransactions();
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">
          Finance Transaction Extractor
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste bank statement text here..."
        className="w-full border p-3 h-40 rounded"
      />

      <button
        onClick={handleExtract}
        className="bg-black text-white px-4 py-2 mt-4 rounded"
      >
        Parse & Save
      </button>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Transactions
        </h2>

        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Confidence</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="border p-2">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>

                <td className="border p-2">
                  {transaction.description}
                </td>

                <td className="border p-2">
                  ₹{transaction.amount}
                </td>

                <td className="border p-2">
                  {transaction.confidence}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}