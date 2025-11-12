
export type AgendamentoDto = {
    id: number;
    salaId: number;
    local: string;
    salaNome: string;
    dataAgendamento: string;  
    horaInicio: string;
    horaFim: string;
    cafe: boolean;
    cafeQuantidade: number;
    cafeDescricao: string;
    responsavel: string;
    dataCriacao: string;
};

export type AgendamentoInputModel = {
    salaId: number;
    dataAgendamento: string;  
    horaInicio: string;
    horaFim: string;
    responsavel: string;
    cafe: boolean;
    cafeQuantidade: number;
    cafeDescricao: string;
};