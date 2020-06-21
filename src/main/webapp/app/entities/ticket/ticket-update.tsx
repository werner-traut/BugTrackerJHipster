import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IProject } from 'app/shared/model/project.model';
import { getEntities as getProjects } from 'app/entities/project/project.reducer';
import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { ILabel } from 'app/shared/model/label.model';
import { getEntities as getLabels } from 'app/entities/label/label.reducer';
import { getEntity, updateEntity, createEntity, reset } from './ticket.reducer';
import { ITicket } from 'app/shared/model/ticket.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ITicketUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const TicketUpdate = (props: ITicketUpdateProps) => {
  const [idslabel, setIdslabel] = useState([]);
  const [projectId, setProjectId] = useState('0');
  const [assignedToId, setAssignedToId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { ticketEntity, projects, users, labels, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/ticket' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getProjects();
    props.getUsers();
    props.getLabels();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...ticketEntity,
        ...values,
        labels: mapIdList(values.labels),
      };

      if (isNew) {
        props.createEntity(entity);
      } else {
        props.updateEntity(entity);
      }
    }
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="bugTrackerJHipsterApp.ticket.home.createOrEditLabel">
            <Translate contentKey="bugTrackerJHipsterApp.ticket.home.createOrEditLabel">Create or edit a Ticket</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : ticketEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="ticket-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="ticket-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="titleLabel" for="ticket-title">
                  <Translate contentKey="bugTrackerJHipsterApp.ticket.title">Title</Translate>
                </Label>
                <AvField
                  id="ticket-title"
                  type="text"
                  name="title"
                  validate={{
                    required: { value: true, errorMessage: translate('entity.validation.required') },
                  }}
                />
              </AvGroup>
              <AvGroup>
                <Label id="descriptionLabel" for="ticket-description">
                  <Translate contentKey="bugTrackerJHipsterApp.ticket.description">Description</Translate>
                </Label>
                <AvField id="ticket-description" type="text" name="description" />
              </AvGroup>
              <AvGroup>
                <Label id="dueDateLabel" for="ticket-dueDate">
                  <Translate contentKey="bugTrackerJHipsterApp.ticket.dueDate">Due Date</Translate>
                </Label>
                <AvField id="ticket-dueDate" type="date" className="form-control" name="dueDate" />
              </AvGroup>
              <AvGroup check>
                <Label id="doneLabel">
                  <AvInput id="ticket-done" type="checkbox" className="form-check-input" name="done" />
                  <Translate contentKey="bugTrackerJHipsterApp.ticket.done">Done</Translate>
                </Label>
              </AvGroup>
              <AvGroup>
                <Label for="ticket-project">
                  <Translate contentKey="bugTrackerJHipsterApp.ticket.project">Project</Translate>
                </Label>
                <AvInput id="ticket-project" type="select" className="form-control" name="project.id">
                  <option value="" key="0" />
                  {projects
                    ? projects.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.name}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="ticket-assignedTo">
                  <Translate contentKey="bugTrackerJHipsterApp.ticket.assignedTo">Assigned To</Translate>
                </Label>
                <AvInput id="ticket-assignedTo" type="select" className="form-control" name="assignedTo.id">
                  <option value="" key="0" />
                  {users
                    ? users.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.login}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <AvGroup>
                <Label for="ticket-label">
                  <Translate contentKey="bugTrackerJHipsterApp.ticket.label">Label</Translate>
                </Label>
                <AvInput
                  id="ticket-label"
                  type="select"
                  multiple
                  className="form-control"
                  name="labels"
                  value={ticketEntity.labels && ticketEntity.labels.map(e => e.id)}
                >
                  <option value="" key="0" />
                  {labels
                    ? labels.map(otherEntity => (
                        <option value={otherEntity.id} key={otherEntity.id}>
                          {otherEntity.label}
                        </option>
                      ))
                    : null}
                </AvInput>
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/ticket" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </AvForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (storeState: IRootState) => ({
  projects: storeState.project.entities,
  users: storeState.userManagement.users,
  labels: storeState.label.entities,
  ticketEntity: storeState.ticket.entity,
  loading: storeState.ticket.loading,
  updating: storeState.ticket.updating,
  updateSuccess: storeState.ticket.updateSuccess,
});

const mapDispatchToProps = {
  getProjects,
  getUsers,
  getLabels,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TicketUpdate);
