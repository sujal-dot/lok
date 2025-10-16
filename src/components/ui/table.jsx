import React from 'react'
export function Table({ children }) {
  return <table className="w-full text-sm">{children}</table>
}
export function TableHeader({ children }) {
  return <thead className="bg-gray-50 text-gray-600">{children}</thead>
}
export function TableBody({ children }) {
  return <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>
}
export function TableRow({ children }) {
  return <tr className="hover:bg-gray-50">{children}</tr>
}
export function TableHead({ children }) {
  return <th className="px-4 py-3 text-left font-semibold">{children}</th>
}
export function TableCell({ children }) {
  return <td className="px-4 py-3 text-gray-800">{children}</td>
}
