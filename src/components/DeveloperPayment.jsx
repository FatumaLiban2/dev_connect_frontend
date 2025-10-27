import React, { useState, useEffect } from 'react';
import '../styles/Payment.css';
const DeveloperPayment = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Placeholder data for developers (earnings focused)
  const placeholderTransactions = [
    {
      id: 1,
      title: "Website Development Project",
      date: "25 April at 09:30 am",
      category: "Web Development",
      icon: "💻",
      amount: 2500,
      trend: "up",
      categoryColor: "#3b82f6"
    },
    {
      id: 2,
      title: "Mobile App UI Design",
      date: "24 April at 14:40 pm",
      category: "UI/UX Design",
      icon: "🎨",
      amount: 1800,
      trend: "up",
      categoryColor: "#8b5cf6"
    },
    {
      id: 3,
      title: "API Integration Service",
      date: "23 April at 16:30 pm",
      category: "Backend Development",
      icon: "⚙️",
      amount: 1500,
      trend: "up",
      categoryColor: "#10b981"
    },
    {
      id: 4,
      title: "Code Review & Consulting",
      date: "22 April at 10:15 am",
      category: "Consulting",
      icon: "📋",
      amount: 800,
      trend: "up",
      categoryColor: "#f59e0b"
    }
  ];

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    const currentUserId = localStorage.getItem('userId');
    
    if (!currentUserId) {
      // Set placeholder data when not authenticated
      setTotalEarned(8168.00);
      setBalance(6169.00);
      return;
    }

    setUserId(currentUserId);

    try {
      const response = await fetch(`/api/developer/earnings/${currentUserId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.transactions && data.transactions.length > 0) {
          setTransactions(data.transactions);
          setTotalEarned(data.totalEarned || 0);
          setBalance(data.balance || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
      // Fallback to placeholder on error
      setTotalEarned(8168.00);
      setBalance(6169.00);
    }
  };

  // Filter and search logic
  const displayTransactions = transactions.length > 0 ? transactions : placeholderTransactions;
  
  const filteredTransactions = displayTransactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'income') return matchesSearch && transaction.amount > 0;
    if (filterType === 'expenses') return matchesSearch && transaction.amount < 0;
    
    return matchesSearch;
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const formatAmount = (amount) => {
    const absAmount = Math.abs(amount);
    const sign = amount > 0 ? '+' : '-';
    return `${sign}$${absAmount}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="payment-dashboard-figma developer">
      <div className="payment-container-figma">
        {/* Top Header with Search */}
        <div className="top-header-figma">
          <div className="search-bar-figma">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search a transaction" 
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="header-right-figma">
            <button className="notification-btn-figma" aria-label="Notifications">
              🔔
              <span className="notification-badge">3</span>
            </button>
            <div className="profile-avatar-figma">
              <img 
                src="https://i.pravatar.cc/80?img=12" 
                alt="Profile" 
                className="avatar-img"
              />
            </div>
          </div>
        </div>

        {/* Stats and Activity Section */}
        <div className="stats-activity-section">
          <div className="stats-column">
            <div className="stat-card developer">
              <div className="stat-icon-circle purple">
                <span className="stat-arrow">↗</span>
              </div>
              <div className="stat-info">
                <div className="stat-label">Total earned this week</div>
                <div className="stat-value">KSH {formatCurrency(totalEarned)}</div>
              </div>
            </div>

            <div className="stat-card developer">
              <div className="stat-icon-circle indigo">
                <span className="stat-arrow">↗</span>
              </div>
              <div className="stat-info">
                <div className="stat-label">Balance</div>
                <div className="stat-value">ksh.{formatCurrency(balance)}</div>
              </div>
            </div>
          </div>

          <div className="activity-column">
            <div className="activity-card developer">
              <div className="activity-header">
                <h3>Activity</h3>
                <span className="activity-period">This week</span>
              </div>
              <div className="chart-container">
                <svg className="activity-chart" viewBox="0 0 600 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradientDev" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(139, 92, 246, 0.25)" />
                      <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                    </linearGradient>
                    <filter id="shadowDev">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(139, 92, 246, 0.3)"/>
                    </filter>
                  </defs>
                  {/* Chart curve with smooth bezier - upward trend for earnings */}
                  <path
                    d="M 0,160 Q 100,140 150,120 T 300,90 Q 400,70 450,80 T 600,75"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#shadowDev)"
                  />
                  {/* Fill area */}
                  <path
                    d="M 0,160 Q 100,140 150,120 T 300,90 Q 400,70 450,80 T 600,75 L 600,200 L 0,200 Z"
                    fill="url(#chartGradientDev)"
                  />
                </svg>
              </div>
              <div className="chart-months">
                <span>JAN</span>
                <span>FEB</span>
                <span>MAR</span>
                <span>APR</span>
                <span className="active-month developer">MAY</span>
                <span>JUN</span>
                <span>JUL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="transaction-section-figma developer">
          <div className="transaction-header-figma">
            <h2>Transaction History</h2>
            <select 
              className="transaction-filter"
              value={filterType}
              onChange={handleFilterChange}
            >
              <option value="all">All transactions</option>
              <option value="income">Earnings</option>
              <option value="expenses">Expenses</option>
            </select>
          </div>

          <div className="transaction-list-figma">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(transaction => (
                <div key={transaction.id} className="transaction-item-figma">
                  <div className="transaction-left">
                    <div className="transaction-icon-figma developer">
                      {transaction.icon}
                    </div>
                    <div className="transaction-details">
                      <div className="transaction-name">{transaction.title}</div>
                      <div className="transaction-date">{transaction.date}</div>
                    </div>
                  </div>
                  
                  <div className="transaction-right">
                    <div className="transaction-category-figma developer">
                      <span 
                        className="category-dot" 
                        style={{ background: transaction.categoryColor || '#8b5cf6' }}
                      ></span>
                      {transaction.category}
                    </div>
                    <div className="transaction-trend">
                      <svg width="70" height="28" viewBox="0 0 70 28">
                        {transaction.trend === 'up' ? (
                          <path
                            d="M 0,24 Q 17,20 35,12 T 70,4"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        ) : (
                          <path
                            d="M 0,4 Q 17,8 35,16 T 70,24"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        )}
                      </svg>
                    </div>
                    <div className={`transaction-amount-figma ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
                      {formatAmount(transaction.amount)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px', 
                color: '#9ca3af',
                fontSize: '14px'
              }}>
                No transactions found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPayment;