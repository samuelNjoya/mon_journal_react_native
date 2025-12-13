import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Modal,
    FlatList
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '../hooks/useTranslation';
import { homeService } from '../api/services/home';
import ErrorModal from '../components/Notification';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Types basés sur la structure de l'API
interface PeriodData {
    date: string;
    total_price_after: number | null;
    total_price_before: number | null;
}

interface TotalBalance {
    total_operations: string;
    total_price_after: number | null;
    total_price_before: number | null;
}

interface ServiceBalance {
    // À définir selon la structure réelle de service_balance
    [key: string]: any;
}

interface ApiWeekData {
    periods: PeriodData[];
    service_balance: ServiceBalance[];
    total_balance: TotalBalance;
}

interface ApiResponse {
    datas: ApiWeekData[];
    status: number;
}

interface WeekSummary {
    weekNumber: number;
    startDate: Date;
    endDate: Date;
    totalOperations: number;
    totalProfit: number;
    averageOperationsPerDay: number;
    averageProfitPerDay: number;
    dailyData: DailyProfit[];
}

interface DailyProfit {
    date: string;
    profit: number;
    operations: number;
}

interface DateRange {
    startDate: Date;
    endDate: Date;
}

const GainsScreen = () => {
    const [dateRange, setDateRange] = useState<DateRange>({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    });
    const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [tempDateRange, setTempDateRange] = useState<DateRange>(dateRange);
    const [apiData, setApiData] = useState<ApiWeekData[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const { t, language } = useTranslation();
    const [activePicker, setActivePicker] = useState<'start' | 'end' | null>(null);
    const [filterTrigger, setFilterTrigger] = useState(0);

    const fetchData = async () => {
        try {
            if (!isLoading) {
                setIsLoading(true)
            }
            const result = await homeService.getGains({
                start: dateRange.startDate,
                end: dateRange.endDate
            });
            // console.log(result.data.datas[3])
            if (result.success && result.data.status) {
                setApiData(result.data.datas);

            } else {
                setErrorMessage(result.data?.err_msg || result.error);
            }
        } catch (error) {
            setErrorMessage(t.alerts.comError);
        } finally {
            setIsLoading(false);
        }
    };

    // Simulation de l'appel API
    useEffect(() => {
        // const fetchData1 = async () => {
        //     setIsLoading(true);

        //     // Simulation du délai de chargement
        //     await new Promise(resolve => setTimeout(resolve, 1000));

        //     // Données mockées basées sur la structure de l'API
        //     const mockApiData: ApiWeekData[] = [
        //         {
        //             periods: [
        //                 { date: "2024-11-25T00:00:00.000000Z", total_price_after: 1200, total_price_before: 1000 },
        //                 { date: "2024-11-26T00:00:00.000000Z", total_price_after: 1800, total_price_before: 1500 },
        //                 { date: "2024-11-27T00:00:00.000000Z", total_price_after: 1500, total_price_before: 1300 },
        //                 { date: "2024-11-28T00:00:00.000000Z", total_price_after: 2200, total_price_before: 1800 },
        //                 { date: "2024-11-29T00:00:00.000000Z", total_price_after: 1900, total_price_before: 1600 },
        //                 { date: "2024-11-30T00:00:00.000000Z", total_price_after: 2100, total_price_before: 1700 },
        //                 { date: "2024-12-01T00:00:00.000000Z", total_price_after: 2400, total_price_before: 2000 }
        //             ],
        //             service_balance: [],
        //             total_balance: { total_operations: "45", total_price_after: 13100, total_price_before: 10900 }
        //         },
        //         {
        //             periods: [
        //                 { date: "2024-11-18T00:00:00.000000Z", total_price_after: 1100, total_price_before: 900 },
        //                 { date: "2024-11-19T00:00:00.000000Z", total_price_after: 1300, total_price_before: 1100 },
        //                 { date: "2024-11-20T00:00:00.000000Z", total_price_after: 1700, total_price_before: 1400 },
        //                 { date: "2024-11-21T00:00:00.000000Z", total_price_after: 1400, total_price_before: 1200 },
        //                 { date: "2024-11-22T00:00:00.000000Z", total_price_after: 1600, total_price_before: 1300 },
        //                 { date: "2024-11-23T00:00:00.000000Z", total_price_after: 2000, total_price_before: 1600 },
        //                 { date: "2024-11-24T00:00:00.000000Z", total_price_after: 1800, total_price_before: 1500 }
        //             ],
        //             service_balance: [],
        //             total_balance: { total_operations: "52", total_price_after: 10900, total_price_before: 9000 }
        //         }
        //     ];

        //     setApiData(mockApiData);
        //     setIsLoading(false);
        // };

        fetchData();
    }, [filterTrigger]);

    const normalizeDate = (date?: Date) => {
        if (!date) return new Date();
        const normalized = new Date(date);
        normalized.setHours(12, 0, 0, 0); // ✅ fixe l'heure à midi
        return normalized;
    };

    const onChangeStartDate = (
        event: DateTimePickerEvent,
        selectedDate?: Date
    ) => {
        const safeDate = normalizeDate(selectedDate);
        if (selectedDate) {
            setTempDateRange(prev => ({
                ...prev,
                startDate: safeDate,
            }));
        }
        setActivePicker(null); // ou setShowDatePicker(false) selon ta logique
    };

    const onChangeEndDate = (event: DateTimePickerEvent,
        selectedDate?: Date
    ) => {
        const safeDate = normalizeDate(selectedDate);
        if (selectedDate) {
            setTempDateRange(prev => ({
                ...prev,
                endDate: safeDate,
            }));
        }
        setActivePicker(null);
    }

    // Transformer les données de l'API en format utilisable par le composant
    const weeksData = useMemo((): WeekSummary[] => {
        return apiData.map((weekData, index) => {
            const dailyData: DailyProfit[] = weekData.periods.map(period => ({
                date: period.date,
                profit: period.total_price_after || 0,
                operations: parseInt(weekData.total_balance.total_operations)
            }));

            const totalOperations = parseInt(weekData.total_balance.total_operations) || dailyData.reduce((sum, day) => sum + day.operations, 0);
            const totalProfit = weekData.total_balance.total_price_after || dailyData.reduce((sum, day) => sum + day.profit, 0);

            return {
                weekNumber: index + 1,
                startDate: new Date(weekData.periods[0].date),
                endDate: new Date(weekData.periods[weekData.periods.length - 1].date),
                totalOperations,
                totalProfit,
                averageOperationsPerDay: Math.round(totalOperations / weekData.periods.length),
                averageProfitPerDay: Math.round(totalProfit / weekData.periods.length),
                dailyData
            };
        });
    }, [apiData]);

    const currentWeekData = weeksData[selectedWeekIndex];

    // Formater les dates
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatDateRange = (start: Date, end: Date): string => {
        return `${formatDate(start)} - ${formatDate(end)}`;
    };

    // Préparer les données pour le graphique
    const chartData = currentWeekData ? {
        labels: currentWeekData.dailyData.map(day => {
            const date = new Date(day.date);
            return date.toLocaleDateString('fr-FR', { weekday: 'short' });
        }),
        datasets: [
            {
                data: currentWeekData.dailyData.map(day => day.profit),
                color: (opacity = 1) => `rgba(252, 191, 0, ${opacity})`,
                strokeWidth: 3,
            },
        ],
        legend: [`Bénéfices - Semaine ${currentWeekData.weekNumber}`]
    } : { labels: [], datasets: [], legend: [] };

    const chartConfig = {
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#fcbf00"
        }
    };

    const handleWeekChange = (direction: 'prev' | 'next') => {
        if (weeksData.length === 0) return;

        setIsLoading(true);

        setTimeout(() => {
            if (direction === 'prev' && selectedWeekIndex > 0) {
                setSelectedWeekIndex(selectedWeekIndex - 1);
            } else if (direction === 'next' && selectedWeekIndex < weeksData.length - 1) {
                setSelectedWeekIndex(selectedWeekIndex + 1);
            }
            setIsLoading(false);
        }, 300);
    };

    const handleDateFilterApply = async () => {

        setDateRange(tempDateRange);

        setSelectedWeekIndex(0);
        setShowDateFilter(false);
        setFilterTrigger(prev => prev + 1);
        // Ici vous feriez un nouvel appel API avec les nouvelles dates
    };

    const handleDateFilterCancel = () => {
        setTempDateRange(dateRange);
        setShowDateFilter(false);
    };

    const CombinedStatCard = ({
        title1, value1, subtitle1, icon1, color1, subvalue1,
        title2, value2, subtitle2, icon2, color2, subvalue2
    }: {
        title1: string; value1: string | number; subtitle1?: string; icon1: string; color1: string; subvalue1: string;
        title2: string; value2: string | number; subtitle2?: string; icon2: string; color2: string; subvalue2: string;
    }) => (
        <View style={styles.combinedCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
                <View style={styles.combinedCardHeader}>
                    <View style={[styles.combinedIconContainer, { backgroundColor: `${color1}20` }]}>
                        <Ionicons name={icon1 as any} size={20} color={color1} />
                    </View>
                    <View>
                        <Text style={styles.combinedCardTitle}>{title1}</Text>
                        <Text style={styles.combinedCardSubtitle}>{subtitle1}</Text>
                    </View>

                </View>
                <View style={[styles.combinedCardHalf]}>
                    <Text style={[styles.combinedCardValue, { color: color1 }]}>{value1}</Text>
                    {subvalue1 && <Text style={styles.combinedCardSubtitle}>{subvalue1}</Text>}
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                <View style={styles.combinedCardHeader}>
                    <View style={[styles.combinedIconContainer, { backgroundColor: `${color2}20` }]}>
                        <Ionicons name={icon2 as any} size={20} color={color2} />
                    </View>
                    <View>
                        <Text style={styles.combinedCardTitle}>{title2}</Text>
                        <Text style={styles.combinedCardSubtitle}>{subtitle2}</Text>
                    </View>

                </View>
                <View>
                    <Text style={[styles.combinedCardValue, { color: color2 }]}>{value2}</Text>
                    {/* {subvalue2 && <Text style={styles.combinedCardSubtitle}>{subvalue2}</Text>} */}
                </View>
            </View>
            {/* <View style={[styles.combinedCardHalf, { flex: 1 }]}>
                
            </View> */}

            {/* <View style={styles.cardSeparator} /> */}

            {/* <View style={[styles.combinedCardHalf]}>
                <Text style={[styles.combinedCardValue, { color: color1 }]}>{value1}</Text>
                {subtitle1 && <Text style={styles.combinedCardSubtitle}>{subtitle1}</Text>}
            </View> */}
        </View>
    );

    const DateFilterModal = () => (
        <Modal
            visible={showDateFilter}
            transparent
            animationType="slide"
            onRequestClose={handleDateFilterCancel}
        >
            {activePicker && (
                <DateTimePicker
                    value={activePicker === 'start' ? tempDateRange.startDate : tempDateRange.endDate}
                    mode="date"
                    display="default"
                    onChange={activePicker === 'start' ? onChangeStartDate : onChangeEndDate}
                />
            )}
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{t.gains.filterbyDate}</Text>

                    <View style={styles.dateInputContainer}>
                        <Text style={styles.dateLabel}>{t.gains.startDate}</Text>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setActivePicker('start')}
                        >
                            <Ionicons name="calendar" size={20} color="#667eea" />
                            <Text style={styles.dateInputText}>
                                {formatDate(tempDateRange.startDate)}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dateInputContainer}>
                        <Text style={styles.dateLabel}>{t.gains.endDate}</Text>
                        <TouchableOpacity
                            style={styles.dateInput}
                            onPress={() => setActivePicker('end')}
                        >
                            <Ionicons name="calendar" size={20} color="#667eea" />
                            <Text style={styles.dateInputText}>
                                {formatDate(tempDateRange.endDate)}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.selectedRange}>
                        {t.gains.selectedPeriod}: {formatDateRange(tempDateRange.startDate, tempDateRange.endDate)}
                    </Text>

                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={handleDateFilterCancel}
                        >
                            <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalButton, styles.applyButton]}
                            onPress={handleDateFilterApply}
                        >
                            <Text style={styles.applyButtonText}>{t.common.apply}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fcbf00" />
                <Text style={styles.loadingText}>{t.gains.loadData}...</Text>
            </View>
        );
    }

    if (weeksData.length === 0) {
        return (
            <View style={styles.noDataContainer}>
                <Ionicons name="stats-chart" size={64} color="#CBD5E0" />
                <Text style={styles.noDataText}>{t.gains.unavailable}</Text>
                <Text style={styles.noDataSubtext}>
                    {t.gains.empty}
                </Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <ErrorModal visible={errorMessage !== ''} type='error' onClose={() => { setErrorMessage('') }} message={errorMessage} />
            {/* En-tête avec bouton filtre */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>{t.gains.dashboard}</Text>
                    <Text style={styles.headerSubtitle}>
                        {formatDateRange(dateRange.startDate, dateRange.endDate)}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setShowDateFilter(true)}
                >
                    <Ionicons name="filter" size={20} color="#FFFFFF" />
                    <Text style={styles.filterButtonText}>{t.gains.filter}</Text>
                </TouchableOpacity>
            </View>

            {/* Navigation entre les semaines */}
            <View style={styles.weekNavigation}>
                <TouchableOpacity
                    style={styles.weekNavButton}
                    onPress={() => handleWeekChange('prev')}
                    disabled={selectedWeekIndex <= 0}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={selectedWeekIndex <= 0 ? "#CCC" : "#fcbf00"}
                    />
                </TouchableOpacity>

                <View style={styles.weekTitleContainer}>
                    <Text style={styles.weekTitle}>
                        {t.gains.week} {currentWeekData.weekNumber}
                        ({formatDate(currentWeekData.startDate)} - {formatDate(currentWeekData.endDate)})
                    </Text>
                    <Text style={styles.weekSubtitle}>
                        {weeksData.length} {t.gains.weekPeriod}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.weekNavButton}
                    onPress={() => handleWeekChange('next')}
                    disabled={selectedWeekIndex >= weeksData.length - 1}
                >
                    <Ionicons
                        name="chevron-forward"
                        size={24}
                        color={selectedWeekIndex >= weeksData.length - 1 ? "#CCC" : "#fcbf00"}
                    />
                </TouchableOpacity>
            </View>

            {/* Indicateurs de semaines */}
            <View style={styles.section}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={SCREEN_WIDTH * 0.6} // Largeur colonne + marge
                    snapToAlignment="center"
                    contentContainerStyle={styles.scrollContainer}
                >
                    {weeksData.map((week, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.weekIndicator,
                                index === selectedWeekIndex && styles.weekIndicatorActive
                            ]}
                            onPress={() => setSelectedWeekIndex(index)}
                        >
                            <Text style={[
                                styles.weekIndicatorText,
                                index === selectedWeekIndex && styles.weekIndicatorTextActive
                            ]}>
                                S{week.weekNumber}
                            </Text>
                            <Text style={styles.weekIndicatorProfit}>
                                {week.totalProfit.toLocaleString()} FCFA
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            {/* <View style={styles.weekIndicators}>
                {weeksData.map((week, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.weekIndicator,
                            index === selectedWeekIndex && styles.weekIndicatorActive
                        ]}
                        onPress={() => setSelectedWeekIndex(index)}
                    >
                        <Text style={[
                            styles.weekIndicatorText,
                            index === selectedWeekIndex && styles.weekIndicatorTextActive
                        ]}>
                            S{week.weekNumber}
                        </Text>
                        <Text style={styles.weekIndicatorProfit}>
                            {week.totalProfit.toLocaleString()} FCFA
                        </Text>
                    </TouchableOpacity>
                ))}
            </View> */}

            {/* Graphique des bénéfices */}
            <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>
                    {t.gains.dailyProfits} - {t.gains.week} {currentWeekData.weekNumber}
                </Text>
                {/* <Text style={styles.chartSubtitle}>
                    total_price_after (FCFA)
                </Text> */}
                <LineChart
                    data={chartData}
                    width={SCREEN_WIDTH - 32 - 32}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />
            </View>

            {/* Cartes de statistiques regroupées */}
            <View style={styles.statsContainer}>
                <CombinedStatCard
                    title1={t.gains.allOperations}
                    value1={currentWeekData.totalOperations}
                    subvalue1={t.gains.operations}
                    subtitle1={t.gains.thisWeek}
                    icon1="swap-horizontal"
                    color1="#4ECDC4"
                    title2={t.gains.totalProfit}
                    value2={`${currentWeekData.totalProfit.toLocaleString()} FCFA`}
                    subvalue2={t.gains.profit}
                    subtitle2={t.gains.cumWeek}
                    icon2="trending-up"
                    color2="#FF6B6B"
                />

                <CombinedStatCard
                    title1={t.gains.aveDailyOp}
                    value1={currentWeekData.averageOperationsPerDay}
                    subvalue1={t.gains.perDay}
                    subtitle1={t.gains.aveDaily}
                    icon1="calendar"
                    color1="#45B7D1"
                    title2={t.gains.aveDailyProfit}
                    value2={`${currentWeekData.averageProfitPerDay.toLocaleString()} FCFA`}
                    subtitle2={t.gains.aveDaily}
                    subvalue2={t.gains.profit}
                    icon2="cash"
                    color2="#F9A826"
                />
            </View>

            {/* Résumé de la période */}
            <View style={styles.periodSummary}>
                <Text style={styles.periodSummaryTitle}>{t.gains.periodSummary}</Text>
                <View style={styles.periodStats}>
                    <View style={styles.periodStat}>
                        <Text style={styles.periodStatValue}>
                            {weeksData.reduce((sum, week) => sum + week.totalOperations, 0).toLocaleString()}
                        </Text>
                        <Text style={styles.periodStatLabel}>{t.gains.totalTransactions}</Text>
                    </View>
                    <View style={styles.periodStat}>
                        <Text style={styles.periodStatValue}>
                            {weeksData.reduce((sum, week) => sum + week.totalProfit, 0).toLocaleString()} FCFA
                        </Text>
                        <Text style={styles.periodStatLabel}>{t.gains.totalProfit}</Text>
                    </View>
                </View>
            </View>

            <DateFilterModal />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: '#718096',
        fontFamily: 'Poppins-Regular'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 17,
        fontFamily: "Poppins-Bold",
        color: '#2D3748',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#718096',
        marginTop: 4,
        fontFamily: 'Poppins-Regular'
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fcbf00',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    filterButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 13,
        fontFamily: 'Poppins-SemiBold'
    },
    weekNavigation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 16,
        margin: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    weekNavButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F7FAFC',
    },
    weekTitleContainer: {
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 12,
    },
    weekTitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: '#2D3748',
        textAlign: 'center',
    },
    weekSubtitle: {
        fontSize: 11,
        color: '#718096',
        marginTop: 2,
        fontFamily: 'Poppins-Regular'
    },
    weekIndicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
        gap: 8,
    },
    weekIndicator: {
        alignItems: 'center',
        padding: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        minWidth: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    weekIndicatorActive: {
        backgroundColor: '#fcbf00',
    },
    weekIndicatorText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#718096',
    },
    weekIndicatorTextActive: {
        color: '#FFFFFF',
    },
    weekIndicatorProfit: {
        fontSize: 10,
        color: '#A0AEC0',
        marginTop: 2,
    },
    chartContainer: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center'
    },
    chartTitle: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#2D3748',
        marginBottom: 4,
        textAlign: 'center',
    },
    chartSubtitle: {
        fontSize: 12,
        color: '#718096',
        marginBottom: 12,
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
    },
    chart: {
        borderRadius: 8,
        marginVertical: 8,
        flex: 1,
    },
    statsContainer: {
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 16,
    },
    combinedCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
        minHeight: 120,

    },
    combinedCardHalf: {

    },
    cardSeparator: {
        width: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 12,
    },
    combinedCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    combinedIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    combinedCardTitle: {
        fontSize: 11,
        color: '#718096',
        fontFamily: 'Poppins-SemiBold'

    },
    combinedCardValue: {
        fontSize: 17,
        fontFamily: 'Poppins-Bold'
    },
    combinedCardSubtitle: {
        fontSize: 10,
        color: '#A0AEC0',
        fontFamily: 'Poppins-Regular'
    },
    // dataInfo: {
    //     backgroundColor: '#F7FAFC',
    //     margin: 16,
    //     padding: 16,
    //     borderRadius: 8,
    //     borderLeftWidth: 4,
    //     borderLeftColor: '#667eea',
    // },
    // infoItem: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     marginBottom: 8,
    // },
    // infoText: {
    //     fontSize: 12,
    //     color: '#4A5568',
    //     marginLeft: 8,
    //     flex: 1,
    // },
    noDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 50,
    },
    noDataText: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#A0AEC0',
        marginTop: 16,
        marginBottom: 8,
    },
    noDataSubtitle: {
        fontSize: 13,
        color: '#CBD5E0',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 17,
        fontFamily: 'Poppins-Bold',
        color: '#2D3748',
        marginBottom: 20,
        textAlign: 'center',
    },
    dateInputContainer: {
        marginBottom: 16,
    },
    dateLabel: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#4A5568',
        marginBottom: 8,
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        gap: 10,
    },
    dateInputText: {
        fontSize: 15,
        color: '#2D3748',
        fontFamily: 'Poppins-Regular'
    },
    selectedRange: {
        textAlign: 'center',
        fontSize: 13,
        color: '#718096',
        marginVertical: 16,
        fontStyle: 'italic',
        fontFamily: 'Poppins-Regular'
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F1F2F6',
    },
    applyButton: {
        backgroundColor: '#fcbf00',
    },
    cancelButtonText: {
        color: '#718096',
        fontFamily: 'Poppins-SemiBold'
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontFamily: 'Poppins-Bold'
    },
    noDataSubtext: {
        fontSize: 13,
        color: '#CBD5E0',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
    },
    scrollContainer: {
        gap: 8,
    },
    section: {
        marginTop: 10,
        paddingHorizontal: 20,
    },
    periodSummary: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    periodSummaryTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#2D3748',
        marginBottom: 16,
        textAlign: 'center',
    },
    periodStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    periodStat: {
        alignItems: 'center',
    },
    periodStatValue: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#fcbf00',
        marginBottom: 4,
    },
    periodStatLabel: {
        fontSize: 11,
        color: '#718096',
        textAlign: 'center',
        fontFamily: 'Poppins-Regular'
    },
});

export default GainsScreen;