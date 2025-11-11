import React, { useEffect, useState } from "react";
import AgendamentosForm from "./agendamento-form";
import { AgendamentoDto } from "../../context/models/agendamento-models";
import { getAgendamentos } from "../../context/services/agendamento-services";
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
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Swal from 'sweetalert2';

const AgendamentosList = () => {
  const [agendamentos, setAgendamentos] = useState<AgendamentoDto[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [titleModal, setTitleModal] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getAgendamentos();
        setMsg(result.msg);
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
    }
    fetchData();
  }, []);

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
    console.log("Criar item");
    setTitleModal("Adicionar Agendamento");
    setOpen(true);
  };
  const handleView = (id: number) => {
    console.log("Visualizar item", id);
    setTitleModal("Visualizar Agendamento");
    setOpen(true);
  };
  const handleEdite = (id: number) => {
    console.log("Editar item", id);
    setTitleModal("Editar Agendamento");
    setOpen(true);
  };
  const handleDelete = (id: number) => {
    console.log("Deletar item", id);

    Swal.fire({
      title: "Confirmar",
      text: "Tem certeza que deseja excluir o agendamento?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#b72525b8",
      cancelButtonColor: "#8b8a8ab8",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Confirmado!",
          text: "Registro excluído com sucesso.",
          icon: "success",
        });
      }
    });
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
              <TableCell>ID</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Horário</TableCell>
              <TableCell>Responsável</TableCell>
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

      <Dialog open={open} onClick={() => setOpen(false)}>
        <DialogTitle>{titleModal}</DialogTitle>

        <DialogContent>
          <AgendamentosForm />
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AgendamentosList;
