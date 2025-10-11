// app.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Gem,
  Percent,
  IndianRupee,
  Download,
  User,
  Phone,
  MapPin,
  Hash,
} from "lucide-react";
import jsPDF from "jspdf";
import { toWords } from "number-to-words";

// Utility: Indian number formatting
const formatIndian = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);
};

// Utility: Weight formatting (g.mmm)
const formatWeight = (grams) => {
  if (!grams || isNaN(grams)) return "0.000 g";
  return `${Math.floor(grams)}.${String(
    Math.round((grams % 1) * 1000)
  ).padStart(3, "0")} g`;
};

// Floating background icon animation
const FloatingIcon = ({ x, y, delay }) => (
  <motion.div
    className="absolute text-yellow-400 opacity-30"
    initial={{ y }}
    animate={{ y: [y, y - 50, y], rotate: [0, 20, -20, 0] }}
    transition={{
      duration: 10,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    style={{ left: x }}
  >
    <Gem size={40} />
  </motion.div>
);

export default function JewelleryCalculator() {
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [numberOfPieces, setNumberOfPieces] = useState("2");
  const [huidNumber, setHuidNumber] = useState("");
  const [jewelleryType, setJewelleryType] = useState("Gold");
  const [rateType, setRateType] = useState("10g"); // "10g" or "1g"
  const [rate, setRate] = useState("");
  const [weight, setWeight] = useState("");
  const [makingCharge, setMakingCharge] = useState("");
  const [makingChargeType, setMakingChargeType] = useState("%"); // "%" or "/gm"
  const [gst, setGst] = useState("");
  const [huidCharges, setHuidCharges] = useState("");
  const [result, setResult] = useState(null);
  const [animatedPrice, setAnimatedPrice] = useState(0);

  const calculate = () => {
    const R = parseFloat(rate || 0);
    const R1 = rateType === "10g" ? R / 10 : R; // convert if 10g
    const R10 = rateType === "10g" ? R : R * 10; // for display both

    const W = parseFloat(weight || 0);
    const TJC = R1 * W; // Total Jewellery Cost

    const MC = parseFloat(makingCharge || 0);
    let TMC = 0;
    if (makingChargeType === "%") {
      TMC = (TJC / 100) * MC;
    } else if (makingChargeType === "/gm") {
      TMC = MC * W;
    } else if (makingChargeType === "/pc") {
      TMC = MC * numberOfPieces;
    }

    const MCTJR = TJC + TMC;
    const GSTval = parseFloat(gst || 0);
    const TGST = (MCTJR / 100) * GSTval;

    const HUID = parseFloat(huidCharges || 0);
    const FTJC = MCTJR + TGST + HUID; // Final price including HUID

    setResult({
      R10,
      R1,
      W,
      TJC,
      MC,
      TMC,
      MCTJR,
      GSTval,
      TGST,
      HUID,
      FTJC,
      makingChargeType,
    });

    console.log(result);
  };

  // Animate price count-up
  useEffect(() => {
    if (!result) return;
    let start = 0;
    const end = result.FTJC;
    const duration = 1000;
    const step = 20;
    let current = start;
    const increment = (end - start) / (duration / step);

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setAnimatedPrice(current);
    }, step);

    return () => clearInterval(timer);
  }, [result]);

  const exportPDF = (
    result,
    jewelleryType,
    customerName,
    customerContact,
    customerAddress,
    huidNumber
  ) => {
    if (!result) return;

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const date = new Date().toLocaleString();

    // ---------- THEME ----------
    const darkGold = [153, 101, 21];
    const softBg = [255, 253, 245];
    const borderGold = [255, 177, 51];
    const textDark = [5, 5, 5];
    const subtleGrey = [110, 110, 110];

    // ---------- COLORS ----------
    let jewelColor;
    if (jewelleryType === "Gold") {
      jewelColor = [255, 215, 0]; // Gold
    } else if (jewelleryType === "Silver") {
      jewelColor = [192, 192, 192]; // Silver
    } else {
      jewelColor = [181, 255, 249]; // Default
    }

    // ---------- PAGE BACKGROUND ----------
    doc.setFillColor(...softBg);
    doc.rect(0, 0, 595, 842, "F");

    // ---------- HEADER BOX ----------
    doc.setDrawColor(...borderGold);
    doc.setLineWidth(1.5);
    doc.roundedRect(40, 35, 515, 100, 10, 10, "S");

    doc.setFont("times", "bold");
    doc.setFontSize(28);
    doc.setTextColor(171, 0, 37);
    doc.text("BHAGWAN DAS JEWELLERS", 297.5, 70, { align: "center" });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(12);
    doc.setTextColor(...subtleGrey);
    doc.text("Trusted Gold & Diamond Jewellery Since 1817", 297.5, 92, {
      align: "center",
    });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(...subtleGrey);
    doc.text("Cash / Credit Memo / Bill", 297.5, 108, {
      align: "center",
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(56, 19, 32);
    doc.text("GSTIN: 23AAPFB9424L1Z3", 297.5, 125, { align: "center" });

    // ---------- CUSTOMER BOX ----------
    let y = 160;
    doc.setDrawColor(...borderGold);
    doc.setLineWidth(0.6);
    doc.roundedRect(40, y - 10, 515, 90, 6, 6, "S");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGold);
    doc.setFontSize(13);
    doc.text("BILL TO", 50, y + 8);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textDark);
    doc.setFontSize(11);
    doc.text(`Name: ${customerName || "Customer Name"}`, 50, y + 30);
    doc.text(
      `Address: ${customerAddress || "Rewa, Madhya Pradesh"}`,
      50,
      y + 50
    );
    doc.text(`Contact: ${customerContact || "Not Specified"}`, 50, y + 70);

    // ---------- DATE (right aligned) ----------
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text(`Date: ${date}`, 530, y + 8, { align: "right" });

    // ---------- TABLE HEADER ----------
    y += 100;
    doc.setFillColor(...jewelColor);
    doc.setDrawColor(255, 255, 255);
    doc.roundedRect(40, y + 5, 515, 40, 5, 5, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...textDark);
    doc.text("Jewellery Type", 50, y + 20);
    doc.text("HUID No.", 50, y + 40);
    doc.text("Weight", 50, y + 60);
    doc.text("Rate/10g", 50, y + 80);
    doc.text("Total", 50, y + 100);
    doc.text("GST%", 50, y + 120);

    // ---------- TABLE DATA ----------
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`${jewelleryType}`, 540, y + 20, { align: "right" });
    doc.text(`${huidNumber || "N/A"}`, 540, y + 40, { align: "right" });
    doc.text(`${result.W} g`, 540, y + 60, { align: "right" });
    doc.text(`Rs ${result.R10}`, 540, y + 80, { align: "right" });
    doc.text(`Rs ${(result.TJC ?? 0).toFixed(2)}`, 540, y + 100, {
      align: "right",
    });
    doc.text(`${(result.TGST ?? 0).toFixed(2)}%`, 540, y + 120, {
      align: "right",
    });

    // ---------- CHARGES + SUMMARY ----------
    y += 150;
    doc.setFillColor(255, 205, 205);
    doc.setDrawColor(...borderGold);
    doc.roundedRect(40, y, 515, 100, 10, 10, "FD");
    doc.setFillColor(191, 255, 197);
    doc.setDrawColor(...borderGold);
    doc.roundedRect(40, y + 110, 515, 100, 10, 10, "FD");

    // Left box: Charges Breakdown
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 50, 50);
    doc.text("Charges Breakdown", 50, y + 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...textDark);
    doc.text(`Making Charges: `, 50, y + 40);
    doc.text(`Rs ${(result.TMC ?? 0).toFixed(2)}`, 540, y + 40, {
      align: "right",
    });
    doc.text(`HUID Charges: `, 50, y + 60);
    doc.text(`Rs ${(result.HUID ?? 0).toFixed(2)}`, 540, y + 60, {
      align: "right",
    });
    doc.text(`GST Amount: `, 50, y + 80);
    doc.text(`Rs ${(result.TGST ?? 0).toFixed(2)}`, 540, y + 80, {
      align: "right",
    });

    // Right box: Totals
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...textDark);
    doc.text("Sub Total:", 50, y + 140);
    doc.text(`Rs ${(result.TJC ?? 0).toFixed(2)}`, 540, y + 140, {
      align: "right",
    });

    doc.text("Total GST:", 50, y + 160);
    doc.text(`Rs ${(result.TGST ?? 0).toFixed(2)}`, 540, y + 160, {
      align: "right",
    });

    doc.setTextColor(70, 10, 87);
    doc.setFontSize(13);
    doc.text("Final Price:", 50, y + 190);
    doc.text(`Rs ${(result.FTJC ?? 0).toFixed(2)}`, 540, y + 190, {
      align: "right",
    });

    // ---------- AMOUNT IN WORDS ----------
    y += 250;
    const amountInWords = isFinite(result.FTJC)
      ? toWords(Math.round(result.FTJC)).toUpperCase()
      : "ZERO";

    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(10);
    doc.setTextColor(...textDark);
    doc.text("Amount in Words:", 45, y);
    doc.text(`${amountInWords} RUPEES ONLY`, 150, y, { maxWidth: 400 });

    // ---------- BANK DETAILS ----------
    y += 40;
    doc.setDrawColor(...borderGold);
    doc.roundedRect(40, y - 10, 270, 70, 6, 6, "S");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...darkGold);
    doc.text("Bank Details", 55, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(...textDark);
    doc.text("Bank: HDFC Bank, Jaipur", 55, y + 22);
    doc.text("A/C No.: 1234567890123456", 55, y + 37);
    doc.text("IFSC: HDFC0001234", 55, y + 52);

    // ---------- SIGNATURE ----------
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.setTextColor(...subtleGrey);
    doc.text("Authorized Signatory", 515, y + 45, { align: "right" });

    // ---------- FOOTER ----------
    doc.setDrawColor(...borderGold);
    doc.line(40, 800, 555, 800);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...subtleGrey);
    doc.text("Thank you for choosing Bhagwan Das Jewellers!", 297.5, 815, {
      align: "center",
    });
    doc.text(
      "Sirmour Chowk, Rewa , Madhya Pradesh | tel.: +91-7662-408875 | Mob.: 9179331159, 9893145276, 9630144461",
      297.5,
      830,
      { align: "center" }
    );

    // ---------- SAVE ----------
    doc.save(`${customerName}_BMJ_Invoice.pdf`);
  };

  return (
    <div className="relative min-h-screen flex flex-col w-[100vw] overflow-hidden bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200">
      {/* Background floating gradient animation */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #fde68a, #fef3c7, #fff)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Floating gems */}
      <FloatingIcon x="20%" y={200} delay={0} />
      <FloatingIcon x="70%" y={400} delay={3} />
      <FloatingIcon x="50%" y={600} delay={6} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex items-center justify-center p-3 md:p-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-3 md:p-10 border border-yellow-300 relative"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <motion.div
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage:
                  "linear-gradient(40deg, #f79e0b, #fbbf24, #b20d30)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
              className="text-2xl md:text-5xl font-extrabold flex flex-col md:flex-row items-center justify-center gap-3 p-3"
            >
              <motion.div
                initial={{ scale: 0.8, rotate: 0 }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 25, -25, 0],
                  color: ["#ca8a04", "#f97916", "#ca8a04"],
                  textShadow: [
                    "0 0 0px #FFD700",
                    "0 0 5px #FFD200",
                    "0 0 0px #FFD700",
                  ],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
                className="inline-block"
              >
                <Gem size={40} className="" />
              </motion.div>{" "}
              Bhagwan Das Jewellers
            </motion.div>
            <motion.div
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage:
                  "linear-gradient(40deg, #f79e0b, #fbbf24, #b20d30)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
              className="text-2xl md:text-3xl font-extrabold flex flex-col md:flex-row items-center justify-center gap-3 p-3"
            >
              <motion.div
                initial={{ scale: 0.8, rotate: 0, color: "#f50e3b" }} // base red
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                  color: ["#f50e3b", "#f97916", "#f50e3b"], // red → bright red → red
                  textShadow: [
                    "0 0 0px #ff1744",
                    "0 0 12px #ff1744",
                    "0 0 0px #ff1744",
                  ],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                }}
                className="inline-block"
              >
                <Calculator size={40} />
              </motion.div>{" "}
              Jewellery Price Calculator
            </motion.div>
          </motion.div>

          {/* Jewellery Type Selector */}
          <div className="mb-6 text-center">
            <label className="font-semibold mr-4 text-black">
              Choose Jewellery Type:
            </label>
            <select
              value={jewelleryType}
              onChange={(e) => setJewelleryType(e.target.value)}
              className="rounded-xl p-2 bg-yellow-100 text-black font-medium shadow-sm hover:shadow-lg focus:ring-2 focus:ring-yellow-400 transition"
            >
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
            </select>
          </div>

          {/* Rate Type Selector */}
          <div className="mb-6 text-center">
            <label className="font-semibold mr-4 text-black">
              Rate based on:
            </label>
            <select
              value={rateType}
              onChange={(e) => setRateType(e.target.value)}
              className="rounded-xl p-2 bg-yellow-100 text-black font-medium shadow-sm hover:shadow-lg focus:ring-2 focus:ring-yellow-400 transition"
            >
              <option value="10g">10 gram</option>
              <option value="1g">1 gram</option>
            </select>
          </div>

          {/* Input Section */}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Details */}

            <div>
              <label className="font-semibold text-gray-700 mb-1 flex gap-2 items-center">
                Customer Name
                <User size={20} className="text-yellow-800 mr-2" />
              </label>
              <div className="flex-1 sm:flex text-[10px] sm:text-lg items-center border rounded-xl p-2 bg-yellow-100 hover:shadow-md focus-within:ring-2 focus-within:ring-yellow-400 transition">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full outline-none text-black bg-transparent"
                  placeholder="Enter Customer Name"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 flex gap-2 items-center">
                Customer Contact
                <Phone size={20} className="text-yellow-800 mr-2" />
              </label>
              <div className="flex-1 sm:flex text-[14px] sm:text-lg items-center border rounded-xl p-2 bg-yellow-100 hover:shadow-md focus-within:ring-2 focus-within:ring-yellow-400 transition">
                <input
                  type="text"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  className="w-full outline-none text-black bg-transparent"
                  placeholder="Enter Contact Number"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 mb-1 flex gap-2 items-center">
                Customer Address
                <MapPin size={20} className="text-yellow-800 mr-2" />
              </label>
              <div className="flex-1 sm:flex text-[14px] sm:text-lg items-center border rounded-xl p-2 bg-yellow-100 hover:shadow-md focus-within:ring-2 focus-within:ring-yellow-400 transition">
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full outline-none text-black bg-transparent"
                  placeholder="Enter Customer Address"
                />
              </div>
            </div>

            {/* Huid Number  */}

            <div>
              <label className="font-semibold text-gray-700 mb-1 flex gap-2 items-center">
                HUID Number
                <Hash size={20} className="text-yellow-800 mr-2" />
              </label>
              <div className="flex-1 sm:flex text-[14px] sm:text-lg items-center border rounded-xl p-2 bg-yellow-100 hover:shadow-md focus-within:ring-2 focus-within:ring-yellow-400 transition">
                <input
                  type="text"
                  value={huidNumber}
                  onChange={(e) => setHuidNumber(e.target.value)}
                  className="w-full outline-none text-black bg-transparent"
                  placeholder="Enter HUID Number"
                />
              </div>
            </div>

            {/* Rate */}
            <div>
              <label className="font-semibold text-gray-700 mb-1 flex gap-2 items-center">
                Current {jewelleryType} Rate ({rateType})
                <IndianRupee size={20} className="text-yellow-800 mr-2" />
              </label>
              <div className="flex-1 sm:flex text-[14px] sm:text-lg items-center border rounded-xl p-2 bg-yellow-100 hover:shadow-md focus-within:ring-2 focus-within:ring-yellow-400 transition ">
                <input
                  type="text"
                  value={formatIndian(rate)}
                  onChange={(e) => setRate(e.target.value.replace(/,/g, ""))}
                  className="w-full outline-none text-black bg-transparent"
                  placeholder={`e.g. ${
                    rateType === "10g" ? "65,000" : "6,500"
                  }`}
                />
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="font-semibold text-gray-700 mb-1 flex gap-2 items-center">
                {jewelleryType} Weight (g.mmm)
                <Gem size={20} className="text-yellow-800 mr-2" />
              </label>
              <div className="flex-1 sm:flex text-[14px] sm:text-lg items-center border rounded-xl p-2 bg-yellow-100 hover:shadow-md focus-within:ring-2 focus-within:ring-yellow-400 transition">
                <input
                  type="text"
                  value={weight}
                  onChange={(e) =>
                    setWeight(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  className="w-full outline-none text-black bg-transparent"
                  placeholder="e.g. 12.345"
                />
              </div>
            </div>

            {/* Making Charge */}
            <div>
              <label className="font-semibold text-gray-700 mb-1 flex gap-2 items-center">
                Making Charge
                {makingChargeType === "%" ? (
                  <Percent size={20} className="text-yellow-800 mr-2" />
                ) : (
                  <span className="text-yellow-800 font-bold text-[15px] mr-2">
                    /gm
                  </span>
                )}
              </label>
              <div className="flex-1 sm:flex text-[14px] sm:text-lg items-center border rounded-xl p-2 bg-yellow-100 hover:shadow-md focus-within:ring-2 focus-within:ring-yellow-400 transition">
                <select
                  value={makingChargeType}
                  onChange={(e) => setMakingChargeType(e.target.value)}
                  className="w-24 outline-none text-black bg-transparent mr-2"
                >
                  <option value="%">%</option>
                  <option value="/gm">/gm</option>
                  <option value="/pc">/pc</option>
                </select>
                <input
                  type="text"
                  value={makingCharge}
                  onChange={(e) =>
                    setMakingCharge(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  className="flex-1 outline-none text-black bg-transparent"
                  placeholder={
                    makingChargeType === "%"
                      ? "e.g. 12"
                      : makingChargeType === "/gm"
                      ? "e.g. 250"
                      : "e.g. 500 (per piece)"
                  }
                />
              </div>
            </div>

            {/* peice input feild if user select piece */}
            {makingChargeType === "/pc" && (
              <div>
                <label className="font-semibold text-gray-700 mb-1 flex gap-2 items-center">
                  Number of Pieces
                  <Hash size={20} className="text-yellow-800 mr-2" />
                </label>
                <div className="flex-1 sm:flex text-[14px] sm:text-lg items-center border rounded-xl p-2 bg-yellow-100 hover:shadow-md focus-within:ring-2 focus-within:ring-yellow-400 transition">
                  <input
                    type="text"
                    value={numberOfPieces}
                    onChange={(e) =>
                      setNumberOfPieces(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className="w-full outline-none text-black bg-transparent"
                    placeholder="e.g. 3 (pieces)"
                  />
                </div>
              </div>
            )}
            

            {/* GST */}
            <div>
              <label className="font-semibold text-gray-700 mb-1 flex gap-2 items-center">
                GST (%)
                <Percent size={20} className="text-yellow-800 mr-2" />
              </label>
              <div className="flex-1 sm:flex text-[14px] sm:text-lg items-center border rounded-xl p-2 bg-yellow-100 hover:shadow-md focus-within:ring-2 focus-within:ring-yellow-400 transition">
                <input
                  type="text"
                  value={gst}
                  onChange={(e) =>
                    setGst(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  className="w-full outline-none text-black bg-transparent"
                  placeholder="e.g. 3"
                />
              </div>
            </div>

            {/* HUID Charges */}
            <div>
              <label className="font-semibold text-gray-700 mb-1 flex gap-2 items-center">
                HUID Charges (Rs )
                <IndianRupee size={20} className="text-yellow-800 mr-2" />
              </label>
              <div className="flex-1 sm:flex text-[14px] sm:text-lg items-center border rounded-xl p-2 bg-yellow-100 hover:shadow-md focus-within:ring-2 focus-within:ring-yellow-400 transition">
                <input
                  type="text"
                  value={huidCharges}
                  onChange={(e) =>
                    setHuidCharges(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  className="w-full outline-none text-black bg-transparent"
                  placeholder="e.g. 150"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={calculate}
              className="flex-1 relative bg-gradient-to-r from-yellow-300 to-yellow-400 text-white py-3 rounded-2xl font-bold text-lg overflow-hidden"
            >
              <span className="relative z-10 text-black text-lg">
                Calculate Final Price
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"
                animate={{ x: ["-100%", "100%", "-100%"] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.button>

            {result && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  exportPDF(
                    result,
                    jewelleryType,
                    customerName,
                    customerContact,
                    customerAddress,
                    huidNumber
                  )
                }
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-2xl font-semibold relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Download size={18} /> Export PDF
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.button>
            )}
          </div>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="mt-10 bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-inner"
              >
                <h2 className="text-xl font-bold text-yellow-700 mb-4">
                  Calculation Summary
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    Rate of 10g {jewelleryType}: Rs {formatIndian(result.R10)}
                  </li>
                  <li>
                    Rate of 1g {jewelleryType}: Rs{" "}
                    {formatIndian(result.R1.toFixed(2))}
                  </li>
                  <li>
                    Total {jewelleryType} Cost ({formatWeight(result.W)}): Rs{" "}
                    {formatIndian(result.TJC.toFixed(2))}
                  </li>
                  <li>
                    Making Charge ({result.makingChargeType}): Rs{" "}
                    {formatIndian(result.TMC.toFixed(2))}
                  </li>
                  <li>GST: Rs {formatIndian(result.TGST.toFixed(2))}</li>
                  <li>
                    HUID Charges: Rs {formatIndian(result.HUID.toFixed(2))}
                  </li>
                  <li className="font-bold text-green-700 text-lg">
                    Final Price: Rs {formatIndian(animatedPrice.toFixed(2))}
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
