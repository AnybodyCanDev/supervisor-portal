'use client';

import { useState, useEffect } from 'react';
import { Thresholds } from '../../types/types';
import { getThresholds, updateThreshold } from '~/server/queries';
import Icon from '../_components/icon-wrapper';
import Loader from '../_components/loader';

export default function ThresholdMatrix() {
  const [thresholds, setThresholds] = useState<Thresholds[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editingCell, setEditingCell] = useState<{ category: string; rank: string } | null>(null);
  const [editedValue, setEditedValue] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchThresholds = async () => {
      const data = await getThresholds();
      setThresholds(data);
      setLoading(false);
    };
    fetchThresholds();
  }, []);

  const categories = [...new Set(thresholds.map(t => t.category))];
  const ranks = [...new Set(thresholds.map(t => t.min_rank_req))];

  const handleSort = (category: string) => {
    if (sortColumn === category) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(category);
      setSortOrder('asc');
    }
  };

  const sortedThresholds = [...thresholds].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a.category === sortColumn ? a.max_amount : 0;
    const valB = b.category === sortColumn ? b.max_amount : 0;
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const handleEdit = (category: string, rank: string, value: number) => {
    setEditingCell({ category, rank });
    setEditedValue(value);
  };

  const handleSave = async () => {
    if (editingCell && editedValue !== null) {
      await updateThreshold(editingCell.category, editingCell.rank, editedValue);
      setThresholds(prev =>
        prev.map(t =>
          t.category === editingCell.category && t.min_rank_req === editingCell.rank
            ? { ...t, max_amount: editedValue }
            : t
        )
      );
      setEditingCell(null);
      setEditedValue(null);
    }
  };

  return (
    <div className='p-6 bg-white shadow-md rounded-xl'>
      <h1 className='text-2xl font-semibold mb-4 text-gray-700'>Threshold Matrix</h1>
      {loading ? (
        <Loader />
      ) : (
        <table className='table-auto w-full border-collapse shadow-md rounded-lg'>
          <thead>
            <tr className='bg-gray-100 text-gray-700'>
              <th className='px-4 py-2'>Min Rank Req</th>
              {categories.map(category => (
                <th
                  key={category}
                  className='px-4 py-2 cursor-pointer'
                  onClick={() => handleSort(category)}
                >
                  {category}
                  {sortColumn === category && (
                    <Icon icon={sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'} className='ml-2' />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ranks.map(rank => (
              <tr key={rank} className='border-b'>
                <td className='px-4 py-2'>{rank}</td>
                {categories.map(category => {
                  const threshold = sortedThresholds.find(t => t.category === category && t.min_rank_req === rank);
                  return (
                    <td key={category} className='px-4 py-2 text-center'>
                      {editingCell?.category === category && editingCell?.rank === rank ? (
                        <input
                          type='number'
                          value={editedValue ?? ''}
                          onChange={e => setEditedValue(parseInt(e.target.value, 10))}
                          onBlur={handleSave}
                          className='input input-bordered w-full text-center'
                          autoFocus
                        />
                      ) : (
                        <span
                          className='cursor-pointer hover:underline'
                          onClick={() => handleEdit(category, rank, threshold?.max_amount || 0)}
                        >
                          {threshold?.max_amount ?? '-'}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
