const request = require("supertest");

describe("Factories", () => {
  let app;
  beforeEach(() => {
    app = require("../app.js");
  });
  afterEach(() => {
    app.close();
  });

  it("gets all factories", done => {
    request(app)
      .get("/factories")
      .expect(200)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body.length).toBeGreaterThan(0);
        done(res);
      });
  });

  it("gets a single factory", done => {
    request(app)
      .get("/factories/0a75d3f4-c8ff-47bb-84c3-a874007d1b4f") // admittedly, this is an ugly id.
      .expect(200)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body).not.toBeNull();
        done(res);
      });
  });

  it("creates a new factory", done => {
    request(app)
      .post("/factories")
      .send({
        name: "New Test",
        email: "newtest@nt.com",
        phone_number: "18001231235",
        city: "Cupertino",
        state: "California",
        company_type: "factory"
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body.name).toEqual("New Test");
        expect(res.body.email).toEqual("newtest@nt.com");
        expect(res.body.phone_number).toEqual("18001231235");
        expect(res.body.city).toEqual("Cupertino");
        expect(res.body.state).toEqual("California");
        expect(res.body.company_type).toEqual("factory");
        done(res);
      });
  });

  it("finds an existing factory", done => {
    request(app)
      .get("/factories/search?q=Foxconn")
      .expect(200)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body).not.toBeNull();
        done(res);
      });
  });

  it("finds factories based on state", done => {
    request(app)
      .get("/factories/state?state=California")
      .expect(200)
      .end((err, res) => {
        if (err) return done.fail(err);
        expect(res.body).not.toBeNull();
        done(res);
      });
  });

  it("updates the factory", done => {
    let testID;
    request(app)
      .post("/factories")
      .send({
        name: "Test Factory 3",
        email: "testfactory3@tf2.com",
        phone_number: "18001231231",
        city: "San Mateo",
        state: "California",
        company_type: "factory",
        id: "0a75d3f4-c8ff-47bb-84c3-a878019n8y1p"
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done.fail(err);
        request(app)
          .put("/factories/0a75d3f4-c8ff-47bb-84c3-a878019n8y1p")
          .send({
            name: "Test Factory 3",
            email: "testfactory3@tf3.com",
            phone_number: "18001231238",
            city: "San Mateo",
            state: "California",
            company_type: "factory"
          })
          .expect(200)
          .end((error, response) => {
            if (error) return done.fail(error);
            expect(response.body.phone_number).toEqual("18001231238");
            done(response);
          });
      })

  });

  it("deletes the factory", done => {
    let testID;
    request(app)
      .post("/factories")
      .send({
        name: "New Test 2",
        email: "newtest2@nt.com",
        phone_number: "18001231236",
        city: "Cupertino",
        state: "California",
        company_type: "factory",
        id: "0a75d3f4-c8ff-47bb-84c3-a874007d1b5m"
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done.fail(err);
        request(app)
          .delete("/factories/0a75d3f4-c8ff-47bb-84c3-a874007d1b5m")
          .expect(200)
          .end((error, response) => {
            if (error) return done.fail(error);
            done(response);
          });
      })

  });

  it("returns 404 when it can't find a factory", done => {
    request(app)
      .get("/factories/search?q=foo bar")
      .expect(404)
      .end((err, res) => {
        if (err) return done.fail(err);
        done(res);
      });
  });
});
