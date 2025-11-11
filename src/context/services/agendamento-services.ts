import { AgendamentoInputModel, AgendamentoDto } from "../models/agendamento-models";
import { ResponseViewModel } from "../models/response-view-model";

const API_URL = import.meta.env.VITE_API_URL;
const resource = "agendamentos";

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<ResponseViewModel<T>> {
  const response = await fetch(`${API_URL}${endpoint}`, {
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

export const getAgendamentos = async () => {
  return apiRequest<AgendamentoDto[]>(`${resource}/listaAgendamentos`);
};

export const getAgendamentoById = async (id: number) => {
  return apiRequest<AgendamentoDto>(`${resource}/agendamento/${id}`);
};

export const createAgendamento = async (data: AgendamentoInputModel) => {
  return apiRequest<AgendamentoDto>(`${resource}/adicionar`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateAgendamento = async (id: number, data: AgendamentoInputModel) => {
  return apiRequest<AgendamentoDto>(`${resource}/atualizar/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteAgendamento = async (id: number) => {
  return apiRequest<boolean>(`${resource}/eliminar/${id}`, {
    method: "DELETE",
  });
};
