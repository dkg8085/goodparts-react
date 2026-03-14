import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taxonomyReducer from './slices/taxonomySlice';
import singlePostReducer from './slices/singlePostSlice';
import taxonomyTermsReducer from './slices/taxonomyNameSlice';
import resetPasswordReducer from './slices/resetPasswordSlice';
import MenuReducer from './slices/menuSlice';
import searchPostReducer from './slices/searchPostSlice';
import contactReducer from './slices/contactUsSlice';
import contactInfoReducer from './slices/contactUsFetchInfoSlice'
import favoritePostReducer from './slices/favoritesSlice'
import favoritePostListReducer from './slices/fetchFavoritePostsSlice'
import showSheetPostsReducer from './slices/UserShowSheetSlice'
import updateShowSheetReducer from './slices/UpdateShowSheetSlice'
import accordionShowSheetReducer from './slices/AccordionShowSheetSlice'
import createShowSheetReducer from './slices/CreateNewShowSheetSlice'
import saveShowSheetPostReducer  from './slices/savedShowSheetPostsSlice'
import updateSavedShowSheetReducer  from './slices/updateSavedShowSheetSlice'
import addActionShowSheetReducer from './slices/AddActionShowSheetSlice'
import createNewActionShowSheetReducer from './slices/CreateNewActionShowSheetSlice'
import deleteNewSectionReducer from './slices/DeleteNewSectionionSlice'
import addNewActionReducer from './slices/AddNewSectionionSlice'
import updateShowSheetBreakReducer from './slices/UpdateShowSheetBreakSlice'
import searchTaxonomyTermsSliceReducer from './slices/searchTaxonomyNameSlice'
import staticMenuReducer from './slices/staticManueSlice';
import selectedValuesReducer from './slices/selectedValuesSlice'
import aiScriptReducer from "./slices/aiScriptSlice";
import prepSectionReducer from "./slices/prepSectionSlice";
import archivePostsReducer from './slices/archivePostsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    taxonomyPosts: taxonomyReducer,
    singlePost: singlePostReducer,
    taxonomyTerms: taxonomyTermsReducer,
    resetPassword: resetPasswordReducer,
    menus: MenuReducer,
    searchPost: searchPostReducer,
    contact: contactReducer,
    contactInfo: contactInfoReducer,
    favoritePost: favoritePostReducer,
    favoritePostList: favoritePostListReducer,
    showSheetPosts: showSheetPostsReducer,
    updateShowSheetMessage: updateShowSheetReducer,
    accordionShowSheet: accordionShowSheetReducer, 
    createShowSheet: createShowSheetReducer, 
    savedShowSheetPosts: saveShowSheetPostReducer, 
    savedshowSheetMessage: updateSavedShowSheetReducer,
    addActionShowSheet: addActionShowSheetReducer,
    createNewActionShowSheet: createNewActionShowSheetReducer,
    deleteNewSection: deleteNewSectionReducer,
    addNewAction: addNewActionReducer,
    updateShowSheetBreak: updateShowSheetBreakReducer,
    searchTaxonomyTerms: searchTaxonomyTermsSliceReducer,
    staticMenus: staticMenuReducer,
    selectedValues :selectedValuesReducer,
    aiScript: aiScriptReducer,
    prepSection: prepSectionReducer,
    archivePosts: archivePostsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;


