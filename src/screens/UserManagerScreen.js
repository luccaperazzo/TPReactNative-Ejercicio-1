import React, { useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ApiStatus from '../components/ApiStatus';
import SuccessMessage from '../components/SuccessMessage';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';
import { clearSuccessMessage, fetchUsers, loadCreatedUsersFromStorage } from '../features/users/usersSlice';

const UserManagerScreen = () => {
  const dispatch = useDispatch();
  const { successMessage, isUsingMockData } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(loadCreatedUsersFromStorage()).then(() => {
      dispatch(fetchUsers(1));
    });
  }, [dispatch]);

  const handleCloseSuccessMessage = () => {
    dispatch(clearSuccessMessage());
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.appTitle}>Gestor de Usuarios de Prueba</Text>
          <Text style={styles.subtitle}>
            Conectado a la API de reqres.in
          </Text>
        </View>

        <ApiStatus isUsingMockData={isUsingMockData} />

        <UserForm />

        <UserList />
      </ScrollView>

      <SuccessMessage
        message={successMessage}
        visible={!!successMessage}
        onClose={handleCloseSuccessMessage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    backgroundColor: 'white',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default UserManagerScreen;