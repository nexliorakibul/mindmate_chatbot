import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Frown, Meh, Sun, CloudRain } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';
import MoodChart from './MoodChart';
import Card from '../components/Card';
import Button from '../components/Button';

const moods = [
    { value: 5, label: 'Amazing', icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { value: 4, label: 'Good', icon: Smile, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
    { value: 3, label: 'Okay', icon: Meh, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { value: 2, label: 'Bad', icon: CloudRain, color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' },
    { value: 1, label: 'Very Sad', icon: Frown, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
];

const MoodTracker = () => {
    const { t } = useTranslation();
    const [moodHistory, setMoodHistory] = useLocalStorage('mood_history', []);
    const [selectedMood, setSelectedMood] = useState(null);
    const [note, setNote] = useState('');

    const handleMoodSelect = (mood) => {
        setSelectedMood(mood);
    };

    const handleSave = () => {
        if (!selectedMood) return;

        const newEntry = {
            id: Date.now(),
            date: new Date().toISOString(),
            score: selectedMood.value,
            mood: selectedMood.label,
            note: note,
        };

        setMoodHistory([...moodHistory, newEntry]);
        setSelectedMood(null);
        setNote('');
    };

    const todayEntry = moodHistory.find(
        (entry) => new Date(entry.date).toDateString() === new Date().toDateString()
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('mood_tracker')}</h1>
                <p className="text-gray-600 dark:text-gray-400">Track your emotional well-being</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                            {todayEntry ? 'Today\'s Mood' : 'How are you feeling?'}
                        </h2>

                        {todayEntry ? (
                            <div className="text-center py-6">
                                <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-primary-50 dark:bg-slate-800 mb-4">
                                    {/* Find icon for today's score */}
                                    {(() => {
                                        const mood = moods.find(m => m.value === todayEntry.score) || moods[2];
                                        return <mood.icon className={`w-10 h-10 ${mood.color}`} />;
                                    })()}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{todayEntry.mood}</h3>
                                <p className="text-gray-500">{todayEntry.note}</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-5 gap-2 mb-6">
                                    {moods.map((mood) => (
                                        <button
                                            key={mood.value}
                                            onClick={() => handleMoodSelect(mood)}
                                            className={`flex flex-col items-center p-2 rounded-lg transition-all ${selectedMood?.value === mood.value
                                                    ? `${mood.bg} ring-2 ring-primary-500 scale-110`
                                                    : 'hover:bg-gray-50 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <mood.icon className={`w-8 h-8 ${mood.color} mb-1`} />
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:block">
                                                {mood.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <AnimatePresence>
                                    {selectedMood && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-4"
                                        >
                                            <textarea
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                placeholder="Add a note (optional)..."
                                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                                rows="3"
                                            />
                                            <Button onClick={handleSave} className="w-full">
                                                Update Mood
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </Card>

                    {/* Stats Summary could go here */}
                    <Card className="p-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                        <h3 className="font-semibold mb-2">Did you know?</h3>
                        <p className="text-sm opacity-90">Tracking your mood helps identify triggers and patterns in your emotional health.</p>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <MoodChart data={moodHistory} />
                </div>
            </div>
        </div>
    );
};

export default MoodTracker;
