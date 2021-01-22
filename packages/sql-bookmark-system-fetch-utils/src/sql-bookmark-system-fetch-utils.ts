import { Bookmark } from './types';

// Category Set

export async function addBookmark(url) {
  const res = await fetch(`/api/bookmark?bookmark=${url}`, { method: 'post' });
  const { id } = await res.json();
  return id as string;
}

export async function getBookmark(id) {
  const res = await fetch(`/api/bookmark?id=${id}`);
  return (await res.json()) as Bookmark;
}

export async function listBookmarks(page = 0, limit = 20) {
  const res = await fetch(`/api/bookmark?page=${page}&limit=${limit}`);
  return (await res.json()) as Bookmark[];
}

export async function deleteBookmark(id) {
  const res = await fetch(`/api/bookmark?id=${id}`, { method: 'delete' });
  await res.json();
}
