import { makeStyles } from '@material-ui/core/styles';
export const useStyles = makeStyles((theme) => ({
    list: {
        width: 250,
    },
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));