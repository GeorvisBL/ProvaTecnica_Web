
import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
} from "@mui/material";
import Agendamentos from "./pages/Agendamentos";
import Salas from "./pages/Salas";

function App() {
  return (
    <>
      <Container sx={{ mt: 4 }}>
        
        <AppBar position="static" color="primary">
          <Toolbar>
            
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Prova Técnica
            </Typography>

            <Button color="inherit" component={Link} to="/salas">
              Salas
            </Button>
            <Button color="inherit" component={Link} to="/agendamentos">
              Agendar
            </Button>
            
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<Agendamentos />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/salas" element={<Salas />} />
        </Routes>

      </Container>
    </>
  );
}
export default App;
