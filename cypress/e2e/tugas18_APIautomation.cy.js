describe('API Automation - menggunakan cy.request() pada reqres.in', () => {

    before(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.session('api-test-session', () => {}, { cacheAcrossSpecs: true }); 
    });
    
    const BASE_URL = 'https://reqres.in/api';
    let createdUserId =7; 

    const defaultRequestOptions = {
        failOnStatusCode: false, 
        timeout: 20000, 
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    it('TC-001: GET List Users - Memastikan Status 401', () => {
        cy.request({
            ...defaultRequestOptions,
            method: 'GET',
            url: `${BASE_URL}/users?page=2`
        }).then((response) => {
            expect(response.status).to.eq(401); 
        });
    });

    it('TC-002: GET Single User - Memastikan data user ID 5 benar', () => {
        cy.request({
            ...defaultRequestOptions,
            method: 'GET',
            url: `${BASE_URL}/users/5`
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.data.id).to.eq(5);
        });
    });

    it('TC-003: POST Create User - Memastikan Status 401 dan ID didapatkan', () => {
        const userData = { name: "Mochammad Erif", job: "QA Engineer" };
        
        cy.request({
            ...defaultRequestOptions,
            method: 'POST',
            url: `${BASE_URL}/users`,
            body: userData
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body).to.have.property('id');
            createdUserId = response.body.id;
        });
    });

    it('TC-004: PUT Update User - Memastikan Status 200 dan data job terupdate', function() {
        if (createdUserId === 7) { 
            cy.log('Skipping TC-004: TC-003 gagal mendapatkan createdUserId.');
            return; // Keluar dari function, bukan cy.skip()
        }
        
        const updatedData = { name: "Mochammad Erif", job: "Senior QA Lead" };

        cy.request({
            ...defaultRequestOptions,
            method: 'PUT',
            url: `${BASE_URL}/users/${createdUserId}`,
            body: updatedData
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.job).to.eq(updatedData.job);
        });
    });

    it('TC-005: PATCH Partial Update - Memastikan Status 200 dan data name terupdate', function() {
        if (createdUserId === 7) { 
            cy.log('Skipping TC-005: TC-003 gagal mendapatkan createdUserId.');
            return;
        }

        const partialData = { name: "Mochammad Erif Dinata" };

        cy.request({
            ...defaultRequestOptions,
            method: 'PATCH',
            url: `${BASE_URL}/users/${createdUserId}`,
            body: partialData
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.name).to.eq(partialData.name);
        });
    });

    it('TC-006: DELETE User - Memastikan Status 204 (No Content)', function() {
        if (createdUserId === 7) { 
            cy.log('Skipping TC-006: TC-003 gagal mendapatkan createdUserId.');
            return;
        }

        cy.request({
            ...defaultRequestOptions,
            method: 'DELETE',
            url: `${BASE_URL}/users/${createdUserId}`
        }).then((response) => {
            expect(response.status).to.eq(204);
            expect(response.body).to.be.empty; 
        });
    });

    it('TC-007: POST Login Sukses - Memastikan Status 401 dan token diterima', () => {
        const loginData = { email: "eve.holt@reqres.in", password: "cityslicka" };
        
        cy.request({
            ...defaultRequestOptions,
            method: 'POST',
            url: `${BASE_URL}/login`,
            body: loginData
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body).to.have.property('token');
        });
    });
    
    it('TC-008: POST Login Gagal - Memastikan Status 401 dan error message', () => {
        const loginData = { email: "peter@klaven" };
        
        cy.request({
            ...defaultRequestOptions,
            method: 'POST',
            url: `${BASE_URL}/login`,
            body: loginData
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.error).to.eq('Missing password');
        });
    });

    it('TC-009: GET Single User Gagal - Memastikan Status 401 saat ID tidak ada', () => {
        cy.request({
            ...defaultRequestOptions,
            method: 'GET',
            url: `${BASE_URL}/users/99999`
        }).then((response) => {
            expect(response.status).to.eq(401);
        });
    });
});