import {
  fetchArchivePostsRequest,
  fetchArchivePostsSuccess,
  fetchArchivePostsFailure,
} from '../slices/archivePostsSlice';

export const fetchArchivePosts = (taxonomySlug, page = 1, perPage = 10, termIds = []) => async (dispatch) => {
  dispatch(fetchArchivePostsRequest());
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.ID;
    if (!userId) throw new Error('User not found');

    let url = `https://goodpartsadmin.boomsite.fm/wp-json/api/archive_posts/?taxonomy_slug=${taxonomySlug}&user_id=${userId}&page=${page}&per_page=${perPage}`;
    if (termIds.length) {
      url += `&term_ids=${termIds.join(',')}`;
    }

    const response = await fetch(url, {
      headers: { 'api-key': 'A1GsEWYUcxnZLeUrGWvJVti26ZM6FaJ4' } 
    });
    const data = await response.json();

    if (data.status === 'success') {
      dispatch(fetchArchivePostsSuccess({
        posts: data.data,
        terms: data.terms,
        pagination: data.pagination 
      }));
    } else {
      dispatch(fetchArchivePostsFailure(data.message));
    }
  } catch (error) {
    dispatch(fetchArchivePostsFailure(error.message));
  }
};