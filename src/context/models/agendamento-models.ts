
export type AgendamentoDto = {
    id: number;
    salaId: number;
    salaNome: string;
    dataAgendamento: string;  
    horaInicio: string;
    horaFim: string;
    cafe: string;
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
    cafe: string;
    cafeQuantidade: number;
    cafeDescricao: string;
    responsavel: string;
};