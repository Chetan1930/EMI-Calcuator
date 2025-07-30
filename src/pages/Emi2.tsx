import React, { useState, useEffect } from "react";

const App: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(33000);
  const [interestRate, setInterestRate] = useState(38);
  const [loanTerm, setLoanTerm] = useState(12);
  const [prepaymentAmount, setPrepaymentAmount] = useState(0);
  const [savedData, setSavedData] = useState<any[]>([]);

  const monthlyInterestRate = interestRate / 12 / 100;

  const emi =
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
    (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);

  const totalPayment = emi * loanTerm;
  const totalInterest = totalPayment - loanAmount;

  useEffect(() => {
    const storedData = localStorage.getItem("loanCalculatorData");
    if (storedData) {
      setSavedData(JSON.parse(storedData));
    }
  }, []);

  const calculatePrepayment = () => {
    if (prepaymentAmount <= emi) return null;
    if (prepaymentAmount >= loanAmount) return null;

    let remainingPrincipal = loanAmount;
    let interestPaid = 0;

    for (let i = 0; i < loanTerm; i++) {
      const monthlyInterest = remainingPrincipal * monthlyInterestRate;
      const monthlyPrincipal = emi - monthlyInterest;
      remainingPrincipal -= monthlyPrincipal;
      interestPaid += monthlyInterest;
    }

    const newPrincipal = loanAmount - prepaymentAmount;
    const newEmi =
      (newPrincipal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
      (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);
    const newTotalPayment = newEmi * loanTerm;
    const newTotalInterest = newTotalPayment - newPrincipal;

    return {
      newPrincipal,
      newEmi,
      newTotalInterest,
      totalSavedInterest: totalInterest - newTotalInterest,
    };
  };

  const prepaymentResult = prepaymentAmount > emi && prepaymentAmount < loanAmount ? calculatePrepayment() : null;

  const handleSave = () => {
    const newEntry = {
      loanAmount,
      interestRate,
      loanTerm,
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
    };
    const updatedData = [...savedData, newEntry];
    setSavedData(updatedData);
    localStorage.setItem("loanCalculatorData", JSON.stringify(updatedData));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">Loan EMI & Prepayment Calculator</h1>

        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Loan Amount (₹)</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Interest Rate (% p.a.)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Loan Term (months)</label>
            <input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Optional Prepayment Amount (₹)</label>
            <input
              type="number"
              value={prepaymentAmount}
              onChange={(e) => setPrepaymentAmount(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {prepaymentAmount > 0 && prepaymentAmount <= emi && (
              <p className="text-sm text-red-500 mt-1">Prepayment must be more than EMI to reduce interest.</p>
            )}
            {prepaymentAmount >= loanAmount && (
              <p className="text-sm text-red-500 mt-1">Prepayment must be less than Loan Amount.</p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t pt-4 space-y-2 text-gray-800">
          <p><strong>Monthly EMI:</strong> ₹{emi.toFixed(2)}</p>
          <p><strong>Total Interest:</strong> ₹{totalInterest.toFixed(2)}</p>
          <p><strong>Total Repayment:</strong> ₹{totalPayment.toFixed(2)}</p>

          {prepaymentResult && (
            <div className="mt-4 bg-green-50 p-4 rounded-xl border border-green-200">
              <h2 className="font-semibold text-green-700">Prepayment Summary:</h2>
              <p>New Principal After Prepayment: ₹{prepaymentResult.newPrincipal.toFixed(2)}</p>
              <p>Estimated Monthly EMI (unchanged term): ₹{prepaymentResult.newEmi.toFixed(2)}</p>
              <p>New Total Interest Payable: ₹{prepaymentResult.newTotalInterest.toFixed(2)}</p>
              <p className="text-green-700 font-bold">Interest Saved: ₹{prepaymentResult.totalSavedInterest.toFixed(2)}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
        >
          Save this Calculation
        </button>

        {savedData.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2 text-gray-700">Saved Calculations:</h2>
            <ul className="space-y-2 max-h-40 overflow-y-auto text-sm">
              {savedData.map((item, index) => (
                <li key={index} className="p-2 bg-gray-50 border border-gray-200 rounded-md">
                  ₹{item.loanAmount} | Rate: {item.interestRate}% | EMI: ₹{item.emi} | Interest: ₹{item.totalInterest}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
