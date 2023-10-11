
const API_BASE = `${Cypress.env("TEST_BASE_API_URL")}`;
describe('Test api connection', () => {
    it('test api', () => {
        cy.request('GET', `${API_BASE}/get-csrf`).as("HealthCheck").then(() => console.log('Request complete'));
        cy.get("@HealthCheck").should((response) => {
            
            expect(response.body).to.have.property('message', 'Success')
        })
    })
  })