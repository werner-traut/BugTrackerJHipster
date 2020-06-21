import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import ProjectComponentsPage, { ProjectDeleteDialog } from './project.page-object';
import ProjectUpdatePage from './project-update.page-object';
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

describe('Project e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let projectComponentsPage: ProjectComponentsPage;
  let projectUpdatePage: ProjectUpdatePage;
  let projectDeleteDialog: ProjectDeleteDialog;
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

  it('should load Projects', async () => {
    await navBarPage.getEntityPage('project');
    projectComponentsPage = new ProjectComponentsPage();
    expect(await projectComponentsPage.title.getText()).to.match(/Projects/);

    expect(await projectComponentsPage.createButton.isEnabled()).to.be.true;
    await waitUntilAnyDisplayed([projectComponentsPage.noRecords, projectComponentsPage.table]);

    beforeRecordsCount = (await isVisible(projectComponentsPage.noRecords)) ? 0 : await getRecordsCount(projectComponentsPage.table);
  });

  it('should load create Project page', async () => {
    await projectComponentsPage.createButton.click();
    projectUpdatePage = new ProjectUpdatePage();
    expect(await projectUpdatePage.getPageTitle().getAttribute('id')).to.match(/bugTrackerJHipsterApp.project.home.createOrEditLabel/);
    await projectUpdatePage.cancel();
  });

  it('should create and save Projects', async () => {
    await projectComponentsPage.createButton.click();
    await projectUpdatePage.setNameInput('name');
    expect(await projectUpdatePage.getNameInput()).to.match(/name/);
    await waitUntilDisplayed(projectUpdatePage.saveButton);
    await projectUpdatePage.save();
    await waitUntilHidden(projectUpdatePage.saveButton);
    expect(await isVisible(projectUpdatePage.saveButton)).to.be.false;

    expect(await projectComponentsPage.createButton.isEnabled()).to.be.true;

    await waitUntilDisplayed(projectComponentsPage.table);

    await waitUntilCount(projectComponentsPage.records, beforeRecordsCount + 1);
    expect(await projectComponentsPage.records.count()).to.eq(beforeRecordsCount + 1);
  });

  it('should delete last Project', async () => {
    const deleteButton = projectComponentsPage.getDeleteButton(projectComponentsPage.records.last());
    await click(deleteButton);

    projectDeleteDialog = new ProjectDeleteDialog();
    await waitUntilDisplayed(projectDeleteDialog.deleteModal);
    expect(await projectDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/bugTrackerJHipsterApp.project.delete.question/);
    await projectDeleteDialog.clickOnConfirmButton();

    await waitUntilHidden(projectDeleteDialog.deleteModal);

    expect(await isVisible(projectDeleteDialog.deleteModal)).to.be.false;

    await waitUntilAnyDisplayed([projectComponentsPage.noRecords, projectComponentsPage.table]);

    const afterCount = (await isVisible(projectComponentsPage.noRecords)) ? 0 : await getRecordsCount(projectComponentsPage.table);
    expect(afterCount).to.eq(beforeRecordsCount);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
