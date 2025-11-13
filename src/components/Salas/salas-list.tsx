import React, { useEffect, useState } from "react";
import SalasForm from "./salas-form";
import { SalaDto } from "../../context/models/sala-models";
import { getSalas } from "../../context/services/sala-services";
import {
  Box,
  Button,
  CircularProgress,
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
import EditIcon from "@mui/icons-material/Edit";

const SalasList = () => {
  const [salas, setSalas] = useState<SalaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [salaId, setSalaId] = useState<number>(0);
  const [formOpen, setFormOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getSalas();

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
    setSalaId(0);
    setFormOpen(true);
  };

  const handleEdite = (id: number) => {
    setSalaId(id);
    setFormOpen(true);
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
              <TableCell>Cod</TableCell>
              <TableCell>Sala</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data de cadastro</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {salas.map((setMsg) => (
              <TableRow key={setMsg.id} hover>
                <TableCell>{setMsg.id.toString().padStart(4, "0")}</TableCell>
                <TableCell>{setMsg.nome}</TableCell>
                <TableCell>{setMsg.ativo ? "Ativo" : "Inativo"}</TableCell>
                <TableCell>{setMsg.dataCriacao}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleEdite(setMsg.id)}>
                      <EditIcon sx={{ color: "#379137bd" }} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <SalasForm
        open={formOpen}
        salaId={salaId}
        onClose={() => setFormOpen(false)}
        onSaved={() => handleSaved()}
      />
    </>
  );
};
export default SalasList;
