/*
відповідь повина мати статус-код 200
у відповіді повинен повертатися токен
у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String
*/

const { userLogin } = require("./auth-controller");

describe("test login", () => {
  test("resp status 200", () => {
    const body = { body: { email: "emailtest@mail.com", password: "qwerty" } };
    expect(userLogin(body)).toBe({ status: 200 });
  });
});
