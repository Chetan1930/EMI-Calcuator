import React, { useState } from 'react';

const LoanCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState<string>('');
  const [rate, setRate] = useState<string>('34');
  const [tenure, setTenure] = useState<string>('12');
  const [paidEMIs, setPaidEMIs] = useState<string>('1');
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'schedule'>('summary');

  const calculate = () => {
    const principalNum = parseFloat(principal);
    const rateNum = parseFloat(rate);
    const tenureNum = parseFloat(tenure);
    const paidEMIsNum = parseFloat(paidEMIs);

    if (isNaN(principalNum) || isNaN(rateNum) || isNaN(tenureNum) || isNaN(paidEMIsNum)) {
      alert('Please fill all the fields with valid numbers.');
      return;
    }

    if (principalNum <= 0 || rateNum <= 0 || tenureNum <= 0 || paidEMIsNum < 0) {
      alert('Please enter positive values for all fields.');
      return;
    }

    if (paidEMIsNum > tenureNum) {
      alert('Paid EMIs cannot be greater than total tenure.');
      return;
    }

    const r = rateNum / 1200; // Monthly interest rate
    const emi = (principalNum * r * Math.pow(1 + r, tenureNum)) / (Math.pow(1 + r, tenureNum) - 1);
    const totalPayment = emi * tenureNum;
    const totalInterest = totalPayment - principalNum;

    let outstanding = principalNum;
    let schedule = [];

    for (let i = 1; i <= tenureNum; i++) {
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
      if (i === paidEMIsNum) break;
    }

    setResults({
      emi: emi.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      outstanding: outstanding.toFixed(2),
      schedule,
      principal: principalNum,
    });
    setActiveTab('summary');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-xl">
      <h1 className="text-2xl font-bold text-indigo-600 text-center mb-6">💸 Loan EMI & Prepayment Calculator</h1>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          Calculate your monthly EMI, total interest, and see how much principal you've paid after a certain number of EMIs.
          Useful for planning prepayments and understanding your loan amortization.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="principal" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount (₹)
            </label>
            <input
              id="principal"
              type="number"
              placeholder="E.g. 500000"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-1">
              Annual Interest Rate (%)
            </label>
            <input
              id="rate"
              type="number"
              placeholder="E.g. 8.5"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
              step="0.1"
            />
          </div>
          
          <div>
            <label htmlFor="tenure" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Tenure (months)
            </label>
            <input
              id="tenure"
              type="number"
              placeholder="E.g. 60 (5 years)"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="paidEMIs" className="block text-sm font-medium text-gray-700 mb-1">
              EMIs Already Paid
            </label>
            <input
              id="paidEMIs"
              type="number"
              placeholder="E.g. 12"
              value={paidEMIs}
              onChange={(e) => setPaidEMIs(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-200 font-medium shadow-md"
          disabled={!principal}
        >
          Calculate EMI & Payment Schedule
        </button>
      </div>

      {results && (
        <div className="mt-6 space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'summary' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('summary')}
            >
              📊 Summary
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'schedule' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('schedule')}
            >
              📅 Payment Schedule
            </button>
          </div>

          {activeTab === 'summary' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Loan Details</h3>
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Principal Amount:</span>
                    <span className="font-medium">{formatCurrency(results.principal)}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-medium">{rate}% p.a.</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Loan Tenure:</span>
                    <span className="font-medium">{tenure} months</span>
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Payment Summary</h3>
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Monthly EMI:</span>
                    <span className="font-medium text-indigo-600">₹{results.emi}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Total Interest:</span>
                    <span className="font-medium">₹{results.totalInterest}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Total Payment:</span>
                    <span className="font-medium">₹{results.totalPayment}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Outstanding after {paidEMIs} EMI(s):</span>
                    <span className="font-medium text-green-600">₹{results.outstanding}</span>
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <h3 className="font-medium text-indigo-700 mb-2">💡 Key Insights</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>You pay {formatCurrency(parseFloat(results.totalInterest))} in interest over the loan term</li>
                  <li>That's {(parseFloat(results.totalInterest)/parseFloat(results.principal)*100).toFixed(1)}% of your principal amount</li>
                  <li>After {paidEMIs} payments, you still owe {formatCurrency(parseFloat(results.outstanding))}</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm">
                <thead className="bg-indigo-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Month</th>
                    <th className="border px-4 py-2 text-right">EMI</th>
                    <th className="border px-4 py-2 text-right">Principal</th>
                    <th className="border px-4 py-2 text-right">Interest</th>
                    <th className="border px-4 py-2 text-right">Remaining</th>
                    <th className="border px-4 py-2 text-right">Paid %</th>
                  </tr>
                </thead>
                <tbody>
                  {results.schedule.map((row: any) => (
                    <tr key={row.month} className={row.month % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="border px-4 py-2">{row.month}</td>
                      <td className="border px-4 py-2 text-right">₹{row.emi.toFixed(2)}</td>
                      <td className="border px-4 py-2 text-right text-green-600">₹{row.principal.toFixed(2)}</td>
                      <td className="border px-4 py-2 text-right text-red-500">₹{row.interest.toFixed(2)}</td>
                      <td className="border px-4 py-2 text-right">₹{row.balance.toFixed(2)}</td>
                      <td className="border px-4 py-2 text-right">
                        {((results.principal - row.balance) / results.principal * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Note: This calculator provides estimates only. Actual loan terms may vary by lender.</p>
        <p className="mt-1">Interest is calculated on a reducing balance basis.</p>
      </div>
    </div>
  );
};

export default LoanCalculator;