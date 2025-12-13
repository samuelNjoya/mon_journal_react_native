import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { ListRenderItem } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import HorizontalScrollGrid from './badgesComponent';

interface Benefit {
    id: number
    title: string
    description?: string
    icon?: any
    color?: string
}


export default function BenefitComponent({ badges }: any) {

    const { t, language } = useTranslation();

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t.migrations.myBenefits}</Text>
            </View>
            <HorizontalScrollGrid badges={badges} />
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginTop: 10,
        paddingHorizontal: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingTop: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: 'Poppins-Bold',
        color: '#333',
    },
});