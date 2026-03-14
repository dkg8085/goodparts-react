import { createSlice } from '@reduxjs/toolkit';
import { loginUser, refreshUserData, emulateLogin } from '../thunks/authThunks'; 

const parseJSON = (item) => {
  if (item === null || item === 'undefined') return null;
  try { return JSON.parse(item); } catch { return null; }
};

const initialState = {
  user:               parseJSON(localStorage.getItem('user')),
  apiKey:             parseJSON(localStorage.getItem('api-key')),
  assignTaxonomies:   parseJSON(localStorage.getItem('assign_taxonomies')) || [],
  taxonomySettings:   parseJSON(localStorage.getItem('taxonomy_settings')) || [],
  userRole:           parseJSON(localStorage.getItem('user_role'))         || [],  
  assignTerms:        parseJSON(localStorage.getItem('assign_terms'))      || [],  
  loading:            false,
  error:              null,
  isRefreshing:       false, 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user             = null;
      state.apiKey           = null;
      state.assignTaxonomies = [];
      state.taxonomySettings = [];
      state.userRole         = [];
      state.assignTerms      = [];
      localStorage.removeItem('user');
      localStorage.removeItem('assign_taxonomies');
      localStorage.removeItem('taxonomy_settings');
      localStorage.removeItem('api-key');
      localStorage.removeItem('user_role');
      localStorage.removeItem('assign_terms');
    },
  },
  extraReducers: (builder) => {
    builder
      // ── LOGIN ──────────────────────────────────────────────
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading          = false;
        state.user             = action.payload.user;
        state.apiKey           = action.payload['api-key'];
        state.assignTaxonomies = action.payload.assign_taxonomies;
        state.taxonomySettings = action.payload.taxonomy_settings;
        state.userRole         = action.payload.user_role;
        state.assignTerms      = action.payload.assign_terms;
        
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('api-key', JSON.stringify(action.payload['api-key']));
        localStorage.setItem('assign_taxonomies', JSON.stringify(action.payload.assign_taxonomies));
        localStorage.setItem('taxonomy_settings', JSON.stringify(action.payload.taxonomy_settings));
        localStorage.setItem('user_role', JSON.stringify(action.payload.user_role));
        localStorage.setItem('assign_terms', JSON.stringify(action.payload.assign_terms));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── REFRESH (silent background sync) ──────────────────
      .addCase(refreshUserData.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshUserData.fulfilled, (state, action) => {
        state.isRefreshing = false;
        
        // Update state and localStorage with any returned fields
        if (action.payload['api-key']) {
          state.apiKey = action.payload['api-key'];
          localStorage.setItem('api-key', JSON.stringify(action.payload['api-key']));
        }
        if (action.payload.assign_taxonomies) {
          state.assignTaxonomies = action.payload.assign_taxonomies;
          localStorage.setItem('assign_taxonomies', JSON.stringify(action.payload.assign_taxonomies));
        }
        if (action.payload.taxonomy_settings) {
          state.taxonomySettings = action.payload.taxonomy_settings;
          localStorage.setItem('taxonomy_settings', JSON.stringify(action.payload.taxonomy_settings));
        }
        if (action.payload.user_role) {
          state.userRole = action.payload.user_role;
          localStorage.setItem('user_role', JSON.stringify(action.payload.user_role));
        }
        if (action.payload.assign_terms) {
          state.assignTerms = action.payload.assign_terms;
          localStorage.setItem('assign_terms', JSON.stringify(action.payload.assign_terms));
        }
        if (action.payload.user) {
          state.user = action.payload.user;
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(refreshUserData.rejected, (state) => {
        state.isRefreshing = false;
        // Silent fail — keep stale data, don't log user out
      })

      // ── EMULATE LOGIN ──────────────────────────────────────
      .addCase(emulateLogin.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(emulateLogin.fulfilled, (state, action) => {
        state.loading          = false;
        state.user             = action.payload.user;
        state.apiKey           = action.payload['api-key'];
        state.assignTaxonomies = action.payload.assign_taxonomies;
        state.taxonomySettings = action.payload.taxonomy_settings;
        state.userRole         = action.payload.user_role;
        state.assignTerms      = action.payload.assign_terms;
        
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('api-key', JSON.stringify(action.payload['api-key']));
        localStorage.setItem('assign_taxonomies', JSON.stringify(action.payload.assign_taxonomies));
        localStorage.setItem('taxonomy_settings', JSON.stringify(action.payload.taxonomy_settings));
        localStorage.setItem('user_role', JSON.stringify(action.payload.user_role));
        localStorage.setItem('assign_terms', JSON.stringify(action.payload.assign_terms));
      })
      .addCase(emulateLogin.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;