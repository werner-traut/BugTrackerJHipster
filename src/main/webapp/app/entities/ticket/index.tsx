import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Ticket from './ticket';
import TicketDetail from './ticket-detail';
import TicketUpdate from './ticket-update';
import TicketDeleteDialog from './ticket-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={TicketDeleteDialog} />
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={TicketUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={TicketUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={TicketDetail} />
      <ErrorBoundaryRoute path={match.url} component={Ticket} />
    </Switch>
  </>
);

export default Routes;
