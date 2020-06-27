import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormLabel from '@material-ui/core/FormLabel';
import { nacionalidades, idiomas } from '../../constants/formConfig';

const useStyles = makeStyles(theme => ({
  input: {
    width: '100%',
    backgroundColor: 'white',
  },
  fieldGroup: {
    padding: theme.spacing(1),
  },
}));

const CardForm = ({ endereco, handleEditButton }) => {
  const classes = useStyles();
  const [calle, setCalle] = useState(endereco.calle ? endereco.calle : '');
  const [numero, setNumero] = useState(endereco.numero ? endereco.numero : '');
  const [referencia, setReferencia] = useState(
    endereco.referencia ? endereco.referencia : '',
  );
  const [latitude, setLatitude] = useState(
    endereco.coordenadas ? endereco.coordenadas.latitude : '',
  );
  const [longitude, setLongitude] = useState(
    endereco.coordenadas ? endereco.coordenadas.longitude : '',
  );
  const [barrio, setBarrio] = useState(endereco.barrio ? endereco.barrio : '');
  const [nome, setNome] = useState(endereco.nome ? endereco.nome : '');
  const [nacionalidade, setNacionalidade] = useState(
    endereco.nacionalidade ? endereco.nacionalidade : '',
  );
  const [idioma, setIdioma] = useState(endereco.idioma ? endereco.idioma : '');
  const [telefono, setTelefono] = useState(
    endereco.contato ? endereco.contato : '',
  );
  const [tempTelefono, setTempTelefono] = useState('');
  const [email, setEmail] = useState(endereco.email ? endereco.email : '');
  return (
    <>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <fieldset className={classes.fieldGroup}>
              <FormLabel component="legend">Dados do Endereço</FormLabel>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    className={classes.input}
                    label="Calle"
                    defaultValue={calle}
                    onChange={e => setCalle(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    className={classes.input}
                    label="Número"
                    type="number"
                    defaultValue={numero}
                    onChange={e => setNumero(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    className={classes.input}
                    label="Barrio"
                    defaultValue={barrio}
                    onChange={e => setBarrio(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.input}
                    label="Referência"
                    defaultValue={referencia}
                    onChange={e => setReferencia(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    className={classes.input}
                    label="Latitude"
                    defaultValue={latitude}
                    onChange={e => setLatitude(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    className={classes.input}
                    label="Número"
                    defaultValue={longitude}
                    onChange={e => setLongitude(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>
          <Grid item xs={12}>
            <fieldset className={classes.fieldGroup}>
              <FormLabel component="legend">
                Informações sobre o estrangeiro e contato
              </FormLabel>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    className={classes.input}
                    label="Nome"
                    defaultValue={nome}
                    onChange={e => setNome(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    defaultValue={nacionalidade}
                    className={classes.input}
                    options={nacionalidades}
                    onChange={(event, value) => setNacionalidade(value)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Nacionalidade"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    defaultValue={idioma}
                    className={classes.input}
                    options={idiomas}
                    onChange={(event, value) => setIdioma(value)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Idiomas"
                        placeholder="Idiomas falados na casa"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    className={classes.input}
                    label="Email"
                    type="email"
                    defaultValue={email}
                    onChange={e => setEmail(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    freeSolo
                    defaultValue={telefono}
                    options={[]}
                    className={classes.input}
                    onChange={(event, value) => setTelefono(value)}
                    onInputChange={(event, value) => setTempTelefono(value)}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Telefones"
                        type="tel"
                        placeholder="Digite e dê Enter"
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </fieldset>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button
          aria-label="editar localização"
          color="primary"
          onClick={handleEditButton}
        >
          Concluir Edição
        </Button>
        <Button
          aria-label="deletar endereço"
          color="secondary"
          onClick={handleEditButton}
        >
          Cancelar
        </Button>
      </CardActions>
    </>
  );
};

export default CardForm;
