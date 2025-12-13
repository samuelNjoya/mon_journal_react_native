import React, { useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { View, StyleSheet } from 'react-native';

const SelectInput = ({ value, onValueChange, options }) => {


    return (
        <View style={styles.container}>
            <RNPickerSelect
                value={value}
                onValueChange={onValueChange}
                items={options.map((opt: { label: string, value: string }) => ({ label: opt.label, value: opt.value }))}
                placeholder={{ label: 'Sélectionnez une option...', value: null }}

                style={pickerSelectStyles}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#3498db',
        borderRadius: 8,
        color: '#2c3e50',
        backgroundColor: '#ecf0f1',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#3498db',
        borderRadius: 8,
        color: '#2c3e50',
        backgroundColor: '#ecf0f1',
        paddingRight: 30,
    },
});

export default SelectInput;