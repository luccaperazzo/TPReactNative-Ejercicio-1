import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearCreateStatus, createUser } from '../features/users/usersSlice';

const UserForm = () => {
  const dispatch = useDispatch();
  const { createStatus, createError } = useSelector((state) => state.users);

  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [nameError, setNameError] = useState('');
  const [jobError, setJobError] = useState('');

  const isLoading = createStatus === 'loading';

  useEffect(() => {
    if (createStatus === 'succeeded') {
      setName('');
      setJob('');
      setNameError('');
      setJobError('');
      
      setTimeout(() => {
        dispatch(clearCreateStatus());
      }, 3000);
    }
  }, [createStatus, dispatch]);

  const validateForm = () => {
    let isValid = true;

    setNameError('');
    setJobError('');

    if (!name.trim()) {
      setNameError('El nombre es requerido');
      isValid = false;
    } else if (name.trim().length < 2) {
      setNameError('El nombre debe tener al menos 2 caracteres');
      isValid = false;
    }

    if (!job.trim()) {
      setJobError('El trabajo/rol es requerido');
      isValid = false;
    } else if (job.trim().length < 2) {
      setJobError('El trabajo/rol debe tener al menos 2 caracteres');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const userData = {
      name: name.trim(),
      job: job.trim(),
    };

    dispatch(createUser(userData));
  };

  const handleReset = () => {
    Alert.alert(
      'Limpiar formulario',
      '¿Estás seguro de que quieres limpiar todos los campos?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: () => {
            setName('');
            setJob('');
            setNameError('');
            setJobError('');
            dispatch(clearCreateStatus());
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Nuevo Usuario</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre *</Text>
        <TextInput
          style={[styles.input, nameError && styles.inputError]}
          placeholder="Ingresa el nombre completo"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (nameError) setNameError('');
          }}
          editable={!isLoading}
          maxLength={50}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Trabajo/Rol *</Text>
        <TextInput
          style={[styles.input, jobError && styles.inputError]}
          placeholder="Ej: Desarrollador, Diseñador, etc."
          value={job}
          onChangeText={(text) => {
            setJob(text);
            if (jobError) setJobError('');
          }}
          editable={!isLoading}
          maxLength={50}
        />
        {jobError ? <Text style={styles.errorText}>{jobError}</Text> : null}
      </View>

      {createError && (
        <View style={styles.errorContainer}>
          <Text style={styles.createErrorText}>Error: {createError}</Text>
        </View>
      )}

      {createStatus === 'succeeded' && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            ✅ Usuario creado exitosamente
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={handleReset}
          disabled={isLoading || (!name && !job)}
        >
          <Text style={styles.resetButtonText}>Limpiar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.submitButton,
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading || !name.trim() || !job.trim()}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.submitButtonText}>Creando...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>Crear Usuario</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>
        * Los campos marcados son obligatorios
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
    marginBottom: 16,
  },
  createErrorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
  successContainer: {
    backgroundColor: '#F0FFF4',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
    marginBottom: 16,
  },
  successText: {
    color: '#34C759',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  resetButton: {
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  resetButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default UserForm;