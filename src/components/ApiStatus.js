// src/components/ApiStatus.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ApiStatus = ({ isUsingMockData = false }) => {
  if (!isUsingMockData) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Modo Offline</Text>
        <Text style={styles.message}>
          Usando datos de demostración. La API real no está disponible.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    marginHorizontal: 20,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    color: '#856404',
    opacity: 0.8,
  },
});

export default ApiStatus;