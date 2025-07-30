import React, { useState } from "react";

const App: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(34);
  const [loanTerm, setLoanTerm] = useState(12);
  const [prepaymentAmount, setPrepaymentAmount] = useState(0);

  const monthlyInterestRate = interestRate / 12 / 100;

  const emi =
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
    (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);

  const totalPayment = emi * loanTerm;
  const totalInterest = totalPayment - loanAmount;

  // Prepayment Calculation ( everthing is done now)
  const calculatePrepayment = () => {
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

  const prepaymentResult = prepaymentAmount > 0 ? calculatePrepayment() : null;

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
      </div>
    </div>
  );
};

export default App;
