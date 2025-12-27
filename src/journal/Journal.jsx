import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, FileText, Calendar, Trash2 } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import Editor from './Editor';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

const Journal = () => {
    const { t } = useTranslation();
    const [entries, setEntries] = useLocalStorage('journal_entries', []);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEntry, setCurrentEntry] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSave = (entry) => {
        if (currentEntry) {
            // Update existing
            setEntries(entries.map(e => e.id === entry.id ? entry : e));
        } else {
            // Create new
            setEntries([entry, ...entries]);
        }
        setIsEditing(false);
        setCurrentEntry(null);
    };

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this entry?')) {
            setEntries(entries.filter(e => e.id !== id));
        }
    };

    const openEntry = (entry) => {
        setCurrentEntry(entry);
        setIsEditing(true);
    };

    const filteredEntries = entries.filter(entry =>
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isEditing) {
        return (
            <Editor
                onSave={handleSave}
                onCancel={() => { setIsEditing(false); setCurrentEntry(null); }}
                initialData={currentEntry}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('journal')}</h1>
                    <p className="text-gray-600 dark:text-gray-400">Reflect on your journey</p>
                </div>
                <Button onClick={() => setIsEditing(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Entry
                </Button>
            </div>

            {entries.length > 0 && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search entries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {filteredEntries.map((entry) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                        >
                            <Card
                                className="p-6 cursor-pointer hover:shadow-md transition-shadow group relative"
                                onClick={() => openEntry(entry)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-1">{entry.title}</h3>
                                    <button
                                        onClick={(e) => handleDelete(entry.id, e)}
                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 text-sm">
                                    {entry.content}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(entry.date).toLocaleDateString()}
                                    {entry.emotion && (
                                        <span className="ml-auto bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded-full">{entry.emotion}</span>
                                    )}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {entries.length === 0 && (
                <div className="text-center py-20 opacity-60">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No entries yet</h3>
                    <p className="text-gray-500">Start writing your first journal entry today.</p>
                </div>
            )}
        </div>
    );
};

export default Journal;
