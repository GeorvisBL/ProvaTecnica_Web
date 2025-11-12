import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { SalaInputModel } from "../../context/models/sala-models";
import {
  createSala,
  getSalaById,
  updateSala,
} from "../../context/services/sala-services";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
interface SalasFormProps {
  open: boolean;
  salaId: number;
  onClose: () => void;
  onSaved: () => void;
}

const defaultValues: SalaInputModel = {
  nome: "",
  local: "",
  ativo: false,
};

const SalasForm: React.FC<SalasFormProps> = ({
  open,
  salaId,
  onClose,
  onSaved,
}) => {
  const editing = Boolean(salaId);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SalaInputModel>({ defaultValues });

  useEffect(() => {
    if (!open) return;

    if (editing) {
      fetchDataSala(salaId);
    } else {
      reset(defaultValues);
    }
  }, [salaId, open, reset, editing]);

  const fetchDataSala = async (cod: number) => {
    try {
      const response = await getSalaById(cod);
      if (response.status && response.data) {
        const data = response.data;

        reset({
          nome: data.nome,
          local: data.local,
          ativo: data.ativo,
        });
      } else {
        Swal.fire("Erro!", response.msg, "error");
      }
    } catch {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Erro ao conectar com o servidor.",
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
  };

  const onSubmit = async (s: SalaInputModel) => {
    const sala: SalaInputModel = {
      nome: s.nome,
      local: s.local,
      ativo: s.ativo,
    };

    try {
      let response;
      if (editing) {
        response = await updateSala(salaId, sala);
      } else {
        response = await createSala(sala);
      }

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

      onSaved();
      onClose();
      reset(defaultValues);
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Erro ao conectar com o servidor.",
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
  };

  return (
    <>
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        onClose={() => {
          onClose();
          reset(defaultValues);
        }}
        slotProps={{ paper: { className: "obt-form-dialog" } }}
      >
        <DialogContent sx={{ pt: 1.5 }}>
          <Typography variant="h6" mb={2}>
            {editing ? "Editar" : "Adicionar"} Sala
          </Typography>

          <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} columns={12}>
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                  <Controller
                    name="nome"
                    control={control}
                    rules={{
                      required: "O nome da sala é obrigatório",
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Nome da Sala:"
                        type="text"
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.nome}
                        helperText={errors.nome?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                  <Controller
                    name="local"
                    control={control}
                    rules={{
                      required: "O local é obrigatório",
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Local da Sala:"
                        type="text"
                        fullWidth
                        required
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.local}
                        helperText={errors.local?.message}
                      />
                    )}
                  />
                </Grid>

                {editing && (
                  <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                    <Controller
                      name="ativo"
                      control={control}
                      render={({ field }) => (
                        <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                          <Typography sx={{ mr: 2 }}>Status:</Typography>
                          <Switch
                            {...field}
                            checked={!!field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            color="primary"
                          />
                        </Box>
                      )}
                    />
                  </Grid>
                )}
              </Grid>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    onClose();
                    reset(defaultValues);
                  }}
                >
                  Sair
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit(onSubmit)}
                  sx={{ width: 200 }}
                >
                  Salvar
                </Button>
              </Box>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default SalasForm;
