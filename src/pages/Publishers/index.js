import React, { useState, useEffect, forwardRef, useContext } from 'react';
import axios from 'axios';
import MaterialTable from 'material-table';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { AuthContext } from '../../services/Firebase/authContext';
import { toast } from 'react-toastify';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const Publishers = () => {
  const [user] = useContext(AuthContext);
  const [state, setState] = useState({
    columns: [
      { title: 'Nome', field: 'displayName' },
      {
        title: 'Congregação',
        field: 'congregation',
        lookup: {
          pend: 'Pendente para aprovação',
          espanhol: 'Espanhola',
          guarani: 'Guarani',
        },
      },
      {
        title: 'Privilégio',
        field: 'role',
        lookup: { pub: 'Publicador', dir: 'Dirigente', admin: 'Administrador' },
      },
      { title: 'Email', field: 'email', editable: 'never' },
    ],
    data: [],
  });

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(process.env.REACT_APP_USERS_API);
      const data = response.data.map(user => {
        const userData = JSON.parse(user.displayName);
        return { uid: user.uid, email: user.email, ...userData };
      });
      setState(prevState => {
        return { ...prevState, data };
      });
    }
    if (user.role === 'admin') {
      fetchData();
    }
  }, [user.role]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom style={{ margin: '40px auto' }}>
        Publicadores
      </Typography>
      <MaterialTable
        title=""
        icons={tableIcons}
        columns={state.columns}
        data={state.data}
        localization={{
          body: {
            emptyDataSourceMessage:
              'Nenhum registro para exibir. Você tem permissões de administrador?',
            editRow: {
              deleteText: 'Você tem certeza que quer deletar esse usuário?',
              cancelTooltip: 'Cancelar',
              saveTooltip: 'Salvar',
            },
          },
          toolbar: {
            searchTooltip: 'Pesquisar',
            searchPlaceholder: 'Pesquisar',
          },
          pagination: {
            labelRowsSelect: 'linhas',
            labelDisplayedRows: '{count} de {from}-{to}',
            firstTooltip: 'Primeira página',
            previousTooltip: 'Página anterior',
            nextTooltip: 'Próxima página',
            lastTooltip: 'Última página',
          },
          header: {
            actions: 'Ações',
          },
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              if (oldData) {
                const userData = {
                  displayName: newData.displayName,
                  congregation: newData.congregation,
                  role: newData.role,
                };

                axios
                  .patch(process.env.REACT_APP_USER_API, {
                    uid: newData.uid,
                    fields: {
                      displayName: JSON.stringify(userData),
                    },
                  })
                  .then(() => {
                    resolve();
                    setState(prevState => {
                      const data = [...prevState.data];
                      data[data.indexOf(oldData)] = newData;
                      return { ...prevState, data };
                    });
                  })
                  .catch(error => {
                    toast.error(`❌ Houve um erro ao editar`);
                    console.log(error);
                    reject();
                  });
              }
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              axios
                .delete(`${process.env.REACT_APP_USER_API}/${oldData.uid}`)
                .then(() => {
                  setState(prevState => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                  resolve();
                })
                .catch(error => {
                  toast.error(`❌ Houve um erro ao deletar`);
                  console.log(error);
                  reject();
                });
            }),
        }}
      />
    </Container>
  );
};

export default Publishers;
