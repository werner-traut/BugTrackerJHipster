import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './ticket.reducer';
import { ITicket } from 'app/shared/model/ticket.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ITicketDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TicketDetail = (props: ITicketDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { ticketEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="bugTrackerJHipsterApp.ticket.detail.title">Ticket</Translate> [<b>{ticketEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="title">
              <Translate contentKey="bugTrackerJHipsterApp.ticket.title">Title</Translate>
            </span>
          </dt>
          <dd>{ticketEntity.title}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="bugTrackerJHipsterApp.ticket.description">Description</Translate>
            </span>
          </dt>
          <dd>{ticketEntity.description}</dd>
          <dt>
            <span id="dueDate">
              <Translate contentKey="bugTrackerJHipsterApp.ticket.dueDate">Due Date</Translate>
            </span>
          </dt>
          <dd>{ticketEntity.dueDate ? <TextFormat value={ticketEntity.dueDate} type="date" format={APP_LOCAL_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="done">
              <Translate contentKey="bugTrackerJHipsterApp.ticket.done">Done</Translate>
            </span>
          </dt>
          <dd>{ticketEntity.done ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="bugTrackerJHipsterApp.ticket.project">Project</Translate>
          </dt>
          <dd>{ticketEntity.project ? ticketEntity.project.name : ''}</dd>
          <dt>
            <Translate contentKey="bugTrackerJHipsterApp.ticket.assignedTo">Assigned To</Translate>
          </dt>
          <dd>{ticketEntity.assignedTo ? ticketEntity.assignedTo.login : ''}</dd>
          <dt>
            <Translate contentKey="bugTrackerJHipsterApp.ticket.label">Label</Translate>
          </dt>
          <dd>
            {ticketEntity.labels
              ? ticketEntity.labels.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.label}</a>
                    {ticketEntity.labels && i === ticketEntity.labels.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/ticket" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/ticket/${ticketEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ ticket }: IRootState) => ({
  ticketEntity: ticket.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TicketDetail);
