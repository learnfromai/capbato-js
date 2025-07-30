import React from 'react';

export const AccountsPage: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 flex justify-center">
          <h2 className="text-2xl font-bold m-0" style={{ color: '#0b4f6c' }}>
            Accounts Management
          </h2>
        </div>
        <button 
          className="px-5 py-2.5 text-white font-bold rounded-lg text-sm transition-all duration-300"
          style={{
            backgroundColor: '#4db6ac',
            boxShadow: '0 4px 8px rgba(77, 182, 172, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3ba69c';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4db6ac';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <i className="fas fa-user-plus mr-2"></i>
          Create Account
        </button>
      </div>
      
      <div className="bg-white rounded-xl overflow-hidden" style={{
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: '#dbeeff' }}>
              <th className="px-5 py-3.5 text-left font-semibold" style={{ color: '#0047ab' }}>
                Name
              </th>
              <th className="px-5 py-3.5 text-center font-semibold" style={{ color: '#0047ab' }}>
                Role
              </th>
              <th className="px-5 py-3.5 text-center font-semibold" style={{ color: '#0047ab' }}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="px-5 py-3.5 text-left">Anjela Depanes</td>
              <td className="px-5 py-3.5 text-center">receptionist</td>
              <td className="px-5 py-3.5 text-center">
                <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded">
                  Change Password
                </button>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-5 py-3.5 text-left">abcd</td>
              <td className="px-5 py-3.5 text-center">receptionist</td>
              <td className="px-5 py-3.5 text-center">
                <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded">
                  Change Password
                </button>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-5 py-3.5 text-left">John Doe</td>
              <td className="px-5 py-3.5 text-center">doctor</td>
              <td className="px-5 py-3.5 text-center">
                <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded">
                  Change Password
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-5 py-3.5 text-left">Aj Admin</td>
              <td className="px-5 py-3.5 text-center">admin</td>
              <td className="px-5 py-3.5 text-center">
                <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded">
                  Change Password
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};