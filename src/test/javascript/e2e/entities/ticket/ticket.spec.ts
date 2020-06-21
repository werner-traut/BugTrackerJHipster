import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import TicketComponentsPage, { TicketDeleteDialog } from './ticket.page-object';
import TicketUpdatePage from './ticket-update.page-object';
import {
  waitUntilDisplayed,
  waitUntilAnyDisplayed,
  click,
  getRecordsCount,
  waitUntilHidden,
  waitUntilCount,
  isVisible,
} from '../../util/utils';

const expect = chai.expect;

describe('Ticket e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let ticketComponentsPage: TicketComponentsPage;
  let ticketUpdatePage: TicketUpdatePage;
  let ticketDeleteDialog: TicketDeleteDialog;
  let beforeRecordsCount = 0;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
    await waitUntilDisplayed(navBarPage.adminMenu);
    await waitUntilDisplayed(navBarPage.accountMenu);
  });

  it('should load Tickets', async () => {
    await navBarPage.getEntityPage('ticket');
    ticketComponentsPage = new TicketComponentsPage();
    expect(await ticketComponentsPage.title.getText()).to.match(/Tickets/);

    expect(await ticketComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([ticketComponentsPage.noRecords, ticketComponentsPage.table]);

    beforeRecordsCount = (await isVisible(ticketComponentsPage.noRecords)) ? 0 : await getRecordsCount(ticketComponentsPage.table);
  });

  it('should load create Ticket page', async () => {
    await ticketComponentsPage.createButton.click();
    ticketUpdatePage = new TicketUpdatePage();
    expect(await ticketUpdatePage.getPageTitle().getAttribute('id')).to.match(/bugTrackerJHipsterApp.ticket.home.createOrEditLabel/);
    await ticketUpdatePage.cancel();
  });

  it('should create and save Tickets', async () => {
    await ticketComponentsPage.createButton.click();
    await ticketUpdatePage.setTitleInput('title');
    expect(await ticketUpdatePage.getTitleInput()).to.match(/title/);
    await ticketUpdatePage.setDescriptionInput('description');
    expect(await ticketUpdatePage.getDescriptionInput()).to.match(/description/);
    await ticketUpdatePage.setDueDateInput('01-01-2001');
    expect(await ticketUpdatePage.getDueDateInput()).to.eq('2001-01-01');
    const selectedDone = await ticketUpdatePage.getDoneInput().isSelected();
    if (selectedDone) {
      await ticketUpdatePage.getDoneInput().click();
      expect(await ticketUpdatePage.getDoneInput().isSelected()).to.be.false;
    } else {
      await ticketUpdatePage.getDoneInput().click();
      expect(await ticketUpdatePage.getDoneInput().isSelected()).to.be.true;
    }
    await ticketUpdatePage.projectSelectLastOption();
    await ticketUpdatePage.assignedToSelectLastOption();
    // ticketUpdatePage.labelSelectLastOption();
    await waitUntilDisplayed(ticketUpdatePage.saveButton);
    await ticketUpdatePage.save();
    await waitUntilHidden(ticketUpdatePage.saveButton);
    expect(await isVisible(ticketUpdatePage.saveButton)).to.be.false;

    expect(await ticketComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(ticketComponentsPage.table);

    await waitUntilCount(ticketComponentsPage.records, beforeRecordsCount + 1);
    expect(await ticketComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Ticket', async () => {
    const deleteButton = ticketComponentsPage.getDeleteButton(ticketComponentsPage.records.last());
    await click(deleteButton);

    ticketDeleteDialog = new TicketDeleteDialog();
    await waitUntilDisplayed(ticketDeleteDialog.deleteModal);
    expect(await ticketDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/bugTrackerJHipsterApp.ticket.delete.question/);
    await ticketDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(ticketDeleteDialog.deleteModal);

    expect(await isVisible(ticketDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([ticketComponentsPage.noRecords, ticketComponentsPage.table]);

    const afterCount = (await isVisible(ticketComponentsPage.noRecords)) ? 0 : await getRecordsCount(ticketComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
