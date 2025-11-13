import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  MenuItem,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { AgendamentoInputModel } from "../../context/models/agendamento-models";
import {
  createAgendamento,
  getAgendamentoById,
  updateAgendamento,
} from "../../context/services/agendamento-services";
import { getSalas } from "../../context/services/sala-services";
import Swal from "sweetalert2";

interface AgendamentosFormProps {
  open: boolean;
  agendamentoId: number;
  onClose: () => void;
  onSaved: () => void;
}

const defaultValues: AgendamentoInputModel = {
  salaId: 0,
  dataAgendamento: "",
  horaInicio: "",
  horaFim: "",
  cafe: false,
  cafeQuantidade: 0,
  cafeDescricao: "",
  responsavel: "",
};

export interface SalaFormDto {
  id: number;
  nome: string;
}

const AgendamentosForm: React.FC<AgendamentosFormProps> = ({
  open,
  agendamentoId,
  onClose,
  onSaved,
}) => {
  const editing = Boolean(agendamentoId);

  const [salas, setSalas] = useState<SalaFormDto[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm<AgendamentoInputModel>({ defaultValues });

  useEffect(() => {
    if (!open) return;
    setActiveStep(0);

    if (editing) {
      fetchDataAgendamento(agendamentoId);
    } else {
      reset(defaultValues);
    }

    fetchDataSalas();
  }, [agendamentoId, open, reset, editing]);

  const fetchDataAgendamento = async (cod: number) => {
    try {
      const response = await getAgendamentoById(cod);
      if (response.status && response.data) {
        const data = response.data;

        let dataFormatada = "";
        if (data.dataAgendamento) {
          if (data.dataAgendamento.includes("/")) {
            const [dia, mes, ano] = data.dataAgendamento.split("/");
            dataFormatada = `${ano}-${mes}-${dia}`;
          } else if (data.dataAgendamento.includes("T")) {
            dataFormatada = data.dataAgendamento.split("T")[0];
          } else {
            dataFormatada = data.dataAgendamento;
          }
        }

        reset({
          salaId: data.salaId ?? 0,
          dataAgendamento: dataFormatada,
          horaInicio: data.horaInicio ?? "",
          horaFim: data.horaFim ?? "",
          cafe: data.cafe ?? false,
          cafeQuantidade: data.cafeQuantidade ?? 0,
          cafeDescricao: data.cafeDescricao ?? "",
          responsavel: data.responsavel ?? "",
        });
      } else {
        Swal.fire("Erro!", response.msg, "error");
      }
    } catch {
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

  const fetchDataSalas = async () => {
    try {
      const response = await getSalas();
      if (response.status && response.data) {
        setSalas(response.data);
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
    } catch {
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

  const onSubmit = async (ag: AgendamentoInputModel) => {
    const [ano, mes, dia] = ag.dataAgendamento.split("-");
    const dataFormatada = `${dia}/${mes}/${ano}`;

    const agendamento: AgendamentoInputModel = {
      salaId: ag.salaId,
      dataAgendamento: dataFormatada,
      horaInicio: ag.horaInicio,
      horaFim: ag.horaFim,
      cafe: ag.cafe,
      cafeQuantidade: ag.cafeQuantidade,
      cafeDescricao: ag.cafeDescricao,
      responsavel: ag.responsavel,
    };

    try {
      let response;
      if (editing) {
        response = await updateAgendamento(agendamentoId, agendamento);
      } else {
        response = await createAgendamento(agendamento);
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

  const steps = [
    { label: "Dados do agendamento" },
    { label: "Responsável" },
    { label: "Café?" },
  ];

  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);

  const handleNext = async () => {
    let fieldsToValidate: (keyof AgendamentoInputModel)[] = [];

    if (activeStep === 0) {
      fieldsToValidate = ["salaId", "dataAgendamento", "horaInicio", "horaFim"];
    } else if (activeStep === 1) {
      fieldsToValidate = ["responsavel"];
    } else if (activeStep === 2) {
      fieldsToValidate = ["cafe", "cafeQuantidade", "cafeDescricao"];
    }

    const isValid = await trigger(fieldsToValidate as any, {
      shouldFocus: true,
    });
    if (!isValid) return;

    setActiveStep((prev) => prev + 1);
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
            {editing ? "Editar" : "Adicionar"} Agendamento
          </Typography>

          <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {/* STEP 1 */}
                <Step>
                  <StepLabel>{steps[0].label}</StepLabel>
                  <StepContent>
                    <Grid container spacing={2} columns={12}>
                      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                        <Controller
                          name="salaId"
                          control={control}
                          rules={{
                            required: "A sala é obrigatória",
                            validate: (value) =>
                              value !== 0 || "Selecione uma sala",
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              select
                              label="Sala:"
                              fullWidth
                              required
                              disabled={editing}
                              error={!!errors.salaId}
                              helperText={errors.salaId?.message}
                            >
                              <MenuItem value={0} disabled>
                                Selecione uma sala
                              </MenuItem>
                              {salas.map((sala) => (
                                <MenuItem key={sala.id} value={sala.id}>
                                  {sala.nome}
                                </MenuItem>
                              ))}
                            </TextField>
                          )}
                        />
                      </Grid>

                      <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                        <Controller
                          name="dataAgendamento"
                          control={control}
                          rules={{
                            required: "A data do agendamento é obrigatória",
                            validate: (value) => {
                              if (!value)
                                return "A data do agendamento é obrigatória";

                              const [ano, mes, dia] = value.split("-").map(Number);
                              const dataSelecionada = new Date( ano, mes - 1, dia );

                              const hoje = new Date();
                              dataSelecionada.setHours(0, 0, 0, 0);
                              hoje.setHours(0, 0, 0, 0);
                              if (dataSelecionada < hoje) {
                                return "A data não pode ser menor que a data atual";
                              }
                              return true;
                            },
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Data do Agendamento:"
                              type="date"
                              fullWidth
                              required
                              InputLabelProps={{ shrink: true }}
                              error={!!errors.dataAgendamento}
                              helperText={errors.dataAgendamento?.message}
                            />
                          )}
                        />
                      </Grid>

                      <Grid size={{ xs: 3, sm: 3, md: 3, lg: 3 }}>
                        <Controller
                          name="horaInicio"
                          control={control}
                          rules={{
                            required: "A hora de início é obrigatória",
                            validate: (value, formValues) => {
                              if (!value)
                                return "A hora de início é obrigatória";

                              const { dataAgendamento } = formValues;
                              if (!dataAgendamento)
                                return "Selecione uma data antes de definir o horário";

                              const [ano, mes, dia] = dataAgendamento.split("-").map(Number);
                              const [hora, minuto] = value.split(":").map(Number);

                              const dataHoraSelecionada = new Date( ano, mes - 1, dia, hora, minuto );
                              const agora = new Date();

                              const hoje = new Date();
                              hoje.setHours(0, 0, 0, 0);
                              const dataSelecionada = new Date( ano, mes - 1, dia );
                              dataSelecionada.setHours(0, 0, 0, 0);

                              if (
                                dataSelecionada.getTime() === hoje.getTime() &&
                                dataHoraSelecionada < agora
                              ) {
                                return "A hora não pode ser menor que a hora atual";
                              }

                              return true;
                            },
                          }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Hora de Início:"
                              type="time"
                              fullWidth
                              required
                              InputLabelProps={{ shrink: true }}
                              error={!!errors.horaInicio}
                              helperText={errors.horaInicio?.message}
                            />
                          )}
                        />
                      </Grid>

                      <Grid size={{ xs: 3, sm: 3, md: 3, lg: 3 }}>
                        <Controller
                          name="horaFim"
                          control={control}
                          rules={{ required: "A hora de fim é obrigatória" }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Hora de Fim:"
                              type="time"
                              fullWidth
                              required
                              InputLabelProps={{ shrink: true }}
                              error={!!errors.horaFim}
                              helperText={errors.horaFim?.message}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                      <Button variant="contained" onClick={handleNext}>
                        Próximo
                      </Button>
                    </Box>
                  </StepContent>
                </Step>

                {/* STEP 2 */}
                <Step>
                  <StepLabel>{steps[1].label}</StepLabel>
                  <StepContent>
                    <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                      <Controller
                        name="responsavel"
                        control={control}
                        rules={{
                          required: "O nome do responsável é obrigatório",
                        }}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Responsável:"
                            type="text"
                            fullWidth
                            required
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.responsavel}
                            helperText={errors.responsavel?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                      <Button onClick={handleBack} sx={{ mr: 1 }}>
                        Voltar
                      </Button>
                      <Button variant="contained" onClick={handleNext}>
                        Próximo
                      </Button>
                    </Box>
                  </StepContent>
                </Step>

                {/* STEP 3 */}
                <Step>
                  <StepLabel>{steps[2].label}</StepLabel>
                  <StepContent>
                    <Grid container spacing={2} columns={12}>
                      <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                        <Controller
                          name="cafe"
                          control={control}
                          render={({ field }) => (
                            <Box
                              display="flex"
                              alignItems="center"
                              sx={{ mt: 1 }}
                            >
                              <Typography sx={{ mr: 2 }}>
                                Servir café?:
                              </Typography>
                              <Switch
                                {...field}
                                checked={!!field.value}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                                color="primary"
                              />
                            </Box>
                          )}
                        />
                      </Grid>

                      <Grid size={{ xs: 6, sm: 6, md: 6, lg: 6 }}>
                        <Controller
                          name="cafeQuantidade"
                          control={control}
                          rules={{
                            validate: (value, formValues) =>
                              formValues.cafe
                                ? value > 0
                                  ? true
                                  : "Informe a quantidade de café"
                                : true,
                          }}
                          render={({ field, fieldState }) => {
                            const cafeValue = useWatch({
                              control,
                              name: "cafe",
                            });

                            useEffect(() => {
                              if (!cafeValue) {
                                field.onChange(0);
                              }
                            }, [cafeValue]);

                            return (
                              <TextField
                                {...field}
                                label="Quantidade de Café:"
                                type="number"
                                fullWidth
                                required={cafeValue}
                                disabled={!cafeValue}
                                InputLabelProps={{ shrink: true }}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                              />
                            );
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                        <Controller
                          name="cafeDescricao"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Descrição:"
                              type="text"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              error={!!errors.cafeDescricao}
                              helperText={errors.cafeDescricao?.message}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                      <Button onClick={handleBack} sx={{ mr: 1 }}>
                        Voltar
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              </Stepper>

              {activeStep === steps.length && (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6">Formulário concluído!</Typography>
                  <Button onClick={handleReset} sx={{ mt: 2 }}>
                    Reiniciar
                  </Button>
                </Box>
              )}

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

export default AgendamentosForm;
function trigger(
  fieldsToValidate: (keyof AgendamentoInputModel)[],
  arg1: { shouldFocus: boolean }
) {
  throw new Error("Function not implemented.");
}
