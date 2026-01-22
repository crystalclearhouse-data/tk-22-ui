"use client";

import { useState } from "react";
import type { ScanReport } from "@/contracts/verdict";

export default function Page() {
  const [mintAddress, setMintAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ScanReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!mintAddress.trim()) {
      setError("Please enter a mint address");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mint: mintAddress }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Scan failed");
      }

      const data = await response.json();
      setReport(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "SAFE":
        return "#00ff00";
      case "WARNING":
        return "#ffaa00";
      case "FAIL_CLOSED":
        return "#ff0000";
      default:
        return "#ffffff";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        backgroundColor: "#0a0a0a",
        color: "#fff",
        fontFamily: "monospace",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "12px", color: "#00ff00" }}>
          TK-22 Scanner
        </h1>
        <p style={{ opacity: 0.7, marginBottom: "40px", fontSize: "16px" }}>
          Helius-only chain verification. No price feeds. No third-party scores.
        </p>

        <div style={{ marginBottom: "32px" }}>
          <input
            type="text"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            placeholder="Enter Solana mint address"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "16px",
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              color: "#fff",
              borderRadius: "4px",
              marginBottom: "16px",
              fontFamily: "monospace",
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !loading) handleScan();
            }}
          />
          <button
            onClick={handleScan}
            disabled={loading}
            style={{
              padding: "16px 32px",
              fontSize: "18px",
              backgroundColor: "#00ff00",
              color: "#000",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              borderRadius: "4px",
              width: "100%",
              fontFamily: "monospace",
            }}
          >
            {loading ? "Scanning..." : "Execute Scan"}
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#330000",
              border: "1px solid #ff0000",
              borderRadius: "4px",
              marginBottom: "24px",
            }}
          >
            <strong style={{ color: "#ff0000" }}>ERROR:</strong> {error}
          </div>
        )}

        {report && (
          <div
            style={{
              backgroundColor: "#1a1a1a",
              border: `2px solid ${getVerdictColor(report.verdict)}`,
              borderRadius: "4px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "32px",
                marginBottom: "8px",
                color: getVerdictColor(report.verdict),
              }}
            >
              {report.verdict}
            </h2>
            <p style={{ fontSize: "16px", marginBottom: "24px", opacity: 0.9 }}>
              {report.summary}
            </p>

            {report.flags.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>Flags:</h3>
                <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
                  {report.flags.map((flag, i) => (
                    <li key={i} style={{ opacity: 0.8 }}>
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div
              style={{
                backgroundColor: "#0f0f0f",
                padding: "16px",
                borderRadius: "4px",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>Chain Data:</h3>
              <div style={{ display: "grid", gap: "8px", fontSize: "14px" }}>
                <div>
                  <strong>Total Supply:</strong>{" "}
                  {report.data.totalSupply !== null ? report.data.totalSupply.toLocaleString() : "N/A"}
                </div>
                <div>
                  <strong>Mint Authority:</strong>{" "}
                  <span style={{ color: report.data.mintAuthority ? "#ff0000" : "#00ff00" }}>
                    {report.data.mintAuthority || "REVOKED"}
                  </span>
                </div>
                <div>
                  <strong>Freeze Authority:</strong>{" "}
                  <span style={{ color: report.data.freezeAuthority ? "#ff0000" : "#00ff00" }}>
                    {report.data.freezeAuthority || "REVOKED"}
                  </span>
                </div>
                <div>
                  <strong>Recent Transactions:</strong>{" "}
                  {report.data.recentTxCount !== null ? report.data.recentTxCount : "N/A"}
                </div>
              </div>
            </div>

            {report.data.topHolders.length > 0 && (
              <div
                style={{
                  backgroundColor: "#0f0f0f",
                  padding: "16px",
                  borderRadius: "4px",
                }}
              >
                <h3 style={{ fontSize: "18px", marginBottom: "12px" }}>Top Holders:</h3>
                <div style={{ display: "grid", gap: "8px", fontSize: "14px" }}>
                  {report.data.topHolders.map((holder, i) => (
                    <div key={i}>
                      <strong>#{i + 1}:</strong> {holder.percentage.toFixed(2)}%
                      <span style={{ opacity: 0.6, marginLeft: "8px", fontSize: "12px" }}>
                        ({holder.address.slice(0, 8)}...)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: "16px",
                fontSize: "12px",
                opacity: 0.5,
                textAlign: "right",
              }}
            >
              Scanned: {new Date(report.scannedAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
