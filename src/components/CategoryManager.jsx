import React, { useState } from 'react';

const initialCategories = [
  'All',
  'Landscape',
  'Abstract',
  'Portrait',
  'Still Life',
  'Modern',
  'Classic',
  'Nature',
  'Cityscape',
];

const CategoryManager = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState('');
  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
      setNewCategory('');
    }
  };
  const handleRemoveCategory = (cat) => {
    setCategories(categories.filter(c => c !== cat));
  };

  return (
    <div className="bg-green-50 rounded-xl p-6 mb-8">
      <h3 className="text-lg font-semibold text-green-800 mb-4">Manage Categories</h3>
      <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          placeholder="Add new category"
          className="px-3 py-2 border rounded w-64"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
        >
          Add
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          cat === 'All' ? (
            <span
              key={cat}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium cursor-not-allowed"
            >
              {cat}
            </span>
          ) : (
            <span
              key={cat}
              className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
            >
              {cat}
              <button
                type="button"
                onClick={() => handleRemoveCategory(cat)}
                className="ml-1 text-red-500 hover:text-red-700 text-lg font-bold px-1"
                title="Remove"
              >
                ×
              </button>
            </span>
          )
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
