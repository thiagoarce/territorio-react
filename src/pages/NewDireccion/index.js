import React, { useState, useContext, useCallback, useEffect } from 'react';
import { AuthContext } from '../../services/Firebase/authContext';
import { firestore, Firebase } from '../../services/Firebase';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { toast } from 'react-toastify';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { trackPromise } from 'react-promise-tracker';

import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import { nacionalidades, idiomas } from '../../constants/formConfig';
import { logradouros } from '../../constants/logradouros';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    maxWidth: '1120px',
    height: '100vh',
    margin: '20px auto',
    padding: '0 30px',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
  },

  fieldGroup: {
    padding: theme.spacing(1),
  },
}));

const filterOptions = createFilterOptions({
  limit: 5,
});

const NewDireccion = () => {
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [referencia, setReferencia] = useState('');
  const [cidade, setCidade] = useState(logradouros[0].nome);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [barrio, setBarrio] = useState('');
  const [nome, setNome] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');
  const [idioma, setIdioma] = useState('');
  const [telefono, setTelefono] = useState('');
  const [tempTelefono, setTempTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [ruas, setRuas] = useState(logradouros[0].ruas);
  const [onlyContato, setOnlyContato] = useState(false);
  const [reset, setReset] = useState('');
  const [initialPosition, setInitialPosition] = useState([0, 0]);
  const [selectedPosition, setSelectedPosition] = useState([0, 0]);
  const [showMap, setShowMap] = useState(false);

  const [user] = useContext(AuthContext);

  const isLocationValid = !calle;

  const isInfoValid =
    (calle && latitude && longitude) ||
    (referencia && latitude && longitude) ||
    telefono ||
    tempTelefono ||
    email;

  // Get Current Position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setInitialPosition([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      () => {
        setInitialPosition([-20.459421, -54.6364654]);
      },
      {
        timeout: 30000,
        enableHighAccuracy: true,
      },
    );
  }, []);

  const handleMapClick = useCallback(async event => {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
    setLatitude(event.latlng.lat.toFixed(5));
    setLongitude(event.latlng.lng.toFixed(5));
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            latlng: `${event.latlng.lat}, ${event.latlng.lng}`,
            key: process.env.REACT_APP_API_KEY,
          },
        },
      );
      if (response.data.status === 'OK') {
        setNumero(response.data.results[0].address_components[0].short_name);
        setCalle(response.data.results[0].address_components[1].long_name);
        setBarrio(response.data.results[0].address_components[2].short_name);
      }
    } catch (error) {
      toast.error('❌ Não foi possível obter os dados');
      console.log(error);
    }
  }, []);

  const getDireccionPosition = useCallback(
    async e => {
      try {
        const response = await axios.get(
          'https://maps.googleapis.com/maps/api/geocode/json',
          {
            params: {
              address: `${calle}, ${numero}, ${cidade}`,
              key: process.env.REACT_APP_API_KEY,
            },
          },
        );
        if (response.data.status === 'OK') {
          const responseBarrio = response.data.results[
            '0'
          ].address_components.filter(comp =>
            comp.types.includes('sublocality'),
          );
          if (responseBarrio['0']) {
            setBarrio(responseBarrio['0'].short_name);
          }

          setLatitude(
            response.data.results['0'].geometry.location.lat.toFixed(5),
          );

          setLongitude(
            response.data.results['0'].geometry.location.lng.toFixed(5),
          );
        } else {
          toast.error('❌ Não foi possível obter os dados');
        }
      } catch (error) {
        toast.error('❌ Não foi possível obter os dados');
        console.log(error);
      }
    },
    [calle, numero, cidade],
  );

  const getActualPosition = useCallback(e => {
    navigator.geolocation.getCurrentPosition(
      async position => {
        setLatitude(position.coords.latitude.toFixed(5));
        setLongitude(position.coords.longitude.toFixed(5));

        try {
          const response = await axios.get(
            'https://maps.googleapis.com/maps/api/geocode/json',
            {
              params: {
                latlng: `${position.coords.latitude}, ${position.coords.longitude}`,
                key: process.env.REACT_APP_API_KEY,
              },
            },
          );
          if (response.data.status === 'OK') {
            setNumero(
              response.data.results[0].address_components[0].short_name,
            );
            setCalle(response.data.results[0].address_components[1].long_name);
            setBarrio(
              response.data.results[0].address_components[2].short_name,
            );
          }
        } catch (error) {
          toast.error('❌ Não foi possível obter os dados');
          console.log(error);
        }
      },
      () => {
        toast.error('❌ Não foi possível obter os dados');
      },
      {
        timeout: 30000,
        enableHighAccuracy: true,
      },
    );
  }, []);

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      const today = new Date();

      const visitas = {
        latest: {
          date: today,
          por: user.displayName,
        },
      };

      const contato =
        tempTelefono.length > 6 ? [...telefono, tempTelefono] : telefono;

      if (onlyContato) {
        trackPromise(
          firestore.collection('changes').add({
            type: 'add',
            idioma,
            email,
            nacionalidade,
            contato,
            visitas,
          }),
        );
      } else {
        const coordenadas = latitude
          ? new Firebase.firestore.GeoPoint(
              parseFloat(latitude),
              parseFloat(longitude),
            )
          : null;

        trackPromise(
          firestore.collection('changes').add({
            type: 'add',
            calle,
            numero,
            referencia,
            barrio,
            email,
            coordenadas,
            idioma,
            nacionalidade,
            contato,
            visitas,
          }),
        );
      }

      setCalle('');
      setNumero('');
      setReferencia('');
      setLatitude('');
      setLongitude('');
      setBarrio('');
      setNome('');
      setNacionalidade('');
      setIdioma('');
      setTelefono('');
      setEmail('');
      setTempTelefono('');
      setReset('Só pa garantir');
      setReset('Reseta!!');
      toast.info('Dados inseridos com sucesso!');
    },
    [
      barrio,
      calle,
      numero,
      idioma,
      email,
      latitude,
      longitude,
      nacionalidade,
      referencia,
      telefono,
      tempTelefono,
      user,
      onlyContato,
    ],
  );

  const classes = useStyles();
  return (
    <>
      <form className={classes.root} onSubmit={handleSubmit}>
        <Grid container spacing={3} justify="flex-end">
          <Grid item xs={8}>
            <Typography variant="h4" gutterBottom>
              Cadastrar novo Endereço
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Grid container>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={onlyContato}
                      onChange={(e, value) => {
                        setOnlyContato(value);
                      }}
                      name="contatocheck"
                      color="primary"
                    />
                  }
                  label="Apenas Telefone ou Email"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showMap}
                      onChange={(e, value) => setShowMap(value)}
                      name="contatocheck"
                      color="primary"
                    />
                  }
                  label="Escolher local em um mapa"
                />
              </Grid>
            </Grid>
          </Grid>
          {!onlyContato && showMap && (
            <Grid item xs={12}>
              <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                <TileLayer
                  attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={selectedPosition} />
              </Map>
            </Grid>
          )}

          {!onlyContato && (
            <Grid item xs={12}>
              <fieldset className={classes.fieldGroup}>
                <FormLabel component="legend">Dados do Endereço</FormLabel>
                <Grid container spacing={2} justify="flex-end">
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      inputValue={calle}
                      key={reset}
                      freeSolo
                      filterOptions={filterOptions}
                      className={classes.input}
                      options={ruas}
                      onChange={(event, value) => setCalle(value)}
                      onInputChange={(event, value) => setCalle(value)}
                      renderInput={params => (
                        <TextField {...params} label="Rua" variant="outlined" />
                      )}
                    />
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <TextField
                      className={classes.input}
                      label="Número"
                      type="number"
                      value={numero}
                      onChange={e => setNumero(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={8} md={4}>
                    <Autocomplete
                      className={classes.input}
                      options={logradouros}
                      getOptionLabel={option => option.nome}
                      defaultValue={logradouros[0]}
                      disableClearable
                      onChange={(event, value) => {
                        setCidade(value.nome);
                        setRuas(value.ruas);
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="Cidade"
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className={classes.input}
                      label="Referência"
                      value={referencia}
                      onChange={e => setReferencia(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className={classes.input}
                      label="Bairro"
                      value={barrio}
                      onChange={e => setBarrio(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      className={classes.input}
                      label="Latitude"
                      value={latitude}
                      onChange={e => setLatitude(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      className={classes.input}
                      label="Longitude"
                      value={longitude}
                      onChange={e => setLongitude(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <fieldset style={{ padding: '10px' }}>
                      <FormLabel component="legend">
                        Buscar localização
                      </FormLabel>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Button
                            onClick={getActualPosition}
                            variant="contained"
                            color="primary"
                            style={{ width: '100%' }}
                          >
                            {' '}
                            A partir de Minha Localização
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Button
                            onClick={getDireccionPosition}
                            variant="contained"
                            disabled={isLocationValid}
                            color="primary"
                            style={{ width: '100%' }}
                          >
                            A partir do endereço informado
                          </Button>
                        </Grid>
                      </Grid>
                    </fieldset>
                  </Grid>
                </Grid>
              </fieldset>
            </Grid>
          )}
          <Grid item xs={12}>
            <fieldset className={classes.fieldGroup}>
              <FormLabel component="legend">
                Dados do estrangeiro e contato
              </FormLabel>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    className={classes.input}
                    label="Nome"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    key={reset}
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
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    key={reset}
                    multiple
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    className={classes.input}
                    label="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    key={reset}
                    multiple
                    freeSolo
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
          <Grid
            item
            xs={12}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!isInfoValid}
              size="large"
            >
              Cadastrar novo estrangeiro
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default NewDireccion;
