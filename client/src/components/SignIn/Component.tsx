/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 28 February 2020
 *
 * Component which allows user to make sign in
 */

/** External imports */
import React, { useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CheckBox from '@material-ui/core/Checkbox';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import { makeStyles, createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

/** Application's imports */
import { TSignInProps } from './container';
import NavigationLink from 'components/NavigationLink';
import Input from 'components/Input';
import Logo from 'img/logo';
import Check from 'public/images/check.svg';

/** Define classes as hook */
const useStyles = makeStyles((theme: Theme) => createStyles({
    backdrop: {
        background: '#fff',
        width: '100%',
        height: '100vh',
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
    },
    root: {
        width: 'min-content',
        borderRadius: 4,
        filter: `drop-shadow(2.828px 2.828px 3.5px rgba(227,207,207,0.9))`,
        backgroundColor: '#ffffff',
        textAlign: 'center',
    },
    innerContainer: {
        borderRadius: 4,
        backgroundColor: '#f4f5f7',
        padding: theme.spacing(4),
    },
    logoContainer: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    textField: {
        width: 230,
    },
    fields: {
        paddingBottom: theme.spacing(3),
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    block: {
        width: 'max-content',
    },
    buttonBlock: {
        width: '100%',
        marginTop: theme.spacing(2),
    },
    button: {
        filter: `drop-shadow(0px 3px 2.5px rgba(0,0,0,0.16))`,
    },
    link: {
        color: theme.palette.primary.main,
    },
    icon: {
        color: '#555',
    },
    checkBoxIcon: {
        marginLeft: 2,
        borderRadius: 3,
        width: 20,
        height: 20,
        filter: `drop-shadow(2.828px 2.828px 3.5px rgba(227,207,207,0.9))`,
        backgroundColor: '#fff',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '$root.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: '#ebf1f5',
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: 'rgba(206,217,224,.5)',
        },
    },
    checkBoxСheckedIcon: {
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        position: 'relative',
        '&:before': {
            position: 'absolute',
            top: 2,
            left: 2,
            backgroundImage: `url(${Check})`,
            width: 20,
            height: 20,
            backgroundSize: '16px, 16px',
            display: 'block',
            content: '""',
            backgroundRepeat: 'no-repeat',
        },
        'input:hover ~ &': {
            // backgroundColor: '#106ba3',
        },
    },
    checkBox: {
        width: 400,
    },
}));

/**
 * Create hook to make component stateless.
 * Compute all values from text fields.
 * Returns fields data and button onClick property.
 */
const useSignInElements = (props: TSignInProps) => {
    const {
        isLoggedIn,
        errorFields,
        fieldsMessages,
        fetchSignIn,
        setSignInErrorFieldsToDefault,
        setSignInFieldsMessagesToDefault,
    } = props;

    const history = useHistory();

    useEffect(() => {
        if (isLoggedIn) {
            const next = history.location.state
                ? `${(history.location.state as any).from.pathname}${(history.location.state as any).from.search}`
                : undefined;
            // const next: string = new URLSearchParams(history.location.state.).get('next');
            history.push(next || '/');
        }
    }, [isLoggedIn]);

    const clearFields = () => {
        setSignInErrorFieldsToDefault();
        setSignInFieldsMessagesToDefault();
    };

    /** User email */
    const [email, setEmail] = useState<string>('');
    const handleChangeEmail =
        useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
            setEmail(event.target.value);
            if (errorFields.email) {
                clearFields();
            }
        }, [errorFields.email]);

    /** User password */
    const [password, setPassword] = useState<string>('');
    const handleChangePassword =
        useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(event.target.value);
            if (errorFields.password) {
                clearFields();
            }
        }, [errorFields.password]);

    /** Remember checkbox */
    const [remember, setRemember] = useState<boolean>(false);
    const handleChangeRemember =
        useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
            setRemember(event.target.checked);
        }, []);

    /** SignUp button handle */
    const handleFetchSignIn = useCallback(() => fetchSignIn({
        email,
        password,
        remember,
    }), [email, password, remember]);

    return {
        emailField: {
            onChange: handleChangeEmail,
            value: email,
            error: errorFields.email,
            helperText: fieldsMessages.email,
        },
        passwordField: {
            onChange: handleChangePassword,
            value: password,
            error: errorFields.password,
            helperText: fieldsMessages.password,
        },
        rememberCheckbox: {
            onChange: handleChangeRemember,
            value: remember,
        },
        signInButton: {
            onClick: handleFetchSignIn,
        },
    };
};

/** Create component */
const Component = (props: TSignInProps) => {
    /** Create styles */
    const classes = useStyles({});

    /** Get fields data from hook */
    const { emailField, passwordField, rememberCheckbox, signInButton } = useSignInElements(props);

    return (
        <div
            className='auth-background'
        >
            <Container maxWidth='lg' className={classes.container}>
                <Paper
                    className={classes.root}
                    elevation={0}
                    square
                >
                    <div className={classes.logoContainer}>
                        <Logo />
                    </div>
                    <div className={classes.innerContainer}>
                        <Grid
                            container
                            direction='column'
                            alignItems='center'
                            justify='flex-start'
                            item
                            spacing={3}
                            className={classes.block}
                        >
                            <Grid item>
                                <Input
                                    color='primary'
                                    type='email'
                                    placeholder='Емеїл'
                                    startAdornment={<EmailIcon className={classes.icon}/>}
                                    data-testid='signin-email-input'
                                    {...emailField}
                                />
                            </Grid>
                            <Grid item>
                                <Input
                                    color='primary'
                                    type='password'
                                    placeholder='Пароль'
                                    startAdornment={<LockIcon className={classes.icon}/>}
                                    data-testid='signin-password-input'
                                    {...passwordField}
                                />
                            </Grid>
                            <Grid item>
                                <FormControl component='fieldset' className={classes.checkBox}>
                                    <FormControlLabel
                                        control={
                                            <CheckBox
                                                disableRipple
                                                disableTouchRipple
                                                disableFocusRipple
                                                color='primary'
                                                checkedIcon={<span className={classNames(classes.checkBoxIcon, classes.checkBoxСheckedIcon)} />}
                                                icon={<span className={classes.checkBoxIcon}/>}
                                                {...rememberCheckbox}
                                            />
                                        }
                                        label={`Запам'ятати мене`}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Button
                                    color='primary'
                                    variant='contained'
                                    disableElevation
                                    className={classes.button}
                                    data-testid='signin-button'
                                    { ...signInButton }
                                >
                                    Увійти
                                </Button>
                            </Grid>
                            <Grid item>
                                <Typography align='center'>
                                    Не зареєстровані?
                                    <NavigationLink
                                        navLink={{
                                            to: '/auth/signup',
                                        }}
                                        className={classes.link}
                                    >
                                        Зареєструватися
                                    </NavigationLink>
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                </Paper>
            </Container>
        </div>
    );
};

export default Component;
