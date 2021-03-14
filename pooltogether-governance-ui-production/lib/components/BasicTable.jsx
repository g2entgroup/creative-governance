import classnames from 'classnames'
import React from 'react'

export const BasicTable = (props) => {
  const { nestedTable, tableInstance, className: externalClassName } = props

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance

  let className = classnames('w-full', externalClassName)
  if (nestedTable) {
    className = classnames(
      'table-fixed w-full text-xxxs xs:text-xxs sm:text-sm align-top',
      externalClassName
    )
  }

  return (
    <>
      <table {...getTableProps()} className={className}>
        <thead>
          {headerGroups.map((headerGroup, index) => {
            return (
              <tr
                key={`header-group-${index}`}
                {...headerGroup.getHeaderGroupProps()}
                style={nestedTable ? { background: 'none' } : {}}
              >
                {headerGroup.headers.map((column) => {
                  return (
                    <th key={`column-${column.id}`} {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
                  )
                })}
              </tr>
            )
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row)

            return (
              <tr key={`row-${row.id}`} {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td key={`row-${row.id}-cell-${index}`} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
