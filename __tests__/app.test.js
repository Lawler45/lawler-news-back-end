const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const endpointFile = require("../endpoints.json");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET api/topics", () => {
  test("200: responds with a status 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("200: returns an array of objects with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body).toHaveLength(3);
        response.body.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("GET api/", () => {
  test("200: responds with a status 200", () => {
    return request(app).get("/api").expect(200);
  });
  test("200: returns an object with keys of endpoints", () => {
    return request(app)
      .get("/api")
      .then((response) => {
        const endPoints = response.body.endPoints;
        const endpointKeys = Object.keys(endPoints);

        expect(endPoints).toEqual(endpointFile);
        expect(endPoints).toBeInstanceOf(Object);
        expect(endpointKeys).toHaveLength(3);
      });
  });
});
describe("GET api/articles/:articleId", () => {
  test("200: brings the artivle up with the relevant article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.title).toEqual("Living in the shadow of a great man");
      });
  });
  test("400: returns a 400 and bad request when passed the wrong data type", () => {
    return request(app)
      .get("/api/articles/lewis")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("Bad Request");
      });
  });
  test("404: returns a 404 and not found when there isnt an article id that matches", () => {
    return request(app)
      .get("/api/articles/2000")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("Not found");
      });
  });
});

describe("ALL: incorrect path", () => {
  test("when entered a wrong path it should return a 404 error", () => {
    return request(app)
      .get("/api/bananas")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("Not Found");
      });
  });
});

//write more tests so you can see what were getting first
//
