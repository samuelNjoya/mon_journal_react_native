import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from '../../hooks/useTranslation';
import BadgeDetails from '../BadgeDetails';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface GridItem {
    id: string;
    title: string;
    icon: string;
    badge_color: string;
    onPress?: () => void;
}

const HorizontalScrollGrid = ({ badges }: any) => {
    const [isVisible, setIsVisible] = useState(false)
    const [badge, setBadge] = useState<any>(null)
    const { t } = useTranslation();
    // Données d'exemple - 12 éléments (4 colonnes de 3 éléments)
    // Diviser les données en colonnes de 3 éléments
    const createColumns = (data: GridItem[], itemsPerColumn: number = 3) => {
        const columns = [];
        for (let i = 0; i < data.length; i += itemsPerColumn) {
            columns.push(data.slice(i, i + itemsPerColumn));
        }
        return columns;
    };

    const columns = createColumns(badges, 2);

    const handleItemPress = (item: GridItem) => {
        setBadge(item)
        setIsVisible(true)
        //item.onPress?.();
    };

    const GridColumn = ({ columnItems, columnIndex }: { columnItems: GridItem[]; columnIndex: number }) => (
        <View style={{ maxWidth: "25%" }}>
            {columnItems.map((item, index) => (
                <TouchableOpacity
                    style={styles.benefitItem}
                    onPress={() => { handleItemPress(item) }}
                    key={index}
                >
                    <View style={[styles.benefitIcon, { backgroundColor: item.badge_color }]}>
                        <Ionicons name="medal-outline" size={20} color="white" />
                        {/* <MaterialIcons name={"trophy-outline"} size={20} color="white" /> */}
                    </View>
                    <Text style={styles.operationTitle} numberOfLines={2}>{item.title}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <>
            <BadgeDetails onClose={() => { setIsVisible(false) }} visible={isVisible} title={badge?.title || ''} message={badge?.description} color={badge?.badge_color} />
            <View style={styles.container}>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    decelerationRate="fast"
                    snapToInterval={SCREEN_WIDTH * 0.8 + 16} // Largeur colonne + marge
                    snapToAlignment="center"
                >
                    {columns.map((column, index) => (
                        <GridColumn key={index} columnItems={column} columnIndex={index} />
                    ))}
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 16,
        marginLeft: 16,
    },
    scrollContent: {
        paddingHorizontal: 8,
    },
    column: {
        marginHorizontal: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    gridItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    lastItemInColumn: {
        borderBottomWidth: 0,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D3748',
    },
    operationTitle: {
        fontSize: 7,
        fontFamily: 'Poppins-Regular',
        color: '#1a171a',
        // marginBottom: 2,
        textAlign: 'center',
    },
    operationDesc: {
        fontSize: 8,
        fontFamily: 'Poppins-Regular',
        color: '#666',
        textAlign: 'center',
    },
    benefitItem: {
        alignItems: 'center',
        margin: 8,
    },
    benefitIcon: {
        width: 35,
        height: 35,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingTop: 15,
    },
});

export default HorizontalScrollGrid;