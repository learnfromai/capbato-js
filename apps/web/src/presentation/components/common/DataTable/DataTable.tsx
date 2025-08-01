import React, { useState, useMemo } from 'react';
import { Box, TextInput, Table, Text, Loader } from '@mantine/core';
import { DataTableProps, SearchableItem } from './types';

export function DataTable<T extends SearchableItem>({
  data,
  columns,
  searchable = false,
  searchPlaceholder = 'Search...',
  searchFields,
  isLoading = false,
  emptyStateMessage = 'No data available',
  onRowClick
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchable || !searchQuery) return data;

    const query = searchQuery.toLowerCase();
    
    return data.filter(item => {
      // If specific search fields are provided, search only those fields
      if (searchFields && searchFields.length > 0) {
        return searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(query);
        });
      }
      
      // Otherwise, search all searchable columns
      return columns.some(column => {
        if (column.searchable === false) return false;
        
        const value = item[column.key as keyof T];
        return value && String(value).toLowerCase().includes(query);
      });
    });
  }, [data, searchQuery, searchFields, columns, searchable]);

  if (isLoading) {
    return (
      <Box style={{ textAlign: 'center', padding: '40px' }}>
        <Loader size="lg" />
        <Text mt="md">Loading...</Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* Search Bar */}
      {searchable && (
        <TextInput
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          style={{
            marginBottom: '15px'
          }}
        />
      )}

      {/* Table */}
      <Box
        style={{
          borderRadius: '10px',
          overflow: 'hidden',
          marginTop: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
            background: 'white'
          }}
        >
          <Table.Thead>
            <Table.Tr
              style={{
                background: '#dbeeff',
                color: '#0047ab'
              }}
            >
              {columns.map((column, index) => (
                <Table.Th
                  key={String(column.key)}
                  style={{
                    padding: '14px',
                    textAlign: column.align || 'left',
                    paddingLeft: column.align === 'left' ? '20px' : '14px',
                    borderBottom: '1px solid #ddd',
                    borderRight: index < columns.length - 1 ? '1px solid #ddd' : 'none',
                    fontWeight: 600,
                    width: column.width
                  }}
                >
                  {column.header}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredData.length === 0 ? (
              <Table.Tr>
                <Table.Td
                  colSpan={columns.length}
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '16px'
                  }}
                >
                  {emptyStateMessage}
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredData.map((item, rowIndex) => (
                <Table.Tr
                  key={rowIndex}
                  style={{
                    borderBottom: rowIndex < filteredData.length - 1 ? '1px solid #ddd' : 'none',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  {columns.map((column, colIndex) => {
                    const value = item[column.key as keyof T];
                    const displayValue = column.render ? column.render(value, item) : String(value || '');
                    
                    return (
                      <Table.Td
                        key={String(column.key)}
                        style={{
                          padding: '14px',
                          textAlign: column.align || 'left',
                          paddingLeft: column.align === 'left' ? '20px' : '14px',
                          borderRight: colIndex < columns.length - 1 ? '1px solid #ddd' : 'none',
                          whiteSpace: column.align === 'center' ? 'nowrap' : 'normal',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          wordWrap: column.align !== 'center' ? 'break-word' : 'normal'
                        }}
                      >
                        {displayValue}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Box>
    </Box>
  );
}
