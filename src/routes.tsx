import React from 'react'
import { BrowserRouter, Route, Switch, Redirect, RouteProps, RouteComponentProps } from "react-router-dom";
import { isAuthenticated } from "./services/auth";


import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreatePoint from './pages/CreatePoint';

export const PrivateRoute = ({ component, ...rest }: RouteProps) => {
    if (!component) {
        throw Error("Component is Undefined");
    }

    const Component = component;

    // Render - Se autenticado 
    const render = (props: RouteComponentProps<any>): React.ReactNode => {
        if (isAuthenticated()) {
            return (
                <div>
                    <Component {...props} />
                </div>
            )
        }

        return (<Redirect to={{ pathname: "/login", state: { from: props.location } }} />)
    };

    return (<Route {...rest} render={render} />);
}


// Rotas
const Routes = () => (
    <BrowserRouter>
        <Switch>
            {/* Login */}
            <Route component={Home} path="/" exact />
            <Route component={CreatePoint} path="/create-point" />
            <Route path="/login" component={Login} />
            {/* Rotas Privadas */}
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            {/* Not Found */}
            <Route path="*" component={() => <h1>Page not found</h1>} />
        </Switch>
    </BrowserRouter>
);

// const Routes = () => {
//     return (
//         <BrowserRouter>
//             <Route component={Home} path="/" exact />
//             <Route component={Login} path="/login"  />
//             <Route component={Dashboard} path="/dashboard" />
//             <Route component={CreatePoint} path="/create-point" />
//         </BrowserRouter>
//     )
// }

export default Routes;
