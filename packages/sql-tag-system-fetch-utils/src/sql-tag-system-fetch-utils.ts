import { Tag } from './types';
import { almFetch } from '@almaclaine/fetch-utils';

export async function addTag(tag) {
  const res = await almFetch(`/api/tag?tag=${tag}`, { method: 'post' });
  const { tag_id } = await res.json();
  return tag_id as string;
}

export async function getTag(tag_id) {
  const res = await almFetch(`/api/tag?tag_id=${tag_id}`);
  return (await res.json()) as Tag;
}

export async function listTags(page = 0, limit = 20) {
  const res = await almFetch(`/api/tag?page=${page}&limit=${limit}`);
  return (await res.json()) as Tag[];
}

export async function deleteTag(tag_id) {
  const res = await almFetch(`/api/tag?tag_id=${tag_id}`, { method: 'delete' });
  await res.json();
}
