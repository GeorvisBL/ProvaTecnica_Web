import React, { useEffect, useState } from "react";
import SalasForm from "./salas-form";
import { SalaDto } from "../../context/models/sala-models";
import { getSalas } from "../../context/services/sala-services";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Paper,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Swal from "sweetalert2";

const SalasList = () => {
  const [salas, setSalas] = useState<SalaDto[]>([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [titleModal, setTitleModal] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getSalas();
        setMsg(result.msg);
        if (result.status && result.data) {
          setSalas(result.data);
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
    setTitleModal("Adicionar Sala");
    setOpen(true);
  };
  const handleView = (id: number) => {
    console.log("Visualizar item", id);
    setTitleModal("Visualizar Sala");
    setOpen(true);
  };
  const handleEdite = (id: number) => {
    console.log("Editar item", id);
    setTitleModal("Editar Sala");
    setOpen(true);
  };
  const handleDelete = (id: number) => {
    console.log("Deletar item", id);

    Swal.fire({
      title: "Confirmar",
      text: "Tem certeza que deseja excluir essa sala?",
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
            Lista de salas
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
              <TableCell>Data de cadastro</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {salas.map((setMsg) => (
              <TableRow key={setMsg.id} hover>
                <TableCell>{setMsg.id.toString().padStart(4, "0")}</TableCell>
                <TableCell>{setMsg.nome}</TableCell>
                <TableCell>{setMsg.dataCriacao}</TableCell>
                <TableCell>{setMsg.ativo ? "Ativo" : "Inativo"}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Visualizar">
                    <IconButton onClick={() => handleView(setMsg.id)}>
                      <VisibilityIcon sx={{ color: "#8f8b8b" }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleEdite(setMsg.id)}>
                      <EditIcon sx={{ color: "#379137bd" }} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Excluir">
                    <IconButton onClick={() => handleDelete(setMsg.id)}>
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
          <SalasForm />
        </DialogContent>
      </Dialog>
    </>
  );
};
export default SalasList;
