const request = require("supertest");

describe("Brands", () => {
  let app;
  beforeEach(() => {
    app = require("../app.js");
  });
  afterEach(() => {
    app.close();
  });

/*
  Could write all these in one test but want to make tests
  explicit
*/

  // ["brands", "factories"].forEach((company)=> {
  //   it(`gets all ${company}`, done => {
  //     request(app)
  //       .get(`/${company}`)
  //       .expect(200)
  //       .end((err, res) => {
  //         if (err) return done.fail(err);
  //         expect(res.body.length).toBeGreaterThan(0);
  //         done(res);
  //       });
  //   });
  //
  // })

  it("gets all brands", done => {
    request(app)
      .get("/brands")
      .expect(200)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body.length).toBeGreaterThan(0);
        done(res);
      });
  });

  it("gets a single brand", done => {
    request(app)
      .get("/brands/60add279-087f-4f6f-89fe-b1aa9d34abce") // admittedly, this is an ugly id.
      .expect(200)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body).not.toBeNull();
        done(res);
      });
  });

  it("creates a new brand", done => {
    request(app)
      .post("/brands")
      .send({
        name: "Test Brand",
        email: "testbrand@tb.com",
        phone_number: "18001234567",
        city: "Palo Alto",
        state: "California",
        company_type: "brand"
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body.name).toEqual("Test Brand");
        expect(res.body.email).toEqual("testbrand@tb.com");
        expect(res.body.phone_number).toEqual("18001234567");
        expect(res.body.city).toEqual("Palo Alto");
        expect(res.body.state).toEqual("California");
        expect(res.body.company_type).toEqual("brand");
        done(res);
      });
  });

  it("finds an existing brand", done => {
    request(app)
      .get("/brands/search?q=Marmot")
      .expect(200)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body).not.toBeNull();
        done(res);
      });
  });

  it("finds brands based on state", done => {
    request(app)
      .get("/brands/state?state=California")
      .expect(200)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body).not.toBeNull();
        done(res);
      });
  });

  it("updates the brand", done => {
    let testID;
    request(app)
      .post("/brands")
      .send({
        name: "Test Brand 3",
        email: "testbrand3@tb2.com",
        phone_number: "18001231236",
        city: "San Mateo",
        state: "California",
        company_type: "brand",
        id: "0a75d3f4-c8ff-47bb-84c3-a878019m7p4y"
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done.fail(err);
        request(app)
          .put("/brands/0a75d3f4-c8ff-47bb-84c3-a878019m7p4y")
          .send({
            name: "Test Brand 3",
            email: "testbrand3@tb2.com",
            phone_number: "18001231237",
            city: "San Mateo",
            state: "California",
            company_type: "brand"
          })
          .expect(200)
          .end((error, response) => {
            if (error) return done.fail(error);
            expect(response.body.phone_number).toEqual("18001231237");
            done(response);
          });
      })

  });


  it("deletes the brand", done => {
    let testID;
    request(app)
      .post("/brands")
      .send({
        name: "Test Brand 2",
        email: "testbrand2@tb2.com",
        phone_number: "18001231236",
        city: "San Francisco",
        state: "California",
        company_type: "brand",
        id: "0a75d3f4-c8ff-47bb-84c3-a874007t9x2u"
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done.fail(err);
        request(app)
          .delete("/brands/0a75d3f4-c8ff-47bb-84c3-a874007t9x2u")
          .expect(200)
          .end((error, response) => {
            if (error) return done.fail(error);
            done(response);
          });
      })

  });

  it("returns 404 when it can't find a brand", done => {
    request(app)
      .get("/brands/search?q=foo bar")
      .expect(404)
      .end((err, res) => {
        if (err) return done.fail(err);
        done(res);
      });
  });
});
