
export type SalaDto = {
    id: number;
    nome: string;
    local: string;
    ativo: boolean;
    dataCriacao: string;
};

export type SalaInputModel = {
    nome: string;
    ativo: boolean;
    local: string;
};