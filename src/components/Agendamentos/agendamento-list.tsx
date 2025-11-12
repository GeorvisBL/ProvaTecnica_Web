import React, { useEffect, useState } from "react";
import AgendamentosForm from "./agendamento-form";
import { AgendamentoDto } from "../../context/models/agendamento-models";
import {
  deleteAgendamento,
  getAgendamentos,
} from "../../context/services/agendamento-services";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Button,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Swal from "sweetalert2";
import AgendamentoView from "./agendamento-view";

const AgendamentosList = () => {
  const [agendamentos, setAgendamentos] = useState<AgendamentoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [agendamentoId, setAgendamentoId] = useState<number>(0);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [viewOpen, setViewOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getAgendamentos();
      if (result.status && result.data) {
        setAgendamentos(result.data);
      } else {
        setError("Nenhum registro encontrado.");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  const handleCriate = () => {
    setAgendamentoId(0);
    setFormOpen(true);
  };

  const handleEdite = (id: number) => {
    setAgendamentoId(id);
    setFormOpen(true);
  };

  const handleView = (id: number) => {
    setAgendamentoId(id);
    setViewOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Confirmar",
      text: "Tem certeza que deseja excluir o agendamento?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#b72525b8",
      cancelButtonColor: "#8b8a8ab8",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar",
    });

    if (result.isConfirmed) {
      const response = await deleteAgendamento(id);
      if (response.status) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: response.status ? "success" : "error",
          title: response.msg,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          width: "auto",
          customClass: {
            popup: "swal-toast",
            title: "swal-toast-title",
            icon: "swal-toast-icon",
          },
        });

        fetchData();
      } else {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: response.status ? "success" : "error",
          title: response.msg,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          width: "auto",
          customClass: {
            popup: "swal-toast",
            title: "swal-toast-title",
            icon: "swal-toast-icon",
          },
        });
      }
    }
  };

  const handleSaved = () => {
    fetchData();
    setFormOpen(false);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 3, p: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            Lista de agendamentos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleCriate()}
          >
            Adicionar
          </Button>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>Cod</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell>Café?</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {agendamentos.map((ag) => (
              <TableRow key={ag.id} hover>
                <TableCell>{ag.id.toString().padStart(4, "0")}</TableCell>
                <TableCell>{ag.salaNome}</TableCell>
                <TableCell>{ag.dataAgendamento}</TableCell>
                <TableCell>{`${ag.horaInicio} - ${ag.horaFim}`}</TableCell>
                <TableCell>{ag.responsavel}</TableCell>
                <TableCell>{ag.cafe ? "Sim" : "Não"}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Visualizar">
                    <IconButton onClick={() => handleView(ag.id)}>
                      <VisibilityIcon sx={{ color: "#8f8b8b" }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleEdite(ag.id)}>
                      <EditIcon sx={{ color: "#379137bd" }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Excluir">
                    <IconButton onClick={() => handleDelete(ag.id)}>
                      <DeleteIcon sx={{ color: "#b72525b8" }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AgendamentosForm
        open={formOpen}
        agendamentoId={agendamentoId}
        onClose={() => setFormOpen(false)}
        onSaved={() => handleSaved()}
      />

      <AgendamentoView
        open={viewOpen}
        agendamentoId={agendamentoId}
        onClose={() => setViewOpen(false)}
      />
    </>
  );
};
export default AgendamentosList;
