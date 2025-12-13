import React, { useState, useMemo } from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,Platform,Dimensions} from 'react-native';
import { useExpenses } from '../../context/ExpenseContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useCategoryTranslation } from '../../hooks/useCategoryTranslation';
import { COLORS, FONTS } from '../../../assets/constants';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const screenWidth = Dimensions.get('window').width;

type Timeframe = 'today' | 'week' | 'month' | 'year';

//Types pour les statistiques
type DayStats = {
  highestDate: string | null;
  highestAmount: number;
  lowestDate: string | null;
  lowestAmount: number;
} | null;

type MonthStats = {
  highestMonth: string | null;
  highestAmount: number;
  lowestMonth: string | null;
  lowestAmount: number;
} | null;

type TodayStats = {
  highest: any | null;
  lowest: any | null;
} | null;

const Dashboard: React.FC = () => {
    const { t, locale } = useTranslation();

    const { getTranslatedCategoryName } = useCategoryTranslation();
    const { expenses, categories } = useExpenses();

    const [timeframe, setTimeframe] = useState<Timeframe>('today');

    // --- Fonctions utilitaires pour les dates ---
    const parseExpenseDate = (dateString: string | Date | undefined): Date => {
        if (typeof dateString === 'string' && dateString.includes('/')) {
            const [day, month, year] = dateString.split('/');
            return new Date(`${year}-${month}-${day}`);
        }
        return new Date(dateString || 0);
    };

    const getStartOfWeek = (date: Date): Date => {
        const d = new Date(date);
        let day = d.getDay();
        day = day === 0 ? 7 : day;
        d.setDate(d.getDate() - day + 1);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString(locale, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getDayName = (date: Date): string => {
        return date.toLocaleDateString(locale, { weekday: 'long' });
    };

    const getMonthName = (date: Date): string => {
        return date.toLocaleDateString(locale, { month: 'long' });
    };

    // --- Filtrage des dépenses par période ---
    const filteredExpenses = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return expenses.filter(exp => {
            const expDate = parseExpenseDate(exp.created_at);
            if (isNaN(expDate.getTime())) return false;

            if (timeframe === 'today') {
                return (
                    expDate.getDate() === today.getDate() &&
                    expDate.getMonth() === today.getMonth() &&
                    expDate.getFullYear() === today.getFullYear()
                );
            } else if (timeframe === 'week') {
                const weekStart = getStartOfWeek(now);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                weekEnd.setHours(23, 59, 59, 999);

                const effectiveEnd = now < weekEnd ? now : weekEnd;
                return expDate >= weekStart && expDate <= effectiveEnd;
            } else if (timeframe === 'month') {
                return (
                    expDate.getMonth() === now.getMonth() &&
                    expDate.getFullYear() === now.getFullYear()
                );
            } else { // year
                return expDate.getFullYear() === now.getFullYear();
            }
        });
    }, [expenses, timeframe]);

    // --- Calculs des indicateurs principaux ---
    const totalAmount = useMemo(() => {
        return filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant as any || 0), 0);
    }, [filteredExpenses]);

    const transactionCount = filteredExpenses.length;

    // --- Calculs pour "Aujourd'hui" ---
    const todayStats = useMemo<TodayStats>(() => {
        if (timeframe !== 'today') return null;

        if (filteredExpenses.length === 0) {
            return { highest: null, lowest: null };
        }

        let highest = filteredExpenses[0];
        let lowest = filteredExpenses[0];

        filteredExpenses.forEach(exp => {
            const amount = parseFloat(exp.montant as any || 0);
            const highestAmount = parseFloat(highest.montant as any || 0);
            const lowestAmount = parseFloat(lowest.montant as any || 0);

            if (amount > highestAmount) highest = exp;
            if (amount < lowestAmount) lowest = exp;
        });

        return { highest, lowest };
    }, [filteredExpenses, timeframe]);

    // --- Calculs pour "Cette semaine" et "Ce mois" ---
    const dayStats = useMemo<DayStats>(() => {
        if (timeframe !== 'week' && timeframe !== 'month') return null;

        const dayMap = new Map<string, number>();

        filteredExpenses.forEach(exp => {
            const expDate = parseExpenseDate(exp.created_at);
            const dateKey = expDate.toISOString().split('T')[0];
            const amount = parseFloat(exp.montant as any || 0);

            dayMap.set(dateKey, (dayMap.get(dateKey) || 0) + amount);
        });

        if (dayMap.size === 0) return { 
            highestDate: null, 
            highestAmount: 0, 
            lowestDate: null, 
            lowestAmount: 0 
        };

        let highestDate: string | null = null;
        let highestAmount = -Infinity;
        let lowestDate: string | null = null;
        let lowestAmount = Infinity;

        dayMap.forEach((amount, date) => {
            if (amount > highestAmount) {
                highestAmount = amount;
                highestDate = date;
            }
            if (amount < lowestAmount) {
                lowestAmount = amount;
                lowestDate = date;
            }
        });

        return { highestDate, highestAmount, lowestDate, lowestAmount };
    }, [filteredExpenses, timeframe]);

    // --- Calculs pour "Cette année" ---
    const monthStats = useMemo<MonthStats>(() => {
        if (timeframe !== 'year') return null;

        const monthMap = new Map<string, number>();

        filteredExpenses.forEach(exp => {
            const expDate = parseExpenseDate(exp.created_at);
            const monthKey = `${expDate.getFullYear()}-${expDate.getMonth()}`;
            const amount = parseFloat(exp.montant as any || 0);

            monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + amount);
        });

        if (monthMap.size === 0) return { 
            highestMonth: null, 
            highestAmount: 0, 
            lowestMonth: null, 
            lowestAmount: 0 
        };

        let highestMonth: string | null = null;
        let highestAmount = -Infinity;
        let lowestMonth: string | null = null;
        let lowestAmount = Infinity;

        monthMap.forEach((amount, monthKey) => {
            if (amount > highestAmount) {
                highestAmount = amount;
                highestMonth = monthKey;
            }
            if (amount < lowestAmount) {
                lowestAmount = amount;
                lowestMonth = monthKey;
            }
        });

        return { highestMonth, highestAmount, lowestMonth, lowestAmount };
    }, [filteredExpenses, timeframe]);

    // --- Calcul des jours restants ---
    const daysRemaining = useMemo(() => {
        const now = new Date();

        if (timeframe === 'week') {
            const weekStart = getStartOfWeek(now);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            const remainingMs = weekEnd.getTime() - now.getTime();
            return Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
        } else if (timeframe === 'month') {
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            const remainingMs = lastDay.getTime() - now.getTime();
            return Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
        }

        return 0;
    }, [timeframe]);

    // --- Catégories les plus Consommées ---
    const topCategories = useMemo(() => {
        if (totalAmount === 0) return [];

        const categoryMap = new Map<string, number>();

        filteredExpenses.forEach(exp => {
            const categoryId = exp.id_categorie_depense;
            const amount = parseFloat(exp.montant as any || 0);

            if (categoryId) {
                categoryMap.set(categoryId.toString(), (categoryMap.get(categoryId.toString()) || 0) + amount);
            }
        });

        const categoryArray = Array.from(categoryMap.entries())
            .map(([catId, amount]) => {
                const category = categories.find(c => c.id.toString() === catId);
                return {
                    id: catId,
                    name: category ? getTranslatedCategoryName(category) : 'Catégorie inconnue',
                    amount,
                    percentage: ((amount / totalAmount) * 100).toFixed(0) + '%',
                    icon: category?.icon,
                    color: category?.color || COLORS.yellow_color
                };
            })
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 3);

        return categoryArray;
    }, [filteredExpenses, categories, totalAmount, getTranslatedCategoryName]);

    // --- Indicateur de tendance ---
    const trendIndicator = useMemo(() => {
        const now = new Date();
        let previousPeriodTotal = 0;
        let previousPeriodLabel = '';

        const getPreviousPeriodRange = (date: Date) => {
            const start = new Date(date);
            const end = new Date(date);

            if (timeframe === 'today') {
                start.setDate(date.getDate() - 1);
                start.setHours(0, 0, 0, 0);
                end.setDate(date.getDate() - 1);
                end.setHours(23, 59, 59, 999);
                previousPeriodLabel = t.dashboard.vs_yesterday;
            } else if (timeframe === 'week') {
                const currentWeekStart = getStartOfWeek(date);
                end.setTime(currentWeekStart.getTime());
                end.setDate(end.getDate() - 1);
                end.setHours(23, 59, 59, 999);
                start.setTime(end.getTime());
                start.setDate(start.getDate() - 6);
                start.setHours(0, 0, 0, 0);
                previousPeriodLabel = t.dashboard.vs_last_week;
            } else if (timeframe === 'month') {
                const lastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
                start.setTime(lastMonth.getTime());
                start.setHours(0, 0, 0, 0);
                end.setTime(lastMonth.getTime());
                end.setMonth(end.getMonth() + 1);
                end.setDate(0);
                end.setHours(23, 59, 59, 999);
                const monthName = lastMonth.toLocaleDateString(locale, { month: 'short' });
                previousPeriodLabel = `vs ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`;
            } else { // year
                start.setFullYear(date.getFullYear() - 1, 0, 1);
                start.setHours(0, 0, 0, 0);
                end.setFullYear(date.getFullYear() - 1, 11, 31);
                end.setHours(23, 59, 59, 999);
                previousPeriodLabel = `vs ${date.getFullYear() - 1}`;
            }

            return { start, end };
        };

        const { start, end } = getPreviousPeriodRange(now);

        const previousExpenses = expenses.filter(exp => {
            const expDate = parseExpenseDate(exp.created_at);
            if (isNaN(expDate.getTime())) return false;
            return expDate >= start && expDate <= end;
        });

        previousPeriodTotal = previousExpenses.reduce((sum, exp) => sum + parseFloat(exp.montant as any || 0), 0);

        //montrer la comparaison si on a des données
        if (totalAmount === 0 && previousPeriodTotal === 0) {
            return { show: false };
        }

        if (previousPeriodTotal === 0 && totalAmount > 0) {
            return {
                text: '+100%',
                label: previousPeriodLabel,
                color: COLORS.success,
                show: true,
                icon: 'trending-up'
            };
        }

        if (totalAmount === 0 && previousPeriodTotal > 0) {
            return {
                text: '-100%',
                label: previousPeriodLabel,
                color: COLORS.error,
                show: true,
                icon: 'trending-down'
            };
        }

        const percentageChange = ((totalAmount - previousPeriodTotal) / previousPeriodTotal) * 100;
        const changeText = `${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(1)}%`;
        const isPositive = percentageChange > 0;

        return {
            text: changeText,
            label: previousPeriodLabel,
            color: isPositive ? COLORS.success : COLORS.error,
            show: true,
            icon: isPositive ? 'trending-up' : 'trending-down'
        };
    }, [expenses, timeframe, totalAmount, locale, t]);

    //composant pour les dates
    // Composant PeriodHeader
    const PeriodHeader: React.FC<{ timeframe: Timeframe; locale: string }> = ({ timeframe, locale }) => {
        const getPeriodLabel = () => {
            const now = new Date();

            switch (timeframe) {
                case 'today':
                    return now.toLocaleDateString(locale, {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    });

                case 'week': {
                    const weekStart = getStartOfWeek(now);
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekEnd.getDate() + 6);

                    const startDay = weekStart.toLocaleDateString(locale, { day: '2-digit' });
                    const endDay = weekEnd.toLocaleDateString(locale, { day: '2-digit' });
                    const monthYear = weekEnd.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

                    return `${t.dashboard.week_of} ${startDay} ${t.dashboard.at} ${endDay} ${monthYear}`;
                }

                case 'month': {
                    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

                    const startDay = firstDay.toLocaleDateString(locale, { day: '2-digit' });
                    const endDay = lastDay.toLocaleDateString(locale, { day: '2-digit' });
                    const monthYear = lastDay.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

                    return `${t.dashboard.empty} ${startDay} ${t.dashboard.at} ${endDay} ${monthYear}`;
                }

                case 'year': {
                    const firstDay = new Date(now.getFullYear(), 0, 1);
                    const lastDay = new Date(now.getFullYear(), 11, 31);

                    const startDay = firstDay.toLocaleDateString(locale, { day: '2-digit', month: 'long' });
                    const endDay = lastDay.toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' });

                    return `${t.dashboard.empty} ${startDay} ${t.dashboard.at} ${endDay}`;
                }

                default:
                    return '';
            }
        };

        return (
            <View style={styles.periodHeader}>
                <Icon name="calendar" size={14} color={COLORS.black_color} />
                <Text style={styles.periodText}>{getPeriodLabel()}</Text>
            </View>
        );
    };


    // --- Rendu des statistiques selon la période ---
    const renderStats = () => {
        if (timeframe === 'today') {
            return (
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Icon name="cash" size={20} color={COLORS.yellow_color} />
                        </View>
                        <View style={styles.statContent}>
                            <Text style={styles.statLabel}>{t.dashboard.dayly_expenses}</Text>
                            <Text style={styles.statValue}>{totalAmount.toLocaleString(locale)} FCFA</Text>
                            <Text style={styles.statSubText}>{transactionCount} {t.dashboard.expense}{transactionCount > 1 ? 's' : ''}</Text>
                        </View>
                    </View>

                    <View style={[styles.statsGrid, { justifyContent: 'space-between', }]}>
                        <View style={[styles.statItem, styles.statItemTwo]}>
                            <View style={[styles.statIconSmall, { backgroundColor: 'rgba(255, 87, 87, 0.1)' }]}>
                                <Icon name="arrow-top-right" size={16} color="#FF5757" />
                            </View>
                            <Text style={styles.statItemLabel}>{t.dashboard.highest_expense}</Text>
                            {todayStats?.highest ? (
                                <Text style={styles.statItemValue}>
                                    {(todayStats.highest.libelle || t.dashboard.expense).toString()} ({parseFloat(todayStats.highest.montant as any).toLocaleString(locale)} FCFA)
                                </Text>
                            ) : (
                                <Text style={styles.statItemValue}>---</Text>
                            )}
                        </View>

                        <View style={[styles.statItem, styles.statItemTwo, styles.statItemLast]}>
                            <View style={[styles.statIconSmall, { backgroundColor: 'rgba(76, 217, 100, 0.1)' }]}>
                                <Icon name="arrow-bottom-right" size={16} color="#4CD964" />
                            </View>
                            <Text style={styles.statItemLabel}>{t.dashboard.lowest_expense}</Text>
                            {todayStats?.lowest && todayStats.highest !== todayStats.lowest ? (
                                <Text style={styles.statItemValue}>
                                    {(todayStats.lowest.libelle || t.dashboard.expense).toString()} ({parseFloat(todayStats.lowest.montant as any).toLocaleString(locale)} FCFA)
                                </Text>
                            ) : (
                                <Text style={styles.statItemValue}>---</Text>
                            )}
                        </View>
                    </View>
                </View>
            );
        } else if (timeframe === 'week') {
            return (
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Icon name="calendar-week" size={20} color={COLORS.yellow_color} />
                        </View>
                        <View style={styles.statContent}>
                            <Text style={styles.statLabel}>{t.dashboard.weekly_expenses}</Text>
                            <Text style={styles.statValue}>{totalAmount.toLocaleString(locale)} FCFA</Text>
                            <Text style={styles.statSubText}>{transactionCount} {t.dashboard.expense}{transactionCount > 1 ? 's' : ''}</Text>
                        </View>
                    </View>

                    <View style={[styles.statsGrid, { justifyContent: 'space-between', }]}>
                        <View style={[styles.statItem, styles.statItemThree,]}>
                            <View style={[styles.statIconSmall, { backgroundColor: 'rgba(255, 87, 87, 0.1)' }]}>
                                <Icon name="chart-line" size={16} color="#FF5757" />
                            </View>
                            {/* <Text style={styles.statItemLabel}>{t.dashboard.record_day}</Text> */}
                            <Text style={styles.statItemLabel}>Dépense élevée</Text>
                            {dayStats?.highestDate ? (
                                <Text style={styles.statItemValue}>
                                    {getDayName(new Date(dayStats.highestDate))}
                                    {'\n'}
                                    <Text style={{ color: COLORS.yellow_color, fontFamily: FONTS.Poppins_SemiBold }}>
                                        {dayStats.highestAmount.toLocaleString(locale)} FCFA
                                    </Text>
                                </Text>
                            ) : (
                                <Text style={styles.statItemValue}>---</Text>
                            )}
                        </View>

                        <View style={[styles.statItem, styles.statItemThree]}>
                            <View style={[styles.statIconSmall, { backgroundColor: 'rgba(76, 217, 100, 0.1)' }]}>
                                <Icon name="chart-bell-curve" size={16} color="#4CD964" />
                            </View>
                            {/* <Text style={styles.statItemLabel}>{t.dashboard.economical_day}</Text> */}
                            <Text style={styles.statItemLabel}>Dépense faible</Text>
                            {dayStats?.lowestDate && dayStats.highestDate !== dayStats.lowestDate ? (
                                <Text style={styles.statItemValue}>
                                    {getDayName(new Date(dayStats.lowestDate))}
                                    {'\n'}
                                    <Text style={{ color: COLORS.yellow_color, fontFamily: FONTS.Poppins_SemiBold }}>
                                        {dayStats.lowestAmount.toLocaleString(locale)} FCFA
                                    </Text>
                                </Text>
                            ) : (
                                <Text style={styles.statItemValue}>---</Text>
                            )}
                        </View>

                        <View style={[styles.statItem, styles.statItemThree, styles.statItemLast]}>
                            <View style={[styles.statIconSmall, { backgroundColor: 'rgba(52, 199, 235, 0.1)' }]}>
                                <Icon name="clock-outline" size={16} color="#34C7EB" />
                            </View>
                            <Text style={styles.statItemLabel}>{t.dashboard.days_remaining}</Text>
                            <Text style={[styles.statItemValue, { color: COLORS.blueColor }]}>
                                {daysRemaining} {t.dashboard.today}{daysRemaining > 1 ? 's' : ''}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        } else if (timeframe === 'month') {
            return (
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Icon name="calendar-month" size={20} color={COLORS.yellow_color} />
                        </View>
                        <View style={styles.statContent}>
                            <Text style={styles.statLabel}>{t.dashboard.monthly_expenses}</Text>
                            <Text style={styles.statValue}>{totalAmount.toLocaleString(locale)} FCFA</Text>
                            <Text style={styles.statSubText}>{transactionCount} {t.dashboard.expense}{transactionCount > 1 ? 's' : ''}</Text>
                        </View>
                    </View>

                    <View style={[styles.statsGrid, { justifyContent: 'space-between', }]}>
                        <View style={[styles.statItem, styles.statItemThree,]}>
                            <View style={[styles.statIconSmall, { backgroundColor: 'rgba(255, 87, 87, 0.1)' }]}>
                                <Icon name="fire" size={16} color="#FF5757" />
                            </View>
                            {/* <Text style={styles.statItemLabel}>{t.dashboard.record_day}</Text> */}
                             <Text style={styles.statItemLabel}>Dépense élevée</Text>
                            {dayStats?.highestDate ? (
                                <Text style={styles.statItemValue}>
                                    {formatDate(new Date(dayStats.highestDate))}
                                    {'\n'}
                                    <Text style={{ color: COLORS.yellow_color, fontFamily: FONTS.Poppins_SemiBold }}>
                                        {dayStats.highestAmount.toLocaleString(locale)} FCFA
                                    </Text>
                                </Text>
                            ) : (
                                <Text style={styles.statItemValue}>---</Text>
                            )}
                        </View>

                        <View style={[styles.statItem, styles.statItemThree,]}>
                            <View style={[styles.statIconSmall, { backgroundColor: 'rgba(76, 217, 100, 0.1)' }]}>
                                <Icon name="leaf" size={16} color="#4CD964" />
                            </View>
                            {/* <Text style={styles.statItemLabel}>{t.dashboard.economical_day}</Text> */}
                             <Text style={styles.statItemLabel}>Dépense faible</Text>
                            {dayStats?.lowestDate && dayStats.highestDate !== dayStats.lowestDate ? (
                                <Text style={styles.statItemValue}>
                                    {formatDate(new Date(dayStats.lowestDate))}
                                    {'\n'}
                                    <Text style={{ color: COLORS.yellow_color, fontFamily: FONTS.Poppins_SemiBold }}>
                                        {dayStats.lowestAmount.toLocaleString(locale)} FCFA
                                    </Text>
                                </Text>
                            ) : (
                                <Text style={styles.statItemValue}>---</Text>
                            )}
                        </View>

                        <View style={[styles.statItem, styles.statItemThree, styles.statItemLast]}>
                            <View style={[styles.statIconSmall, { backgroundColor: 'rgba(52, 199, 235, 0.1)' }]}>
                                <Icon name="progress-clock" size={16} color="#34C7EB" />
                            </View>
                            <Text style={styles.statItemLabel}>{t.dashboard.days_remaining}</Text>
                            <Text style={[styles.statItemValue, { color: COLORS.blueColor }]}>
                                {daysRemaining} {t.dashboard.today}{daysRemaining > 1 ? 's' : ''}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        } else { // year
            return (
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Icon name="calendar-blank" size={20} color={COLORS.yellow_color} />
                        </View>
                        <View style={styles.statContent}>
                            <Text style={styles.statLabel}>{t.dashboard.annual_expenses}</Text>
                            <Text style={styles.statValue}>{totalAmount.toLocaleString(locale)} FCFA</Text>
                            <Text style={styles.statSubText}>{transactionCount} {t.dashboard.expense}{transactionCount > 1 ? 's' : ''}</Text>
                        </View>
                    </View>

                    <View style={[styles.statsGrid, { justifyContent: 'space-between', }]}>
                        <View style={[styles.statItem, styles.statItemTwo,]}>
                            <View style={[styles.statIconSmall, { backgroundColor: 'rgba(255, 87, 87, 0.1)' }]}>
                                <Icon name="chart-bar" size={16} color="#FF5757" />
                            </View>
                            {/* <Text style={styles.statItemLabel}>{t.dashboard.record_month}</Text> */}
                             <Text style={styles.statItemLabel}>Dépense élevée</Text>
                            {monthStats?.highestMonth ? (
                                <Text style={styles.statItemValue}>
                                    {getMonthName(new Date(
                                        parseInt(monthStats.highestMonth.split('-')[0]), 
                                        parseInt(monthStats.highestMonth.split('-')[1]), 
                                        1
                                    ))}
                                    {'\n'}
                                    <Text style={{ color: COLORS.yellow_color, fontFamily: FONTS.Poppins_SemiBold }}>
                                        {monthStats.highestAmount.toLocaleString(locale)} FCFA
                                    </Text>
                                </Text>
                            ) : (
                                <Text style={styles.statItemValue}>---</Text>
                            )}
                        </View>

                        <View style={[styles.statItem, styles.statItemTwo, styles.statItemLast]}>
                            <View style={[styles.statIconSmall, { backgroundColor: 'rgba(76, 217, 100, 0.1)' }]}>
                                <Icon name="chart-line-variant" size={16} color="#4CD964" />
                            </View>
                            {/* <Text style={styles.statItemLabel}>{t.dashboard.economical_month}</Text> */}
                             <Text style={styles.statItemLabel}>Dépense Faible</Text>
                            {monthStats?.lowestMonth && monthStats.highestMonth !== monthStats.lowestMonth ? (
                                <Text style={styles.statItemValue}>
                                    {getMonthName(new Date(
                                        parseInt(monthStats.lowestMonth.split('-')[0]), 
                                        parseInt(monthStats.lowestMonth.split('-')[1]), 
                                        1
                                    ))}
                                    {'\n'}
                                    <Text style={{ color: COLORS.yellow_color, fontFamily: FONTS.Poppins_SemiBold }}>
                                        {monthStats.lowestAmount.toLocaleString(locale)} FCFA
                                    </Text>
                                </Text>
                            ) : (
                                <Text style={styles.statItemValue}>---</Text>
                            )}
                        </View>
                    </View>
                </View>
            );
        }
    };

    // --- Rendu des Catégories les plus Consommées ---
    const renderTopCategories = () => {
        if (totalAmount === 0) {
            let message = '';
            let icon = '';

            switch (timeframe) {
                case 'today':
                    message = t.dashboard.no_expenses_today;
                    icon = 'emoticon-happy-outline';
                    break;
                case 'week':
                    message = t.dashboard.no_expenses_week;
                    icon = 'trophy-outline';
                    break;
                case 'month':
                    message = t.dashboard.no_expenses_month;
                    icon = 'finance';
                    break;
                case 'year':
                    message = t.dashboard.no_expenses_year;
                    icon = 'chart-box-outline';
                    break;
            }

            return (
                <View style={styles.noDataContainer}>
                    <Icon name={icon as any} size={50} color={COLORS.lightGray} />
                    <Text style={styles.noDataText}>{message}</Text>
                </View>
            );
        }

        if (topCategories.length === 0) {
            return (
                <View style={styles.noDataContainer}>
                    <Icon name="tag-outline" size={50} color={COLORS.lightGray} />
                    <Text style={styles.noDataText}>{t.dashboard.no_categorized_expenses}</Text>
                </View>
            );
        }

        return (
            <View style={styles.categoriesContainer}>
                <View style={styles.sectionHeader}>
                    <Icon name="chart-pie" size={20} color={COLORS.yellow_color} />
                    <Text style={styles.sectionTitle}>{t.dashboard.most_consumed_categories}</Text>
                </View>

                {topCategories.map((cat, index) => (
                    <View key={cat.id} style={styles.categoryCard}>
                        <View style={styles.categoryHeader}>
                            <View style={[styles.categoryRankBadge, { backgroundColor: cat.color }]}>
                                {/* <Text style={styles.categoryRank}>#{index + 1}</Text> */}
                                <MaterialCommunityIcons
                                    name={cat.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                                    size={20}
                                    color="#fff"
                                />
                            </View>

                            <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
                            <Text style={styles.categoryPercentage}>{cat.percentage}</Text>
                        </View>

                        <View style={styles.progressContainer}>
                            <View
                                style={[
                                    styles.progressBar,
                                    {
                                        width: `${Math.min(100, parseFloat(cat.percentage))}%`,
                                        backgroundColor: cat.color
                                    }
                                ]}
                            />
                        </View>

                        <View style={styles.categoryFooter}>
                            <Text style={styles.categoryAmount}><Text style={{ fontWeight: "bold" }}>{cat.amount.toLocaleString(locale)}</Text> / {totalAmount.toLocaleString(locale)} FCFA</Text>
                            {/* <Icon name="chevron-right" size={16} color={COLORS.lightGray} /> */}
                            <Text style={{ color: COLORS.lightGray, fontSize: 10, }}>{index + 1}</Text>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    // --- Rendu du sélecteur de période ---
    const renderTimeframeButton = (type: Timeframe, label: string, icon: string) => {
        const isActive = timeframe === type;
        return (
            <TouchableOpacity
                style={[styles.timeframeButton, isActive && styles.timeframeButtonActive]}
                onPress={() => setTimeframe(type)}
            >
                <Icon
                    name={icon as any}
                    size={14}
                    color={isActive ? COLORS.font_color : '#666'}
                    style={styles.timeframeIcon}
                />
                <Text style={[styles.timeframeText, isActive && styles.timeframeTextActive]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

            <View style={styles.timeframeSelector}>
                {renderTimeframeButton('today', t.dashboard.today, 'calendar-today')}
                {renderTimeframeButton('week', t.dashboard.this_week, 'calendar-week')}
                {renderTimeframeButton('month', t.dashboard.this_month, 'calendar-month')}
                {renderTimeframeButton('year', t.dashboard.this_year, 'calendar-blank')}
            </View>

            <View style={styles.card}>
                <View>
                    <PeriodHeader timeframe={timeframe} locale={locale} />
                </View>
                <View style={styles.totalSection}>
                    <View>
                        <Text style={styles.totalLabel}>
                            {timeframe === 'today' ? t.dashboard.dayly_expenses :
                                timeframe === 'week' ? t.dashboard.weekly_expenses :
                                    timeframe === 'month' ? t.dashboard.monthly_expenses :
                                        t.dashboard.annual_expenses}
                        </Text>
                        
                        <Text style={styles.totalAmount}>{totalAmount.toLocaleString(locale)} FCFA</Text>
                    </View>

                    {trendIndicator.show && (
                        <View style={[styles.trendBadge, { backgroundColor: trendIndicator.color + '18' }]}>
                            <Icon name={trendIndicator.icon as any} size={11} color={trendIndicator.color} />
                            <Text style={[styles.trendText, { color: trendIndicator.color }]}>
                                {trendIndicator.text} {trendIndicator.label}
                            </Text>
                        </View>
                    )}
                </View>

                {renderStats()}
            </View>

            <View style={styles.card}>
                {renderTopCategories()}
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //  backgroundColor: '#F8F9FA',
        backgroundColor: COLORS.white,
        paddingHorizontal: 10,
        paddingTop: 20,
        marginBottom: 10,
        borderRadius: 8,
    },
    timeframeSelector: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 4,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    timeframeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        borderRadius: 8,
    },
    timeframeButtonActive: {
        backgroundColor: COLORS.yellow_color,
        shadowColor: COLORS.yellow_color,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    timeframeIcon: {
        marginRight: 2,
    },
    timeframeText: {
        fontSize: 12,
        fontFamily: FONTS.Poppins_Medium,
        color: '#666',
    },
    timeframeTextActive: {
        color: COLORS.font_color,
        fontFamily: FONTS.Poppins_SemiBold,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 2,
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    totalLabel: {
        fontSize: 13,
        fontFamily: FONTS.Poppins_Regular,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    totalAmount: {
        fontSize: 20,
        fontFamily: FONTS.Poppins_SemiBold,
        color: COLORS.yellow_color,
    },
    trendBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 20,
    },
    trendText: {
        fontSize: 10,
        fontFamily: FONTS.Poppins_SemiBold,
        marginLeft: 4,
    },
    statsContainer: {
        marginTop: 5,
    },
    statCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(252, 191, 0, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    statContent: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        fontFamily: FONTS.Poppins_Regular,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontFamily: FONTS.Poppins_SemiBold,
        color: COLORS.yellow_color,
        marginBottom: 2,
    },
    statSubText: {
        fontSize: 12,
        fontFamily: FONTS.Poppins_Regular,
        color: COLORS.blueColor,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'space-between',
    },
    statItem: {
        // width: '32%',
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 8,
        marginBottom: 8,
    },
    // Pour 2 éléments
    statItemTwo: {
        width: '48%',
        marginRight: '4%',
        // Pour le dernier élément, on va annuler le marginRight avec une classe conditionnelle
    },
    // Pour 3 éléments  
    statItemThree: {
        width: '32%',
        marginRight: '2%',
    },
    // Classe pour le dernier élément
    statItemLast: {
        marginRight: 0,
    },
    statIconSmall: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statItemLabel: {
        fontSize: 11,
        fontFamily: FONTS.Poppins_Medium,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    statItemValue: {
        fontSize: 12,
        fontFamily: FONTS.Poppins_Regular,
        color: COLORS.textPrimary,
        lineHeight: 16,
    },
    categoriesContainer: {
        marginTop: 5,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: FONTS.Poppins_SemiBold,
        //color: COLORS.black_color,
        marginLeft: 10,
    },
    categoryCard: {
        backgroundColor: '#FAFAFA',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    categoryRankBadge: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    categoryRank: {
        fontSize: 14,
        fontFamily: FONTS.Poppins_SemiBold,
        color: COLORS.white,
    },
    categoryName: {
        flex: 1,
        fontSize: 12,
        fontFamily: FONTS.Poppins_Medium,
        //color: COLORS.yellow_color,
    },
    categoryPercentage: {
        fontSize: 12,
        fontFamily: FONTS.Poppins_SemiBold,
        //  color: COLORS.font_color,
    },
    progressContainer: {
        height: 6,
        backgroundColor: '#E8E8E8',
        borderRadius: 3,
        marginBottom: 12,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
    },
    categoryFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryAmount: {
        fontSize: 11,
        fontFamily: FONTS.Poppins_Medium,
        color: COLORS.textSecondary,
    },
    noDataContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noDataText: {
        fontSize: 14,
        fontFamily: FONTS.Poppins_Regular,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginTop: 16,
        paddingHorizontal: 20,
    },

    // Styles pour le PeriodHeader
    periodHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    periodText: {
        fontSize: 12,
        fontFamily: FONTS.Poppins_Regular,
       // color: COLORS.lightGray,
        marginLeft: 6,
    },

});

export default Dashboard;