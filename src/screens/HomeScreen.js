import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Button,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, fetchPosts } from '../features/posts/postsSlice';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { items, status, error, addPostStatus } = useSelector((state) => state.posts);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleAddPost = () => {
    if (!title.trim() || !body.trim()) {
      return;
    }

    const newPost = {
      title,
      body,
      userId: 1,
    };

    dispatch(addPost(newPost));

    setTitle('');
    setBody('');
  };

  const isLoading = status === 'loading';
  const isAddingPost = addPostStatus === 'loading';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>MiniBlog de Clases</Text>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Cargando publicaciones...</Text>
        </View>
      )}
      {error && <Text style={styles.error}>Error: {error}</Text>}

      <FlatList
        data={items}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : `local-${index}`
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.body}</Text>
          </View>
        )}
        ListEmptyComponent={
          !isLoading && (
            <Text style={styles.empty}>No hay publicaciones todavía.</Text>
          )
        }
      />

      <View style={styles.form}>
        <Text style={styles.formTitle}>Nueva publicación</Text>
        <TextInput
          style={styles.input}
          placeholder="Título"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Contenido"
          value={body}
          onChangeText={setBody}
          multiline
        />
        <Button
          title={isAddingPost ? 'Enviando...' : 'Publicar'}
          onPress={handleAddPost}
          disabled={!title.trim() || !body.trim() || isAddingPost}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 40, 
    backgroundColor: '#ffffff' 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 12, 
    textAlign: 'center',
    color: '#333'
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  card: {
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  title: { 
    fontWeight: 'bold', 
    marginBottom: 4, 
    fontSize: 16,
    color: '#333'
  },
  empty: { 
    textAlign: 'center', 
    marginTop: 16, 
    fontStyle: 'italic',
    color: '#666'
  },
  form: { 
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  formTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 8,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  multiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  error: { 
    color: 'red', 
    marginVertical: 8,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500'
  },
});

export default HomeScreen;
