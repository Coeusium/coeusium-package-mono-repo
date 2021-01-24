import { Tag } from './types';
import { almFetch } from '@almaclaine/fetch-utils';

export async function addTag(tag) {
  const res = await almFetch(`/api/tag?tag=${tag}`, { method: 'post' });
  const { id } = await res.json();
  return id as string;
}

export async function getTag(id) {
  const res = await almFetch(`/api/tag?id=${id}`);
  return (await res.json()) as Tag;
}

export async function listTags(page = 0, limit = 20) {
  const res = await almFetch(`/api/tag?page=${page}&limit=${limit}`);
  return (await res.json()) as Tag[];
}

export async function deleteTag(id) {
  const res = await almFetch(`/api/tag?id=${id}`, { method: 'delete' });
  await res.json();
}
