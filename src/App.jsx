// app.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Gem, Percent, IndianRupee } from "lucide-react";

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

export default function JewelleryCalculator() {
  const [jewelleryType, setJewelleryType] = useState("Gold"); // default
  const [rate, setRate] = useState("");
  const [weight, setWeight] = useState("");
  const [makingCharge, setMakingCharge] = useState("");
  const [gst, setGst] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const R = parseFloat(rate || 0);
    const R1 = R / 10;
    const W = parseFloat(weight || 0);
    const TJC = R1 * W; // Total Jewellery Cost
    const MC = parseFloat(makingCharge || 0);
    const TMC = (TJC / 100) * MC;
    const MCTJR = TJC + TMC;
    const GSTval = parseFloat(gst || 0);
    const TGST = (MCTJR / 100) * GSTval;
    const FTJC = MCTJR + TGST;

    setResult({
      R,
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

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col w-[100vw]">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-50 p-6 ">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-yellow-300"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Calculator size={28} /> Jewellery Price Calculator
            </h1>
            <p className="text-gray-600">Estimate {jewelleryType.toLowerCase()} cost instantly</p>
          </div>

          {/* Jewellery Type Selector */}
          <div className="mb-8 text-center">
            <label className="font-semibold mr-4 text-black ">Choose Jewellery Type:</label>
            <select
              value={jewelleryType}
              onChange={(e) => setJewelleryType(e.target.value)}
              className=" rounded-xl p-2 bg-yellow-100 text-black font-medium"
            >
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
            </select>
          </div>

          {/* Input Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Rate */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Current {jewelleryType} Rate (10g)
              </label>
              <div className="flex items-center border rounded-xl p-2 bg-yellow-100">
                <IndianRupee className="text-yellow-800 mr-2" />
                <input
                  type="text"
                  value={formatIndian(rate)}
                  onChange={(e) => setRate(e.target.value.replace(/,/g, ""))}
                  className="w-full outline-none text-black"
                  placeholder="e.g. 65,000"
                />
              </div>
            </div>

            {/* Weight */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                {jewelleryType} Weight (g.mmm)
              </label>
              <div className="flex items-center border rounded-xl p-2 bg-yellow-100">
                <Gem className="text-yellow-800 mr-2" />
                <input
                  type="text"
                  value={weight}
                  onChange={(e) =>
                    setWeight(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  className="w-full outline-none text-black"
                  placeholder="e.g. 12.345"
                />
              </div>
            </div>

            {/* Making Charge */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Making Charge (%)
              </label>
              <div className="flex items-center border rounded-xl p-2 bg-yellow-100">
                <Percent className="text-yellow-800 mr-2" />
                <input
                  type="text"
                  value={makingCharge}
                  onChange={(e) =>
                    setMakingCharge(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  className="w-full outline-none text-black"
                  placeholder="e.g. 12"
                />
              </div>
            </div>

            {/* GST */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                GST (%)
              </label>
              <div className="flex items-center border rounded-xl p-2 bg-yellow-100">
                <Percent className="text-yellow-800 mr-2" />
                <input
                  type="text"
                  value={gst}
                  onChange={(e) =>
                    setGst(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  className="w-full outline-none text-black"
                  placeholder="e.g. 3"
                />
              </div>
            </div>
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={calculate}
            className="w-full mt-8 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-2xl font-bold text-lg shadow-lg hover:shadow-yellow-400/50"
          >
            Calculate Final Price
          </motion.button>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-yellow-700 mb-4">
                Calculation Summary
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li>
                  Rate of 10g {jewelleryType}: ₹ {formatIndian(result.R)}
                </li>
                <li>
                  Rate of 1g {jewelleryType}: ₹ {formatIndian(
                    result.R1.toFixed(2)
                  )}
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
      </div>
    </div>
  );
}
