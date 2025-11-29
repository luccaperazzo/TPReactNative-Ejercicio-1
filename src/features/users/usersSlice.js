import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { storage } from '../../utils/storage';

const API_CONFIG = {
  baseUrl: 'https://reqres.in/api',
  apiKey: 'reqres-free-v1',
};

const STORAGE_KEY = 'createdUsers';

const loadCreatedUsers = async () => {
  try {
    const stored = await storage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading created users:', error);
    return [];
  }
};

const saveCreatedUsers = async (users) => {
  try {
    await storage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving created users:', error);
  }
};

const initialState = {
  items: [],
  apiUsers: [],
  createdUsers: [],
  status: 'idle',
  error: null,
  createStatus: 'idle',
  createError: null,
  currentPage: 1,
  totalPages: 1,
  successMessage: null,
  isUsingMockData: false,
  apiAvailable: true,
};

export const loadCreatedUsersFromStorage = createAsyncThunk(
  'users/loadCreatedUsersFromStorage',
  async () => {
    const createdUsers = await loadCreatedUsers();
    return createdUsers;
  }
);

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page = 1, { rejectWithValue }) => {
    try {
      console.log('Attempting to fetch users from reqres.in API...');
      console.log('URL:', `${API_CONFIG.baseUrl}/users?page=${page}`);
      
      const response = await fetch(
        `${API_CONFIG.baseUrl}/users?page=${page}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'x-api-key': API_CONFIG.apiKey,
          },
        }
      );
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Reqres.in API request successful, data received:', data);
      return { ...data, isUsingMockData: false };
    } catch (error) {
      console.error('Fetch users error:', error);
      
      try {
        console.log('⚠️ Reqres.in failed, switching to JSONPlaceholder as fallback...');
        const fallbackResponse = await fetch('https://jsonplaceholder.typicode.com/users');
        if (fallbackResponse.ok) {
          const users = await fallbackResponse.json();
          const transformedData = {
            page: page,
            per_page: 6,
            total: users.length,
            total_pages: Math.ceil(users.length / 6),
            data: users.slice((page - 1) * 6, page * 6).map((user, index) => ({
              id: user.id,
              email: user.email,
              first_name: user.name.split(' ')[0],
              last_name: user.name.split(' ').slice(1).join(' ') || 'User',
              avatar: `https://reqres.in/img/faces/${(index % 6) + 1}-image.jpg`
            })),
            isUsingMockData: true
          };
          console.log('✅ JSONPlaceholder API successful, data transformed:', transformedData);
          return transformedData;
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
      
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (newUser, { rejectWithValue }) => {
    try {
      console.log('Creating user via reqres.in API...');
      const response = await fetch(
        `${API_CONFIG.baseUrl}/users`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': API_CONFIG.apiKey,
          },
          body: JSON.stringify(newUser),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Create user API successful');
      return data;
    } catch (error) {
      console.error('Create user error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearCreateStatus: (state) => {
      state.createStatus = 'idle';
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCreatedUsersFromStorage.fulfilled, (state, action) => {
        state.createdUsers = action.payload;
        state.items = [...action.payload, ...state.apiUsers];
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        state.apiUsers = action.payload.data || [];
        state.currentPage = action.payload.page || 1;
        state.totalPages = action.payload.total_pages || 1;
        state.apiAvailable = true;
        
        state.items = [...state.createdUsers, ...(action.payload.data || [])];
        
        state.isUsingMockData = action.payload.isUsingMockData || false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
        state.items = [...state.createdUsers];
        state.currentPage = 1;
        state.totalPages = 1;
      })
      .addCase(createUser.pending, (state) => {
        state.createStatus = 'loading';
        state.createError = null;
        state.successMessage = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.createError = null;
        
        const newUser = {
          ...action.payload,
          first_name: action.payload.name?.split(' ')[0] || action.payload.name || 'Usuario',
          last_name: action.payload.name?.split(' ')[1] || '',
          email: `${(action.payload.name || 'usuario').toLowerCase().replace(' ', '.')}@reqres.in`,
          avatar: 'https://reqres.in/img/faces/1-image.jpg',
          isCreatedLocally: true,
        };
        
        state.createdUsers.unshift(newUser);
        
        state.items = [...state.createdUsers, ...state.apiUsers];
        
        saveCreatedUsers(state.createdUsers);
        
        state.successMessage = 'Usuario creado exitosamente';
      })
      .addCase(createUser.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.createError = action.payload || action.error.message;
      });
  },
});

export const { clearSuccessMessage, clearCreateStatus } = usersSlice.actions;
export default usersSlice.reducer;