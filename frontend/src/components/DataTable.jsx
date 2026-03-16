import React from 'react';

const DataTable = ({ columns, data, pagination }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-color-white)',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      border: '1px solid var(--border-color)',
      marginTop: '24px'
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border-color)' }}>
              {columns.map((col, index) => (
                <th key={index} style={{
                  padding: '16px 24px',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {col.header}
                </th>
              ))}
              {pagination && (pagination.onEdit || pagination.onDelete) && (
                <th style={{
                  padding: '16px 24px',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  textAlign: 'right'
                }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} style={{
                borderBottom: rowIndex === data.length - 1 ? 'none' : '1px solid var(--border-color)',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} style={{
                    padding: '16px 24px',
                    color: 'var(--text-main)',
                    fontSize: '15px'
                  }}>
                    {row[col.accessor]}
                  </td>
                ))}
                {pagination && (pagination.onEdit || pagination.onDelete) && (
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {pagination.onEdit && (
                        <button
                          onClick={() => pagination.onEdit(row)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'white',
                            color: 'var(--text-main)',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '14px',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--primary-red)';
                            e.currentTarget.style.color = 'var(--primary-red)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.color = 'var(--text-main)';
                          }}
                        >
                          Edit
                        </button>
                      )}
                      {pagination.onDelete && (
                        <button
                          onClick={() => pagination.onDelete(row)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: '#fff1f2',
                            color: 'var(--primary-red)',
                            cursor: 'pointer',
                            fontWeight: '500',
                            fontSize: '14px',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--primary-red)';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#fff1f2';
                            e.currentTarget.style.color = 'var(--primary-red)';
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No data available
        </div>
      )}
      
      {pagination && pagination.totalPages > 0 && (
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Showing page {pagination.currentPage + 1} of {pagination.totalPages} ({pagination.totalElements} total)
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 0}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: pagination.currentPage === 0 ? '#f9fafb' : 'white',
                color: pagination.currentPage === 0 ? '#9ca3af' : 'var(--text-main)',
                cursor: pagination.currentPage === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              Previous
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages - 1}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: pagination.currentPage >= pagination.totalPages - 1 ? '#f9fafb' : 'white',
                color: pagination.currentPage >= pagination.totalPages - 1 ? '#9ca3af' : 'var(--text-main)',
                cursor: pagination.currentPage >= pagination.totalPages - 1 ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
