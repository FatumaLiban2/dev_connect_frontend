import '../../styles/Chat.css';

const ReadReceipts = ({ status }) => {
  // status can be: 'sent', 'delivered', 'read'
  
  const getTickColor = () => {
    if (status === 'read') return '#7b3ede'; // Purple when read
    return '#95a5a6'; // Gray when sent/delivered
  };

  const renderTick = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8L6 11L13 4"
        stroke={getTickColor()}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="read-receipts">
      {status === 'sent' && (
        <div className="tick single">{renderTick()}</div>
      )}
      {(status === 'delivered' || status === 'read') && (
        <div className="tick double">
          {renderTick()}
          <div style={{ marginLeft: '-6px' }}>{renderTick()}</div>
        </div>
      )}
    </div>
  );
};

export default ReadReceipts;
