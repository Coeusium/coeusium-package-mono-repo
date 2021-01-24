import { Bookmark } from './types';
import { almFetch } from '@almaclaine/fetch-utils';

// Category Set

export async function addBookmark(url) {
  const res = await almFetch(`/api/bookmark?bookmark=${url}`, {
    method: 'post',
  });
  const { id } = await res.json();
  return id as string;
}

export async function getBookmark(id) {
  const res = await almFetch(`/api/bookmark?id=${id}`);
  return (await res.json()) as Bookmark;
}

export async function listBookmarks(page = 0, limit = 20) {
  const res = await almFetch(`/api/bookmark?page=${page}&limit=${limit}`);
  return (await res.json()) as Bookmark[];
}

export async function deleteBookmark(id) {
  const res = await almFetch(`/api/bookmark?id=${id}`, { method: 'delete' });
  await res.json();
}
