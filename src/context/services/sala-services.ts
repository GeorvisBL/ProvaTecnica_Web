
import { SalaInputModel, SalaDto } from "../models/sala-models";
import { ResponseViewModel } from "../models/response-view-model";

const BASE_URL = import.meta.env.VITE_API_URL;
const resource = "salas";

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<ResponseViewModel<T>> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    return {
      status: false,
      msg: `Erro HTTP ${response.status}: ${errorText}`,
      data: null as T | null,
    };
  }

  const result = (await response.json()) as ResponseViewModel<T>;
  return result;
}

export const getSalas = async () => {
  return apiRequest<SalaDto[]>(`${resource}/lista-salas`);
};

export const getSalaById = async (id: number) => {
  return apiRequest<SalaDto>(`${resource}/sala/${id}`);
};

export const createSala = async (data: SalaInputModel) => {
  return apiRequest<SalaDto>(`${resource}/adicionar`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateSala = async (id: number, data: SalaInputModel) => {
  return apiRequest<SalaDto>(`${resource}/atualizar/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteSala = async (id: number) => {
  return apiRequest<boolean>(`${resource}/eliminar/${id}`, {
    method: "DELETE",
  });
};
