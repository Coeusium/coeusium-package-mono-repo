import { Category, CategorySet } from './types';
import { almFetch } from '@almaclaine/fetch-utils';

// Category Set

export async function addCategorySet(name) {
  const res = await almFetch(`/api/category/set?name=${name}`, {
    method: 'post',
  });
  const { id } = await res.json();
  return id as string;
}

export async function getCategorySet(id) {
  const res = await almFetch(`/api/category/set?id=${id}`);
  return (await res.json()) as CategorySet;
}

export async function listCategorySets(page = 0, limit = 20) {
  const res = await almFetch(`/api/category/set?page=${page}&limit=${limit}`);
  return (await res.json()) as CategorySet[];
}

export async function deleteCategorySet(id) {
  const res = await almFetch(`/api/category/set?id=${id}`, {
    method: 'delete',
  });
  await res.json();
}

// Category

export async function addCategory(name, set_id, parent = '') {
  let url = `/api/category?name=${name}&set_id=${set_id}`;
  if (parent) url = `${url}&parent=${parent}`;
  const res = await almFetch(url, { method: 'post' });
  const { id } = await res.json();
  return id as string;
}

export async function getCategory(id) {
  const res = await almFetch(`/api/category?id=${id}`);
  return (await res.json()) as Category;
}

export async function getCategoryChildren(id) {
  const res = await almFetch(`/api/category?id=${id}&type=children`);
  return (await res.json()) as Category[];
}

export async function getTopLevelCategories(id) {
  const res = await almFetch(`/api/category?id=${id}&type=top`);
  return (await res.json()) as Category[];
}

export async function getCategoryDescendants(id) {
  const res = await almFetch(`/api/category?id=${id}&type=descendants`);
  return (await res.json()) as Category[];
}

export async function deleteCategory(id) {
  const res = await almFetch(`/api/category?id=${id}`, { method: 'delete' });
  await res.json();
}
