// app.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Gem, Percent, IndianRupee, Download } from "lucide-react";
import jsPDF from "jspdf";

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

// Variants for stagger animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function JewelleryCalculator() {
  const [jewelleryType, setJewelleryType] = useState("Gold");
  const [rateType, setRateType] = useState("10g"); // "10g" or "1g"
  const [rate, setRate] = useState("");
  const [weight, setWeight] = useState("");
  const [makingCharge, setMakingCharge] = useState("");
  const [gst, setGst] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const R = parseFloat(rate || 0);
    const R1 = rateType === "10g" ? R / 10 : R; // convert if 10g
    const R10 = rateType === "10g" ? R : R * 10; // for display both

    const W = parseFloat(weight || 0);
    const TJC = R1 * W; // Total Jewellery Cost
    const MC = parseFloat(makingCharge || 0);
    const TMC = (TJC / 100) * MC;
    const MCTJR = TJC + TMC;
    const GSTval = parseFloat(gst || 0);
    const TGST = (MCTJR / 100) * GSTval;
    const FTJC = MCTJR + TGST;

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
      FTJC,
    });
  };

  const exportPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    const date = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.text("💎 Jewellery Price Calculator", 20, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${date}`, 20, 28);

    doc.setFontSize(12);
    doc.text(`Jewellery Type: ${jewelleryType}`, 20, 40);
    doc.text(
      `Rate of 10g ${jewelleryType}: ₹ ${formatIndian(result.R10)}`,
      20,
      50
    );
    doc.text(
      `Rate of 1g ${jewelleryType}: ₹ ${formatIndian(result.R1.toFixed(2))}`,
      20,
      60
    );
    doc.text(
      `Total ${jewelleryType} Cost (${formatWeight(
        result.W
      )}): ₹ ${formatIndian(result.TJC.toFixed(2))}`,
      20,
      70
    );
    doc.text(`Making Charge: ₹ ${formatIndian(result.TMC.toFixed(2))}`, 20, 80);
    doc.text(`GST: ₹ ${formatIndian(result.TGST.toFixed(2))}`, 20, 90);

    doc.setFontSize(14);
    doc.setTextColor(0, 128, 0);
    doc.text(`Final Price: ₹ ${formatIndian(result.FTJC.toFixed(2))}`, 20, 105);

    doc.save("jewellery-price.pdf");
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

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-10 border border-yellow-300 relative"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <motion.h1
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
              className="text-4xl font-extrabold flex items-center justify-center gap-3"
            >
              <Calculator size={36} className="text-yellow-600" /> Jewellery
              Price Calculator
            </motion.h1>
          </motion.div>

          {/* Jewellery Type Selector */}
          <div className="mb-6 text-center">
            <label className="font-semibold mr-4 text-black">
              Choose Jewellery Type:
            </label>
            <select
              value={jewelleryType}
              onChange={(e) => setJewelleryType(e.target.value)}
              className="rounded-xl p-2 bg-yellow-100 text-black font-medium shadow-sm hover:shadow-lg"
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
              className="rounded-xl p-2 bg-yellow-100 text-black font-medium shadow-sm hover:shadow-lg"
            >
              <option value="10g">10 gram</option>
              <option value="1g">1 gram</option>
            </select>
          </div>

          {/* Input Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Rate */}
            <motion.div variants={itemVariants}>
              <label className="block font-semibold text-gray-700 mb-1">
                Current {jewelleryType} Rate ({rateType})
              </label>
              <div className="flex items-center border rounded-xl p-2 bg-yellow-100 hover:shadow-md">
                <IndianRupee className="text-yellow-800 mr-2" />
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
            </motion.div>

            {/* Weight */}
            <motion.div variants={itemVariants}>
              <label className="block font-semibold text-gray-700 mb-1">
                {jewelleryType} Weight (g.mmm)
              </label>
              <div className="flex items-center border rounded-xl p-2 bg-yellow-100 hover:shadow-md">
                <Gem className="text-yellow-800 mr-2" />
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
            </motion.div>

            {/* Making Charge */}
            <motion.div variants={itemVariants}>
              <label className="block font-semibold text-gray-700 mb-1">
                Making Charge (%)
              </label>
              <div className="flex items-center border rounded-xl p-2 bg-yellow-100 hover:shadow-md">
                <Percent className="text-yellow-800 mr-2" />
                <input
                  type="text"
                  value={makingCharge}
                  onChange={(e) =>
                    setMakingCharge(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  className="w-full outline-none text-black bg-transparent"
                  placeholder="e.g. 12"
                />
              </div>
            </motion.div>

            {/* GST */}
            <motion.div variants={itemVariants}>
              <label className="block font-semibold text-gray-700 mb-1">
                GST (%)
              </label>
              <div className="flex items-center border rounded-xl p-2 bg-yellow-100 hover:shadow-md">
                <Percent className="text-yellow-800 mr-2" />
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
            </motion.div>
          </motion.div>

          {/* Buttons */}
          <div className="flex gap-4 mt-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={calculate}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-2xl font-bold text-lg"
            >
              Calculate Final Price
            </motion.button>

            {result && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportPDF}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-2xl font-semibold"
              >
                <Download size={18} /> Export PDF
              </motion.button>
            )}
          </div>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="mt-10 bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-inner"
            >
              <h2 className="text-xl font-bold text-yellow-700 mb-4">
                Calculation Summary
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>
                  Rate of 10g {jewelleryType}: ₹ {formatIndian(result.R10)}
                </li>
                <li>
                  Rate of 1g {jewelleryType}: ₹{" "}
                  {formatIndian(result.R1.toFixed(2))}
                </li>
                <li>
                  Total {jewelleryType} Cost ({formatWeight(result.W)}): ₹{" "}
                  {formatIndian(result.TJC.toFixed(2))}
                </li>
                <li>Making Charge: ₹ {formatIndian(result.TMC.toFixed(2))}</li>
                <li>GST: ₹ {formatIndian(result.TGST.toFixed(2))}</li>
                <li className="font-bold text-green-700 text-lg">
                  Final Price: ₹ {formatIndian(result.FTJC.toFixed(2))}
                </li>
              </ul>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
