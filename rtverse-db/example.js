require("longjohn");
setTimeout(() => {
  throw new Error("bOOM");
}, 2000);
