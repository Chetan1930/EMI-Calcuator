import React, { useState } from 'react';

const LoanCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState(0);
  const [rate, setRate] = useState(34);
  const [tenure, setTenure] = useState(12);
  const [paidEMIs, setPaidEMIs] = useState(1);
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    const r = rate / 1200; // Monthly interest rate
    const emi = (principal * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1);
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - principal;

    let outstanding = principal;
    let schedule = [];

    for (let i = 1; i <= tenure; i++) {
      const interest = outstanding * r;
      const principalPaid = emi - interest;
      outstanding -= principalPaid;
      schedule.push({
        month: i,
        emi: emi,
        interest: interest,
        principal: principalPaid,
        balance: Math.max(0, outstanding),
      });
      if (i === paidEMIs) break;
    }

    setResults({
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      outstanding: outstanding.toFixed(2),
      schedule,
    });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold text-indigo-600 text-center mb-6">💸 Loan EMI & Prepayment Calculator</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <input
          type="number"
          placeholder="Loan Amount (₹)"
          value={principal}
          onChange={(e) => setPrincipal(Number(e.target.value))}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          placeholder="Annual Interest Rate (%)"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          placeholder="Tenure (months)"
          value={tenure}
          onChange={(e) => setTenure(Number(e.target.value))}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          placeholder="EMIs Paid"
          value={paidEMIs}
          onChange={(e) => setPaidEMIs(Number(e.target.value))}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <button
        onClick={calculate}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
      >
        Calculate
      </button>

      {results && (
        <div className="mt-6 space-y-3 bg-gray-50 p-4 rounded-md">
          <p><strong>📌 Monthly EMI:</strong> ₹{results.emi}</p>
          <p><strong>📌 Total Interest:</strong> ₹{results.totalInterest}</p>
          <p><strong>📌 Total Payment:</strong> ₹{results.totalPayment}</p>
          <p><strong>✅ Outstanding after {paidEMIs} EMI(s):</strong> ₹{results.outstanding}</p>

          <details className="mt-4">
            <summary className="text-indigo-600 underline cursor-pointer font-medium">📊 Amortization Schedule</summary>
            <table className="w-full mt-4 border border-gray-300 text-sm">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="border px-2 py-1">Month</th>
                  <th className="border px-2 py-1">EMI</th>
                  <th className="border px-2 py-1">Interest</th>
                  <th className="border px-2 py-1">Principal</th>
                  <th className="border px-2 py-1">Remaining</th>
                </tr>
              </thead>
              <tbody>
                {results.schedule.map((row: any) => (
                  <tr key={row.month} className="text-center">
                    <td className="border px-2 py-1">{row.month}</td>
                    <td className="border px-2 py-1">₹{row.emi.toFixed(2)}</td>
                    <td className="border px-2 py-1">₹{row.interest.toFixed(2)}</td>
                    <td className="border px-2 py-1">₹{row.principal.toFixed(2)}</td>
                    <td className="border px-2 py-1">₹{row.balance.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
