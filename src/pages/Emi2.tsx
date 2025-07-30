import React, { useState } from "react";

const App: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('34');
  const [loanTerm, setLoanTerm] = useState('12');
  const [prepaymentAmount, setPrepaymentAmount] = useState('');

  const parsedLoanAmount = parseFloat(loanAmount);
  const parsedInterestRate = parseFloat(interestRate);
  const parsedLoanTerm = parseFloat(loanTerm);
  const parsedPrepaymentAmount = parseFloat(prepaymentAmount) || 0;

  const isInputValid = !isNaN(parsedLoanAmount) && !isNaN(parsedInterestRate) && !isNaN(parsedLoanTerm);

  const monthlyInterestRate = parsedInterestRate / 12 / 100;

  const emi = isInputValid
    ? (parsedLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, parsedLoanTerm)) /
      (Math.pow(1 + monthlyInterestRate, parsedLoanTerm) - 1)
    : 0;

  const totalPayment = emi * parsedLoanTerm;
  const totalInterest = totalPayment - parsedLoanAmount;

  const calculatePrepayment = () => {
    const newPrincipal = parsedLoanAmount - parsedPrepaymentAmount;
    const newEmi =
      (newPrincipal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, parsedLoanTerm)) /
      (Math.pow(1 + monthlyInterestRate, parsedLoanTerm) - 1);
    const newTotalPayment = newEmi * parsedLoanTerm;
    const newTotalInterest = newTotalPayment - newPrincipal;

    return {
      newPrincipal,
      newEmi,
      newTotalInterest,
      totalSavedInterest: totalInterest - newTotalInterest,
    };
  };

  const prepaymentResult = parsedPrepaymentAmount > 0 && isInputValid ? calculatePrepayment() : null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-600">
          Loan EMI & Prepayment Calculator
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700">Loan Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 500000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Interest Rate (% p.a.)</label>
            <input
              type="number"
              placeholder="e.g. 8.5"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Loan Term (months)</label>
            <input
              type="number"
              placeholder="e.g. 60"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Optional Prepayment Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 100000"
              value={prepaymentAmount}
              onChange={(e) => setPrepaymentAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {isInputValid ? (
          <div className="mt-6 border-t pt-4 space-y-2 text-gray-800">
            <p>
              <strong>Monthly EMI:</strong> ₹{emi.toFixed(2)}
            </p>
            <p>
              <strong>Total Interest:</strong> ₹{totalInterest.toFixed(2)}
            </p>
            <p>
              <strong>Total Repayment:</strong> ₹{totalPayment.toFixed(2)}
            </p>

            {prepaymentResult && (
              <div className="mt-4 bg-green-50 p-4 rounded-xl border border-green-200">
                <h2 className="font-semibold text-green-700">Prepayment Summary:</h2>
                <p>New Principal After Prepayment: ₹{prepaymentResult.newPrincipal.toFixed(2)}</p>
                <p>Estimated Monthly EMI (same term): ₹{prepaymentResult.newEmi.toFixed(2)}</p>
                <p>New Total Interest Payable: ₹{prepaymentResult.newTotalInterest.toFixed(2)}</p>
                <p className="text-green-700 font-bold">
                  Interest Saved: ₹{prepaymentResult.totalSavedInterest.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-6 text-red-500 text-center">Please enter all required fields correctly.</p>
        )}
      </div>
    </div>
  );
};

export default App;
