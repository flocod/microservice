const Busboy = require("busboy");
const path = require("path");

const fs = require("fs-extra");

let uploadDir = path.join(__dirname, "..", "..", "privateUploads");

fs.ensureDirSync(uploadDir);
uploadDir = fs.realpathSync(uploadDir);

const collectReq = async (req, res) => {
  try {
    const collected = { files: [] };

    console.log("ICI___****_********:");
    const busboy = Busboy({ headers: req.headers });
    console.log("busboy_____:");

    busboy.on("file", (fieldname, file, info) => {
      console.log(" eeeeeeeeeeeeeh ");
      const { filename } = info;
      console.log(" e111111111111 ");
      if (filename) {
        console.log("filename_______:", filename);

        const ext = filename.split(".")[filename.split(".").length - 1];
        console.log(" e3333333333333 ");

        const fileExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "pdf"];

        if (fileExtensions.includes(ext)) {
          console.log(" e444444444444 ");
          try {
            fs.ensureDirSync(path.join(uploadDir, fieldname));
            console.log(" e555555555555 ");
          } catch (e) {
            console.log(" eRROR: ");
            console.log(e);
            res.status(500).json({ msg: "Internal server error ", detail: e });
          }

          const saveTo = path.join(uploadDir, fieldname, filename);

          file.pipe(fs.createWriteStream(saveTo));

          const str = saveTo.split(uploadDir).pop();

          collected[fieldname] = str;

          collected.files.push(str);

          console.log("collected_______:", collected);
        } /*else {
            //res.status(200).json({ msg: 'Internal server error ', detail: `Incorrect file type for: ${fieldname}` });
            throw (`Incorrect file type for: ${fieldname}`);
          }*/
      } else {
        console.log(" e222222222222");
        file.on("data", () => {});
        file.on("end", () => {});
      }
    });

    busboy.on("field", (fieldname, val) => {
      if (val !== null && val.length !== 0) collected[fieldname] = val;
        console.log("collected",collected);
    });

    busboy.on("finish", async () => {
      console.log(" collected: ");
      console.log(collected);
    });

    // console.log('END END BUSBOY 2');

    req.pipe(busboy);

    return collected;

  } catch (e) {
    console.log("LAST ERRO ERROR END BUSBOY");
    //   console.log("requette _____:", req);
    console.log("error _____:", e.message);
    if (e instanceof ValidationError) {
      return res
        .status(500)
        .json({ msg: `Captured validation error: ${e.errors[0].message}` });
    }
    return res.status(500).json({ msg: "Internal server error ", detail: e });
  }
};

module.exports = collectReq;
