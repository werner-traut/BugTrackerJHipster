import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ITicket } from 'app/shared/model/ticket.model';
import { getEntities as getTickets } from 'app/entities/ticket/ticket.reducer';
import { getEntity, updateEntity, createEntity, reset } from './label.reducer';
import { ILabel } from 'app/shared/model/label.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ILabelUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const LabelUpdate = (props: ILabelUpdateProps) => {
  const [ticketId, setTicketId] = useState('0');
  const [isNew, setIsNew] = useState(!props.match.params || !props.match.params.id);

  const { labelEntity, tickets, loading, updating } = props;

  const handleClose = () => {
    props.history.push('/label');
  };

  useEffect(() => {
    if (isNew) {
      props.reset();
    } else {
      props.getEntity(props.match.params.id);
    }

    props.getTickets();
  }, []);

  useEffect(() => {
    if (props.updateSuccess) {
      handleClose();
    }
  }, [props.updateSuccess]);

  const saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const entity = {
        ...labelEntity,
        ...values,
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
          <h2 id="bugTrackerJHipsterApp.label.home.createOrEditLabel">
            <Translate contentKey="bugTrackerJHipsterApp.label.home.createOrEditLabel">Create or edit a Label</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <AvForm model={isNew ? {} : labelEntity} onSubmit={saveEntity}>
              {!isNew ? (
                <AvGroup>
                  <Label for="label-id">
                    <Translate contentKey="global.field.id">ID</Translate>
                  </Label>
                  <AvInput id="label-id" type="text" className="form-control" name="id" required readOnly />
                </AvGroup>
              ) : null}
              <AvGroup>
                <Label id="labelLabel" for="label-label">
                  <Translate contentKey="bugTrackerJHipsterApp.label.label">Label</Translate>
                </Label>
                <AvField
                  id="label-label"
                  type="text"
                  name="label"
                  validate={{
                    minLength: { value: 3, errorMessage: translate('entity.validation.minlength', { min: 3 }) },
                  }}
                />
              </AvGroup>
              <Button tag={Link} id="cancel-save" to="/label" replace color="info">
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
  tickets: storeState.ticket.entities,
  labelEntity: storeState.label.entity,
  loading: storeState.label.loading,
  updating: storeState.label.updating,
  updateSuccess: storeState.label.updateSuccess,
});

const mapDispatchToProps = {
  getTickets,
  getEntity,
  updateEntity,
  createEntity,
  reset,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(LabelUpdate);
