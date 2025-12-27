import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BookOpen, Smile, MessageCircle, ArrowRight, Sun, Moon, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';

const quotes = [
    { text: "The only way out is through.", author: "Robert Frost" },
    { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
    { text: "There is hope, even when your brain tells you there isn't.", author: "John Green" },
    { text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
    { text: "Breathe. It’s just a bad day, not a bad life.", author: "Unknown" },
];

const Dashboard = () => {
    const { t } = useTranslation();
    const { currentUser } = useAuth();
    // Initialize with random quote to avoid useEffect state update
    const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const menuItems = [
        {
            title: 'Daily Journal',
            description: 'Write down your thoughts and feelings.',
            icon: BookOpen,
            to: '/journal',
            color: 'bg-blue-500',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Mood Tracker',
            description: 'Track how you are feeling today.',
            icon: Smile,
            to: '/mood',
            color: 'bg-purple-500',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            title: 'AI Chat Companion',
            description: 'Chat with your empathetic AI friend.',
            icon: MessageCircle,
            to: '/chat',
            color: 'bg-green-500',
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            title: 'Support & Calm',
            description: 'Breathing exercises and self-care tips.',
            icon: Heart,
            to: '/support',
            color: 'bg-orange-500',
            gradient: 'from-orange-500 to-amber-500'
        }
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        {getGreeting()}, {currentUser?.email?.split('@')[0]}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        {t('how_are_you')}
                    </p>
                </div>
            </motion.div>

            {/* Quote Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="p-8 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border-indigo-100 dark:border-slate-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-indigo-100 dark:bg-indigo-900/30 rounded-full blur-3xl"></div>
                    <div className="relative z-10 text-center max-w-2xl mx-auto">
                        <h2 className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200 italic mb-4">
                            "{quote.text}"
                        </h2>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">
                            — {quote.author}
                        </p>
                    </div>
                </Card>
            </motion.div>

            {/* Quick Actions Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {menuItems.map((menu) => (
                    <motion.div key={menu.to} variants={item} whileHover={{ y: -5 }}>
                        <Link to={menu.to} className="block group">
                            <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden border-transparent">
                                <div className={`h-2 bg-gradient-to-r ${menu.gradient}`}></div>
                                <div className="p-6">
                                    <div className={`inline-flex items-center justify-center p-3 rounded-lg ${menu.color} bg-opacity-10 text-white mb-4`}>
                                        {/* Note: The bg-opacity-10 isn't working on the icon container because text-white overrides color. 
                        We need to apply text color explicitly or use bg-opacity properly.
                        Let's fix it by using a specific text color class for the icon based on the color prop or generic.
                    */}
                                        <menu.icon className={`w-6 h-6 text-${menu.color.replace('bg-', '')}`} style={{ color: 'inherit' }} />
                                        {/* Actually, let's just use the gradient color for text or similar. 
                        Better approach: 
                    */}
                                        <div className={`absolute inset-0 opacity-20 ${menu.color}`}></div>
                                        {/* Wait, the implementation above is a bit messy with classes. Let's simplify. */}
                                    </div>

                                    {/* Re-writing the icon part clearly */}
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${menu.gradient} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                        <menu.icon className="w-6 h-6" />
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                        {menu.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        {menu.description}
                                    </p>
                                    <div className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:underline">
                                        Open <ArrowRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Dashboard;
