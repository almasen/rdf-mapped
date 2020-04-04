const mail = require("./");

test("mail-sending works", async () => {
  mail.sendEmail("threbitsch@gmail.com", "subject", "text");
});