import assert from "node:assert/strict";
import test from "node:test";
import { messageForLoginFailure } from "./loginFailureMessage.js";

const t = (key) => key;

test("401 keeps the server credential message", () => {
  assert.equal(
    messageForLoginFailure(
      { status: 401, message: "אימייל או סיסמה שגויים" },
      t
    ),
    "אימייל או סיסמה שגויים"
  );
});

test("a repeated 401 is not labeled a server error", () => {
  const err = { status: 401, message: "אימייל או סיסמה שגויים" };
  assert.equal(messageForLoginFailure(err, t), messageForLoginFailure(err, t));
  assert.notEqual(
    messageForLoginFailure(err, t),
    "login.errors.serverError"
  );
});

test("raw axios status text falls back to incorrect credentials", () => {
  assert.equal(
    messageForLoginFailure(
      { status: 401, message: "Request failed with status code 401" },
      t
    ),
    "login.errors.incorrectCredentials"
  );
});

test("network and 500 stay server errors", () => {
  assert.equal(
    messageForLoginFailure({ message: "Network error" }, t),
    "login.errors.serverError"
  );
  assert.equal(
    messageForLoginFailure({ status: 500, message: "boom" }, t),
    "login.errors.serverError"
  );
});
