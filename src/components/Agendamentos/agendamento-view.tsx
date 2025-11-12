import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAgendamentoById } from "../../context/services/agendamento-services";
import { AgendamentoDto } from "../../context/models/agendamento-models";
import { Box, CircularProgress, Dialog, DialogContent, Typography } from "@mui/material";

interface AgendamentosViewProps {
  open: boolean;
  agendamentoId: number;
  onClose: () => void;
}

const defaultAgendamento: AgendamentoDto = {
  id: 0,
  salaId: 0,
  local: "",
  salaNome: "",
  dataAgendamento: "",
  horaInicio: "",
  horaFim: "",
  cafe: true,
  cafeQuantidade: 0,
  cafeDescricao: "",
  responsavel: "",
  dataCriacao: "",
};

const AgendamentoView: React.FC<AgendamentosViewProps> = ({
  open,
  agendamentoId,
  onClose,
}) => {
  const [agendamentoData, setAgendamentoData] =
    useState<AgendamentoDto>(defaultAgendamento);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !agendamentoId) return;

    const fetchDataAgendamento = async () => {
      setLoading(true);
      try {
        const response = await getAgendamentoById(agendamentoId);

        if (response.status && response.data) {
          setAgendamentoData(response.data);
        } else {
          Swal.fire(
            "Erro!",
            response.msg ?? "Erro ao buscar agendamento",
            "error"
          );
        }
      } catch {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Erro ao conectar com o servidor.",
          showConfirmButton: false,
          timer: 1500,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDataAgendamento();
  }, [agendamentoId, open]);

  if (!open) return null;

  return (
    <>
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        onClose={onClose}
        slotProps={{ paper: { className: "obt-form-dialog" } }}
      >
        <DialogContent sx={{ pt: 1.5 }}>
          <Typography variant="h6" mb={2}>
            Agendamento
          </Typography>

          <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 4 }}>
            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="30vh"
                >
                <CircularProgress />
              </Box>
            ) : (
                <Box>
                    <Typography><strong>Cod:</strong> {agendamentoData.id.toString().padStart(4, "0")}</Typography>
                    <Typography><strong>Sala:</strong> {agendamentoData.salaNome}</Typography>
                    <Typography><strong>Data:</strong> {agendamentoData.dataAgendamento}</Typography>
                    <Typography><strong>Hora Início:</strong> {agendamentoData.horaInicio}</Typography>
                    <Typography><strong>Hora Fim:</strong> {agendamentoData.horaFim}</Typography>
                    <Typography><strong>Responsável:</strong> {agendamentoData.responsavel}</Typography>
                    <Typography><strong>Café:</strong> {agendamentoData.cafe ? "Sim" : "Não"}</Typography>
                    {agendamentoData.cafe && (
                        <>
                            <Typography><strong>Quantidade de Café:</strong> {agendamentoData.cafeQuantidade}</Typography>
                            <Typography><strong>Descrição:</strong> {agendamentoData.cafeDescricao}</Typography>
                        </>
                    )}
                    <Typography><strong>Data Criação:</strong> {agendamentoData.dataCriacao}</Typography>
                    <Typography><strong>local:</strong> {agendamentoData.local}</Typography>
                </Box>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgendamentoView;
